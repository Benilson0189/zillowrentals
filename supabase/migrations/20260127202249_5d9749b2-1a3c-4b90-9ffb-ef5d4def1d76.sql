
-- Create a function to distribute referral commissions when someone invests
CREATE OR REPLACE FUNCTION public.distribute_referral_commissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    investor_profile_id UUID;
    level_a_profile_id UUID;
    level_b_profile_id UUID;
    level_c_profile_id UUID;
    level_a_user_id UUID;
    level_b_user_id UUID;
    level_c_user_id UUID;
    commission_a NUMERIC;
    commission_b NUMERIC;
    commission_c NUMERIC;
BEGIN
    -- Get the investor's profile
    SELECT id, referred_by INTO investor_profile_id, level_a_profile_id
    FROM public.profiles
    WHERE user_id = NEW.user_id;

    -- If investor was referred (Level A referrer exists)
    IF level_a_profile_id IS NOT NULL THEN
        -- Calculate 20% commission for Level A
        commission_a := NEW.amount * 0.20;
        
        -- Get Level A user_id and their referrer (Level B)
        SELECT user_id, referred_by INTO level_a_user_id, level_b_profile_id
        FROM public.profiles
        WHERE id = level_a_profile_id;
        
        -- Credit commission to Level A referrer
        UPDATE public.user_balances
        SET commission_earnings = COALESCE(commission_earnings, 0) + commission_a,
            balance = COALESCE(balance, 0) + commission_a,
            updated_at = now()
        WHERE user_id = level_a_user_id;
        
        -- If Level B referrer exists
        IF level_b_profile_id IS NOT NULL THEN
            -- Calculate 3% commission for Level B
            commission_b := NEW.amount * 0.03;
            
            -- Get Level B user_id and their referrer (Level C)
            SELECT user_id, referred_by INTO level_b_user_id, level_c_profile_id
            FROM public.profiles
            WHERE id = level_b_profile_id;
            
            -- Credit commission to Level B referrer
            UPDATE public.user_balances
            SET commission_earnings = COALESCE(commission_earnings, 0) + commission_b,
                balance = COALESCE(balance, 0) + commission_b,
                updated_at = now()
            WHERE user_id = level_b_user_id;
            
            -- If Level C referrer exists
            IF level_c_profile_id IS NOT NULL THEN
                -- Calculate 1% commission for Level C
                commission_c := NEW.amount * 0.01;
                
                -- Get Level C user_id
                SELECT user_id INTO level_c_user_id
                FROM public.profiles
                WHERE id = level_c_profile_id;
                
                -- Credit commission to Level C referrer
                UPDATE public.user_balances
                SET commission_earnings = COALESCE(commission_earnings, 0) + commission_c,
                    balance = COALESCE(balance, 0) + commission_c,
                    updated_at = now()
                WHERE user_id = level_c_user_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically distribute commissions when investment is created
DROP TRIGGER IF EXISTS trigger_distribute_commissions ON public.user_investments;
CREATE TRIGGER trigger_distribute_commissions
    AFTER INSERT ON public.user_investments
    FOR EACH ROW
    EXECUTE FUNCTION public.distribute_referral_commissions();
