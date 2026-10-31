# Krishna Decor Furniture – Pali

Business profile website for Krishna Decor Furniture, Pali, Rajasthan.

## Business Details

- Name: Krishna Decor Furniture
- Location: Pali, Rajasthan
- Phone: 9829781979
- WhatsApp: 919829781979

## Project Structure

```text
krishna-furniture-pali/
│
├── index.html
├── README.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── main.js
│   │
│   └── images/
│       ├── shop-icon.png
│       ├── owner-photo.jpg
│       │
│       └── categories/
│
└── data/
    └── shops/
        └── krishna-decor.json
```

## Image Upload Instructions

Upload images to the exact folders and use the exact filenames mentioned in the JSON file.

Example:

- `assets/images/shop-icon.png`
- `assets/images/owner-photo.jpg`
- `assets/images/categories/sofa.jpg`
- `assets/images/categories/chair.jpg`
- `assets/images/categories/table.jpg`

Important:
- Use lowercase English filenames.
- Avoid spaces in filenames.
- Keep file extensions correct (`.jpg`, `.png`, `.webp`).
- The filename in JSON must match the uploaded filename exactly.
- GitHub Pages filenames are case-sensitive.

## Adding Products

Products will be added to:

`data/shops/krishna-decor.json`

Each product will contain:

- Product name
- Main category ID
- Subcategory ID
- Description
- Main image
- Additional gallery images

## Website Hosting

This website is designed for GitHub Pages.

No Firebase, Cloudflare Worker, database, or separate server is required.

Upload the files to the GitHub repository and enable GitHub Pages from repository settings.
