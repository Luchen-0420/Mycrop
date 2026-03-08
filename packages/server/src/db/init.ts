import { query } from './pool'

/**
 * Initializes the database schemas if they don't exist.
 * We are running this on startup for the MVP.
 */
export const initDb = async () => {
  console.log('📦 Initializing database schemas...')
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- HR Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL, -- 'hard', 'soft', 'language', 'life'
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        max_xp INTEGER DEFAULT 100,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS training_projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        goal TEXT,
        status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'paused'
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS training_resources (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES training_projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'video', 'book', 'course', 'document'
        url TEXT,
        total_items INTEGER DEFAULT 1,
        completed_items INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS wellness_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        record_date DATE NOT NULL,
        stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
        mood VARCHAR(50),
        sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, record_date)
      );
    `)

    // --- Admin Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL, -- '食品', '日用品', '文具', '电器耗材'等
        location VARCHAR(100),
        quantity INTEGER DEFAULT 0,
        unit VARCHAR(20) DEFAULT '个',
        min_alert_quantity INTEGER DEFAULT 1,
        expiry_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS fixed_assets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        purchase_date DATE,
        purchase_price DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT '使用中', -- '使用中', '已闲置', '已出二手'
        location VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS procurement_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        estimated_price DECIMAL(10, 2),
        reason TEXT,
        is_promotion_day BOOLEAN DEFAULT FALSE,
        ai_decision VARCHAR(50) DEFAULT 'pending', -- 'approved', 'rejected', 'pending'
        ai_comment TEXT,
        status VARCHAR(50) DEFAULT '待审批', -- '待审批', '已购买', '已放弃'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Credentials & Digital Accounts (Admin Phase 2) ---
    await query(`
      CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) DEFAULT 'id_card',
        name VARCHAR(255) NOT NULL,
        identifier VARCHAR(255),
        issue_date DATE,
        expiry_date DATE,
        location VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS digital_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        platform_name VARCHAR(255) NOT NULL,
        account_type VARCHAR(50) DEFAULT 'social',
        username VARCHAR(255),
        password_hint VARCHAR(255),
        bind_email VARCHAR(255),
        bind_phone VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Finance Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'cash', 'bank', 'credit', 'investment'
        balance DECIMAL(15, 2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL, -- 'income', 'expense', 'transfer'
        amount DECIMAL(15, 2) NOT NULL,
        category VARCHAR(50),
        description TEXT,
        transaction_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
        category VARCHAR(50) NOT NULL, -- E.g., '餐饮', '交通', or '全局'
        amount_limit DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, month, category)
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS points_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL, -- Positive for earning, Negative for spending
        source VARCHAR(50) NOT NULL, -- 'early_sleep', 'wishlist_redeem', 'task_done'
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS wishlist_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        target_points INTEGER NOT NULL, -- Since 1:1, this is also the price
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'redeemed'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
        next_billing_date DATE NOT NULL,
        category VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Operations Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
        priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
        due_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        frequency VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly'
        points_reward INTEGER DEFAULT 30,
        current_streak INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS habit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
        log_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, habit_id, log_date)
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS okrs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(20) NOT NULL, -- e.g. "2026 Q1"
        objective VARCHAR(255) NOT NULL,
        progress INTEGER DEFAULT 0, -- 0 to 100
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS key_results (
        id SERIAL PRIMARY KEY,
        okr_id INTEGER REFERENCES okrs(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        current_value INTEGER DEFAULT 0,
        target_value INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- PR Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        relationship VARCHAR(50) DEFAULT 'friend', -- 'family', 'friend', 'colleague', 'mentor', 'client'
        tags TEXT, -- comma separated or JSON
        birthday DATE,
        preferences TEXT,
        target_frequency INTEGER DEFAULT 30, -- Days between contacts
        last_contact_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
        type VARCHAR(50) DEFAULT 'chat', -- 'meet', 'call', 'chat', 'event'
        notes TEXT,
        interaction_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
        direction VARCHAR(20) NOT NULL, -- 'received', 'given'
        item_name VARCHAR(255) NOT NULL,
        value DECIMAL(10, 2) DEFAULT 0.00,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Legal Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS contracts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'employment', 'rental', 'service', etc.
        party VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'terminated'
        key_terms TEXT,
        renewal_reminder DATE,
        document_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS insurances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL, -- 'health', 'auto', 'property', 'life'
        provider VARCHAR(255) NOT NULL,
        policy_number VARCHAR(100) NOT NULL,
        premium DECIMAL(10, 2) NOT NULL,
        coverage TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        renewal_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'consumer', 'property', 'employment', etc.
        platform VARCHAR(255),
        amount DECIMAL(10, 2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'resolved', 'closed'
        start_date DATE NOT NULL,
        resolution_date DATE,
        description TEXT,
        resolution_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- R&D Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'development', 'completed', 'paused'
        stage VARCHAR(20) DEFAULT 'idea', -- 'idea', 'MVP', 'beta', 'production'
        start_date DATE,
        expected_end_date DATE,
        tech_stack TEXT,
        progress INTEGER DEFAULT 0,
        description TEXT,
        github_url VARCHAR(500),
        demo_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'archived'
        tags TEXT,
        estimated_effort VARCHAR(50),
        market_potential VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS tech_notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        content TEXT,
        tags TEXT,
        importance VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Commerce Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS revenue_streams (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'salary', 'freelance', 'investment', 'content', 'business'
        monthly_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'CNY',
        stability VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        growth_potential VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
        description TEXT,
        company VARCHAR(255),
        platforms TEXT,
        last_updated DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS partnerships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'negotiation', -- 'negotiation', 'active', 'completed', 'cancelled'
        start_date DATE,
        end_date DATE,
        value DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'CNY',
        description TEXT,
        contact_person VARCHAR(255),
        last_interaction DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // --- Travel Module Schemas ---
    await query(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        destination VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'confirmed', 'completed', 'cancelled'
        budget DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'CNY',
        travelers INTEGER DEFAULT 1,
        type VARCHAR(20) DEFAULT 'leisure', -- 'leisure', 'business', 'family'
        notes TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        would_recommend BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS packing_templates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL, -- 'leisure', 'business', 'family'
        climate VARCHAR(50) NOT NULL, -- 'tropical', 'temperate', 'cold', 'mixed'
        duration VARCHAR(50),
        items JSONB NOT NULL, -- Array of {category, item, quantity, essential}
        last_used DATE,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS travel_expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        category VARCHAR(50) NOT NULL, -- '交通', '住宿', '餐饮', '购物', '娱乐'
        item VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'CNY',
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'submitted', 'approved', 'rejected'
        description TEXT,
        receipt_url VARCHAR(500),
        reimbursable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS agent_tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        mission_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. MC-20261012-001
        original_prompt TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'reviewing', 'dispatching', 'completed', 'blocked', 'cancelled'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS agent_subtasks (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES agent_tasks(id) ON DELETE CASCADE,
        agent_role VARCHAR(50) NOT NULL, -- e.g. 'cfo', 'cao'
        action_type VARCHAR(100) NOT NULL,
        parameters JSONB,
        status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
        result_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS thinking_logs (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES agent_tasks(id) ON DELETE CASCADE,
        subtask_id INTEGER REFERENCES agent_subtasks(id) ON DELETE SET NULL, -- Optional, if thought belongs to a subtask
        agent_role VARCHAR(50) NOT NULL, -- e.g. 'strategy', 'review', 'cfo'
        log_type VARCHAR(50) NOT NULL, -- 'thinking', 'action', 'error', 'system'
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Phase 4: Long-Term Memory (RAG)
    await query(`CREATE EXTENSION IF NOT EXISTS vector;`)

    await query(`
      CREATE TABLE IF NOT EXISTS agent_memories (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(384),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Phase 5.5: Goal Redemption System — extend tasks table
    await query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS points_reward INTEGER DEFAULT 0;`)
    await query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_wishlist_id INTEGER REFERENCES wishlist_items(id) ON DELETE SET NULL;`)

    // Phase 7: Audit & Reflection Engine
    await query(`
      CREATE TABLE IF NOT EXISTS audit_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        report_date DATE NOT NULL UNIQUE,
        efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
        procrastination_index DECIMAL(3, 2),
        tasks_created INTEGER DEFAULT 0,
        tasks_completed INTEGER DEFAULT 0,
        habits_completed INTEGER DEFAULT 0,
        habits_total INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        points_spent INTEGER DEFAULT 0,
        okr_delta JSONB,
        top_wins TEXT[],
        top_failures TEXT[],
        honest_feedback TEXT,
        recommendations TEXT[],
        raw_llm_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('✅ Database schemas initialized.')
  } catch (err) {
    console.error('❌ Failed to initialize database schemas:', err)
  }
}
