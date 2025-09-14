-- Debug table structure and fix potential issues
-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'loan_packages'
ORDER BY ordinal_position;

-- Check if there are any constraints causing issues
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'loan_packages';

-- Fix potential issues
-- Ensure all existing records have referral_code and tooltip_enabled
UPDATE loan_packages
SET
  referral_code = COALESCE(referral_code, 'CN09XXXX'),
  tooltip_enabled = COALESCE(tooltip_enabled, true)
WHERE referral_code IS NULL OR tooltip_enabled IS NULL;

-- Check for any duplicate slugs that might cause unique constraint violations
SELECT slug, COUNT(*) as count
FROM loan_packages
GROUP BY slug
HAVING COUNT(*) > 1;
