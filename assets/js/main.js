/* ==========================================
   KRISHNA DECOR FURNITURE
   FINAL WEBSITE JAVASCRIPT
   CATEGORY-WISE PRODUCT GRID
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

  if (element && url) {
    element.href = url;
  }
}

function setImage(id, url) {
  const element = $(id);

  if (element && url) {
    element.src = url;
  }
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

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

  const whatsappUrl =
    `https://wa.me/${data.whatsapp || ""}`;

  ["callTop", "callButton", "contactCall"].forEach(id => {
    setLink(id, phoneUrl);
  });

  ["waTop", "waButton", "contactWhatsApp"].forEach(id => {
    setLink(id, whatsappUrl);
  });

  setLink(
    "instagramTop",
    data.instagram || DEFAULT_INSTAGRAM_URL
  );

  setLink(
    "mapLink",
    data.mapUrl || DEFAULT_MAP_URL
  );
}

/* ==========================================
   CATEGORY NAME HELPERS
========================================== */

function getCategoryName(categoryId) {
  const categories = shopData.categories || [];

  const category = categories.find(
    item => item.id === categoryId
  );

  return category ? category.name : categoryId;
}

function getSubcategoryName(categoryId, subcategoryId) {
  const categories = shopData.categories || [];

  const category = categories.find(
    item => item.id === categoryId
  );

  if (category && category.subcategories) {
    const subcategory = category.subcategories.find(
      item => item.id === subcategoryId
    );

    if (subcategory) {
      return subcategory.name;
    }
  }

  const names = {
    "sofa": "Sofa",
    "chair": "Chair",
    "table": "Table",
    "bed": "Bed",
    "door": "Door",
    "home-decor": "Home Decor",
    "furniture-other": "Other",
    "window": "Window",
    "glass": "Glass",
    "gate": "Gate",
    "building-other": "Other",
    "office-chair": "Chair",
    "office-table": "Table",
    "office-other": "Other"
  };

  return names[subcategoryId] || subcategoryId;
}

/* ==========================================
   PRODUCT IMAGE VIEWER
========================================== */

function openPhoto(images, startIndex = 0) {
  if (!images || !images.length) return;

  let currentIndex = startIndex;

  const overlay = createElement(
    "div",
    "photo-overlay"
  );

  const image = createElement(
    "img",
    "photo-viewer-image"
  );

  const closeButton = createElement(
    "button",
    "photo-close",
    "×"
  );

  const previousButton = createElement(
    "button",
    "photo-previous",
    "‹"
  );

  const nextButton = createElement(
    "button",
    "photo-next",
    "›"
  );

  closeButton.type = "button";
  previousButton.type = "button";
  nextButton.type = "button";

  closeButton.setAttribute("aria-label", "Close image");
  previousButton.setAttribute("aria-label", "Previous image");
  nextButton.setAttribute("aria-label", "Next image");

  function updateImage() {
    image.src = images[currentIndex];
  }

  previousButton.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + images.length) % images.length;

    updateImage();
  });

  nextButton.addEventListener("click", () => {
    currentIndex =
      (currentIndex + 1) % images.length;

    updateImage();
  });

  closeButton.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      overlay.remove();
    }
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

    if (event.key === "ArrowRight") {
      nextButton.click();
    }

    if (event.key === "ArrowLeft") {
      previousButton.click();
    }
  }

  document.addEventListener("keydown", keyboardHandler);

  overlay.append(
    closeButton,
    previousButton,
    image,
    nextButton
  );

  document.body.appendChild(overlay);

  updateImage();
}

/* ==========================================
   PRODUCT CARD
========================================== */

function createProductCard(product) {
  const card = createElement(
    "article",
    "product-card"
  );

  const images = [
    product.image,
    ...(product.gallery || [])
  ].filter((image, index, array) => {
    return image && array.indexOf(image) === index;
  });

  const mainImage = createElement(
    "img",
    "product-image"
  );

  mainImage.src = images[0] || "";
  mainImage.alt = product.name || "Furniture product";
  mainImage.loading = "lazy";

  mainImage.addEventListener("click", () => {
    openPhoto(images, 0);
  });

  const title = createElement(
    "h3",
    "product-title",
    product.name || "Product"
  );

  card.append(mainImage, title);

  if (product.description) {
    const description = createElement(
      "p",
      "product-description",
      product.description
    );

    card.appendChild(description);
  }

  /* PRODUCT GALLERY */

  if (images.length > 1) {
    const gallery = createElement(
      "div",
      "product-gallery"
    );

    images.forEach((imagePath, index) => {
      const thumbnail = createElement(
        "img",
        "gallery-thumb"
      );

      thumbnail.src = imagePath;
      thumbnail.alt =
        `${product.name} photo ${index + 1}`;

      thumbnail.loading = "lazy";

      thumbnail.addEventListener("click", () => {
        openPhoto(images, index);
      });

      gallery.appendChild(thumbnail);
    });

    card.appendChild(gallery);
  }

  return card;
}

/* ==========================================
   CATEGORY-WISE PRODUCT GRID
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
      createElement(
        "p",
        "empty-message",
        "Products coming soon."
      )
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
        product =>
          product.subcategoryId === subcategory.id
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

      const grid = createElement(
        "div",
        "product-grid"
      );

      products.forEach(product => {
        grid.appendChild(
          createProductCard(product)
        );
      });

      group.append(heading, grid);

      categorySection.appendChild(group);
    });

    productsBox.appendChild(categorySection);
  });

  /* Products with category IDs not found in shop JSON */

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

    const grid = createElement(
      "div",
      "product-grid"
    );

    unknownProducts.forEach(product => {
      grid.appendChild(createProductCard(product));
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

  if (categoriesSection) {
    categoriesSection.hidden = true;
  }

  if (subcategoriesSection) {
    subcategoriesSection.hidden = true;
  }

  if (productsSection) {
    productsSection.hidden = false;
  }

  setText("productsHeading", "Our Products");

  renderProductCatalog();
}

/* ==========================================
   LOAD JSON FILES
========================================== */

async function loadWebsite() {
  try {
    const [shopResponse, productsResponse] =
      await Promise.all([
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
