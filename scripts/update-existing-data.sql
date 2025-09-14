-- Update existing loan_packages data to include referral_code and tooltip_enabled
UPDATE loan_packages
SET
  referral_code = 'CN09XXXX',
  tooltip_enabled = true
WHERE referral_code IS NULL OR tooltip_enabled IS NULL;
