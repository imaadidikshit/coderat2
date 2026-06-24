import React from 'react';
import claudeIcon from '../model_logos/claude-ai-icon.svg';
import openaiIcon from '../model_logos/openai_dark.svg';
import geminiIcon from '../model_logos/gemini.svg';
import deepseekIcon from '../model_logos/deepseek.svg';
import metaIcon from '../model_logos/meta.svg';
import openrouterIcon from '../model_logos/openrouter_dark.svg';
import googleAiStudioIcon from '../model_logos/google_ai_studio.svg';

/**
 * Official brand marks. Where a logo ships in the repo we reuse it; the rest are
 * faithful inline SVG path recreations of the public brand glyphs so we never
 * depend on external assets. Purely presentational.
 */

export const RepoLogos = {
  claude: claudeIcon,
  openai: openaiIcon,
  gemini: geminiIcon,
  deepseek: deepseekIcon,
  meta: metaIcon,
  openrouter: openrouterIcon,
  googleAiStudio: googleAiStudioIcon,
};

type IconProps = { className?: string };

export const GitHubMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 .5C5.73.5.5 5.73.5 12.04c0 5.05 3.29 9.33 7.86 10.84.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.55 11.55 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

export const VercelMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2 22 20H2L12 2Z" />
  </svg>
);

export const NetlifyMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 256 226" className={className} fill="none" aria-hidden>
    <path fill="#05BDBA" d="m61.6 169.1 4.2.1 22.6-9.4 1.4-3.4-3.2-3.2h-3.2l-15.6 6.4-6.8 9.6 .6 3.3Z" />
    <path fill="#05BDBA" d="M186.4 56.4l-1.4-3.4-22.6 9.4-1.4 3.4 3.2 3.2h3.2l15.6-6.4 6.8-9.6-.4-.2Z M128 0l-7 7v44l7 7 7-7V7l-7-7Zm0 161l-7 7v50l7 7 7-7v-50l-7-7Zm-79-49L0 119l7 7h44l7-7-7-7H7l-7-7 49-7-7 7Zm207 0-49 7 7 7 49-7-7-7Z" />
    <path fill="#014847" d="M141 95v-9l-6-6h-14l-6 6v18l6 6h14l6-6v-9Z" />
  </svg>
);

export const VSCodeMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
    <path fill="#0065A9" d="M70 5 95 17v66L70 95 32 64 12 80 5 76V24l7-4 20 16L70 5Z" />
    <path fill="#007ACC" d="M70 5 32 36 12 20 5 24v52l7 4 20-16 38 31 25-12V17L70 5Zm0 23v44L40 50l30-22Z" />
  </svg>
);

export const SlackMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden>
    <path fill="#36C5F0" d="M25.8 77.6a12.9 12.9 0 1 1-12.9-12.9h12.9v12.9Zm6.5 0a12.9 12.9 0 0 1 25.8 0v32.3a12.9 12.9 0 1 1-25.8 0V77.6Z" />
    <path fill="#2EB67D" d="M45.2 25.8a12.9 12.9 0 1 1 12.9-12.9v12.9H45.2Zm0 6.5a12.9 12.9 0 0 1 0 25.8H12.9a12.9 12.9 0 1 1 0-25.8h32.3Z" />
    <path fill="#ECB22E" d="M97 45.2a12.9 12.9 0 1 1 12.9 12.9H97V45.2Zm-6.5 0a12.9 12.9 0 0 1-25.8 0V12.9a12.9 12.9 0 1 1 25.8 0v32.3Z" />
    <path fill="#E01E5A" d="M77.6 97a12.9 12.9 0 1 1-12.9 12.9V97h12.9Zm0-6.5a12.9 12.9 0 0 1 0-25.8h32.3a12.9 12.9 0 1 1 0 25.8H77.6Z" />
  </svg>
);

export const LinearMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="#5E6AD2" aria-hidden>
    <path d="M1.2 61.4 38.6 98.8a50 50 0 0 1-37.4-37.4ZM.2 49.3 50.7 99.8a50 50 0 0 0 8.9-1.3L1.5 40.4a50 50 0 0 0-1.3 8.9ZM3.9 31.5 68.5 96.1a50 50 0 0 0 6.6-3.2L7.1 24.9a50 50 0 0 0-3.2 6.6ZM12.2 18.4 81.6 87.8A50 50 0 1 0 12.2 18.4Z" />
  </svg>
);

export const DatadogMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#632CA6" aria-hidden>
    <path d="M20.7 3.3 18 5.1l-2.3-1.4-3 .5-1.4 4.8 1.9 2.1-.5 1.4-2.3.3-3.4-3.6L3 9.9l-.7 4.4 5 4.6-.9 1.3 1.6 2.5 1.9-2.6 6.6-1.2.5-2.6-1.5-.4.1-2.2 2-.2.6-3.4-1.7-.8 1.4-2.6 2.3-.2-.9-2Z" />
  </svg>
);

export const PagerDutyMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#06AC38" aria-hidden>
    <path d="M5 2h7.5C17 2 20 5 20 9.2c0 4.2-3 7.2-7.5 7.2H9V22H5V2Zm4 3.6v7.2h3.3c2.2 0 3.6-1.5 3.6-3.6 0-2.1-1.4-3.6-3.6-3.6H9Z" />
  </svg>
);

export const CypressMark: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <circle cx="12" cy="12" r="11" stroke="#69D3A7" strokeWidth="1.6" />
    <path d="M12 7.2A4.8 4.8 0 0 0 8 14.7M12 7.2a4.8 4.8 0 0 1 3.1 1.1M11 16.6c.6.2 1.6.2 2.3-.2l.9 2.1c-1.2.6-2.8.6-4 .2" stroke="#69D3A7" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
