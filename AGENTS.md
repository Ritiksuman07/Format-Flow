# Agent Hub — CSV Cleaner + Validator

## Hub Command Protocol
Each agent team debates features, architecture, and trade-offs. The Hub (me) facilitates, resolves conflicts, and makes final calls based on evidence.

---

## Team 1: Research & Strategy (Market Intelligence)

**Sub-Agents:**
| Agent | Role | Focus |
|-------|------|-------|
| R1 - Market Analyst | Competitor research | Analyzes CleanCSV, CSV Lint, OpenRefine, Excel power query |
| R2 - SEO Strategist | Keyword discovery | Finds high-intent CSV-related search terms |
| R3 - Pricing Researcher | Monetization models | Benchmarks freemium vs trial vs usage pricing |
| R4 - User Pain Analyst | Feature prioritization | Mines Reddit, HN, Twitter for CSV pain points |

**Debate Questions:**
1. Is $15/mo the right price point?
2. Should we do free tier + pro, or free trial?
3. What's the killer feature competitors don't have?

---

## Team 2: Engineering & Architecture (Builders)

**Sub-Agents:**
| Agent | Role | Focus |
|-------|------|-------|
| E1 - Frontend Lead | Next.js + Tailwind | Component architecture, state management |
| E2 - CSV Engine Lead | Data processing | Parser, cleaner, validator pipeline |
| E3 - Performance Lead | Web Workers | Large file handling, memory optimization |
| E4 - Security Lead | Input sanitization | XSS prevention, file validation, rate limiting |

**Debate Questions:**
1. Client-side only vs lightweight API? (Decision: Client-side — zero server cost)
2. papaparse vs custom parser? (Decision: papaparse for reliability)
3. Web Workers for >50MB files? (Decision: Implement in v2, sync for now)
4. How to handle 200MB+ files? (Decision: Stream + chunk processing)

---

## Team 3: Design & UX (Experience)

**Sub-Agents:**
| Agent | Role | Focus |
|-------|------|-------|
| D1 - UI Designer | Visual design | Color, typography, layout, dark mode |
| D2 - UX Researcher | User flow | Onboarding, empty states, error handling |
| D3 - Accessibility Lead | a11y | WCAG compliance, keyboard nav, screen readers |
| D4 - Conversion Designer | CRO | Pricing page, upgrade prompts, trial flow |

**Debate Questions:**
1. Single-page tool vs multi-step wizard? (Decision: Single-page with sections)
2. Show preview by default or after upload? (Decision: Auto-preview on upload)
3. Dark mode in MVP? (Decision: Yes, system preference)
4. Place upgrade prompts where? (Decision: After action on row-limited files)

---

## Team 4: Quality & Testing (Assurance)

**Sub-Agents:**
| Agent | Role | Focus |
|-------|------|-------|
| Q1 - Test Engineer | Edge cases | Empty files, malformed CSV, unicode, BOM |
| Q2 - Cross-browser Lead | Compatibility | Chrome, Firefox, Safari, Edge |
| Q3 - Mobile Lead | Responsive | Mobile-first design, touch interactions |
| Q4 - Regression Guard | Stability | Ensures features don't break each other |

**Debate Questions:**
1. Test with 10K, 100K, 1M row files? (Decision: Test up to 100K for MVP)
2. Supported encodings? (Decision: UTF-8, UTF-16, Latin-1 auto-detect)
3. Delimiter auto-detection? (Decision: comma, tab, semicolon, pipe)

---

## Team 5: Growth & Marketing (Distribution)

**Sub-Agents:**
| Agent | Role | Focus |
|-------|------|-------|
| G1 - SEO Lead | Organic growth | Meta tags, structured data, sitemap |
| G2 - Content Strategist | Blog/content | "How to clean CSV" type articles |
| G3 - Social Lead | Distribution | Product Hunt, Reddit, Twitter launch |
| G4 - Analytics Lead | Tracking | PostHog/Plausible events, conversion funnel |

**Debate Questions:**
1. SEO-first or launch-first? (Decision: SEO-first — sustainable)
2. Product Hunt launch strategy? (Decision: Phased — soft launch first)
3. Free tool directory submissions? (Decision: Yes, top 30 directories)

---

## Hub Decision Log

| # | Decision | Team Consensus | Rationale |
|---|----------|---------------|-----------|
| 1 | Client-side only | Engineering + Research | Zero hosting cost, fast, private |
| 2 | Free 10K rows + $15/mo unlimited | Research + Growth | Market-standard, clear upgrade trigger |
| 3 | Lemon Squeezy for payments | Engineering | Multi-currency, tax-compliant, no US entity |
| 4 | No auth required for free tier | UX + Engineering | Lower friction, higher conversion |
| 5 | Dark mode in v1 | Design + UX | Low effort, high perceived quality |
| 6 | Auto-detect delimiters | All teams | Eliminates #1 user frustration |
