-- Add image_url column to investment_plans for property images
ALTER TABLE public.investment_plans ADD COLUMN IF NOT EXISTS image_url text;

-- Update plans with property names and descriptions
ALTER TABLE public.investment_plans ADD COLUMN IF NOT EXISTS description text;