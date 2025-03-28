-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  tuev_date DATE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  transport_type TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  status TEXT NOT NULL DEFAULT 'unassigned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table vehicles;
alter publication supabase_realtime add table appointments;
