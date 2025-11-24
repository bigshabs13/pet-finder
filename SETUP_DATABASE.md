# Pet-Finder Database Setup

## Quick Setup

Your Supabase database needs to be configured with the required tables. Follow these steps:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com
2. Log in to your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Create the Pets Table

Copy the entire SQL code below and paste it into the SQL Editor:

```sql
-- Create pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  gender VARCHAR(50),
  age VARCHAR(100),
  weight VARCHAR(100),
  color VARCHAR(100),
  description TEXT,
  microchip_id VARCHAR(100),
  owner_phone VARCHAR(20) NOT NULL,
  photo_url TEXT,
  qr_code_url TEXT,
  status VARCHAR(50) DEFAULT 'safe',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on owner_id for faster queries
CREATE INDEX pets_owner_id_idx ON pets(owner_id);

-- Enable RLS on pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to read/write their own pets
CREATE POLICY "Users can read their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = owner_id);
```

### Step 3: Run the Query
1. Click the **Run** button (or press Ctrl+Enter)
2. Wait for the query to complete successfully
3. You should see a green checkmark indicating success

### Step 4: Verify
Go back to your Pet-Finder website and try adding a pet again. It should now work!

## Database Schema

The `pets` table now includes:
- **Basic Info**: name, species, breed
- **Physical Details**: gender, age, weight, color
- **Identification**: microchip_id, photo_url
- **Contact**: owner_phone
- **QR Code**: qr_code_url
- **Status**: safe/lost tracking

## Troubleshooting

If you still get an error:
1. Make sure you're connected to the correct Supabase project
2. Check that the SQL executed without errors
3. Go to the **Table Editor** to verify the `pets` table exists
4. Refresh your browser and try again

## Need Help?

Check the Supabase documentation: https://supabase.com/docs
