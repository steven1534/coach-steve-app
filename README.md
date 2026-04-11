# Coach Steve — Elite Swing Analyzer

Upload a baseball swing video and get a blunt, scout-level breakdown powered by AI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
   Get a free key at https://aistudio.google.com/apikey

3. Start development:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser.

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express + SQLite
- **AI**: Google Gemini 2.0 Flash (multimodal video analysis)
