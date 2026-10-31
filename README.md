# Krishna Decor Furniture - DigiProfiles starter

Repository target: `opnoraweb-creator/krishna-furniture-pali`

## Included
- Public profile page (`index.html`)
- Category and product rendering from `data/shops/krishna-decor.json`
- Shopkeeper portal (`shopkeeper/index.html`)
- Cloudflare Worker source (`worker/worker.js`) for protected upload + GitHub JSON updates
- Cloudinary image hosting; images are not stored in GitHub

## Important before publishing
This is a starter implementation. The shopkeeper portal will NOT work until the Cloudflare Worker and Cloudinary account are configured.

### 1. Add profile photos
Put `shop-icon.png` and `owner-photo.jpg` in `assets/images/`. Replace the placeholder files with the real shop icon and owner photo.

### 2. GitHub Pages
Upload the project files to the root of `opnoraweb-creator/krishna-furniture-pali`.
Enable Pages from Settings -> Pages -> Deploy from branch -> `main` -> `/ (root)`.

### 3. Cloudinary
Create a Cloudinary account and note cloud name, API key and API secret. Never put API secret in browser code or GitHub.

### 4. Cloudflare Worker
Deploy `worker/worker.js` as a Cloudflare Worker. Set vars:
- `GITHUB_OWNER=opnoraweb-creator`
- `GITHUB_REPO=krishna-furniture-pali`
- `GITHUB_BRANCH=main`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`

Set secrets using Wrangler:
- `wrangler secret put SHOP_PIN`
- `wrangler secret put GITHUB_TOKEN` (fine-grained token limited to this repository, Contents: Read and write)
- `wrangler secret put CLOUDINARY_API_SECRET`

### 5. Connect portal to Worker
In `shopkeeper/js/app.js`, replace `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev` with your deployed Worker URL.

### 6. Protect the editor
Give the shop PIN only to the shopkeeper. Do not place the PIN or GitHub token in public HTML/JS. The Worker checks the PIN and keeps GitHub/Cloudinary secrets server-side.

## Current shop data
Edit `data/shops/krishna-decor.json` for initial shop details. Category and product data will be added through the shopkeeper portal after Worker setup.

## Important limitations
- Public GitHub repository means website code and JSON are public. Do not store private customer information.
- Cloudinary images are publicly viewable if their URLs are used on the public profile.
- GitHub Pages updates can take a short time to publish after a commit.
- Use a long unique shop PIN. For production, add rate limiting and a stronger login flow.
