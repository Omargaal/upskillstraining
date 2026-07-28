-- 1) Certificates table
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  tier_id text NOT NULL REFERENCES public.tiers(id) ON DELETE CASCADE,
  certificate_number text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own certificates"
  ON public.certificates FOR SELECT TO authenticated
  USING (auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'ogadmin'::app_role));

CREATE POLICY "admins manage certificates"
  ON public.certificates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'ogadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'ogadmin'::app_role));

-- 2) Trigger: after a module is completed, check if the whole tier is done and issue a certificate
CREATE OR REPLACE FUNCTION public.maybe_issue_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier_id text;
  v_total int;
  v_done int;
  v_num text;
BEGIN
  SELECT tier_id INTO v_tier_id FROM public.modules WHERE id = NEW.module_id;
  IF v_tier_id IS NULL THEN RETURN NEW; END IF;

  SELECT count(*) INTO v_total FROM public.modules WHERE tier_id = v_tier_id;
  SELECT count(*) INTO v_done
    FROM public.module_progress mp
    JOIN public.modules m ON m.id = mp.module_id
    WHERE mp.user_id = NEW.user_id AND m.tier_id = v_tier_id;

  IF v_total > 0 AND v_done >= v_total THEN
    v_num := 'UST-' || upper(v_tier_id) || '-' || to_char(now(), 'YYYYMMDD') || '-' || substr(replace(NEW.user_id::text, '-', ''), 1, 8);
    INSERT INTO public.certificates (user_id, tier_id, certificate_number)
    VALUES (NEW.user_id, v_tier_id, v_num)
    ON CONFLICT (user_id, tier_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_module_progress_certificate ON public.module_progress;
CREATE TRIGGER trg_module_progress_certificate
AFTER INSERT ON public.module_progress
FOR EACH ROW EXECUTE FUNCTION public.maybe_issue_certificate();