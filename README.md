# ITElect4 Lost & Found Frontend

React and Vite frontend for the GT4 Lost & Found application.

## Live deployment

- Frontend: https://itelect4-project-it-4-b-magbuhat.vercel.app/
- Backend health: https://itelect4-project-it-4-b-magbuhat.vercel.app/api/health

The frontend and API currently share one Vercel deployment and domain. API requests use the `/api` path.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`. Leave `VITE_API_URL` empty to use the Vite development proxy, or set it to the backend origin.
3. Start the backend from the sibling `../itelect4-backend` folder.
4. Run `npm run dev` and open the Vite URL it prints.

Run `npm run build` to type-check and create the production frontend build.

The app uses email/password login and reads users, items, and claims from the backend API. Do not commit `.env`.