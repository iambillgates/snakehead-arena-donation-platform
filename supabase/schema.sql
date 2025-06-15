-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT UNIQUE,
  google_id TEXT UNIQUE,
  name TEXT,
  email TEXT,
  total_donations BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount IN (50000, 200000)),
  type TEXT NOT NULL CHECK (type IN ('SNAKEHEADS_POINTS', 'SNAKEHEADS_PEDS')),
  reward TEXT NOT NULL CHECK (reward IN ('1,000,000 points', '1 month access')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
  date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
  midtrans_transaction_id TEXT UNIQUE,
  payment_method TEXT,
  payment_details JSONB,
  transaction_time TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for leaderboard queries
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_date ON donations(date);
