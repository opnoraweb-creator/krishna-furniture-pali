const DATA_URL = "data/shops/krishna-decor.json";
const FALLBACK = {
  shopName:"Krishna Decor Furniture", tagline:"Furniture Wholesale & Retail", phone:"9829781979",
  whatsapp:"919829781979", address:"Near Bangar School, Pali, Rajasthan", mapQuery:"Krishna Decor Furniture, Pali, Rajasthan",
  about:"Furniture wholesale and retail shop in Pali, Rajasthan.", ownerPhoto:"assets/images/owner-photo.jpg",
  categories:[], products:[]
};
const $ = id => document.getElementById(id);
function safeText(id,value){ if($(id)) $(id).textContent=value||""; }
function render(data){
  safeText("shopName",data.shopName);safeText("heroName",data.shopName);safeText("footerName",data.shopName);
  safeText("tagline",data.tagline);safeText("about",data.about);safeText("address",data.address);
  safeText("phoneText",data.phone);safeText("hours",data.hours);safeText("year",new Date().getFullYear());
  $("ownerPhoto").src=data.ownerPhoto||FALLBACK.ownerPhoto;
  const tel=(data.phone||"").replace(/[^\d+]/g,"");
  $("callTop").href=$("callButton").href=tel?"tel:"+tel:"#";
  const wa=(data.whatsapp||"").replace(/\D/g,"");
  $("waTop").href=$("waButton").href=wa?"https://wa.me/"+wa:"#";
  $("mapLink").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(data.mapQuery||data.address||"Pali Rajasthan");
  const cats=$("categories");cats.innerHTML="";
  if(!data.categories?.length) cats.innerHTML='<p class="muted">Product categories will appear here soon.</p>';
  (data.categories||[]).filter(c=>c.active!==false).forEach(c=>{
    const card=document.createElement("article");card.className="category-card";
    const img=document.createElement("img");img.src=c.image||"assets/images/category-placeholder.jpg";img.alt=c.name||"Category";
    const h=document.createElement("h3");h.textContent=c.name||"Category";
    card.append(img,h);card.onclick=()=>showCategory(c.id,c.name,data.products||[]);cats.append(card);
  });
  showCategory(null,"All Products",data.products||[]);
}
function showCategory(id,name,products){
  safeText("productsHeading",name||"Products");const box=$("products");box.innerHTML="";
  const items=products.filter(p=>p.active!==false&&(!id||p.categoryId===id));
  if(!items.length){box.innerHTML='<p class="muted">Products will appear here soon.</p>';return;}
  items.forEach(p=>{
    const card=document.createElement("article");card.className="product-card";
    const img=document.createElement("img");img.src=(p.images&&p.images[0])||"assets/images/product-placeholder.jpg";img.alt=p.name||"Product";
    const h=document.createElement("h3");h.textContent=p.name||"Product";
    card.append(img,h);
    if(p.description){const d=document.createElement("p");d.textContent=p.description;card.append(d);}
    if(p.price){const price=document.createElement("p");price.textContent=p.price;card.append(price);}
    box.append(card);
  });
}
fetch(DATA_URL+"?v="+Date.now()).then(r=>{if(!r.ok)throw Error("Data unavailable");return r.json();}).then(render).catch(err=>{console.warn(err);render(FALLBACK);});
