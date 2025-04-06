-- Create necessary extensions
create extension if not exists "uuid-ossp";

-- Enable Row Level Security
alter database postgres set "auth.enable_row_level_security" = on;

-- Create custom types
CREATE TYPE share_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE envelope_share_status AS ENUM ('active', 'pending');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    initials TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create envelopes table
CREATE TABLE envelopes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    recurring BOOLEAN DEFAULT false,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create envelope amounts table
CREATE TABLE envelope_amounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    envelope_id UUID REFERENCES envelopes(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create used amounts table
CREATE TABLE used_amounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    envelope_id UUID REFERENCES envelopes(id) ON DELETE CASCADE NOT NULL,
    used INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create entries table
CREATE TABLE entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    envelope_id UUID REFERENCES envelopes(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create envelope shares table
CREATE TABLE envelope_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    envelope_id UUID REFERENCES envelopes(id) ON DELETE CASCADE NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    shared_with_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status envelope_share_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(envelope_id, shared_with_id)
);

-- Create share requests table
CREATE TABLE share_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    envelope_id UUID REFERENCES envelopes(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status share_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(envelope_id, sender_id, recipient_id)
);

-- Create indexes
CREATE INDEX idx_envelopes_owner_id ON envelopes(owner_id);
CREATE INDEX idx_envelope_amounts_envelope_id ON envelope_amounts(envelope_id);
CREATE INDEX idx_used_amounts_envelope_id ON used_amounts(envelope_id);
CREATE INDEX idx_entries_envelope_id ON entries(envelope_id);
CREATE INDEX idx_envelope_shares_envelope_id ON envelope_shares(envelope_id);
CREATE INDEX idx_envelope_shares_shared_with_id ON envelope_shares(shared_with_id);
CREATE INDEX idx_share_requests_envelope_id ON share_requests(envelope_id);
CREATE INDEX idx_share_requests_sender_id ON share_requests(sender_id);
CREATE INDEX idx_share_requests_recipient_id ON share_requests(recipient_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_envelopes_updated_at
    BEFORE UPDATE ON envelopes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_envelope_amounts_updated_at
    BEFORE UPDATE ON envelope_amounts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_used_amounts_updated_at
    BEFORE UPDATE ON used_amounts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON entries
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_envelope_shares_updated_at
    BEFORE UPDATE ON envelope_shares
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_share_requests_updated_at
    BEFORE UPDATE ON share_requests
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE envelope_amounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_amounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE envelope_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Envelopes policies
CREATE POLICY "Users can view their own envelopes"
    ON envelopes FOR SELECT
    USING (
        auth.uid() = owner_id OR 
        EXISTS (
            SELECT 1 FROM envelope_shares 
            WHERE envelope_id = envelopes.id 
            AND shared_with_id = auth.uid() 
            AND status = 'active'
        )
    );

CREATE POLICY "Users can create their own envelopes"
    ON envelopes FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own envelopes"
    ON envelopes FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own envelopes"
    ON envelopes FOR DELETE
    USING (auth.uid() = owner_id);

-- Envelope amounts policies
CREATE POLICY "Users can view envelope amounts they have access to"
    ON envelope_amounts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM envelopes 
            WHERE id = envelope_amounts.envelope_id 
            AND (
                owner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM envelope_shares 
                    WHERE envelope_id = envelopes.id 
                    AND shared_with_id = auth.uid() 
                    AND status = 'active'
                )
            )
        )
    );

CREATE POLICY "Users can manage envelope amounts they own"
    ON envelope_amounts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM envelopes 
            WHERE id = envelope_amounts.envelope_id 
            AND owner_id = auth.uid()
        )
    );

-- Similar policies for used_amounts, entries, envelope_shares, and share_requests...
-- (Additional policies follow the same pattern as above)

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_envelope_balance(envelope_id UUID, date DATE)
RETURNS INTEGER AS $$
DECLARE
    allocated INTEGER;
    used INTEGER;
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO allocated
    FROM envelope_amounts
    WHERE envelope_amounts.envelope_id = get_envelope_balance.envelope_id
    AND envelope_amounts.date <= get_envelope_balance.date;

    SELECT COALESCE(SUM(used), 0) INTO used
    FROM used_amounts
    WHERE used_amounts.envelope_id = get_envelope_balance.envelope_id
    AND used_amounts.date <= get_envelope_balance.date;

    RETURN allocated - used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 