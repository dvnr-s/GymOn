# Backend Setup Guide

This guide will help you set up the MongoDB backend for the GymOn application.

## Prerequisites

- Node.js 18+ installed
- A MongoDB Atlas account (free tier available)
- Git

## Step 1: MongoDB Atlas Setup

### 1.1 Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Try Free" to create an account
3. Complete the registration process

### 1.2 Create a Cluster

1. Click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region close to you
4. Name your cluster (e.g., "gymon-cluster")
5. Click "Create"

### 1.3 Create a Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `gymon-admin`)
5. Create a secure password (click "Autogenerate Secure Password")
6. **Important:** Copy and save this password!
7. Under "Database User Privileges", select "Read and write to any database"
8. Click "Add User"

### 1.4 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** For production, restrict this to your application's IP
4. Click "Confirm"

### 1.5 Get Your Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<password>` with your database user password
6. Add the database name before the `?`: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gymon?retryWrites=true&w=majority`

## Step 2: Environment Configuration

### 2.1 Create Environment File

Create a `.env.local` file in the root of your project:

```bash
# Copy the example file
cp .env.example .env.local
```

### 2.2 Configure Environment Variables

Edit `.env.local` with your values:

```env
# MongoDB Connection String (from Step 1.5)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/gymon?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Environment
NODE_ENV=development
```

### 2.3 Generate a Secure JWT Secret

For security, generate a proper JWT secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Application

```bash
# Development mode
npm run dev

# Or with peer server for video calls
npm run dev:full
```

The application will be available at `http://localhost:3000`

## Step 5: Test the API

### Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint

```bash
# Use the token from login response
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Connection Error: "MongoNetworkError"

- Verify your IP is whitelisted in MongoDB Atlas Network Access
- Check if the connection string is correct
- Ensure the password doesn't contain special characters that need URL encoding

### "Authentication failed"

- Verify the username and password in your connection string
- Make sure the database user has the correct permissions
- Check if the password needs URL encoding for special characters

### "MONGODB_URI not defined"

- Ensure `.env.local` file exists in the project root
- Restart the development server after creating/modifying `.env.local`
- Check that the variable name is exactly `MONGODB_URI`

### "JWT_SECRET not defined"

- Add the `JWT_SECRET` variable to your `.env.local` file
- Use a strong, random string (at least 32 characters)

## Vercel Deployment

When deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your secure JWT secret
4. Redeploy the application

### Important Notes for Production

- Use a strong, unique JWT secret
- Restrict MongoDB Network Access to your Vercel IP ranges
- Enable MongoDB Atlas monitoring for production
- Consider using MongoDB Atlas backups for data protection

## Database Collections

The following collections will be created automatically:

- `users` - User accounts and profiles
- `healthdatas` - Health metrics and tracking
- `dietplans` - Diet plans and meal tracking
- `workoutplans` - Workout routines and sessions
- `chatmessages` - Chat history between users

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.
