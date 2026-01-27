-- Update generate_display_id function to create IDs in format: 3 numbers + 1 letter + 3 numbers (e.g., 837B372)
CREATE OR REPLACE FUNCTION public.generate_display_id()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    new_id TEXT;
    letters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    digits TEXT := '0123456789';
    i INTEGER;
    exists_count INTEGER;
BEGIN
    LOOP
        new_id := '';
        -- Generate 3 digits
        FOR i IN 1..3 LOOP
            new_id := new_id || substr(digits, floor(random() * length(digits) + 1)::integer, 1);
        END LOOP;
        -- Add 1 letter in the middle
        new_id := new_id || substr(letters, floor(random() * length(letters) + 1)::integer, 1);
        -- Generate 3 more digits
        FOR i IN 1..3 LOOP
            new_id := new_id || substr(digits, floor(random() * length(digits) + 1)::integer, 1);
        END LOOP;
        
        -- Check if ID already exists
        SELECT COUNT(*) INTO exists_count FROM public.profiles WHERE display_id = new_id;
        
        -- If unique, return it
        IF exists_count = 0 THEN
            RETURN new_id;
        END IF;
    END LOOP;
END;
$function$;