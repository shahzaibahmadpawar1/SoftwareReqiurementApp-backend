# Deploying Backend to Vercel

## Prerequisites

1. ✅ Vercel account (free): https://vercel.com
2. ✅ GitHub repository with your backend code
3. ✅ PostgreSQL database (Supabase, Neon, or other cloud provider)

## Step 1: Prepare Your Database

Since Vercel is serverless, you need a cloud PostgreSQL database:

### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling → Transaction mode)
5. Save it for Step 3

### Option B: Neon
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Save it for Step 3

## Step 2: Push Your Code to GitHub

```bash
cd backend
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: **backend** (if backend is in a subfolder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL = your_postgresql_connection_string
   NODE_ENV = production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your API will be live at: `https://your-project.vercel.app`

### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd backend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? software-requirements-backend
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
# Paste your database connection string

# Deploy to production
vercel --prod
```

## Step 4: Update Frontend API URL

After deployment, update your frontend to use the Vercel URL:

**File: `frontend/src/services/api.ts`**

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-project.vercel.app/api'
  : 'http://localhost:5000/api';
```

Or use environment variables:

**File: `frontend/.env`**
```env
VITE_API_URL=https://your-project.vercel.app/api
```

**File: `frontend/src/services/api.ts`**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app/health`
2. You should see: `{"status":"OK","message":"Server is running"}`
3. Test an API endpoint: `https://your-project.vercel.app/api/projects`

## Important Notes

### Database Connection Pooling

For serverless deployments, use **connection pooling**:

**Supabase:**
- Use the "Transaction" mode connection string
- Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true`

**Neon:**
- Connection pooling is automatic
- Use the provided connection string

### CORS Configuration

Make sure your backend allows requests from your frontend domain:

**File: `backend/src/server.ts`**
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ]
}));
```

### Environment Variables

Never commit `.env` files! Always set environment variables in Vercel dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add `DATABASE_URL` and any other secrets

## Troubleshooting

### Build Fails: "tsc: command not found"
✅ **Fixed!** TypeScript is now in dependencies.

### Database Connection Timeout
- Use connection pooling (port 6543 for Supabase)
- Check if your database allows connections from Vercel IPs
- Verify DATABASE_URL is correct

### CORS Errors
- Add your Vercel URL to CORS origins
- Check if frontend is using correct API URL

### 404 on API Routes
- Verify `vercel.json` routes configuration
- Check build output in Vercel logs
- Ensure `dist/server.js` exists after build

### Cold Starts
- Serverless functions may have cold starts (1-2 second delay)
- This is normal for free tier
- Consider using Vercel Pro for better performance

## Monitoring

View logs in Vercel dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Functions" tab for logs

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment

## Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

## Costs

- **Free Tier**: 100GB bandwidth, 100 hours serverless execution
- **Pro**: $20/month for more resources
- **Database**: Supabase/Neon have free tiers

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Deploy frontend to Vercel (separate project)
3. ✅ Update API URLs
4. ✅ Test the full application
5. ✅ Set up custom domain (optional)

---

**Your backend is now deployed!** 🚀

Access it at: `https://your-project.vercel.app`
