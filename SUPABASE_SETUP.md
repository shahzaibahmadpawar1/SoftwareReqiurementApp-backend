# Supabase Setup Guide

## ✅ Supabase Configuration Complete!

Your Supabase credentials have been added to the `.env` file.

### 📋 Current Configuration

```env
SUPABASE_URL=https://duygfjbfypkjrfeojigy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔑 IMPORTANT: Get Your Database Password

The `.env` file has a placeholder `[YOUR-PASSWORD]` that needs to be replaced with your actual Supabase database password.

### How to Get Your Password:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/duygfjbfypkjrfeojigy

2. **Navigate to Database Settings**
   - Click "Settings" (gear icon) in the left sidebar
   - Click "Database"

3. **Find Connection String**
   - Scroll to "Connection string"
   - Select "Connection pooling" tab
   - Mode: **Transaction**
   - Copy the connection string

4. **Update .env File**
   - Open `backend/.env`
   - Replace `[YOUR-PASSWORD]` with your actual password
   - The connection string should look like:
   ```
   DATABASE_URL=postgresql://postgres.duygfjbfypkjrfeojigy:your_actual_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## 📊 Run the Database Schema

Now that Supabase is configured, you need to create the database tables.

### Option 1: Using Supabase SQL Editor (Recommended)

1. **Go to SQL Editor**
   - In Supabase dashboard, click "SQL Editor" in the left sidebar

2. **Open the Schema File**
   - Open `Database/schema.sql` from your project
   - Copy all the contents

3. **Run the Schema**
   - Paste the SQL into Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter
   - Wait for completion (should show "Success")

4. **Verify Tables**
   - Click "Table Editor" in the sidebar
   - You should see 7 tables:
     - projects
     - requirement_users
     - pages
     - functionalities
     - workflows
     - user_page_access
     - user_functionality_access

### Option 2: Using psql Command Line

```bash
# Navigate to Database folder
cd "E:\Projects\Software requirement app\Database"

# Run the schema (replace with your actual password)
psql "postgresql://postgres.duygfjbfypkjrfeojigy:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f schema.sql
```

## 🧪 Test the Connection

After updating the password and running the schema:

1. **Restart the Backend Server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then start again
   cd backend
   npm run dev
   ```

2. **Check Console Output**
   - You should see: `✅ Server is running on http://localhost:5000`
   - No database connection errors

3. **Test API Endpoint**
   - Open browser: http://localhost:5000/api/projects
   - Should return an array (empty `[]` or with sample data)

4. **Test Frontend**
   - Open: http://localhost:5173
   - Try creating a new project
   - If it works, your database is connected! 🎉

## 🚀 For Vercel Deployment

When deploying to Vercel, add these environment variables:

1. **Go to Vercel Dashboard**
   - Your project → Settings → Environment Variables

2. **Add Variables:**
   ```
   DATABASE_URL = postgresql://postgres.duygfjbfypkjrfeojigy:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   
   SUPABASE_URL = https://duygfjbfypkjrfeojigy.supabase.co
   
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWdmamJmeXBranJmZW9qaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NDY0MDMsImV4cCI6MjA4MzUyMjQwM30.ZmKDMM7h-vTfSLIBmp5msC1VASWw7E6v_Br812mS2m8
   ```

3. **Redeploy**
   - Vercel will automatically redeploy with the new environment variables

## 📝 Connection String Breakdown

```
postgresql://postgres.duygfjbfypkjrfeojigy:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
           │                          │            │                                      │     │
           └─ Username                └─ Password  └─ Host (connection pooler)           │     └─ Database
                                                                                          └─ Port (6543 for pooling)
```

**Why port 6543?**
- Port 6543 is Supabase's connection pooler (PgBouncer)
- Required for serverless deployments (Vercel)
- Prevents "too many connections" errors

**Why Transaction mode?**
- Best for serverless functions
- Faster connection times
- Recommended by Vercel

## 🔒 Security Notes

- ✅ `.env` file is in `.gitignore` (never commit it!)
- ✅ Use environment variables in Vercel
- ✅ Anon key is safe for client-side use
- ⚠️ Never expose your database password in code
- ⚠️ Never commit `.env` to GitHub

## 🐛 Troubleshooting

### "Connection refused" or "timeout"
- Check if password is correct
- Verify connection string format
- Ensure Supabase project is active

### "Too many connections"
- Make sure you're using port 6543 (pooler)
- Check connection string has `pooler.supabase.com`

### "Database does not exist"
- Run the schema.sql file first
- Check if tables were created in Supabase Table Editor

### "Authentication failed"
- Password is incorrect
- Get the correct password from Supabase dashboard

## ✅ Checklist

- [ ] Get database password from Supabase dashboard
- [ ] Update `backend/.env` with actual password
- [ ] Run `Database/schema.sql` in Supabase SQL Editor
- [ ] Verify 7 tables are created
- [ ] Restart backend server
- [ ] Test http://localhost:5000/api/projects
- [ ] Test frontend at http://localhost:5173
- [ ] Add environment variables to Vercel
- [ ] Deploy to Vercel

## 📚 Next Steps

1. **Get your password** from Supabase dashboard
2. **Update `.env`** file with the password
3. **Run the schema** in Supabase SQL Editor
4. **Restart the server** and test
5. **Deploy to Vercel** with environment variables

---

**Your Supabase is almost ready!** Just get the password, update `.env`, and run the schema. 🚀
