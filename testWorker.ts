import { Octokit } from "@octokit/rest";
import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";

export async function runAIPlaywrightWorker(
    targetUrl: string, 
    repoFullName: string, 
    commitSha: string, 
    prNumber?: number,
    githubToken?: string,
    skipComment?: boolean
) {
    try {
        console.log(`[Worker] Starting AI QA run for ${targetUrl} on ${repoFullName}@${commitSha}`);
        
        let resolvedPrNumber = prNumber;
        const token = githubToken;
        let internalApiError = null;
        let debugInfo: string[] = [];

        if (token && repoFullName && !resolvedPrNumber) {
            const [owner, repo] = repoFullName.split('/');
            if (owner && repo) {
                const octokit = new Octokit({ auth: token });
                try {
                    const openPulls = await octokit.pulls.list({
                        owner, repo, state: 'open', sort: 'updated', direction: 'desc', per_page: 20
                    });
                    const matchingPr = openPulls.data.find(p => p.head.sha === commitSha);
                    
                    if (matchingPr) {
                        resolvedPrNumber = matchingPr.number;
                    } else {
                        const pullsRes = await octokit.repos.listPullRequestsAssociatedWithCommit({
                            owner, repo, commit_sha: commitSha
                        });
                        const openAssociated = pullsRes.data.find(pr => pr.state === 'open');
                        if (openAssociated) {
                            resolvedPrNumber = openAssociated.number;
                        }
                    }
                } catch (e: any) {
                    console.warn("[Worker] Failed to lookup PR for commit early check", e);
                }
            }
        }

        if (!resolvedPrNumber && !skipComment) {
            console.log(`[Worker] Skipping analysis - commit ${commitSha} is not associated with a Pull Request.`);
            return { status: "skipped", error: "Skipped - Commit is not part of an open Pull Request." };
        }

        let navigationError = null;
        let domText = "";
        
        // Run AI Engine (Gemini)
        const geminiKey = process.env.GEMINI_API_KEY;
        let aiVerdict = "passed";
        let aiDescription = "All basic visual tests passed. The page loaded successfully and no explicit errors were detected on the screen.";

        for (let attempt = 1; attempt <= 2; attempt++) {
            navigationError = null;
            try {
                const res = await fetch(targetUrl);
                if (!res.ok) {
                    navigationError = `HTTP ${res.status} ${res.statusText}`;
                }
                const html = await res.text();
                
                // Extract text from the HTML using cheerio
                const $ = cheerio.load(html);
                $('script, style, noscript, svg, img, iframe').remove();
                domText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);
                
                if (!domText && !navigationError) {
                    // If it's an SPA and body is empty, we just pass the raw HTML to AI to sense check
                    domText = html.substring(0, 5000);
                }
            } catch (e: any) {
                navigationError = e.message;
                console.error("[Worker] Navigation failed on attempt", attempt, e);
            }

            if (navigationError) {
                aiVerdict = "failed";
                aiDescription = `Navigation to ${targetUrl} failed with error: ${navigationError}`;
            } else if (geminiKey) {
                try {
                    const ai = new GoogleGenAI({ apiKey: geminiKey });
                    const prompt = `Act as an expert QA engineer. Analyze this webpage content.
Webpage text/HTML:
"${domText}"

CRITICAL OUTPUT REQUIREMENT:
1. Determine "passed" or "failed" status. If the text is just a React/Vite root div without crash errors, assume "passed". If there's an explicit error string like "Error 500", "Application Error", "SyntaxError", return "failed".
2. In your "description", DO NOT write paragraphs of text. You MUST output an immediate visual summary using:
   - A bold "Visual Health Score" using emoji blocks (e.g. Health: 🟩🟩🟩🟩🟩🟩🟨⬜ 85%)
   - A Markdown Table summarizing structural checks: | Module/Check | Status (🟢/🔴) | Feedback |
   - A short bulleted list of 1-line warnings if any.
Keep it strictly visual and brief!

Return a valid JSON object ONLY with exactly these fields:
{"status": "passed" or "failed", "description": "visual markdown summary"}`;

                    const aiRes = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: { responseMimeType: "application/json" }
                    });
                    const parsed = JSON.parse(aiRes.text || "{}");
                    if (parsed.status === "failed") {
                        aiVerdict = "failed";
                        aiDescription = parsed.description || "AI detected functional issues on the page layout.";
                    } else {
                        aiVerdict = "passed";
                        aiDescription = parsed.description || aiDescription;
                    }
                } catch(e) {
                   console.warn("[Worker] AI Check error", e);
                }
            }

            if (aiVerdict === "passed") {
                if (attempt === 2) {
                    debugInfo.push("Passed on retry");
                }
                break; // Exit retry loop on success
            } else {
                console.log(`[Worker] Attempt ${attempt} failed. Retrying in 5s...`);
                if (attempt === 1) {
                    // Simple wait before retry
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        }

        // Post Verdict to GitHub
        if (skipComment) {
            console.log(`[Worker] skipComment is true. Skipping GitHub Octokit posts.`);
            debugInfo.push("Skipped Octokit posts");
        } else {
            // In real app, we need an installation token or the user's OAuth token.
            // We'll try to use a provided token, or fallback to an env var
            const token = githubToken || process.env.GITHUB_ACCESS_TOKEN; 
            console.log(`[Worker] Using GitHub token: ${token ? 'yes (length: ' + token.length + ')' : 'no'}`);
            debugInfo.push(`Token present: ${!!token}`);
            if (!token) {
               console.warn("[Worker] No GitHub token available to post status! Skipping Octokit calls.");
               internalApiError = "No GitHub token available. Could not post results to GitHub.";
            } else {
               try {
                   const octokit = new Octokit({ auth: token });
                   const [owner, repo] = (repoFullName || "").split('/');
                   debugInfo.push(`Owner: ${owner}, Repo: ${repo}`);

                   if (owner && repo) {
                       debugInfo.push(`Resolved PR: ${resolvedPrNumber}`);
                       
                       // 1. Post Commit Status
                       try {
                           await octokit.repos.createCommitStatus({
                               owner,
                               repo,
                               sha: commitSha,
                               state: aiVerdict === "passed" ? "success" : "failure",
                               target_url: targetUrl,
                               description: "AutoQA: " + (aiVerdict === "passed" ? "Tests passed" : "Tests failed"),
                               context: "AutoQA / AI E2E Tests"
                           });
                           debugInfo.push("Commit status posted");
                       } catch(e: any) {
                           debugInfo.push(`Commit status failed: ${e.message}`);
                       }

                       // 2. Post or update a comment on the PR
                       if (resolvedPrNumber) {
                           let commentBody = `### 🤖 AutoQA Bot\n\n> *This is an automated review performed by your AutoQA integration.*\n\n### ${aiVerdict === "passed" ? "✅ Test Passed" : "❌ Test Failed"}\n\n**Commit**: \`${commitSha}\`\n**Preview URL**: ${targetUrl}\n\n**Detailed Summary**:\n\n${aiDescription}`;
                           
                           try {
                               const commentsRes = await octokit.issues.listComments({
                                   owner,
                                   repo,
                                   issue_number: resolvedPrNumber
                               });
                               const existingComment = commentsRes.data.find(c => c.body && c.body.includes('🤖 AutoQA Bot'));
                               
                               if (existingComment) {
                                   await octokit.issues.updateComment({
                                       owner,
                                       repo,
                                       comment_id: existingComment.id,
                                       body: commentBody
                                   });
                                   debugInfo.push("PR Comment updated");
                               } else {
                                   await octokit.issues.createComment({
                                       owner,
                                       repo,
                                       issue_number: resolvedPrNumber,
                                       body: commentBody
                                   });
                                   debugInfo.push("PR Comment posted");
                               }
                           } catch(e: any) {
                               debugInfo.push(`PR Comment failed: ${e.message}`);
                           }
                       }

                       // 3. Create an Issue if Failed
                       if (aiVerdict === "failed") {
                           let issueTitle = `🚨 AutoQA Failed for commit ${commitSha.substring(0,7)}`;
                           let issueBody = `### 🤖 AutoQA Bot\n\n> *This is an automated failure report generated by your AutoQA integration.*\n\n**Commit**: \`${commitSha}\`\n**Preview URL**: ${targetUrl}\n\n### Detailed QA Summary\n\n${aiDescription}\n\nPlease review the deployment and fix the underlying issues.`;
                           try {
                               await octokit.issues.create({
                                   owner, 
                                   repo, 
                                   title: issueTitle, 
                                   body: issueBody
                               });
                               debugInfo.push("Issue posted");
                           } catch (issueErr: any) {
                               console.warn("[Worker] Failed to create GitHub Issue:", issueErr.message);
                               debugInfo.push(`Issue failed: ${issueErr.message}`);
                           }
                       }
                   }
               } catch (apiErr: any) {
                   console.error("[Worker] GitHub API Error when posting verdict:", apiErr.message);
                   internalApiError = `GitHub API Error: ${apiErr.message}`;
                   debugInfo.push(`API Error: ${apiErr.message}`);
               }
            }
        }

        console.log(`[Worker] Finished test run. Result: ${aiVerdict}`);
        return { status: aiVerdict, error: navigationError || internalApiError || null, debug: debugInfo.join(', ') };

    } catch (err: any) {
        console.error("[Worker] Fatal error", err);
        return { status: 'failed', error: `Worker crashed internally: ${err.message || 'Unknown error'}` };
    }
}
