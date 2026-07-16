
CREATE POLICY "ogadmin view consultations" ON public.consultations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ogadmin'));
CREATE POLICY "ogadmin view contact" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ogadmin'));
