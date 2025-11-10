# Quick Push Checklist ✅

Run these commands before pushing to GitHub:

## 1. Verify .gitignore is Working

```bash
# Check what will be committed
git status

# Make sure these are NOT listed:
# ❌ backend/.env
# ❌ backend/CREDENTIALS.md
# ❌ frontend/.env.local
# ❌ node_modules/
```

## 2. Remove Sensitive Files (if already tracked)

```bash
# Remove from git tracking (keeps local file)
git rm --cached backend/.env
git rm --cached backend/CREDENTIALS.md
git rm --cached frontend/.env.local

# Commit the removal
git commit -m "Remove sensitive files from tracking"
```

## 3. Verify .env.example Files Exist

```bash
# These should exist:
ls backend/.env.example
ls frontend/.env.example
```

## 4. Add All Safe Files

```bash
# Add everything (gitignore will protect sensitive files)
git add .

# Verify what's staged
git status
```

## 5. Commit Changes

```bash
git commit -m "Initial commit: Tech Grantha blogging platform"
```

## 6. Create GitHub Repository

1. Go to https://github.com/new
2. Create repository named `tech-grantha`
3. **DO NOT** initialize with README (you already have one)

## 7. Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/tech-grantha.git

# Push
git branch -M main
git push -u origin main
```

## 8. Verify on GitHub

Check that these files are **NOT** visible on GitHub:
- ❌ `backend/.env`
- ❌ `backend/CREDENTIALS.md`
- ❌ `frontend/.env.local`
- ❌ Any `node_modules/` folders

Check that these files **ARE** visible:
- ✅ `README.md`
- ✅ `.gitignore` (root, backend, frontend)
- ✅ `backend/.env.example`
- ✅ `frontend/.env.example`
- ✅ All source code files

## 9. If Secrets Were Pushed

**IMMEDIATELY:**

1. **Rotate ALL credentials:**
   - Supabase: Generate new keys
   - Cloudinary: Regenerate API keys
   - Gemini: Create new API key
   - JWT: Change JWT_SECRET
   - Admin: Change admin password

2. **Remove from history:**
   ```bash
   # Install git-filter-repo
   pip install git-filter-repo
   
   # Remove sensitive files
   git filter-repo --path backend/.env --invert-paths
   git filter-repo --path backend/CREDENTIALS.md --invert-paths
   
   # Force push
   git push --force origin main
   ```

## Quick Commands Reference

```bash
# Check what's tracked by git
git ls-files

# Check what's ignored
git status --ignored

# See what will be committed
git diff --cached

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Remove file from git but keep locally
git rm --cached <file>

# View remote URL
git remote -v
```

## All Clear? Push! 🚀

```bash
git push origin main
```

---

**Remember**: Never commit `.env` files or credentials to GitHub!
