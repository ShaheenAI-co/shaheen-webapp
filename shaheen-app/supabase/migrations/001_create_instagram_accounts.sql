-- Create Instagram accounts table
-- This table stores Instagram Business API long-lived tokens and account information

CREATE TABLE IF NOT EXISTS instagram_accounts (
    instagram_id BIGINT PRIMARY KEY,  -- Instagram Business Account ID
    clerk_id VARCHAR(255) NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
    username VARCHAR(255),            -- Instagram account username
    access_token TEXT NOT NULL,       -- Long-lived access token
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,  -- Token expiration
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_posted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(clerk_id, username)        -- Ensure one account per user per username
);

-- Create index for faster queries by clerk_id
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_clerk_id ON instagram_accounts(clerk_id);

-- Create index for faster queries by expiration date
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_expires_at ON instagram_accounts(expires_at);

-- Create index for faster queries by username
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_username ON instagram_accounts(username);

-- Add comments for documentation
COMMENT ON TABLE instagram_accounts IS 'Stores Instagram Business API account information and long-lived tokens';
COMMENT ON COLUMN instagram_accounts.instagram_id IS 'Instagram Business Account ID from Meta Graph API';
COMMENT ON COLUMN instagram_accounts.clerk_id IS 'Clerk user ID for authentication';
COMMENT ON COLUMN instagram_accounts.username IS 'Instagram account username (page name)';
COMMENT ON COLUMN instagram_accounts.access_token IS 'Long-lived access token for Instagram Business API (60 days)';
COMMENT ON COLUMN instagram_accounts.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN instagram_accounts.connected_at IS 'When the account was first connected';
COMMENT ON COLUMN instagram_accounts.last_posted_at IS 'Timestamp of the last post made through this account';

-- Enable Row Level Security (RLS)
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can only access their own Instagram accounts
CREATE POLICY "Users can only access their own Instagram accounts" ON instagram_accounts
    FOR ALL USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON instagram_accounts TO authenticated;
GRANT USAGE ON SEQUENCE instagram_accounts_id_seq TO authenticated;
