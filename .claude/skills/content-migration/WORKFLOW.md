# Content Migration Workflow Guide

## Quick Start

### Option 1: Using Claude Code CLI (Recommended)

```bash
# In your project directory
claude-code

# Then use these prompts:
```

### Prompt 1: Initialize the Migration
```
"Using the content-migration skill, read the Google Sheet at
https://docs.google.com/spreadsheets/d/1am6WhOg1ZAZBnpq-Wfd8Ro347OaGbQ9kv8REtGYI5p0/edit?gid=66286043#gid=66286043
and create a migration plan. Set up the folder structure and audit log."
```

### Prompt 2: Process a Single Page (Test)
```
"Using the content-migration skill, create the Prison Law Expert Witness page.
Research the current page, analyze it, and generate the new markdown file
following all the standards in the skill."
```

### Prompt 3: Batch Process by Category
```
"Using the content-migration skill, process all Expert Witness pages
from the spreadsheet. Generate markdown files for each one."
```

### Prompt 4: Generate Report
```
"Using the content-migration skill, generate a migration progress report
showing what's been completed and what remains."
```

---

## Detailed Workflow

### Phase 1: Setup & Planning (30 minutes)

**Step 1: Review the Spreadsheet**
- Open: https://docs.google.com/spreadsheets/d/1am6WhOg1ZAZBnpq-Wfd8Ro347OaGbQ9kv8REtGYI5p0/edit?gid=66286043#gid=66286043
- Understand the columns and data
- Note any special cases or priorities

**Step 2: Initialize Migration**
```
"Using the content-migration skill, initialize the migration project"
```

This creates:
```
content-migration/
├── pages/                  # Generated pages go here
├── audit-log.md           # Track progress
├── migration-plan.md      # Overall strategy
└── notes.md               # Any special considerations
```

**Step 3: Test with One Page**
Pick a simple page to test:
```
"Using the content-migration skill, create the [simple page name] page"
```

Review the output to ensure quality before proceeding.

---

### Phase 2: Content Generation (Ongoing)

#### Approach A: Sequential Processing

Process pages one by one for careful review:

```
"Using the content-migration skill, create the [page name] page from row [ID]"
```

**After each page:**
1. Review the generated markdown
2. Check SEO metadata
3. Verify tone matches brief
4. Confirm all template sections present
5. Edit if needed
6. Mark as complete in audit log

#### Approach B: Batch Processing

Process multiple pages at once by category:

```
"Using the content-migration skill, process all pages in the Expert Witness category"
```

**After batch:**
1. Review all generated files
2. Check for consistency
3. Spot-check quality
4. Note any issues
5. Update audit log

#### Approach C: Priority-Based

Focus on high-traffic or important pages first:

```
"Using the content-migration skill, process the following priority pages:
- Homepage
- Main Expert Witness page
- Main Education page
- Contact page"
```

---

### Phase 3: Quality Control (After Each Batch)

**Checklist for Each Page:**

✅ **Structure**
- [ ] Follows template exactly
- [ ] All sections present
- [ ] Proper markdown formatting
- [ ] Metadata in frontmatter

✅ **Content**
- [ ] Matches tone & voice guidelines
- [ ] Addresses audience pain points
- [ ] Benefits before features
- [ ] Active voice throughout
- [ ] Short paragraphs
- [ ] Scannable format

✅ **SEO**
- [ ] Meta title ≤60 chars
- [ ] Meta description ≤160 chars
- [ ] Primary keyword in H1
- [ ] Keywords natural in content
- [ ] 3-5 internal links
- [ ] 1-3 external links
- [ ] FAQ section present

✅ **Conversion**
- [ ] 3+ CTAs throughout
- [ ] Trust elements present
- [ ] Clear value propositions
- [ ] Process explanation
- [ ] Contact info prominent

✅ **Brand**
- [ ] Psychology & Psychiatry both mentioned (where relevant)
- [ ] Key trust signals (HCPC, GMC, Legal Aid)
- [ ] 24h CVs mentioned
- [ ] Nationwide coverage
- [ ] Quality checks mentioned

---

### Phase 4: Integration (After All Pages Complete)

**Step 1: Review Migration Report**
```
"Using the content-migration skill, generate final migration report"
```

**Step 2: Create GitHub Branch**
```bash
git checkout -b content-migration
```

**Step 3: Move Files to Astro**
Decide on integration approach:
- Option A: Convert to Astro pages (`.astro` files)
- Option B: Use Astro Content Collections
- Option C: Keep as markdown for headless CMS

**Step 4: Test Locally**
```bash
npm run dev
# Visit each new page
# Check formatting, links, images
```

**Step 5: SEO Check**
- Run Lighthouse audit
- Check meta tags
- Verify internal links
- Test mobile responsiveness

**Step 6: Commit & Deploy**
```bash
git add content-migration/
git commit -m "feat: Complete content migration from Psychology Direct & Psychiatry Direct"
git push origin content-migration
```

---

## Tips for Success

### 1. Start Small
Process 1-2 pages first to validate the approach before doing the full migration.

### 2. Iterate on Quality
If the first few pages need editing, refine your prompts:
```
"Using the content-migration skill, create the [page name] page.
Pay special attention to [specific aspect that needed improvement]."
```

### 3. Maintain Consistency
Use the same prompt structure for similar pages:
```
"Using the content-migration skill, create the [service] Expert Witness page"
```

### 4. Review in Batches
Don't review every page individually - do spot checks:
- First page in batch: Detailed review
- Random samples: Quick check
- Last page in batch: Verify consistency

### 5. Track Progress
Update the audit log regularly:
```
"Using the content-migration skill, update the audit log with completed pages"
```

### 6. Handle Special Cases
For complex pages, provide additional context:
```
"Using the content-migration skill, create the [complex page] page.
Note: This page needs to [special requirement].
Additional context: [relevant information]."
```

---

## Troubleshooting

### Issue: Generated content too generic
**Solution:** Provide more context from the current page:
```
"The current page emphasizes [specific point].
Make sure the new version maintains this focus."
```

### Issue: Tone doesn't match brief
**Solution:** Reference the example:
```
"Match the tone of the Prison Law example page exactly."
```

### Issue: Missing SEO elements
**Solution:** Explicitly request them:
```
"Ensure full SEO metadata is included in the frontmatter."
```

### Issue: CTAs not layered properly
**Solution:** Specify CTA placement:
```
"Include CTAs in hero, after benefits section, and at page end."
```

### Issue: Trust elements missing
**Solution:** List required trust signals:
```
"Include HCPC registration, Legal Aid compliance, and client testimonial."
```

---

## Example Session

Here's a complete example of processing pages:

```bash
# Session start
claude-code

# Initialize
> "Using the content-migration skill, initialize the migration project"
✓ Created folder structure
✓ Generated audit log template
✓ Created migration plan

# Test page
> "Using the content-migration skill, create the Prison Law Expert Witness page"
✓ Fetched current page
✓ Analyzed content
✓ Generated new markdown file
✓ Saved to content-migration/pages/prison-law-expert-witness.md

# Review output
> [Review the file, looks good]

# Process category
> "Using the content-migration skill, process all Criminal Law subcategory pages"
✓ Processing 5 pages...
✓ Generated criminal-law-expert-witness.md
✓ Generated youth-offender-assessments.md
✓ Generated mental-health-defences.md
✓ Generated sentencing-reports.md
✓ Generated capacity-assessments.md

# Check progress
> "Using the content-migration skill, show migration progress"
✓ Completed: 6 pages
✓ Remaining: 47 pages
✓ By vertical: Expert Witness: 6, Education: 0, Psychiatry: 0

# Continue with next batch...
```

---

## Advanced Usage

### Custom Templates

If you need page-specific templates:

```
"Using the content-migration skill, create the [page] using this custom structure:
[Your custom structure]"
```

### Content Enrichment

To add additional research:

```
"Using the content-migration skill, create the [page] page.
Also research latest [topic] guidance and include relevant updates."
```

### Bulk Operations

Process entire spreadsheet:

```
"Using the content-migration skill, process all pages in the spreadsheet.
Generate a complete set of markdown files."
```

*Note: This may take time. Consider doing in batches.*

---

## Post-Migration Tasks

After all pages are generated:

### 1. Content Review
- Spot-check 20% of pages
- Verify consistency
- Check for errors

### 2. SEO Audit
- Run Screaming Frog or similar
- Check meta tags
- Verify internal linking

### 3. Conversion Optimization
- Ensure CTAs are clear
- Test forms
- Verify contact information

### 4. Technical Setup
- Set up redirects from old URLs
- Update sitemap
- Configure analytics

### 5. Launch Preparation
- Staging environment review
- Client approval
- Launch checklist

---

## Support & Resources

- **Skill Documentation:** `.claude/skills/content-migration/SKILL.md`
- **Content Brief:** (Embedded in skill)
- **Example Output:** Prison Law page
- **Spreadsheet:** [Google Sheet Link]

---

## Success Metrics

Track these metrics to measure success:

**Content Quality**
- % of pages following template
- % of pages with all SEO elements
- % of pages with layered CTAs

**SEO Performance**
- Average Lighthouse SEO score
- Number of pages ranking for target keywords
- Organic traffic increase

**Conversion Performance**
- Form submission rate
- Phone call clicks
- Average time on page

---

This workflow ensures a systematic, high-quality content migration that meets all brand, SEO, and conversion standards.
