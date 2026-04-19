# DavsAI Web Application

Dette er en React-baseret webversion af DavsAI-appen, som kan køres på Render eller andre hosting-platforme.

## Mappestruktur

```
DavsAI/
├── web/                    # Frontend React-applikation
│   ├── src/
│   │   ├── pages/         # Sider (Home.tsx)
│   │   ├── components/    # Gjenbrugelige komponenter
│   │   ├── App.tsx        # Hovedapp-komponent
│   │   └── index.css      # Global styling
│   ├── public/            # Statiske filer
│   └── index.html         # HTML-indgang
├── web-server/            # Express-server til at serve webappen
│   └── index.ts
├── backend/               # Groq API backend (eksisterende)
│   ├── app.py
│   └── requirements.txt
├── package-web.json       # Dependencies for webappen
└── README.md
```

## Installation & Opsætning

### Forudsætninger
- Node.js 18+
- Python 3.8+ (til backend)
- Render-konto (til hosting)

### Lokal udvikling

1. **Installer dependencies:**
   ```bash
   npm install
   ```

2. **Start udviklings-serveren:**
   ```bash
   npm run dev
   ```

3. **Åbn i browser:**
   ```
   http://localhost:3000
   ```

### Backend-opsætning på Render

1. **Opret en ny Web Service på Render:**
   - Repository: `cptleftnut/DavsAI`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Environment Variables:
     - `GROQ_API_KEY`: Din Groq API-nøgle
     - `PORT`: 5000 (eller efter behov)

2. **Webappen kommunikerer med backend på:**
   ```
   https://davslm.onrender.com/api/chat
   ```

## Deployment til Render

### Option 1: Frontend + Backend på samme Render-service

1. Opret en ny Web Service
2. Build Command: 
   ```bash
   npm install && npm run build
   ```
3. Start Command:
   ```bash
   npm start
   ```
4. Environment Variables:
   - `GROQ_API_KEY`: Din Groq API-nøgle
   - `NODE_ENV`: production

### Option 2: Separate Frontend & Backend

**Frontend (Render Static Site):**
- Build Command: `npm run build`
- Publish Directory: `dist`

**Backend (Render Web Service):**
- Samme som ovenfor

## Teknologi Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Flask, Groq API
- **Server:** Express.js
- **Styling:** Playful & Whimsical design med vibrant farver

## Funktioner

- 7 forskellige monster-personligheder
- Sanntids chat med Groq LLM
- Dynamisk mood-system
- Responsive design
- Farverig og legende brugergrænseflade

## API Integration

Webappen kommunikerer med backend via POST-requests til `/api/chat`:

```typescript
const response = await fetch('https://davslm.onrender.com/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'Hej!',
    monster_type: 'gnist'
  })
});
```

Backend returnerer:
```json
{
  "svar": "Zapp! Hvad skal vi lave?",
  "humor": "glad"
}
```

## Fejlfinding

### Webappen kan ikke forbinde til backend
- Kontroller at backend-URL'en er korrekt i `Home.tsx`
- Sikr at GROQ_API_KEY er sat på Render
- Tjek CORS-indstillinger i `backend/app.py`

### Monsters vises ikke korrekt
- Kontroller at emoji-karakterer er understøttet i browseren
- Tjek browser-konsollen for fejl

## Udvikling

### Tilføj nye features
1. Rediger komponenter i `web/src/`
2. Kør `npm run dev` for at se ændringer live
3. Test i browser før deployment

### Build for produktion
```bash
npm run build
```

Output er i `dist/` mappen.

## Support

For problemer eller spørgsmål, kontakt udviklingsteamet eller åbn et issue på GitHub.
