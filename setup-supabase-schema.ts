import { Client } from "pg";
import { config } from "dotenv";

config();

async function run() {
    if (!process.env.SUPABASE_DB_URL) {
        console.error("Missing SUPABASE_DB_URL in environment variables.");
        return;
    }
    
    const client = new Client({
        connectionString: process.env.SUPABASE_DB_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log("Connected to Supabase. Setting up the complete database schema with RLS...");
    
    const sql = `
        -- Extension for UUID generation
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -------------------------------------------------------------
        -- 1. USERS TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.users (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            github_id TEXT UNIQUE,
            full_name TEXT,
            email TEXT UNIQUE,
            avatar_url TEXT,
            role TEXT,
            role_other_specify TEXT,
            company_size TEXT,
            company_name TEXT,
            company_email TEXT,
            primary_goal TEXT,
            account_type TEXT,
            has_seen_tour BOOLEAN DEFAULT FALSE,
            profile_completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Add columns safely if they don't exist yet for existing deployments
        DO $$ 
        BEGIN
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role_other_specify TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_size TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_email TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS primary_goal TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_type TEXT;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS has_seen_tour BOOLEAN DEFAULT FALSE;
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
        END $$;

        -------------------------------------------------------------
        -- 2. SUBSCRIPTIONS TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.subscriptions (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
            plan_tier TEXT DEFAULT 'Free', -- Free, Starter, Growth
            paypal_subscription_id TEXT UNIQUE,
            razorpay_subscription_id TEXT UNIQUE,
            subscription_status TEXT DEFAULT 'Active', -- Active, Past_Due, Cancelled
            test_credits_remaining INTEGER DEFAULT 50,
            billing_cycle_reset_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -------------------------------------------------------------
        -- 3. WORKSPACES TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.workspaces (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT NOT NULL,
            owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -------------------------------------------------------------
        -- 4. PROJECTS TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.projects (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            repo_name TEXT,
            github_installation_id TEXT,
            base_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Add columns safely if they don't exist yet for existing deployments
        DO $$ 
        BEGIN
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'My Project';
            ALTER TABLE public.projects ALTER COLUMN repo_name DROP NOT NULL;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS site_map JSONB;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS summary TEXT;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS suggestions JSONB;
            ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS untestable_elements JSONB;
            
            ALTER TABLE public.test_cases ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'passed';
            ALTER TABLE public.test_cases ADD COLUMN IF NOT EXISTS duration DECIMAL(5,1) DEFAULT 1.2;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
        END $$;

        -------------------------------------------------------------
        -- 5. TEST CASES TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.test_cases (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            instruction TEXT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -------------------------------------------------------------
        -- 6. TEST SELECTORS TABLE (Auto-heal Cache)
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.test_selectors (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
            element_name TEXT NOT NULL,
            cached_path TEXT NOT NULL,
            last_verified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -------------------------------------------------------------
        -- 7. TEST RUNS TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.test_runs (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
            trigger_source TEXT NOT NULL, -- e.g., 'GitHub PR', 'Manual'
            pr_number INTEGER,
            pr_commit_hash TEXT,
            target_vercel_url TEXT,
            status TEXT DEFAULT 'Pending', -- Pending, Running, Passed, Failed
            started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -------------------------------------------------------------
        -- 8. TEST LOGS TABLE
        -------------------------------------------------------------
        CREATE TABLE IF NOT EXISTS public.test_logs (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            run_id UUID REFERENCES public.test_runs(id) ON DELETE CASCADE,
            case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
            status TEXT NOT NULL, -- Pass, Fail
            error_message TEXT,
            screenshot_url TEXT,
            execution_time_ms INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );


        -------------------------------------------------------------
        -- ROW LEVEL SECURITY (RLS) ENABLEMENT
        -------------------------------------------------------------
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.test_selectors ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.test_runs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.test_logs ENABLE ROW LEVEL SECURITY;

        -------------------------------------------------------------
        -- DROP EXISTING POLICIES (for idempotency)
        -------------------------------------------------------------
        DO $$ 
        DECLARE 
            r RECORD; 
        BEGIN 
            FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
            LOOP 
                EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename); 
            END LOOP; 
        END $$;

        -------------------------------------------------------------
        -- CREATE NEW RLS POLICIES
        -------------------------------------------------------------
        
        -- Users
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

        -- Subscriptions
        CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

        -- Workspaces (Owner can CRUD)
        CREATE POLICY "Users can view own workspaces" ON public.workspaces FOR SELECT USING (auth.uid() = owner_id);
        CREATE POLICY "Users can insert own workspaces" ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
        CREATE POLICY "Users can update own workspaces" ON public.workspaces FOR UPDATE USING (auth.uid() = owner_id);
        CREATE POLICY "Users can delete own workspaces" ON public.workspaces FOR DELETE USING (auth.uid() = owner_id);

        -- Projects (Accessible via Workspace Owner)
        CREATE POLICY "Users can view projects in their workspaces" ON public.projects FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()));
        CREATE POLICY "Users can insert projects in their workspaces" ON public.projects FOR INSERT 
        WITH CHECK (EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()));
        CREATE POLICY "Users can update projects in their workspaces" ON public.projects FOR UPDATE 
        USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()));
        CREATE POLICY "Users can delete projects in their workspaces" ON public.projects FOR DELETE 
        USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = workspace_id AND owner_id = auth.uid()));

        -- Test Cases
        CREATE POLICY "Users can view test cases in their projects" ON public.test_cases FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can insert test cases in their projects" ON public.test_cases FOR INSERT 
        WITH CHECK (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can update test cases in their projects" ON public.test_cases FOR UPDATE 
        USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can delete test cases in their projects" ON public.test_cases FOR DELETE 
        USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));

        -- Test Selectors
        CREATE POLICY "Users can view test selectors via test cases" ON public.test_selectors FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.test_cases tc JOIN public.projects p ON tc.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tc.id = test_case_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can insert test selectors" ON public.test_selectors FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.test_cases tc JOIN public.projects p ON tc.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tc.id = test_case_id AND w.owner_id = auth.uid())
        );
        CREATE POLICY "Users can update test selectors" ON public.test_selectors FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.test_cases tc JOIN public.projects p ON tc.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tc.id = test_case_id AND w.owner_id = auth.uid())
        );
        CREATE POLICY "Users can delete test selectors" ON public.test_selectors FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.test_cases tc JOIN public.projects p ON tc.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tc.id = test_case_id AND w.owner_id = auth.uid())
        );

        -- Test Runs
        CREATE POLICY "Users can view test runs in their projects" ON public.test_runs FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can insert test runs in their projects" ON public.test_runs FOR INSERT 
        WITH CHECK (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can update test runs in their projects" ON public.test_runs FOR UPDATE 
        USING (EXISTS (SELECT 1 FROM public.projects p JOIN public.workspaces w ON p.workspace_id = w.id WHERE p.id = project_id AND w.owner_id = auth.uid()));

        -- Test Logs
        CREATE POLICY "Users can view test logs via runs" ON public.test_logs FOR SELECT 
        USING (EXISTS (SELECT 1 FROM public.test_runs tr JOIN public.projects p ON tr.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tr.id = run_id AND w.owner_id = auth.uid()));
        CREATE POLICY "Users can insert test logs via runs" ON public.test_logs FOR INSERT 
        WITH CHECK (EXISTS (SELECT 1 FROM public.test_runs tr JOIN public.projects p ON tr.project_id = p.id JOIN public.workspaces w ON p.workspace_id = w.id WHERE tr.id = run_id AND w.owner_id = auth.uid()));

        -------------------------------------------------------------
        -- DATABASE TRIGGERS & FUNCTIONS
        -------------------------------------------------------------
        
        -- Automatically create user records and starter subscription when they sign up
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.users (id, full_name, email, avatar_url)
          VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');

          INSERT INTO public.subscriptions (user_id, plan_tier, test_credits_remaining)
          VALUES (new.id, 'Free', 50);

          INSERT INTO public.workspaces (name, owner_id)
          VALUES ('Personal Workspace', new.id);

          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Drop trigger if it exists and recreate
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

        -------------------------------------------------------------
        -- UTILITY FUNCTION: DECREMENT TEST CREDITS
        -------------------------------------------------------------
        -- Used by backend workers to secure credit spending in one atomic transaction
        CREATE OR REPLACE FUNCTION public.decrement_test_credits(project_uuid UUID)
        RETURNS BOOLEAN AS $$
        DECLARE
          v_user_id UUID;
          v_credits INTEGER;
        BEGIN
          -- Find out who owns this project by walking up to Workspace -> Owner
          SELECT w.owner_id INTO v_user_id 
          FROM public.projects p 
          JOIN public.workspaces w ON p.workspace_id = w.id 
          WHERE p.id = project_uuid;

          SELECT test_credits_remaining INTO v_credits
          FROM public.subscriptions
          WHERE user_id = v_user_id;

          -- Proceed if credits >= 1
          IF v_credits > 0 THEN
            UPDATE public.subscriptions 
            SET test_credits_remaining = test_credits_remaining - 1 
            WHERE user_id = v_user_id;
            
            RETURN TRUE;
          ELSE
            RETURN FALSE;
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

    `;
    
    try {
        await client.query(sql);
        console.log("✅ Successfully created all tables, RLS policies, and triggers!");
    } catch (e) {
        console.error("❌ Error setting up database schema:", e);
    } finally {
        await client.end();
    }
}

run().catch(console.error);
