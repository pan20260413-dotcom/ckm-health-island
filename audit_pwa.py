from playwright.sync_api import sync_playwright
import json
BASE='http://127.0.0.1:4182/index.html'
result={'level':'browser simulation','checks':[],'console_errors':[],'page_errors':[]}
def check(n,ok,d=''):
 result['checks'].append({'name':n,'result':'PASS' if ok else 'FAIL','detail':d})
 if not ok: raise AssertionError(n+' '+d)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 ctx=b.new_context(viewport={'width':1280,'height':900},service_workers='allow')
 page=ctx.new_page();page.on('console',lambda m:result['console_errors'].append(m.text) if m.type=='error' else None);page.on('pageerror',lambda e:result['page_errors'].append(str(e)))
 # Hold registration so two pre-existing caches can be created before activate.
 page.add_init_script("if('serviceWorker' in navigator && sessionStorage.getItem('__auditAllowSw')!=='1'){const real=navigator.serviceWorker.register.bind(navigator.serviceWorker);navigator.serviceWorker.register=()=>Promise.resolve({auditBlocked:true});window.__auditAllowSw=real}")
 page.goto(BASE,wait_until='networkidle')
 cache_result=page.evaluate("""async()=>{if(!('caches' in window))return false;await caches.open('unrelated-site-cache');await caches.open('ckm-health-island-v31-shell-old');await caches.open('ckm-health-island-v3-habits-old');return true}""")
 check('Cache API available on localhost',cache_result)
 page.evaluate("sessionStorage.setItem('__auditAllowSw','1')");page.reload(wait_until='networkidle')
 page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller",timeout=10000)
 page.evaluate('navigator.serviceWorker.ready')
 caches=page.evaluate('caches.keys()')
 check('new project shell cache installed',any(x=='ckm-health-island-v311-shell-1' for x in caches),str(caches))
 check('only named legacy CKM caches removed',not any('ckm-health-island-v31-shell-old'==x or 'ckm-health-island-v3-habits-old'==x for x in caches) and 'unrelated-site-cache' in caches,str(caches))
 manifest=page.request.get('http://127.0.0.1:4182/manifest.webmanifest')
 data=manifest.json()
 check('manifest loads and includes icons',manifest.status==200 and len(data['icons'])>=3)
 check('iOS touch icon declared and present',page.locator('link[rel="apple-touch-icon"]').get_attribute('href')=='icon-180.png' and page.request.get('http://127.0.0.1:4182/icon-180.png').status==200)
 # Go offline; page-shell and all app code should remain usable.
 page.context.set_offline(True)
 try:
  page.reload(wait_until='domcontentloaded',timeout=10000)
  page.wait_for_selector('#habit-system .habit-card',timeout=10000)
  check('offline navigation renders app',True,page.title())
  online_state=page.evaluate('ckmState().passport.xp')
  page.locator('#habit-system .habit-grid').first.locator('button[data-action="complete"]').first.click()
  check('offline health task writes localStorage',page.evaluate('ckmState().passport.xp')==online_state+4)
  css=page.evaluate("getComputedStyle(document.querySelector('#habit-system')).backgroundColor")
  check('offline styles present',css!='rgba(0, 0, 0, 0)',css)
 except Exception as e:
  check('offline navigation renders app',False,str(e))
 page.context.set_offline(False)
 ctx.close();b.close()
 # Android-sized Chromium device emulation, not a physical device.
 device=p.devices['Pixel 7']
 b2=p.chromium.launch(headless=True);c2=b2.new_context(**device);pg=c2.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
 pg.goto(BASE,wait_until='networkidle');pg.wait_for_selector('#habit-system')
 width=pg.evaluate('innerWidth');overflow=pg.evaluate('document.documentElement.scrollWidth>innerWidth')
 check('Android Chrome device-profile viewport has no horizontal overflow',width>0 and not overflow,f'width={width} overflow={overflow}')
 check('Android profile no page errors',not errs,str(errs))
 c2.close();b2.close()
print(json.dumps(result,ensure_ascii=False,indent=2))
