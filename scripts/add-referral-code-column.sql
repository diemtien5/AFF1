-- Add referral_code column to loan_packages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loan_packages' AND column_name='referral_code') THEN
    ALTER TABLE loan_packages ADD COLUMN referral_code TEXT DEFAULT 'CN09XXXX';
  END IF;
END $$;
