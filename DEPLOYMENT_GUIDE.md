# Life Debugger - Deployment Guide

This guide covers deploying the full-stack Life Debugger application to:
- **MongoDB Atlas** (Database)
- **Render** (Backend API)
- **Vercel** (Frontend)

---

## Prerequisites
- Node.js installed (v18+)
- Git installed
- Accounts on: MongoDB Atlas, Render, Vercel

---

## Step 1: MongoDB Atlas Setup

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up

2. **Create Free Cluster**:
   - Click "Create" → "Free Tier" (M0)
   - Choose AWS as provider
   - Select nearest region
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access" → "Add New User"
   - Username: `lifedebugger`
   - Password: Create a strong password (save this!)
   - Role: "Read and Write to any database"

4. **Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Render deployment

5. **Get Connection String**:
   - Go to "Database" → "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your password
   - Format: `mongodb+srv://lifedebugger:YOUR_PASSWORD@cluster.mongodb.net/lifedebugger?retryWrites=true&w=majority`

---

## Step 2: Backend Deployment (Render)

### Option A: Deploy from GitHub (Recommended)

1. **Push Code to GitHub**:
   ```bash
   cd d:/Life-Debugger
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on GitHub and push
   ```

2. **Create Render Account**: Go to [Render](https://render.com) and sign up with GitHub

3. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `life-debugger-backend`
     - Root Directory: `backend`
     - Build Command: (leave empty)
     - Start Command: `node app.js`

4. **Environment Variables**:
   Add these in Render dashboard:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://lifedebugger:YOUR_PASSWORD@cluster.mongodb.net/lifedebugger?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   GEMINI_API_KEY=your-gemini-api-key
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

6. **Get Backend URL**: After deployment, you'll get a URL like:
   `https://life-debugger-backend.onrender.com`

### Option B: Deploy from CLI

```bash
# Install Render CLI
npm install -g render-cli

# Deploy
cd backend
render deploy --token YOUR_RENDER_TOKEN
```

---

## Step 3: Frontend Deployment (Vercel)

### Option A: Deploy from GitHub (Recommended)

1. **Push Updated Code**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

2. **Create Vercel Account**: Go to [Vercel](https://vercel.com) and sign up with GitHub

3. **Deploy**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Settings:
     - Framework Preset: `Vite` (or `Other`)
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

4. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://life-debugger-backend.onrender.com
   ```

5. **Deploy**: Click "Deploy"

### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

---

## Step 4: Update Environment Variables

After getting your deployment URLs:

1. **Update Backend on Render**:
   - Go to Render dashboard → Your backend service
   - Update `CLIENT_ORIGIN` to your Vercel URL (e.g., `https://your-project.vercel.app`)

2. **Update Frontend on Vercel** (if needed):
   - Go to Vercel dashboard → Your frontend project
   - Settings → Environment Variables
   - Update `VITE_API_URL` to your Render backend URL

---

## Step 5: Verify Deployment

1. Test health endpoint: `https://your-backend.onrender.com/api/health`
2. Visit your frontend: `https://your-frontend.vercel.app`
3. Try registering a new user
4. Test the chat functionality

---

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_ORIGIN` in backend matches your Vercel URL exactly
- Include `https://` prefix

### MongoDB Connection Issues
- Verify username/password in connection string
- Ensure network access allows all IPs (0.0.0.0/0)
- Check cluster status is not "Paused" (free tier pauses after inactivity)

### API Not Working
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `JWT_SECRET` is set (required for auth)

---

## Quick Commands

```bash
# Development
cd backend && npm run dev
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│   Vercel        │────▶│   Render        │
│   (React App)   │     │   (Frontend)    │     │   (Backend API) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │   MongoDB Atlas │
                                                 │   (Database)    │
                                                 └─────────────────┘
```

