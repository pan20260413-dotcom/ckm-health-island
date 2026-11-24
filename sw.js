const CACHE_NAME='ckm-health-island-v312-shell-1';
const MANAGED_PREFIXES=['ckm-health-island-v312-shell-','ckm-health-island-v311-shell-','ckm-health-island-v31-shell-','ckm-health-island-v3-habits-'];
const SHELL=['./','./index.html','./habit-system.css','./habit-system.js','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./island_growth_base.png','./island_growth_preview.png'];
const APP_PATHS=new Set(SHELL.map(path=>new URL(path,self.registration.scope).pathname));

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name!==CACHE_NAME&&MANAGED_PREFIXES.some(prefix=>name.startsWith(prefix))).map(name=>caches.delete(name)));
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{return await fetch(request)}catch{return (await caches.open(CACHE_NAME)).match('./index.html')}})());
    return;
  }
  if(APP_PATHS.has(url.pathname))event.respondWith((async()=>{
    const cached=await caches.match(url.pathname);
    if(cached)return cached;
    return fetch(request);
  })());
});
