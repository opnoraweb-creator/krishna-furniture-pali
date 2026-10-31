const SHOP_DATA_URL = "data/shops/krishna-decor.json";
const PRODUCTS_DATA_URL = "data/products/krishna-decor-products.json";

const DEFAULT_MAP_URL = "https://maps.app.goo.gl/byF8p2iFVTduc25B6";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/krishna_decor_furniture_pali?psln=cWV1c2xmZmY1b2Nk";

const $ = (id) => document.getElementById(id);

let shopData = {};
let allProducts = [];
let selectedCategory = null;
let selectedSubcategory = null;

const categoriesBox = $("categories");
const subcategoriesBox = $("subcategories");
const productsBox = $("products");

function setText(id, value) {
  const element = $(id);
  if (element && value !== undefined) element.textContent = value;
}

function setLink(id, url) {
  const element = $(id);
  if (element && url) element.href = url;
}

function setImage(id, url) {
  const element = $(id);
  if (element && url) element.src = url;
}

function showSection(id, visible) {
  const element = $(id);
  if (element) element.hidden = !visible;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// SHOP INFORMATION
function initializeShop(data) {
  shopData = data;

  setText("shopName", data.shopName);
  setText("tagline", data.tagline);
  setText("heroName", data.shopName);
  setText("about", data.about);
  setText("address", data.address);
  setText("phoneText", data.phone);
  setText("footerName", data.shopName);
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

  renderMainCategories(data.categories || []);
}

// MAIN CATEGORIES
function renderMainCategories(categories) {
  if (!categoriesBox) return;

  categoriesBox.innerHTML = "";

  categories.filter(category => category.active !== false).forEach(category => {
    const card = createElement("button", "category-card");
    card.type = "button";

    const image = createElement("img");
    image.src = category.image || "assets/images/categories/default.jpg";
    image.alt = category.name;
    image.loading = "lazy";

    const title = createElement("h3", "", category.name);

    card.append(image, title);

    card.addEventListener("click", () => {
      openSubcategories(category);
    });

    categoriesBox.appendChild(card);
  });
}

// SUBCATEGORIES
function openSubcategories(category) {
  selectedCategory = category;
  selectedSubcategory = null;

  setText("subcategoriesHeading", category.name);

  showSection("categoriesSection", false);
  showSection("subcategoriesSection", true);
  showSection("productsSection", false);

  renderSubcategories(category);
}

function renderSubcategories(category) {
  if (!subcategoriesBox) return;

  subcategoriesBox.innerHTML = "";

  (category.subcategories || [])
    .filter(item => item.active !== false)
    .forEach(subcategory => {
      const card = createElement("button", "category-card");
      card.type = "button";

      const image = createElement("img");
      image.src = subcategory.image || "assets/images/categories/default.jpg";
      image.alt = subcategory.name;
      image.loading = "lazy";

      const title = createElement("h3", "", subcategory.name);

      card.append(image, title);

      card.addEventListener("click", () => {
        openProducts(category, subcategory);
      });

      subcategoriesBox.appendChild(card);
    });
}

// PRODUCTS
function openProducts(category, subcategory) {
  selectedCategory = category;
  selectedSubcategory = subcategory;

  setText(
    "productsHeading",
    `${category.name} - ${subcategory.name}`
  );

  showSection("categoriesSection", false);
  showSection("subcategoriesSection", false);
  showSection("productsSection", true);

  renderProducts(
    allProducts.filter(product =>
      product.active !== false &&
      product.categoryId === category.id &&
      product.subcategoryId === subcategory.id
    )
  );
}

function renderProducts(products) {
  if (!productsBox) return;

  productsBox.innerHTML = "";

  if (!products.length) {
    productsBox.appendChild(
      createElement("p", "empty-message", "Abhi is category mein products upload nahi kiye gaye hain.")
    );
    return;
  }

  products.forEach(product => {
    const card = createElement("article", "product-card");

    const images = [
      product.image,
      ...(product.gallery || [])
    ].filter((image, index, array) =>
      image && array.indexOf(image) === index
    );

    const mainImage = createElement("img", "product-image");
    mainImage.src = images[0] || "assets/images/categories/default.jpg";
    mainImage.alt = product.name;
    mainImage.loading = "lazy";

    mainImage.addEventListener("click", () => {
      openPhoto(images, 0);
    });

    const title = createElement("h3", "", product.name);
    const description = createElement("p", "product-description", product.description || "");

    card.append(mainImage, title);

    if (product.description) {
      card.appendChild(description);
    }

    if (images.length > 1) {
      const gallery = createElement("div", "product-gallery");

      images.forEach((image, index) => {
        const thumb = createElement("img", "gallery-thumb");
        thumb.src = image;
        thumb.alt = `${product.name} photo ${index + 1}`;
        thumb.loading = "lazy";

        thumb.addEventListener("click", () => {
          openPhoto(images, index);
        });

        gallery.appendChild(thumb);
      });

      card.appendChild(gallery);
    }

    productsBox.appendChild(card);
  });
}

// PHOTO VIEWER
function openPhoto(images, startIndex) {
  let currentIndex = startIndex;

  const overlay = createElement("div", "photo-overlay");
  const image = createElement("img", "photo-viewer-image");

  const closeButton = createElement("button", "photo-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image");

  const previousButton = createElement("button", "photo-previous", "‹");
  previousButton.type = "button";

  const nextButton = createElement("button", "photo-next", "›");
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

  overlay.append(
    closeButton,
    previousButton,
    image,
    nextButton
  );

  document.body.appendChild(overlay);
  updateImage();
}

// BACK BUTTONS
const backCategories = $("backCategories");

if (backCategories) {
  backCategories.addEventListener("click", () => {
    showSection("categoriesSection", true);
    showSection("subcategoriesSection", false);
    showSection("productsSection", false);
  });
}

// Product section mein dynamically back button
function addProductsBackButton() {
  const section = $("productsSection");
  if (!section || $("backToSubcategories")) return;

  const button = createElement("button", "back-button", "← Back to Subcategories");
  button.id = "backToSubcategories";
  button.type = "button";

  button.addEventListener("click", () => {
    if (selectedCategory) {
      openSubcategories(selectedCategory);
    }
  });

  section.prepend(button);
}

// LOAD BOTH JSON FILES
async function loadWebsite() {
  try {
    const [shopResponse, productsResponse] = await Promise.all([
      fetch(SHOP_DATA_URL),
      fetch(PRODUCTS_DATA_URL)
    ]);

    if (!shopResponse.ok) {
      throw new Error("Shop JSON load nahi hua.");
    }

    if (!productsResponse.ok) {
      throw new Error("Products JSON load nahi hua.");
    }

    const shop = await shopResponse.json();
    const productData = await productsResponse.json();

    allProducts = productData.products || [];

    initializeShop(shop);
    addProductsBackButton();

  } catch (error) {
    console.error("Website loading error:", error);

    if (categoriesBox) {
      categoriesBox.textContent =
        "Website data load nahi ho paya. JSON file paths check karein.";
    }
  }
}

loadWebsite();
