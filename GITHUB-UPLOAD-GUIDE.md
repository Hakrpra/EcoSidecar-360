# Upload EcoSidecar-360 to GitHub — website only, no Git commands

You don't need Git for this. About 5 minutes.

1. Go to https://github.com and sign in (create a free account first if you don't have one).
2. Click the **+** at the top-right → **New repository**.
3. Repository name: `EcoSidecar-360`
   Description: `Industrial energy monitoring and optimization platform for MSMEs`
   Choose **Private** for now (you can make it Public later in Settings — safer while it's a hackathon entry).
   Leave "Add a README / .gitignore / license" **unchecked** — this project already has all three.
   Click **Create repository**.
4. On the empty repo page, click **uploading an existing file** (in the "Quick setup" box).
5. Unzip `EcoSidecar-360.zip` on your computer first. Open the unzipped `EcoSidecar-360` folder, select **everything inside it** (all files and folders — including the hidden `.github` folder and `.gitignore`; press Ctrl+H / Cmd+Shift+. if hidden files aren't visible), and drag it all into the GitHub upload box.
   ⚠️ Do NOT upload `node_modules`, `dist`, or `.venv` if you see them — they're build junk, and `.gitignore` can't filter a web upload.
6. Commit message: `Initial commit — EcoSidecar-360 dashboard, firmware, backend, docs`
   Click **Commit changes**.
7. Done. Your repo is live at `https://github.com/<your-username>/EcoSidecar-360`.

## Optional: free live demo (Vercel)
1. https://vercel.com → sign in with GitHub → **Add New → Project** → pick `EcoSidecar-360`.
2. Set **Root Directory** to `frontend`. Vercel auto-detects Vite. Click **Deploy**.
3. You get a public URL showing the dashboard in DEMO MODE. The backend is not deployed by this step — the dashboard falls back to its built-in demo data, which is exactly what a demo should do.

## Run it on your own computer first (recommended)
Mac Terminal:
```
cd ~/Downloads/EcoSidecar-360/frontend
npm install
npm run dev
```
Open http://localhost:5173
