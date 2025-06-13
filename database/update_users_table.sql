-- Update users table to include additional fields for registration

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'active';

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Add constraint to ensure email uniqueness
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Update existing users to have verified emails
UPDATE users SET email_verified = TRUE WHERE email IN ('admin@naijadelights.com', 'user@example.com');
