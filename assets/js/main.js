/* =====================================
   KRISHNA DECOR FURNITURE
   CATEGORY + SUBCATEGORY + GALLERY
===================================== */

const DATA_URL = "data/shops/krishna-decor.json";

const MAP_URL =
  "https://maps.app.goo.gl/byF8p2iFVTduc25B6";

const INSTAGRAM_URL =
  "https://www.instagram.com/krishna_decor_furniture_pali?psln=cWV1c2xmZmY1b2Nk";

const WHATSAPP_NUMBER = "919829781979";
const PHONE_NUMBER = "9829781979";

const $ = id => document.getElementById(id);

let shopData = null;
let activeMainCategory = null;
let activeSubCategory = null;


/* =====================================
   DEFAULT CATEGORY STRUCTURE
===================================== */

const defaultCategories = [

  {
    id: "furniture-home-decor",
    name: "Furniture & Home Decor",
    image: "assets/images/categories/furniture-home-decor.jpg",

    subcategories: [
      { id: "sofa", name: "Sofa" },
      { id: "chair", name: "Chair" },
      { id: "table", name: "Table" },
      { id: "door", name: "Door" },
      { id: "home-decor", name: "Home Decor" },
      { id: "furniture-other", name: "Other" }
    ]
  },

  {
    id: "building-material",
    name: "Building Material",
    image: "assets/images/categories/building-material.jpg",

    subcategories: [
      { id: "window", name: "Window" },
      { id: "glass", name: "Glass" },
      { id: "gate", name: "Gate" },
      { id: "building-other", name: "Other" }
    ]
  },

  {
    id: "office-material",
    name: "Office Material",
    image: "assets/images/categories/office-material.jpg",

    subcategories: [
      { id: "office-chair", name: "Chair" },
      { id: "office-table", name: "Table" },
      { id: "office-other", name: "Other" }
    ]
  }

];


/* =====================================
   SAFE TEXT
===================================== */

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value || "";
  }
}


/* =====================================
   SAFE IMAGE PATH
===================================== */

function imagePath(path, fallback = "") {
  return path || fallback;
}


/* =====================================
   INITIALIZE SHOP
===================================== */

function initializeShop(data) {

  shopData = data;

  setText("shopName", data.shopName);
  setText("heroName", data.shopName);
  setText("footerName", data.shopName);

  setText("tagline", data.tagline);
  setText("about", data.about);
  setText("phoneText", data.phone);
  setText("address", data.address);

  setText("year", new Date().getFullYear());

  const owner = $("ownerPhoto");

  if (owner && data.ownerPhoto) {
    owner.src = data.ownerPhoto;
  }

  /* CONTACT */

  const phone = (data.phone || PHONE_NUMBER)
    .replace(/[^\d+]/g, "");

  const whatsapp = (data.whatsapp || WHATSAPP_NUMBER)
    .replace(/\D/g, "");

  ["callTop", "callButton", "contactCall"].forEach(id => {
    if ($(id)) {
      $(id).href = "tel:" + phone;
    }
  });

  ["waTop", "waButton", "contactWhatsApp"].forEach(id => {
    if ($(id)) {
      $(id).href = "https://wa.me/" + whatsapp;
    }
  });

  /* SOCIAL LINKS */

  if ($("instagramTop")) {
    $("instagramTop").href = INSTAGRAM_URL;
  }

  /* MAP */

  if ($("mapLink")) {
    $("mapLink").href = MAP_URL;
  }

  /* CATEGORY DATA */

  const categories =
    data.categories && data.categories.length
      ? data.categories
      : defaultCategories;

  shopData.categories = categories;

  renderMainCategories(categories);

  showAllProducts();
}


/* =====================================
   MAIN CATEGORY CARDS
===================================== */

function renderMainCategories(categories) {

  const container = $("categories");

  if (!container) return;

  container.innerHTML = "";

  categories.forEach(category => {

    if (category.active === false) return;

    const card = document.createElement("article");

    card.className = "category-card";

    const image = document.createElement("img");

    image.src = imagePath(
      category.image,
      "assets/images/categories/default.jpg"
    );

    image.alt = category.name;

    image.loading = "lazy";

    const heading = document.createElement("h3");

    heading.textContent = category.name;

    card.append(image, heading);

    card.addEventListener("click", () => {
      openSubcategories(category);
    });

    container.appendChild(card);

  });

}


/* =====================================
   OPEN SUBCATEGORIES
===================================== */

function openSubcategories(category) {

  activeMainCategory = category;
  activeSubCategory = null;

  const section = $("subcategoriesSection");

  const categorySection = $("categoriesSection");

  const productsSection = $("productsSection");

  if (!section) return;

  categorySection.hidden = true;

  section.hidden = false;

  setText(
    "subcategoriesHeading",
    category.name
  );

  renderSubcategories(category);

  productsSection.hidden = true;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =====================================
   SUBCATEGORY CARDS
===================================== */

function renderSubcategories(category) {

  const container = $("subcategories");

  if (!container) return;

  container.innerHTML = "";

  const subcategories =
    category.subcategories || [];

  if (!subcategories.length) {

    container.innerHTML =
      '<p class="muted">No subcategories available.</p>';

    return;
  }

  subcategories.forEach(subcategory => {

    if (subcategory.active === false) return;

    const card = document.createElement("article");

    card.className = "category-card";

    const image = document.createElement("img");

    image.src = imagePath(
      subcategory.image,
      "assets/images/categories/default.jpg"
    );

    image.alt = subcategory.name;

    image.loading = "lazy";

    const heading = document.createElement("h3");

    heading.textContent = subcategory.name;

    card.append(image, heading);

    card.addEventListener("click", () => {
      openProducts(category, subcategory);
    });

    container.appendChild(card);

  });

}


/* =====================================
   OPEN PRODUCTS
===================================== */

function openProducts(category, subcategory) {

  activeMainCategory = category;

  activeSubCategory = subcategory;

  const productsSection = $("productsSection");

  const products = $("products");

  if (!productsSection || !products) return;

  $("subcategoriesSection").hidden = true;

  productsSection.hidden = false;

  setText(
    "productsHeading",
    subcategory.name
  );

  renderProducts(category, subcategory);

  productsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =====================================
   PRODUCT GALLERY
===================================== */

function renderProducts(category, subcategory) {

  const container = $("products");

  container.innerHTML = "";

  const allProducts = shopData.products || [];

  const filteredProducts = allProducts.filter(product => {

    if (product.active === false) return false;

    return (
      product.categoryId === category.id &&
      product.subcategoryId === subcategory.id
    );

  });

  if (!filteredProducts.length) {

    container.innerHTML =
      '<p class="muted">Products will be added soon.</p>';

    return;
  }

  filteredProducts.forEach(product => {

    const card = document.createElement("article");

    card.className = "product-card";

    const images = product.images || [];

    const image = document.createElement("img");

    image.src =
      images[0] ||
      "assets/images/products/default.jpg";

    image.alt = product.name;

    image.loading = "lazy";

    const heading = document.createElement("h3");

    heading.textContent = product.name;

    card.append(image, heading);

    if (product.description) {

      const description = document.createElement("p");

      description.textContent = product.description;

      card.appendChild(description);

    }

    if (product.price) {

      const price = document.createElement("p");

      price.textContent = product.price;

      card.appendChild(price);

    }

    /* MULTIPLE PHOTO GALLERY */

    if (images.length > 1) {

      const gallery = document.createElement("div");

      gallery.className = "product-gallery";

      images.forEach((src, index) => {

        const thumb = document.createElement("img");

        thumb.src = src;

        thumb.alt = product.name + " " + (index + 1);

        thumb.loading = "lazy";

        thumb.addEventListener("click", () => {

          openPhoto(src, product.name);

        });

        gallery.appendChild(thumb);

      });

      card.appendChild(gallery);

    }

    container.appendChild(card);

  });

}


/* =====================================
   ALL PRODUCTS
===================================== */

function showAllProducts() {

  const container = $("products");

  if (!container || !shopData) return;

  container.innerHTML = "";

  const products = shopData.products || [];

  if (!products.length) {

    container.innerHTML =
      '<p class="muted">Products will appear here soon.</p>';

    return;
  }

  products
    .filter(p => p.active !== false)
    .forEach(product => {

      const card = document.createElement("article");

      card.className = "product-card";

      const image = document.createElement("img");

      image.src =
        product.images?.[0] ||
        "assets/images/products/default.jpg";

      image.alt = product.name;

      image.loading = "lazy";

      const heading = document.createElement("h3");

      heading.textContent = product.name;

      card.append(image, heading);

      container.appendChild(card);

    });

}


/* =====================================
   BACK TO CATEGORIES
===================================== */

if ($("backCategories")) {

  $("backCategories").addEventListener("click", () => {

    $("subcategoriesSection").hidden = true;

    $("productsSection").hidden = false;

    $("categoriesSection").hidden = false;

    $("categoriesSection").scrollIntoView({
      behavior: "smooth"
    });

  });

}


/* =====================================
   PHOTO VIEWER
===================================== */

function openPhoto(src, title) {

  let viewer = document.getElementById("photoViewer");

  if (!viewer) {

    viewer = document.createElement("div");

    viewer.id = "photoViewer";

    viewer.className = "photo-viewer";

    viewer.innerHTML = `
      <button class="photo-close" aria-label="Close">×</button>
      <img class="photo-viewer-image" alt="">
      <p class="photo-viewer-title"></p>
    `;

    document.body.appendChild(viewer);

    viewer.querySelector(".photo-close")
      .addEventListener("click", () => {
        viewer.classList.remove("active");
      });

    viewer.addEventListener("click", event => {
      if (event.target === viewer) {
        viewer.classList.remove("active");
      }
    });

  }

  viewer.querySelector(".photo-viewer-image").src = src;

  viewer.querySelector(".photo-viewer-image").alt = title;

  viewer.querySelector(".photo-viewer-title").textContent = title;

  viewer.classList.add("active");

}


/* =====================================
   LOAD JSON
===================================== */

fetch(DATA_URL + "?v=" + Date.now())

  .then(response => {

    if (!response.ok) {
      throw new Error("Shop JSON file not found");
    }

    return response.json();

  })

  .then(data => {

    initializeShop(data);

  })

  .catch(error => {

    console.error("Shop loading error:", error);

    initializeShop({

      shopName: "Krishna Decor Furniture",

      tagline: "Furniture • Interiors • Decor • Sleepwell",

      phone: PHONE_NUMBER,

      whatsapp: WHATSAPP_NUMBER,

      address:
        "Near Traffic Police Control Room, Opposite Side Bangar School, Pali, Rajasthan.",

      about:
        "Furniture, Interiors, Home Decor and Building Materials.",

      ownerPhoto:
        "assets/images/owner-photo.jpg",

      categories: defaultCategories,

      products: []

    });

  });
