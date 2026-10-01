# Frontend Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.local.example .env.local
```

2. Edit `.env.local` if your backend is running on a different URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The application will be available at: http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory (pages)
│   ├── components/       # Reusable React components
│   ├── lib/             # Utility functions and API client
│   └── types/           # TypeScript type definitions
├── public/              # Static files
└── package.json         # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Building for Production

```bash
npm run build
npm run start
```

## Common Issues

### Issue: Port 3000 already in use

**Solution:** Use a different port
```bash
PORT=3001 npm run dev
```

### Issue: Cannot connect to backend

**Solution:** 
1. Ensure backend is running on port 8000
2. Check `.env.local` has correct API URL
3. Verify CORS is configured correctly in backend

## Next Steps

- Create login and registration pages
- Build applicant dashboard
- Create application form components
- Implement file upload functionality
- Add admin dashboard
