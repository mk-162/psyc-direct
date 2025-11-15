# Psychology Direct - Deployment Guide

## Quick Start

This project is set up with Claude Code skills and automated GitHub Actions deployment.

## Using Claude Code with Skills

### What are Skills?

Skills are predefined workflows and standards that Claude Code uses to maintain consistency across your project. This project includes an **Astro Webpage Builder** skill located at:

```
.claude/skills/astro-webpage-builder/SKILL.md
```

### How to Use the Skill

When working with Claude Code, simply reference the skill in your prompts:

```bash
"Using the astro-webpage-builder skill, create a new services page for Educational Psychology"
```

Claude Code will:
1. Read the skill standards
2. Follow the project structure
3. Use existing components
4. Apply brand guidelines
5. Handle Git operations
6. Commit and push to GitHub

### Common Prompts

**Create a new page:**
```
"Create a new page for [service name] following the service page template in the skill"
```

**Update existing page:**
```
"Update the expert-witness page to add [new section] following the skill guidelines"
```

**Create a new component:**
```
"Create a new [ComponentName] component following the skill standards"
```

**Deploy changes:**
```
"Commit these changes and push to GitHub for deployment"
```

## Deployment Options

This project supports three deployment platforms:

### Option 1: GitHub Pages (Currently Active)

**Status:** ✅ Configured and ready

**Workflow:** `.github/workflows/deploy.yml`

**Setup Steps:**
1. Go to your GitHub repository
2. Settings > Pages
3. Source: GitHub Actions
4. The site will deploy automatically on push to `main` or `master`

**URL:** https://mk-162.github.io/psyc-direct

**How it works:**
- Push to `main` or `master` branch
- GitHub Actions builds the site
- Automatically deploys to GitHub Pages
- Usually live in 2-3 minutes

### Option 2: Netlify

**Workflow:** `.github/workflows/deploy-netlify.yml.example`

**Setup Steps:**
1. Create account at [netlify.com](https://netlify.com)
2. Create new site
3. Get your Netlify Auth Token: https://app.netlify.com/user/applications
4. Get your Site ID: Site Settings > General
5. Add GitHub secrets:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
6. Rename `deploy-netlify.yml.example` to `deploy-netlify.yml`
7. Disable or remove `deploy.yml`

**Pros:**
- Automatic SSL
- Custom domains
- Form handling
- Edge functions
- Deploy previews for PRs

### Option 3: Vercel (Recommended for Production)

**Setup Steps:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Astro
4. Click "Deploy"

**That's it!** Vercel handles everything automatically.

**Pros:**
- Native GitHub integration
- Automatic deployments
- Deploy previews for PRs
- Edge network
- Analytics
- Zero config needed

**Note:** The `.github/workflows/deploy-vercel.yml.example` is for advanced use cases. Vercel's native integration is recommended.

## Build Check Workflow

**Workflow:** `.github/workflows/build-check.yml`

**What it does:**
- Runs on Pull Requests
- Runs on feature branches
- Checks TypeScript types
- Tests build process
- Prevents broken code from merging

**How to use:**
1. Create feature branch: `git checkout -b feature/new-page`
2. Make changes
3. Push: `git push origin feature/new-page`
4. Create Pull Request
5. Build check runs automatically
6. Merge when checks pass ✅

## Project Structure

```
psyc-direct-astro/
├── .claude/
│   ├── skills/
│   │   └── astro-webpage-builder/
│   │       └── SKILL.md          # Claude Code skill definitions
│   └── config.json               # Claude Code configuration
├── .github/
│   └── workflows/
│       ├── deploy.yml            # GitHub Pages deployment (active)
│       ├── build-check.yml       # PR/branch build checks
│       ├── deploy-netlify.yml.example
│       └── deploy-vercel.yml.example
├── public/
│   └── images/
│       └── PSYCHOLOGY.svg        # Brand logo
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable components
│   │   └── forms/                # Form components
│   ├── layouts/
│   │   └── Layout.astro          # Base layout
│   ├── pages/                    # Auto-routed pages
│   │   ├── index.astro           # Homepage
│   │   └── expert-witness.astro  # Service page
│   └── styles/
│       └── global.css            # Global styles
└── astro.config.mjs              # Astro configuration
```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:4321
```

### Making Changes

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Make changes** to files in `src/`

3. **Preview** changes at http://localhost:4321

4. **Commit** when satisfied:
   ```bash
   git add .
   git commit -m "feat: Add new service page"
   git push origin main
   ```

5. **Wait** 2-3 minutes for automatic deployment

6. **Visit** your live site!

### Using Claude Code

```bash
# Start Claude Code in project directory
claude-code

# Then give it tasks like:
"Create a new About page with team section and company history"
"Update the contact form to include a file upload field"
"Add a testimonials carousel to the homepage"
```

Claude Code will:
- Reference the skill file
- Create/modify files
- Follow brand guidelines
- Handle Git commits
- Push to GitHub
- Trigger auto-deployment

## Environment Configuration

### GitHub Pages
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://mk-162.github.io',
  base: '/psyc-direct',
  // ...
});
```

### Netlify or Vercel (Custom Domain)
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://psychologydirect.co.uk',
  // Remove base property for root domain
  // ...
});
```

## Troubleshooting

### Deployment fails on GitHub Actions

1. Check workflow status: Repository > Actions
2. Click failed workflow for details
3. Common issues:
   - Build errors (check logs)
   - Missing dependencies (run `npm install`)
   - Type errors (run `npx astro check`)

### Site not updating after push

1. Check Actions tab for build status
2. Clear browser cache (Ctrl+Shift+R)
3. Wait a few minutes (can take 2-5 minutes)

### Local development not working

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Images not showing on deployed site

Check that image paths start with `/`:
```astro
<!-- Correct -->
<img src="/images/logo.svg" />

<!-- Wrong -->
<img src="./images/logo.svg" />
```

## Performance Optimization

### Build Size
Check build output:
```bash
npm run build
```

### Lighthouse Score
Target scores (all 90+):
- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

### Image Optimization
Use Astro's Image component:
```astro
---
import { Image } from 'astro:assets';
import myImage from '../images/photo.jpg';
---

<Image src={myImage} alt="Description" />
```

## Maintenance

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update Astro
npm install astro@latest
```

### Update Skill
Edit `.claude/skills/astro-webpage-builder/SKILL.md` to add new patterns or update standards.

## Security

### Secrets Management
- Never commit API keys or secrets
- Use GitHub Secrets for deployment tokens
- Sensitive data goes in environment variables

### Dependencies
- Review `npm audit` output regularly
- Update dependencies for security patches
- Use `npm audit fix` cautiously

## Support

### Resources
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Claude Code Docs](https://code.claude.com)

### Getting Help
1. Check this documentation
2. Review the skill file: `.claude/skills/astro-webpage-builder/SKILL.md`
3. Ask Claude Code for help
4. Check GitHub repository issues

## Next Steps

### Immediate
- [ ] Enable GitHub Pages in repository settings
- [ ] Test deployment by pushing a small change
- [ ] Verify site is live

### Recommended
- [ ] Set up custom domain (if applicable)
- [ ] Configure analytics (Plausible/Fathom)
- [ ] Add remaining pages (Education, About, Contact)
- [ ] Set up email form handling (Formspree/Netlify Forms)
- [ ] Run Lighthouse audit
- [ ] Add sitemap.xml
- [ ] Configure robots.txt

### Optional
- [ ] Migrate to Vercel or Netlify for better features
- [ ] Set up preview deployments for PRs
- [ ] Add Content Collections for blog/resources
- [ ] Implement search functionality (Pagefind)
- [ ] Add dark mode toggle
- [ ] Set up monitoring/uptime alerts

## License

This project is proprietary to Psychology Direct.

## Authors

Built with Claude Code and Astro.
