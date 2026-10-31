/* ==========================================
   KRISHNA DECOR FURNITURE
   FINAL WEBSITE JAVASCRIPT
   UNLIMITED PRODUCT PHOTOS
========================================== */

const SHOP_DATA_URL = "data/shops/krishna-decor.json";
const PRODUCTS_DATA_URL = "data/products/krishna-decor-products.json";

const DEFAULT_MAP_URL = "https://maps.app.goo.gl/byF8p2iFVTduc25B6";

const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/krishna_decor_furniture_pali?psln=cWV1c2xmZmY1b2Nk";

let shopData = {};
let allProducts = [];

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
   GET ALL PHOTOS OF A PRODUCT
========================================== */

function getProductImages(product) {
  const photos = [
    product.image,
    ...(Array.isArray(product.gallery) ? product.gallery : [])
  ];

  return photos.filter((photo, index) => {
    return photo && photos.indexOf(photo) === index;
  });
}

/* ==========================================
   PRODUCT PHOTO CARD
   LABEL ONLY: 1, 2, 3...
========================================== */

function createPhotoCard(imagePath, number, productName) {
  const card = createElement("article", "product-card");

  const image = createElement("img", "product-image");

  image.src = imagePath;
  image.alt = productName || "Furniture";
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
   CATEGORY-WISE UNLIMITED PHOTO GRID
========================================== */

function renderProductCatalog() {
  const productsBox = $("products");

  if (!productsBox) return;

  productsBox.innerHTML = "";

  const activeProducts = allProducts.filter(
    product => product.active !== false
  );

  if (!activeProducts.length) {
    productsBox.appendChild(
      createElement("p", "empty-message", "Products coming soon.")
    );
    return;
  }

  const categories = shopData.categories || [];

  categories.forEach(category => {
    if (category.active === false) return;

    const categoryProducts = activeProducts.filter(
      product => product.categoryId === category.id
    );

    if (!categoryProducts.length) return;

    const categorySection = createElement(
      "section",
      "catalog-category"
    );

    const categoryHeading = createElement(
      "h2",
      "catalog-category-heading",
      category.name
    );

    categorySection.appendChild(categoryHeading);

    const subcategories = category.subcategories || [];

    subcategories.forEach(subcategory => {
      if (subcategory.active === false) return;

      const products = categoryProducts.filter(
        product => product.subcategoryId === subcategory.id
      );

      if (!products.length) return;

      const group = createElement(
        "div",
        "catalog-product-group"
      );

      const heading = createElement(
        "h3",
        "catalog-subcategory-heading",
        subcategory.name
      );

      const grid = createElement("div", "product-grid");

      /* Har photo ko alag card mein dikhana */

      let photoNumber = 1;

      products.forEach(product => {
        const images = getProductImages(product);

        images.forEach(imagePath => {
          grid.appendChild(
            createPhotoCard(
              imagePath,
              photoNumber,
              product.name
            )
          );

          photoNumber++;
        });
      });

      group.append(heading, grid);
      categorySection.appendChild(group);
    });

    productsBox.appendChild(categorySection);
  });

  /* Unknown category products */

  const knownCategoryIds = categories.map(
    category => category.id
  );

  const unknownProducts = activeProducts.filter(
    product => !knownCategoryIds.includes(product.categoryId)
  );

  if (unknownProducts.length) {
    const extraSection = createElement(
      "section",
      "catalog-category"
    );

    const heading = createElement(
      "h2",
      "catalog-category-heading",
      "Other Products"
    );

    const grid = createElement("div", "product-grid");

    let photoNumber = 1;

    unknownProducts.forEach(product => {
      getProductImages(product).forEach(imagePath => {
        grid.appendChild(
          createPhotoCard(imagePath, photoNumber, product.name)
        );

        photoNumber++;
      });
    });

    extraSection.append(heading, grid);
    productsBox.appendChild(extraSection);
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
   LOAD JSON FILES
========================================== */

async function loadWebsite() {
  try {
    const [shopResponse, productsResponse] = await Promise.all([
      fetch(SHOP_DATA_URL),
      fetch(PRODUCTS_DATA_URL)
    ]);

    if (!shopResponse.ok) {
      throw new Error("Shop JSON file could not be loaded.");
    }

    if (!productsResponse.ok) {
      throw new Error("Products JSON file could not be loaded.");
    }

    const shop = await shopResponse.json();
    const productData = await productsResponse.json();

    if (!Array.isArray(productData.products)) {
      throw new Error("Products JSON format is incorrect.");
    }

    allProducts = productData.products;

    initializeShop(shop);
    showFinalCatalog();

  } catch (error) {
    console.error("Website loading error:", error);

    const productsBox = $("products");

    if (productsBox) {
      productsBox.textContent =
        "Website data load nahi ho paya. JSON file paths aur format check karein.";
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
