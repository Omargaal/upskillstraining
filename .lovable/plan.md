
# Redesign: IT Training page (`/courses?category=it`)

Your spec describes a full learning platform (auth roles, Stripe, progress tracking, quizzes, labs, certificates, admin grading, live cohorts). That's a multi-week build spanning ~10 database tables, Stripe integration, and dozens of new pages.

I want to confirm scope before I start, because "re-design the IT Course page" and "build the full portal" are very different jobs. My proposal is to split it into phases and do **Phase 1 now**.

## Phase 1 — Marketing redesign (this task)

Completely rebuild the IT Training landing page around the new curriculum so it *looks and reads* like the described product. No backend changes.

### Page sections (top → bottom)
1. **Hero** — "From zero experience to enterprise-ready skills." Deep-blue palette, MD-102 / Intune / Entra ID badges, primary CTA "View curriculum", secondary "See pricing".
2. **Value pillars** (4 cards) — Stackable tiers · Hands-on labs · Live or self-paced · MD-102 aligned.
3. **Curriculum** — 4 tier blocks, each with 3 module cards using the big-blue-numeral motif (01/02/03 … 12). Every card shows title + one-line topic + "Lab" tag.
4. **Delivery modes** — 3 cards: Self-paced Online · Online + Live Labs · In-Class. Explains format, cadence, support level.
5. **Pricing table** — 4 tier rows + Bundle row, columns Online / Live / In-Class, with the exact prices from the spec. "Save £X with the bundle" callout. Buttons are "Enquire" (opens the existing Consultation modal) — no Stripe yet.
6. **Free Module 0 — Orientation** — lead-magnet card with "What is Modern Endpoint Management?" and CTA to the free consultation.
7. **Career outcomes** — job titles + salary bands (reuse existing journey data), MD-102 alignment note.
8. **FAQ** — 6–8 Qs (delivery, prerequisites, refunds, instalments, cert alignment, time commitment).
9. **Final CTA** — book consultation.

### Design tokens
- Add a "deep blue + amber accent" variant to existing tokens in `src/styles.css` so the IT page reads more enterprise than the current gradient-heavy look. Reuse existing shadcn components.
- Keep the numeral-forward module card style consistent across curriculum + pricing.

### Files touched
- `src/components/ITTrainingLanding.tsx` — rewritten around the 4-tier structure.
- `src/lib/courses.ts` — add the 12-module + 4-tier data model (frontend only) so the page reads from one source.
- `src/styles.css` — add IT-track color tokens.
- `src/routes/courses.index.tsx` — no structural change; still renders `<ITTrainingLanding />`.

Existing pages (About, PCO, Home, Admin) are **not** touched.

## Phase 2+ (later, on request)

- Auth roles (student/instructor/admin) + Supabase tables (tiers, modules, enrollments, progress, quizzes, labs, certificates, live_sessions).
- Stripe checkout for tier + bundle + instalments.
- Student dashboard, module viewer, quiz engine, lab uploads, certificate PDFs.
- Admin content manager, progress viewer, cohort scheduler.

Each of these is its own task and I'll plan them individually when you're ready.

---

**Reply "go" to start Phase 1**, or tell me which sections to add/drop/reorder first. If you want me to jump straight into Phase 2 (backend/LMS) instead, say so and I'll plan that separately.
