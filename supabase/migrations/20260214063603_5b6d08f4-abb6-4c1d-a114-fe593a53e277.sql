
-- Allow users to only view their own submitted reports
CREATE POLICY "Users can view own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = reporter_id);
