/* ==========================================
   KRISHNA DECOR FURNITURE
   AUTOMATIC GITHUB PRODUCT GALLERY
   NEW FOLDER = NEW CATEGORY
========================================== */

const SHOP_DATA_URL = "data/shops/krishna-decor.json";

const GITHUB_API =
  "https://api.github.com/repos/opnoraweb-creator/krishna-furniture-pali/contents/assets/images/products";

const DEFAULT_MAP_URL =
  "https://maps.app.goo.gl/byF8p2iFVTduc25B6";

const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/krishna_decor_furniture_pali?psln=cWV1c2xmZmY1b2Nk";

let shopData = {};

const $ = id => document.getElementById(id);

/* ==========================================
   BASIC HELPERS
========================================== */

function setText(id, value) {
  const element = $(id);

  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function setLink(id, url) {
  const element = $(id);
  if (element && url) element.href = url;
}

function setImage(id, url) {
  const element = $(id);
  if (element && url) element.src = url;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

/* ==========================================
   SHOP INFORMATION
========================================== */

function initializeShop(data) {
  shopData = data;

  setText("shopName", data.shopName);
  setText("tagline", data.tagline);
  setText("heroName", data.shopName);
  setText("about", data.about);
  setText("address", data.address);
  setText("phoneText", data.phone);
  setText("footerName", data.shopName);
  setText("footerNameCopyright", data.shopName);
  setText("year", new Date().getFullYear());

  setImage("ownerPhoto", data.ownerPhoto);

  const phoneUrl = `tel:${data.phone || ""}`;
  const whatsappUrl = `https://wa.me/${data.whatsapp || ""}`;

  ["callTop", "callButton", "contactCall"].forEach(id => {
    setLink(id, phoneUrl);
  });

  ["waTop", "waButton", "contactWhatsApp"].forEach(id => {
    setLink(id, whatsappUrl);
  });

  setLink("instagramTop", data.instagram || DEFAULT_INSTAGRAM_URL);
  setLink("mapLink", data.mapUrl || DEFAULT_MAP_URL);
}

/* ==========================================
   PHOTO VIEWER
========================================== */

function openPhoto(images, startIndex = 0) {
  if (!images.length) return;

  let currentIndex = startIndex;

  const overlay = createElement("div", "photo-overlay");
  const image = createElement("img", "photo-viewer-image");

  const closeButton = createElement("button", "photo-close", "×");
  const previousButton = createElement("button", "photo-previous", "‹");
  const nextButton = createElement("button", "photo-next", "›");

  closeButton.type = "button";
  previousButton.type = "button";
  nextButton.type = "button";

  function updateImage() {
    image.src = images[currentIndex];
  }

  previousButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  closeButton.addEventListener("click", () => overlay.remove());

  overlay.addEventListener("click", event => {
    if (event.target === overlay) overlay.remove();
  });

  function keyboardHandler(event) {
    if (!document.body.contains(overlay)) {
      document.removeEventListener("keydown", keyboardHandler);
      return;
    }

    if (event.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", keyboardHandler);
    }

    if (event.key === "ArrowRight") nextButton.click();
    if (event.key === "ArrowLeft") previousButton.click();
  }

  document.addEventListener("keydown", keyboardHandler);

  overlay.append(closeButton, previousButton, image, nextButton);
  document.body.appendChild(overlay);

  updateImage();
}

/* ==========================================
   IMAGE FILE HELPERS
========================================== */

function isImageFile(file) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
}

function getPhotoNumber(fileName, index) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const match = nameWithoutExtension.match(/\d+/);

  return match ? Number(match[0]) : index + 1;
}

function formatCategoryName(folderName) {
  return folderName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

/* ==========================================
   PRODUCT PHOTO CARD
========================================== */

function createPhotoCard(imagePath, number, categoryName) {
  const card = createElement("article", "product-card");

  const image = createElement("img", "product-image");

  image.src = imagePath;
  image.alt = `${categoryName} ${number}`;
  image.loading = "lazy";

  image.addEventListener("click", () => {
    openPhoto([imagePath]);
  });

  const title = createElement(
    "h3",
    "product-title",
    String(number)
  );

  card.append(image, title);

  return card;
}

/* ==========================================
   GITHUB API
   GET ALL CATEGORY FOLDERS
========================================== */

async function getGitHubFolders() {
  const response = await fetch(GITHUB_API, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `GitHub folder loading failed: ${response.status}`
    );
  }

  const items = await response.json();

  return items
    .filter(item => item.type === "dir")
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ==========================================
   GITHUB API
   GET IMAGES FROM CATEGORY FOLDER
========================================== */

async function getFolderImages(folderName) {
  const folderUrl =
    `${GITHUB_API}/${encodeURIComponent(folderName)}`;

  const response = await fetch(folderUrl, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    console.warn("Folder could not load:", folderName);
    return [];
  }

  const files = await response.json();

  return files
    .filter(file =>
      file.type === "file" &&
      isImageFile(file) &&
      file.download_url
    )
    .sort((a, b) => {
      const numberA = getPhotoNumber(a.name, 0);
      const numberB = getPhotoNumber(b.name, 0);

      return numberA - numberB ||
        a.name.localeCompare(b.name);
    });
}

/* ==========================================
   AUTOMATIC PRODUCT CATALOG
========================================== */

async function renderProductCatalog() {
  const productsBox = $("products");

  if (!productsBox) return;

  productsBox.innerHTML = "";

  productsBox.appendChild(
    createElement("p", "empty-message", "Loading products...")
  );

  try {
    const folders = await getGitHubFolders();

    productsBox.innerHTML = "";

    let totalPhotos = 0;

    for (const folder of folders) {
      const images = await getFolderImages(folder.name);

      if (!images.length) continue;

      const categoryName = formatCategoryName(folder.name);

      const categorySection = createElement(
        "section",
        "catalog-category"
      );

      const heading = createElement(
        "h2",
        "catalog-category-heading",
        categoryName
      );

      const grid = createElement("div", "product-grid");

      images.forEach((file, index) => {
        const number = getPhotoNumber(file.name, index);

        grid.appendChild(
          createPhotoCard(
            file.download_url,
            number,
            categoryName
          )
        );

        totalPhotos++;
      });

      categorySection.append(heading, grid);
      productsBox.appendChild(categorySection);
    }

    if (totalPhotos === 0) {
      productsBox.appendChild(
        createElement(
          "p",
          "empty-message",
          "Products coming soon."
        )
      );
    }

  } catch (error) {
    console.error("Product catalog error:", error);

    productsBox.innerHTML = "";

    productsBox.appendChild(
      createElement(
        "p",
        "empty-message",
        "Products load nahi ho paye. GitHub repository aur internet connection check karein."
      )
    );
  }
}

/* ==========================================
   WEBSITE DISPLAY MODE
========================================== */

function showFinalCatalog() {
  const categoriesSection = $("categoriesSection");
  const subcategoriesSection = $("subcategoriesSection");
  const productsSection = $("productsSection");

  if (categoriesSection) categoriesSection.hidden = true;
  if (subcategoriesSection) subcategoriesSection.hidden = true;
  if (productsSection) productsSection.hidden = false;

  setText("productsHeading", "Our Products");

  renderProductCatalog();
}

/* ==========================================
   LOAD SHOP DATA
========================================== */

async function loadWebsite() {
  try {
    const shopResponse = await fetch(SHOP_DATA_URL);

    if (!shopResponse.ok) {
      throw new Error("Shop JSON file could not be loaded.");
    }

    const shop = await shopResponse.json();

    initializeShop(shop);
    showFinalCatalog();

  } catch (error) {
    console.error("Website loading error:", error);

    const productsBox = $("products");

    if (productsBox) {
      productsBox.textContent =
        "Website data load nahi ho paya. Shop JSON file check karein.";
    }

    const productsSection = $("productsSection");

    if (productsSection) {
      productsSection.hidden = false;
    }
  }
}

/* ==========================================
   START WEBSITE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  loadWebsite();
});
