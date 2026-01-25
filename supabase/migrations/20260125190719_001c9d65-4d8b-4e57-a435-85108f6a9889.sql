
-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);

-- Create policies for payment proofs bucket
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create linked_accounts table for withdrawals
CREATE TABLE public.linked_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on linked_accounts
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

-- RLS policies for linked_accounts
CREATE POLICY "Users can view their own linked accounts"
ON public.linked_accounts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own linked accounts"
ON public.linked_accounts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own linked accounts"
ON public.linked_accounts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own linked accounts"
ON public.linked_accounts
FOR DELETE
USING (auth.uid() = user_id);

-- Add proof_url column to transactions table for deposit proofs
ALTER TABLE public.transactions ADD COLUMN proof_url TEXT;

-- Add linked_account_id column to transactions table for withdrawals
ALTER TABLE public.transactions ADD COLUMN linked_account_id UUID REFERENCES public.linked_accounts(id);
