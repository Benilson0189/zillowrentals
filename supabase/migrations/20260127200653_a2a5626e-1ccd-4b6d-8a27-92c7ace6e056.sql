-- Make the payment-proofs bucket public so admins can view the proof images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'payment-proofs';

-- Add RLS policy to allow anyone to view payment proofs (since bucket is now public)
-- But only authenticated users can upload
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');