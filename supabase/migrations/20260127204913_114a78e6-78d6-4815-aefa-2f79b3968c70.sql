-- Add display_id column to profiles
ALTER TABLE public.profiles 
ADD COLUMN display_id TEXT UNIQUE;

-- Create function to generate unique display ID in format like 345D789
CREATE OR REPLACE FUNCTION public.generate_display_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_id TEXT;
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    i INTEGER;
    exists_count INTEGER;
BEGIN
    LOOP
        new_id := '';
        -- Generate 7 character alphanumeric ID
        FOR i IN 1..7 LOOP
            new_id := new_id || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if ID already exists
        SELECT COUNT(*) INTO exists_count FROM public.profiles WHERE display_id = new_id;
        
        -- If unique, return it
        IF exists_count = 0 THEN
            RETURN new_id;
        END IF;
    END LOOP;
END;
$$;

-- Update existing profiles with display IDs
UPDATE public.profiles SET display_id = public.generate_display_id() WHERE display_id IS NULL;

-- Make display_id not null after populating
ALTER TABLE public.profiles ALTER COLUMN display_id SET NOT NULL;

-- Set default for new profiles
ALTER TABLE public.profiles ALTER COLUMN display_id SET DEFAULT public.generate_display_id();

-- Update the handle_new_user function to include display_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Check if there's a referral code in metadata
    IF NEW.raw_user_meta_data->>'invite_code' IS NOT NULL THEN
        SELECT id INTO referrer_id FROM public.profiles 
        WHERE invite_code = NEW.raw_user_meta_data->>'invite_code';
    END IF;

    -- Create profile with auto-generated display_id
    INSERT INTO public.profiles (user_id, phone, full_name, referred_by, display_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        referrer_id,
        public.generate_display_id()
    );

    -- Create balance record
    INSERT INTO public.user_balances (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$;