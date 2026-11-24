from playwright.sync_api import sync_playwright
from test_config import BASE_URL
from pathlib import Path
import tempfile,json
checks=[]
def check(name,ok,detail=''):
 checks.append({'name':name,'result':'PASS' if ok else 'FAIL','detail':detail})
 if not ok:raise AssertionError(name+': '+detail)
with sync_playwright() as p:
 profile=Path(tempfile.mkdtemp(prefix='ckm-v312-pwa-profile-'))
 def launch():return p.chromium.launch_persistent_context(str(profile),headless=True,accept_downloads=True,service_workers='allow')
 ctx=launch();page=ctx.new_page();page.goto(BASE_URL,wait_until='networkidle');page.wait_for_selector('#habit-system .habit-card');page.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.controller',timeout=15000)
 page.locator('#habit-system .habit-grid').first.locator('button[data-action="complete"]').first.click()
 first=page.evaluate('({xp:ckmState().passport.xp,count:ckmState().habitSystem.records.length,tree:ckmState().habitSystem.records.filter(x=>x.status==="completed").length})')
 check('first online installation records one confirmed task',first['xp']>=4 and first['count']>=1 and first['tree']>=1,json.dumps(first))
 ctx.close()
 # Relaunch the same isolated persistent profile to model a browser close/reopen.
 ctx=launch();page=ctx.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.goto(BASE_URL,wait_until='networkidle');page.wait_for_selector('#habit-system .habit-card')
 reopened=page.evaluate('({xp:ckmState().passport.xp,count:ckmState().habitSystem.records.length})')
 check('close and reopen preserves this profile local data',reopened['xp']==first['xp'] and reopened['count']==first['count'],json.dumps(reopened))
 ctx.set_offline(True);page.reload(wait_until='domcontentloaded');page.wait_for_selector('#habit-system .habit-card')
 task=page.evaluate("HabitSystem.tasks.find(t=>t.theme==='move'&&t.level===ckmState().habitSystem.level).id")
 page.evaluate('(id)=>HabitSystem.choose(id)',task);page.evaluate('(id)=>HabitSystem.complete(id)',task)
 after_offline=page.evaluate('({xp:ckmState().passport.xp,count:ckmState().habitSystem.records.length})')
 page.reload(wait_until='domcontentloaded');page.wait_for_selector('#habit-system .habit-card')
 after_offline_reload=page.evaluate('({xp:ckmState().passport.xp,count:ckmState().habitSystem.records.length})')
 check('fully offline launch, task completion and reload persist',after_offline==after_offline_reload and after_offline['xp']==first['xp']+4,json.dumps(after_offline_reload))
 ctx.set_offline(False)
 page.evaluate("async()=>{await Promise.all((await caches.keys()).map(k=>caches.delete(k)));await Promise.all((await navigator.serviceWorker.getRegistrations()).map(r=>r.unregister()))}")
 page.reload(wait_until='networkidle');page.wait_for_selector('#habit-system .habit-card');page.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.controller',timeout=15000)
 final=page.evaluate('({xp:ckmState().passport.xp,count:ckmState().habitSystem.records.length,cacheName:ckmState().passport.xp})')
 check('clear site cache and re-fetch app preserves local health data',final['xp']==after_offline['xp'] and final['count']==after_offline['count'],json.dumps(final))
 check('lifecycle flow has no page errors',not errs,str(errs))
 ctx.close()
print(json.dumps({'browser':'Chromium persistent-profile simulation','checks':checks},ensure_ascii=False,indent=2))
