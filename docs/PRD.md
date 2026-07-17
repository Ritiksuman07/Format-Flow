# Product Requirements Document: CSV Cleaner + Validator

## Product Overview
A web-based CSV cleaning and validation tool. Upload → Clean → Download. No signup required for free tier. Client-side processing means files never leave your machine.

## Target Audience
- **Primary**: Freelancers, small business owners, marketers (non-technical)
- **Secondary**: Developers, data analysts, researchers
- **Tertiary**: Anyone who regularly works with CSV/spreadsheet exports

## User Flow
1. Land on page → see upload area
2. Upload CSV file (drag & drop or click)
3. Auto-preview of data in table
4. Select cleaning operations (checkboxes/toggles)
5. See validation errors highlighted in preview
6. Download cleaned CSV

## Features by Priority

### P0 (MVP - Must Have)
- [x] CSV file upload (drag & drop + click)
- [x] Auto-detect delimiter, encoding
- [x] Table preview of parsed data
- [x] Trim whitespace across all cells
- [x] Remove duplicate rows (exact match)
- [x] Remove empty rows
- [x] Remove empty columns
- [x] Email validation + highlighting
- [x] Download cleaned CSV
- [x] Row limit: Free (10K rows), Pro (unlimited)
- [x] Dark mode (system preference)

### P1 (v1.1 - Soon)
- [ ] Fuzzy duplicate detection
- [ ] Phone number validation
- [ ] Date format standardization
- [ ] Export as XLSX
- [ ] Undo/redo last action
- [ ] Column split/merge

### P2 (v1.2 - Later)
- [ ] Upload history (localStorage)
- [ ] Batch file processing
- [ ] Custom validation rules
- [ ] API access for pro users
- [ ] Team sharing

## Pricing Model

| Feature | Free | Pro ($15/mo) |
|---------|------|--------------|
| Max rows | 10,000 | Unlimited |
| Cleaning operations | All | All + batch |
| Validations | Email | Email + Phone + Date + Custom |
| Export formats | CSV | CSV + XLSX |
| File size | 50MB | 500MB |
| Support | Community | Email priority |

## Success Metrics
- **Activation**: User completes a clean + download cycle
- **Conversion**: Free → Pro upgrade rate > 3%
- **Retention**: Week-4 return rate > 20%
- **SEO**: Rank top 5 for "csv cleaner online"
