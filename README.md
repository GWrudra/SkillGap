# SkillGap: Career Intelligence Platform

SkillGap is an AI-powered career diagnostic dashboard that evaluates a user's current skills against industry standards for their target role, generating a personalized "Readiness Score", identifying skill gaps, and mapping out a prioritized learning pathway.

## Features

- **Premium UI/UX:** Built with a high-end editorial design aesthetic, featuring smooth CSS micro-animations, glass-morphism, and a high-contrast layout.
- **AI-Powered Diagnostics:** Uses Gemini AI to compare user skills against role requirements to calculate a readiness score and generate actionable advice.
- **Robust Fallback Engine:** Features a highly capable offline rule-based fallback engine to ensure the platform never breaks if the AI API is rate-limited.
- **Learning Pathways:** Curates personalized learning resources based on the user's preferred learning style (Video, Reading, or Project-based learning).
- **History Tracking:** Saves all past analysis results locally, allowing users to track their progress over time.
- **Career Pathways Explorer:** Provides insights into the 10 most in-demand tech roles with salary ranges, growth metrics, and direct links to apply on job boards.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS (for custom animations)
- **Icons:** Lucide React
- **Database/Auth:** Supabase (configured)
- **AI API:** Google Gemini 2.0 Flash
- **Language:** TypeScript

## Setup & Deployment

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

## Deployment Options

This project is perfectly optimized to be deployed on **Vercel**:
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`) in the Vercel project settings.
4. Click **Deploy**.

Alternatively, it can be deployed to Netlify or any cloud provider that supports Node.js.

## Recent Updates
- Added premium CSS animations (staggered fade-ins, hover lifts).
- Refined the learning resource engine to categorize and curate paths based on user learning style preferences (Reading, Project, Video).
- Persisted profile states and history locally for a seamless cross-session experience.
