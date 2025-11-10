# Git Cleanup Guide - Before Pushing to GitHub

## ⚠️ IMPORTANT: Remove Sensitive Files from Git History

If you've already committed sensitive files (like `.env` or `CREDENTIALS.md`), follow these steps to remove them from git history before pushing to GitHub.

## Step 1: Check What's Currently Tracked

```bash
git status
git ls-files | grep -E "\.env|CREDENTIALS"
```

## Step 2: Remove Sensitive Files from Git (if already committed)

### Option A: Remove from current commit only
```bash
# Remove from staging
git rm --cached backend/.env
git rm --cached backend/CREDENTIALS.md
git rm --cached frontend/.env.local

# Commit the removal
git commit -m "Remove sensitive files from tracking"
```

### Option B: Remove from entire git history (if already pushed)
⚠️ **WARNING**: This rewrites history. Only do this if you haven't shared the repo yet!

```bash
# Install git-filter-repo (recommended method)
# On Windows with Python:
pip install git-filter-repo

# Remove files from entire history
git filter-repo --path backend/.env --invert-paths
git filter-repo --path backend/CREDENTIALS.md --invert-paths
git filter-repo --path frontend/.env.local --invert-paths

# Or use BFG Repo-Cleaner (alternative)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --delete-files CREDENTIALS.md
```

## Step 3: Verify .gitignore is Working

```bash
# Check that .env files are ignored
git status

# You should NOT see:
# - backend/.env
# - frontend/.env.local
# - backend/CREDENTIALS.md
```

## Step 4: Create .env.example Files

The repository now includes:
- `backend/.env.example` - Template for backend environment variables
- `frontend/.env.example` - Template for frontend environment variables

Users should copy these and fill in their own values:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Step 5: Safe to Push

Once sensitive files are removed and .gitignore is in place:

```bash
git add .
git commit -m "Add .gitignore files and environment templates"
git branch -M main
git remote add origin https://github.com/yourusername/tech-grantha.git
git push -u origin main
```

## Files That Should NEVER Be Committed

### Backend
- ❌ `backend/.env` (contains API keys, database credentials)
- ❌ `backend/CREDENTIALS.md` (contains passwords)
- ❌ `backend/node_modules/`
- ❌ Any `*.pem`, `*.key`, `*.cert` files

### Frontend
- ❌ `frontend/.env.local` (contains API URLs)
- ❌ `frontend/.env` (if it contains sensitive data)
- ❌ `frontend/node_modules/`
- ❌ `frontend/dist/` (build output)

### Root
- ❌ `.env` files at any level
- ❌ `node_modules/` directories
- ❌ `.kiro/` (IDE specific)

## Files That SHOULD Be Committed

### Configuration Templates
- ✅ `backend/.env.example`
- ✅ `frontend/.env.example`
- ✅ `.gitignore` files
- ✅ `README.md`
- ✅ `package.json` files

### Source Code
- ✅ All `.js`, `.ts`, `.tsx` files
- ✅ All `.css`, `.html` files
- ✅ Database migrations (`.sql` files)
- ✅ Documentation (`.md` files)

## Quick Checklist Before Pushing

- [ ] `.gitignore` files are in place (root, backend, frontend)
- [ ] `.env` files are NOT in git (`git ls-files | grep .env` returns only `.env.example`)
- [ ] `CREDENTIALS.md` is NOT in git
- [ ] `node_modules/` directories are ignored
- [ ] `.env.example` files are present with placeholder values
- [ ] README.md is updated with setup instructions
- [ ] No API keys or passwords in any committed files

## If You Accidentally Pushed Secrets

1. **Immediately rotate all credentials**:
   - Generate new Supabase keys
   - Generate new Cloudinary API keys
   - Generate new Gemini API key
   - Change JWT secret
   - Update admin passwords

2. **Remove from git history** (see Option B above)

3. **Force push** (if repo is private and you're the only user):
   ```bash
   git push --force origin main
   ```

## Need Help?

If you're unsure about any step, it's better to:
1. Create a NEW repository
2. Copy only the source code (not .env files)
3. Push the clean code to the new repo

---

**Remember**: Once secrets are pushed to GitHub, consider them compromised and rotate them immediately!
