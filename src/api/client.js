const BASE=(import.meta.env.VITE_SHINEX_API_URL||'https://shinex-marketplace.onrender.com/api').replace(/\/$/,'');
export const tokenStore={get:()=>sessionStorage.getItem('shinex_token'),set:t=>sessionStorage.setItem('shinex_token',t),clear:()=>sessionStorage.removeItem('shinex_token')};
export async function api(path,{method='GET',body,form=false,signal}={}){
  const headers={}; const token=tokenStore.get(); if(token) headers.Authorization=`Bearer ${token}`;
  if(body && !form) headers['Content-Type']='application/json';
  let res;
  try{res=await fetch(BASE+path,{method,headers,body:form?body:body?JSON.stringify(body):undefined,signal})}catch(e){const x=new Error('Network error. Please check your connection and try again.');x.status=0;throw x}
  let payload=null; try{payload=await res.json()}catch{}
  if(!res.ok){const x=new Error(payload?.message||`Request failed (${res.status})`);x.status=res.status;x.payload=payload;throw x}
  return payload;
}
export const qs=o=>{const p=new URLSearchParams();Object.entries(o||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')p.set(k,v)});const s=p.toString();return s?`?${s}`:''};
export const money=n=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(Number(n)||0);
export const formatDate=s=>s?new Intl.DateTimeFormat('en-NG',{dateStyle:'medium'}).format(new Date(s)):'—';
export const whatsappUrl=number=>`https://wa.me/${String(number||'').replace(/\D/g,'')}`;
