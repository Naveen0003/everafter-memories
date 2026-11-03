# EverAfter Memories – React (Vite) Frontend

React 18 + Vite. Plain JavaScript. Same approved luxury design, one config file per client.

## Run it
```bash
npm install
cp .env.example .env     # leave empty for demo mode
npm run dev              # http://localhost:5173
npm run build            # output in dist/
```

## Folder map
- `src/config.js` – names, date, venue, events, story, photos. **The only file to edit per client.**
- `src/supabase.js` – all backend calls. Demo mode (no .env) stores wishes in the browser.
- `src/components/` – Hero, Invitation, Sections (Story, Events), Gallery, WishForm, Rsvp, Travel (QR + share), CouplePanel.
- `src/styles.css` – the design (colors, 3D effects).
- `schema.sql` – database tables, privacy rules and private storage for Supabase.

## Connect the backend
1. Create a Supabase project, run `schema.sql` in the SQL Editor.
2. Authentication > Users > add the couple. Run the `insert into public.events ...` line at the end of `schema.sql` with their UUID. The slug must equal `slug` in `src/config.js`.
3. Authentication > Providers > Email: turn off public sign-ups.
4. Put the Project URL and **anon** key in `.env`. Never use the service_role key.
5. `npm run dev`, send a text, photo and video wish, sign in at "For the couple only" and check they appear.

## Go live (Netlify)
1. Push the project to a GitHub repository (`.env` is ignored by git).
2. Netlify > Add new site > Import from Git. Build command `npm run build`, publish directory `dist`.
3. Site configuration > Environment variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Redeploy.
4. Open the live link on a phone, test again, then add the custom domain if the client has one.
5. Make the QR code from the final URL (the Share section shows it) and scan on 3 phones before printing.
Vercel and Cloudflare Pages use the same build command and `dist` folder.

## Security checklist
- Only the anon key is in the app. Guests can only send wishes; no rule lets them read any.
- Bucket `guest-media` must be Private.
- Test that Client A's couple never sees Client B's wishes.
- No spam rate limit yet: add a captcha (for example Cloudflare Turnstile) before sharing widely.
- Check current Supabase and hosting limits and prices before promising a hosting period.

## New client
Copy the project, edit `src/config.js` and photos in `public/photos`, create a new Supabase project (best separation), set new env values, deploy, test, get written approval.
