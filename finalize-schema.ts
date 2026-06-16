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
    console.log("Connected to Supabase. Running schema finalization and cleanup...");
    
    const sql = `
        -------------------------------------------------------------
        -- 1. DROP TEMPORARY TEST TABLES
        -------------------------------------------------------------
        DROP TABLE IF EXISTS public.test_connection CASCADE;
        DROP TABLE IF EXISTS public.secure_test_table CASCADE;
        
        -------------------------------------------------------------
        -- 2. CREATE FUNCTION FOR AUTO-UPDATING 'updated_at'
        -------------------------------------------------------------
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -------------------------------------------------------------
        -- 3. APPLY UPDATE TRIGGERS TO ALL RELEVANT TABLES
        -------------------------------------------------------------
        DROP TRIGGER IF EXISTS update_users_modtime ON public.users;
        CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
        
        DROP TRIGGER IF EXISTS update_subscriptions_modtime ON public.subscriptions;
        CREATE TRIGGER update_subscriptions_modtime BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

        DROP TRIGGER IF EXISTS update_workspaces_modtime ON public.workspaces;
        CREATE TRIGGER update_workspaces_modtime BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

        DROP TRIGGER IF EXISTS update_projects_modtime ON public.projects;
        CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

        DROP TRIGGER IF EXISTS update_test_cases_modtime ON public.test_cases;
        CREATE TRIGGER update_test_cases_modtime BEFORE UPDATE ON public.test_cases FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

        DROP TRIGGER IF EXISTS update_test_selectors_modtime ON public.test_selectors;
        CREATE TRIGGER update_test_selectors_modtime BEFORE UPDATE ON public.test_selectors FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();


        -------------------------------------------------------------
        -- 4. MISSING TABLE: WEBHOOK EVENTS (Crucial for Payments & GitHub)
        -------------------------------------------------------------
        -- To prevent duplicate payment processing or double-testing on GitHub retries
        CREATE TABLE IF NOT EXISTS public.webhook_events (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            provider TEXT NOT NULL, -- 'stripe', 'razorpay', 'github'
            event_type TEXT NOT NULL,
            payload JSONB,
            processed BOOLEAN DEFAULT false,
            error_message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Security for webhook events (Only Service Role should manipulate it entirely)
        ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
        
        -- Drop if exists and recreate
        DROP POLICY IF EXISTS "Deny all user access to webhooks" ON public.webhook_events;
        CREATE POLICY "Deny all user access to webhooks" 
        ON public.webhook_events 
        FOR ALL TO authenticated 
        USING (false);

    `;
    
    try {
        await client.query(sql);
        console.log("✅ Successfully cleaned up test tables, added auto-update triggers, and created webhook tracking table!");
    } catch (e) {
        console.error("❌ Error running finalization script:", e);
    } finally {
        await client.end();
    }
}

run().catch(console.error);
