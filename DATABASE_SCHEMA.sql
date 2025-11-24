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

-- Create missing_pets table for tracking lost pets
CREATE TABLE missing_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lost_date DATE NOT NULL,
  lost_time TIME,
  lost_location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  additional_description TEXT,
  reward_amount DECIMAL(10, 2),
  reward_description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX missing_pets_owner_id_idx ON missing_pets(owner_id);
CREATE INDEX missing_pets_status_idx ON missing_pets(status);
CREATE INDEX missing_pets_location_idx ON missing_pets(lost_location);

ALTER TABLE missing_pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all missing pets"
  ON missing_pets FOR SELECT
  USING (true);

CREATE POLICY "Users can insert missing pets"
  ON missing_pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own missing pets"
  ON missing_pets FOR UPDATE
  USING (auth.uid() = owner_id);

-- Create pet_sightings table for tracking sightings
CREATE TABLE pet_sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  missing_pet_id UUID REFERENCES missing_pets(id) ON DELETE CASCADE,
  reporter_name VARCHAR(255),
  reporter_phone VARCHAR(20),
  reporter_email VARCHAR(255),
  sighting_location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  sighting_date DATE NOT NULL,
  sighting_time TIME,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX pet_sightings_pet_id_idx ON pet_sightings(pet_id);
CREATE INDEX pet_sightings_location_idx ON pet_sightings(sighting_location);
CREATE INDEX pet_sightings_date_idx ON pet_sightings(sighting_date);

ALTER TABLE pet_sightings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sightings"
  ON pet_sightings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert sightings"
  ON pet_sightings FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-qr-codes', 'pet-qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for storage
CREATE POLICY "Public Access for QR Codes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pet-qr-codes');

CREATE POLICY "Users can upload their own QR codes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pet-qr-codes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
