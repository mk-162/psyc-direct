# Content Migration Skill

Automated page builder and content writer for merging Psychology Direct and Psychiatry Direct websites.

## What This Does

This skill automates the migration of 50+ pages from two separate websites into one unified, SEO-optimized, conversion-focused domain.

### Input
- Google Sheets spreadsheet with page mapping
- Current page URLs (Psychology Direct & Psychiatry Direct)
- Content brief and brand guidelines

### Output
- Markdown files ready for Astro/CMS
- Complete SEO metadata
- Conversion-optimized content
- Brand-compliant tone and structure

## Quick Start

### 1. Read the Documentation
- **SKILL.md** - Complete skill definition and standards
- **WORKFLOW.md** - Step-by-step usage guide
- **README.md** - This file

### 2. Start Claude Code
```bash
cd psyc-direct-astro
claude-code
```

### 3. Initialize Migration
```
"Using the content-migration skill, initialize the migration project"
```

### 4. Create Your First Page
```
"Using the content-migration skill, create the Prison Law Expert Witness page"
```

### 5. Review Output
Check `content-migration/pages/prison-law-expert-witness.md`

### 6. Process More Pages
```
"Using the content-migration skill, process all Expert Witness pages"
```

## Key Features

### ✅ Fully Automated Content Creation
- Fetches current page content
- Analyzes strengths and weaknesses
- Generates new optimized content
- Includes SEO metadata
- Adds layered CTAs
- Incorporates trust elements

### ✅ Brand Voice Compliance
- Matches Psychology Direct tone
- Professional with empathy
- Clear, concise, trustworthy
- Active voice, short paragraphs
- Benefits before features

### ✅ SEO Optimized
- Target keyword integration
- Meta tags (title ≤60, description ≤160)
- Internal linking strategy
- FAQ sections for long-tail
- H1/H2/H3 hierarchy

### ✅ Conversion Focused
- Layered CTAs throughout
- Trust signals near conversion points
- Audience-specific sections
- Clear value propositions
- Process explanations

### ✅ Quality Assured
- Template adherence
- Audit trail
- Progress tracking
- Batch processing
- Consistency checks

## Skill Components

### SKILL.md
The complete skill definition including:
- Content brief and writing rules
- Page template structure
- SEO requirements
- Trust elements and conversion strategy
- Research process
- Quality standards

### WORKFLOW.md
Step-by-step workflow guide including:
- Quick start commands
- Detailed phase-by-phase process
- Quality control checklists
- Integration steps
- Troubleshooting tips

### Example Output
Prison Law Expert Witness page demonstrating:
- Perfect template adherence
- Optimal SEO structure
- Layered CTAs
- Trust elements
- Professional tone

## Usage Examples

### Process a Single Page
```
"Using the content-migration skill, create the [page name] page from row [ID]"
```

### Process by Category
```
"Using the content-migration skill, process all pages in the Expert Witness category"
```

### Generate Progress Report
```
"Using the content-migration skill, generate migration progress report"
```

### Custom Requirements
```
"Using the content-migration skill, create the [page name] page.
Special requirement: [specific need]
Additional context: [relevant info]"
```

## Output Structure

```
content-migration/
├── pages/
│   ├── prison-law-expert-witness.md
│   ├── criminal-law-expert-witness.md
│   ├── educational-psychology-services.md
│   └── ... (all generated pages)
├── audit-log.md
├── migration-plan.md
├── migration-report.md
└── notes.md
```

## Quality Standards

Every generated page includes:

### Content
- ✅ Template structure adherence
- ✅ Brand tone matching
- ✅ Pain point addressing
- ✅ Benefits before features
- ✅ Active voice
- ✅ Scannable format

### SEO
- ✅ Target keyword integration
- ✅ Meta tags optimized
- ✅ Internal linking (3-5 links)
- ✅ External authority links (1-3)
- ✅ FAQ sections
- ✅ H1/H2/H3 hierarchy

### Conversion
- ✅ Layered CTAs (3+)
- ✅ Trust elements
- ✅ Clear value props
- ✅ Process explanation
- ✅ Audience sections
- ✅ Contact prominence

### Brand
- ✅ Psychology & Psychiatry both mentioned
- ✅ HCPC/GMC registration
- ✅ 24h CV turnaround
- ✅ Nationwide coverage
- ✅ Quality assurance
- ✅ Professional empathetic tone

## Data Source

**Google Sheet:**
https://docs.google.com/spreadsheets/d/1am6WhOg1ZAZBnpq-Wfd8Ro347OaGbQ9kv8REtGYI5p0/edit?gid=66286043#gid=66286043

**Columns:**
- Current Domain
- Current URL
- Proposed New Page
- Proposed URL
- Vertical
- Service Type
- SEO Target Phrases
- Suggested Title
- Suggested Meta Description

## Content Brief Summary

### Audience
B2B organizational clients:
- Solicitors
- Local Authorities
- Multi-Academy Trusts
- Schools

### Tone
- Professional authority
- Human-centric empathy
- Clear and concise
- Understanding of pressure
- Trustworthy

### Key Messages
- HCPC/GMC registered experts
- CVs within 24 hours
- Nationwide coverage
- Legal Aid compliant
- 100% quality checked
- Psychology & Psychiatry

## Integration with Astro

After generating markdown files:

### Option 1: Convert to Astro Pages
Use the existing Astro components to build pages from the markdown content.

### Option 2: Astro Content Collections
Set up Content Collections for dynamic page generation.

### Option 3: Headless CMS
Upload markdown to CMS for non-technical editing.

## Tips for Success

1. **Start Small** - Test with 1-2 pages first
2. **Review Quality** - Check early outputs carefully
3. **Iterate Prompts** - Refine based on results
4. **Batch Process** - Group similar pages
5. **Track Progress** - Use audit log regularly
6. **Maintain Consistency** - Use same prompt patterns

## Troubleshooting

### Content Too Generic
Add more specific context from current page.

### Tone Mismatch
Reference the Prison Law example explicitly.

### Missing SEO
Request full metadata in frontmatter.

### CTAs Not Layered
Specify CTA placement requirements.

### Trust Elements Missing
List required trust signals explicitly.

## Success Criteria

A successful migration will:
- ✅ Rank better (SEO optimized)
- ✅ Convert better (CTAs, trust)
- ✅ Read better (tone, structure)
- ✅ Serve users better (answers questions)
- ✅ Represent brand better (consistent, professional)

## Next Steps

1. Review SKILL.md and WORKFLOW.md
2. Start Claude Code
3. Initialize migration project
4. Test with one page
5. Process in batches
6. Quality check outputs
7. Integrate with Astro
8. Deploy to production

---

**Questions or issues?** Review the WORKFLOW.md or refine your prompts with additional context.

**Ready to start?** Use the Quick Start commands above.
