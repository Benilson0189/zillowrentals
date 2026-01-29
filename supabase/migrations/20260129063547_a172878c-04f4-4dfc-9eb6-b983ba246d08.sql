-- Update the foreign key constraint to SET NULL on delete
-- This allows linked_accounts to be deleted even when transactions reference them

ALTER TABLE public.transactions 
DROP CONSTRAINT IF EXISTS transactions_linked_account_id_fkey;

ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_linked_account_id_fkey 
FOREIGN KEY (linked_account_id) 
REFERENCES public.linked_accounts(id) 
ON DELETE SET NULL;