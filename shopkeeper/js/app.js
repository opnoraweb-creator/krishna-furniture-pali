// The Worker URL and private shop PIN are configured by the site owner.
const WORKER_URL = "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev";
let shopPin="", data={categories:[],products:[]};
const $=id=>document.getElementById(id);
const uid=()=>crypto.randomUUID();
async function api(path,body){
  const r=await fetch(WORKER_URL+path,{method:"POST",headers:{"X-Shop-Pin":shopPin},body});
  const result=await r.json().catch(()=>({error:"Invalid server response"}));
  if(!r.ok)throw Error(result.error||"Request failed");return result;
}
async function upload(file){
  const fd=new FormData();fd.append("file",file);
  const out=await api("/upload",fd);return out.url;
}
async function save(){
  $("status").textContent="Saving to GitHub…";
  await api("/save",new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  $("status").textContent="Saved! Website data updated. Refresh the public profile in a few moments.";
  renderLists();
}
function renderLists(){
  const select=$("productCategory");select.innerHTML='<option value="">Select category</option>';
  data.categories.forEach(c=>{const o=document.createElement("option");o.value=c.id;o.textContent=c.name;select.append(o);});
  $("categoryList").innerHTML=data.categories.map(c=>`<div class="item"><span>${escapeHtml(c.name)}</span><button data-delcat="${c.id}">Delete</button></div>`).join("")||"<small>No categories yet</small>";
  $("productList").innerHTML=data.products.map(p=>`<div class="item"><span>${escapeHtml(p.name)} <small>(${escapeHtml(data.categories.find(c=>c.id===p.categoryId)?.name||"No category")})</small></span><button data-delproduct="${p.id}">Delete</button></div>`).join("")||"<small>No products yet</small>";
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("loginBtn").onclick=async()=>{
  shopPin=$("pin").value.trim();if(!shopPin)return;
  try{const r=await api("/load",new Blob(["{}"],{type:"application/json"}));data=r.data;$("login").hidden=true;$("manager").hidden=false;renderLists();}
  catch(e){$("loginMsg").textContent=e.message;}
};
$("addCat").onclick=async()=>{
  try{const name=$("catName").value.trim(),file=$("catImage").files[0];if(!name||!file)throw Error("Category name and photo are required.");
  const image=await upload(file);data.categories.push({id:uid(),name,image,active:true});await save();$("catName").value="";$("catImage").value="";}
  catch(e){$("status").textContent=e.message;}
};
$("addProduct").onclick=async()=>{
  try{const name=$("productName").value.trim(),categoryId=$("productCategory").value,files=[...$("productImages").files];if(!name||!categoryId||!files.length)throw Error("Product name, category and at least one photo are required.");
  const images=[];for(const f of files)images.push(await upload(f));
  data.products.push({id:uid(),name,categoryId,images,description:$("description").value.trim(),price:$("price").value.trim(),active:true});
  await save();$("productName").value="";$("description").value="";$("price").value="";$("productImages").value="";}
  catch(e){$("status").textContent=e.message;}
};
document.addEventListener("click",async e=>{
  if(e.target.dataset.delcat){const id=e.target.dataset.delcat;data.categories=data.categories.filter(c=>c.id!==id);data.products=data.products.filter(p=>p.categoryId!==id);try{await save();}catch(err){$("status").textContent=err.message;}}
  if(e.target.dataset.delproduct){data.products=data.products.filter(p=>p.id!==e.target.dataset.delproduct);try{await save();}catch(err){$("status").textContent=err.message;}}
});