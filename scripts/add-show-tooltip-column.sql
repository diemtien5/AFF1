-- Add show_tooltip column to loan_packages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loan_packages' AND column_name='show_tooltip') THEN
    ALTER TABLE loan_packages ADD COLUMN show_tooltip BOOLEAN DEFAULT true;
  END IF;
END $$;
