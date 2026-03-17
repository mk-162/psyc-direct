# Cocoon CMS — How Editing Works

## The Short Version

1. **Edit** in the CMS admin panel
2. **Save** — this commits your changes to GitHub automatically
3. **Wait ~60 seconds** — Vercel detects the change and rebuilds the site
4. **Live** — your changes are visible on the public site

---

## Step by Step

### 1. Open the CMS

Go to: **cocoon-hgt.vercel.app/admin**

You'll see a sidebar with content collections (Wellness Services, Articles, Membership, etc.). Click any collection to see its pages.

### 2. Edit a Page

Click a page to open the editor. You'll see:

- **Left panel** — the form fields (title, body text, images, etc.)
- **Right panel** — a live preview of the page as visitors will see it

Make your changes in the left panel. The preview updates in real time.

### 3. Save Your Changes

Click the **Save** button (top right of the editor).

**What happens behind the scenes:**
- TinaCMS sends your changes to GitHub (the code repository)
- This creates a new "commit" — think of it as a saved version
- Vercel (the hosting platform) notices the new commit
- Vercel rebuilds the entire site with your changes (~60 seconds)

### 4. View the Live Site

After saving, wait about a minute, then visit the live site URL to see your changes.

> **Why the wait?** The live site is a pre-built static website (which makes it very fast for visitors). Every time content changes, the site needs to rebuild. This takes about 60 seconds.

---

## Key Things to Know

### The Preview Panel IS Live (Sort Of)

The preview you see while editing in the CMS is accurate — it shows exactly how the page will look. But it's a **local preview**, not the public site. Visitors won't see your changes until you save and the site rebuilds.

### Every Save = A Publish

There's no "draft" mode at the moment. When you click Save, the changes go live after the rebuild. So make sure you're happy with your edits before saving.

### You Can't Break Anything

If something goes wrong, every save is versioned in GitHub. We can roll back to any previous version at any time.

### Editing Images

When you upload an image through the CMS, it's stored in the site's image library. Use the image picker in any image field to browse or upload.

---

## Quick Reference

| Action | Where |
|--------|-------|
| Edit content | cocoon-hgt.vercel.app/admin |
| View live site | cocoon-hgt.vercel.app |
| Time to go live after save | ~60 seconds |

---

## Troubleshooting

**"I saved but don't see my changes"**
→ Wait 60 seconds and hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)

**"The preview looks wrong"**
→ The preview is generally accurate but occasionally layout details differ slightly. Always check the live site after publishing.

**"I made a mistake"**
→ Don't panic. Edit the page again and save, or ask us to roll back to a previous version.
