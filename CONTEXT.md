# C-Hero — Product & Domain Context

> Companion to `CLAUDE.md`. `CLAUDE.md` covers *how the codebase is built*; this file covers *what the product is, who uses it, and why it exists*. Read this first when picking up unfamiliar work.

## The company

**C-Hero** (written with the letter **C**, pronounced *"Sea Hero"* — easy to mishear in voice input).

C-Hero manufactures innovative **man-overboard (MOB) rescue equipment** for commercial boats: rescue poles, davits, and related gear used to recover crew who have fallen into the water. Their customers are commercial maritime operators — companies that own fleets of working vessels.

This codebase is **the training platform** crew use after their vessel buys a C-Hero product. It is not an e-commerce site, not a product catalog — it is a read-the-manual-then-pass-the-quiz training system tied to what a specific vessel actually has onboard.

## People

- **Wayne** and **Shane** — C-Hero founders. They write the assessment questions, direct new customers to the site, and receive admin SMS + email notifications on signup events. In production, notifications go to `info@c-hero.com`, Shane's email, and Wayne's phone.
- **Augustus (the developer / this user)** — solo freelance developer building and modernizing the app. Also receives admin notifications.

## Product catalog

Products live in the `products` table and are referenced by short string IDs. The file layout under `public/assets/c-hero-classes/<id>/` mirrors this.

| ID   | Name                            | Category       |
|------|---------------------------------|----------------|
| `vr` | VR Rescue Pole                  | Rescue Pole    |
| `hr` | HR Rescue Pole                  | Rescue Pole    |
| `rk` | RK Rescue Pole                  | Rescue Pole    |
| `rs` | RS Rescue Pole                  | Rescue Pole    |
| `3b` | 3B Series 3 Davit – Bitt Mount  | Series 3 Davit |
| `3f` | 3F Series 3 Davit – Flat Mount  | Series 3 Davit |
| `5b` | 5B Series 5 Davit – Bitt Mount  | Series 5 Davit |
| `5f` | 5F Series 5 Davit – Flat Mount  | Series 5 Davit |
| `7b` | 7B Series 7 Davit – Bitt Mount  | Series 7 Davit |
| `7f` | 7F Series 7 Davit – Flat Mount  | Series 7 Davit |
| `9b` | 9B Series 9 Davit – Bitt Mount  | Man Rated      |
| `9f` | 9F Series 9 Davit – Flat Mount  | Man Rated      |
| `lk` | LK Litter Kit                   | Litter Kit     |
| `lh` | LH Lokhead                      | Lokhead        |

**Naming pattern for davits:** number = series, trailing letter = mount type (`b` = Bitt Mount, `f` = Flat Mount). "Man Rated" (Series 9) means the davit is certified to lift a person, not just equipment.

## Classes (the training units)

Each product has **four classes**, identified by a single letter suffix on the PDF filename:

1. **Setup** — `_a.pdf`
2. **Operations** — `_b.pdf`
3. **Inspection** — `_c.pdf`
4. **Drill** — `_d.pdf`

Some classes also have a **prusik strap** variant (e.g. `vr_p.pdf`, `vr_b_p.pdf`) — a conditional extra unit that applies when a davit has a prusik strap attached. **How this slots into the class model is still being figured out** (treat as a likely ~5th class, but don't hardcode assumptions).

Also under `c-hero-classes/`: a `safety/z_safety.pdf` and `troubleshooting/troubleshooting.pdf` — cross-product reference material, not per-product classes.

### How a class works for the user

1. User lands on a class page and **reads the PDF** (training manual for that class).
2. User clicks **"Take the assessment"** to go to a separate assessment page.
3. Quiz is **multiple choice + true/false**, questions stored in the DB.
4. **Must get 100% to pass** — every question right. (High bar by design — this is rescue equipment.)
5. **No time limit.** **Retakes allowed.**
6. The PDF is on a different page from the quiz but **remains accessible** — users are allowed to reference it while answering.

### Terminology — "assessment"

The multiple-choice quiz a user takes to pass a class is called an **"assessment"** throughout the codebase (routes, files, types, UI copy). This was renamed from "test" on 2026-04-16 to avoid collision with the software-engineering meaning of "test." Legacy `/test/:classId` URLs still redirect to `/assessment/:classId` for any bookmarked links. Historical migrations 003/004 retain the original "test" naming because they reference real dropped table names.

## User roles

Four roles, tracked via `users.level` (a load-bearing admin gate — see memory).

- **Crew** — works on a single vessel. Takes classes for the products their vessel has.
- **Captain** — runs a single vessel. Sees their crew's progress.
- **Shore-side** — employee of a company who oversees multiple vessels (possibly across multiple ports). Sees captains' and crews' progress under their company.
- **Admin** — site administrator. In practice: the developer and the C-Hero founders, not end users. Can see everything.

**Progress visibility is top-down:** shore-side → captain → crew. Whether crew members on the same vessel see each other is TBD and not a priority.

## Organizational model

From `db/init/tables/`:

- **`company`** — an operator that buys C-Hero products. Joined to vessels via `company_vessels` and to products via `company_products`.
- **`vessels`** — the boats. Joined to products via `vessels_products` and to users via `users_vessels`.
- **`ports`** — physical location where a vessel is based. Joined to vessels via `ports_vessels`. Minimal meaning today; may grow.
- **`users`** — joined to vessels (`users_vessels`) and to classes (`users_products` — the `class_id` column holds composite class identifiers like `hr_b`, despite the table name).
- **`products`** — the catalog above. Questions live in `questions`, joined to classes via `class_questions` (where `class_id` is a composite like `hr_b` = HR product + Operations class).

Shore-side ↔ company scoping is **still being fleshed out** — the tables exist but the exact hierarchy (how a shore-side user's jurisdiction is computed) isn't fully settled.

## Lifecycle: how a user ends up trained

1. A company buys a C-Hero product (physical sale, off-platform).
2. Founders direct that company's crew to the training site.
3. User hits signup, enters phone number.
4. **Twilio** sends a 4-digit code; user enters it.
5. **Auth0** handles authentication (JWT on protected `/api/routes/` endpoints).
6. During signup, the user selects which products their vessel has.
7. Products, their four classes, and serial numbers are associated with the user.
8. **SendGrid** sends a welcome email.
9. Admins (founders + Augustus) get SMS + email notifications on signup events (see `server/sms.js`).
10. User reads PDFs, takes quizzes, passes classes.

## Notifications (`server/sms.js`)

- **Twilio** — login codes to end users; admin SMS to founders on signup events.
- **SendGrid** — welcome email to new users; admin email alerts to founders.
- Production vs. dev is gated by `VITE_NODE_ENV`: in dev, admin notifications only go to Augustus.

## PDFs

- Currently stored as **static assets** in `public/assets/c-hero-classes/` (also mirrored in `src/assets/` and `dist/assets/` — the duplication is a smell worth cleaning up).
- All vessels get the **same PDF for the same product** — no per-tenant content.
- Works fine as long as PDFs are public, small, and change infrequently. If they ever become sensitive, per-tenant, or churn often, move to **S3 + signed URLs**. Not urgent.

## Question authoring

- Questions are authored by a founder in a **Google Sheet**.
- Augustus manually transfers them into Postgres (`questions` / `class_questions` tables).
- No admin UI for question editing yet.

## Certification

**Not built.** On the roadmap. Today, passing all four classes for a product does nothing external — no certificate, no expiration, no recert cadence. When this lands, it will be the main consumer of "has this user passed everything for product X" state.

## Deployment

- **Render.com** today.

## Current state & roadmap (as of 2026-04-16)

- **In flight:** UI updates and performance/code-quality optimizations. Ongoing modernization of older patterns left over from earlier in the project.
- **Actively unsettled (safe to propose changes, but confirm first):**
  - Certification flow (unbuilt).
  - Shore-side ↔ company scoping.
  - How the prusik strap fits into the class model.
  - Serial-number assignment wiring.
- **No hard "don't touch" zones** — but handle sensitive areas (auth, `users.level` gating, assessment submission) case-by-case with confirmation.
- **Next priorities:** TBD — Augustus will sync with the founders.

## Glossary

- **MOB** — man overboard.
- **Davit** — a crane-like arm that lowers/raises equipment (or people, if "Man Rated") over the side of a vessel.
- **Bitt mount / Flat mount** — two ways to attach a davit to the deck.
- **Prusik strap** — a friction-hitch rope device; relevant to some davit configurations.
- **Class** — one of the four training units per product (Setup / Operations / Inspection / Drill).
- **Assessment** — the multiple-choice check at the end of a class. (Renamed from "test" on 2026-04-16.)
