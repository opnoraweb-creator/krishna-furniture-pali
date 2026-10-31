// Cloudflare Worker: keep all secrets in Worker environment variables.
// Required secrets: SHOP_PIN, GITHUB_TOKEN, CLOUDINARY_API_SECRET
// Required vars: GITHUB_OWNER=opnoraweb-creator, GITHUB_REPO=krishna-furniture-pali,
// GITHUB_BRANCH=main, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY
const FILE_PATH="data/shops/krishna-decor.json";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,X-Shop-Pin"};
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{...cors,"Content-Type":"application/json"}});
async function sha1(text){const bytes=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-1",bytes);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function cloudinaryUpload(file,env){
  const timestamp=Math.floor(Date.now()/1000).toString(),folder="digiprofiles/krishna-decor";
  const signature=await sha1(`folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`);
  const fd=new FormData();fd.append("file",file);fd.append("api_key",env.CLOUDINARY_API_KEY);fd.append("timestamp",timestamp);fd.append("folder",folder);fd.append("signature",signature);
  const r=await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,{method:"POST",body:fd});
  const out=await r.json();if(!r.ok)throw Error(out.error?.message||"Image upload failed");return out.secure_url;
}
async function githubRequest(env,method,path,body){
  const url=`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
  const r=await fetch(url,{method,headers:{"Authorization":`Bearer ${env.GITHUB_TOKEN}`,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
  const out=await r.json();if(!r.ok)throw Error(out.message||"GitHub request failed");return out;
}
export default {async fetch(request,env){
  if(request.method==="OPTIONS")return new Response(null,{headers:cors});
  if(request.method!=="POST")return reply({error:"Method not allowed"},405);
  if(request.headers.get("X-Shop-Pin")!==env.SHOP_PIN)return reply({error:"Incorrect shop PIN"},401);
  const url=new URL(request.url);
  try{
    if(url.pathname==="/upload"){
      const fd=await request.formData(),file=fd.get("file");if(!file||typeof file==="string")return reply({error:"Image file missing"},400);
      if(file.size>8*1024*1024)return reply({error:"Maximum image size is 8 MB"},413);
      if(!file.type.startsWith("image/"))return reply({error:"Only image files are allowed"},400);
      return reply({url:await cloudinaryUpload(file,env)});
    }
    if(url.pathname==="/load"){
      const current=await githubRequest(env,"GET",FILE_PATH);
      const decoded=atob(current.content.replace(/\n/g,""));
      const bytes=Uint8Array.from(decoded,c=>c.charCodeAt(0));
      const data=JSON.parse(new TextDecoder().decode(bytes));
      return reply({data});
    }
    if(url.pathname==="/save"){
      const data=await request.json();
      if(!data||!Array.isArray(data.categories)||!Array.isArray(data.products))return reply({error:"Invalid shop data"},400);
      const current=await githubRequest(env,"GET",FILE_PATH);
      const content=btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(data,null,2))));
      await githubRequest(env,"PUT",FILE_PATH,{message:"Update Krishna Decor shop catalogue",content,sha:current.sha,branch:env.GITHUB_BRANCH||"main"});
      return reply({ok:true});
    }
    return reply({error:"Not found"},404);
  }catch(e){return reply({error:e.message||"Server error"},500);}
}};
