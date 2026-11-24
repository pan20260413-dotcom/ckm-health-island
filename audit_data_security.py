from playwright.sync_api import sync_playwright
import json
BASE='http://127.0.0.1:4182/index.html';out=[]
def check(n,ok,d=''):
 out.append({'name':n,'result':'PASS' if ok else 'FAIL','detail':d})
 if not ok: raise AssertionError(n+' '+d)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);ctx=b.new_context(service_workers='block',accept_downloads=True);page=ctx.new_page();errs=[];dialogs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.on('dialog',lambda d:(dialogs.append(d.message),d.accept()))
 page.goto(BASE,wait_until='networkidle');page.wait_for_selector('#habit-system')
 # A reserved object-property ID in a full backup must be rejected.
 backup=page.evaluate('HabitSystem._backupEnvelope()');backup['data']['passport']['tasks']={'__proto__':{'title':'x','category':'x','status':'completed','startedAt':'2026-11-23','completedAt':'2026-11-23','xp':1}}
 badfile=Path=__import__('pathlib').Path(__file__).with_name('prototype-backup.json');badfile.write_text(json.dumps(backup),encoding='utf-8')
 before=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
 with page.expect_file_chooser() as fc:page.locator('#habit-system [data-action="import"]').click()
 fc.value.set_files(str(badfile));page.wait_for_timeout(300)
 check('prototype key import rejected without mutation',before==json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False))
 # Quota error during reward write must revert the state.
 task=page.evaluate("HabitSystem.tasks.find(t=>t.theme==='move'&&t.level===1)")
 page.evaluate('(id)=>HabitSystem.choose(id)',task['id']);before=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
 page.evaluate("const old=localStorage.setItem.bind(localStorage);Object.defineProperty(localStorage,'setItem',{configurable:true,value:(k,v)=>{if(k==='ckmIslandState')throw new DOMException('quota','QuotaExceededError');return old(k,v)}})")
 page.evaluate('(id)=>HabitSystem.complete(id)',task['id'])
 after_state=page.evaluate('ckmState()');before_state=json.loads(before);check('quota failure rolls back task award',after_state['passport']['xp']==before_state['passport']['xp'] and after_state['trees']==before_state['trees'] and after_state['habitSystem']['records']==before_state['habitSystem']['records'],'no tree, XP or task record added')
 check('quota failure causes no uncaught page error',not errs,str(errs))
 ctx.close()
 # Semantically malformed but syntactically valid local state is quarantined.
 c2=b.new_context(service_workers='block');q=c2.new_page();e=[];q.on('pageerror',lambda x:e.append(str(x)))
 corrupted={'trees':4,'days':{'2026-11-23':'not-array'},'passport':{'xp':'bad','tasks':{'__proto__':{'status':'completed'}},'history':'bad'},'habitSystem':{'records':'corrupt'}}
 q.add_init_script('localStorage.setItem("ckmIslandState",'+json.dumps(json.dumps(corrupted))+')')
 q.goto(BASE,wait_until='networkidle');recovery=q.evaluate('ckmState().ckmRecoveryData')
 check('corrupt nested localStorage preserved and app recovers',not e and bool(recovery.get('habitSystem')) and bool(recovery.get('day:2026-11-23')) and q.locator('#habit-system [role="alert"]').count()==1,str(e))
 c2.close()
 # Unparseable JSON text is retained as a raw recovery field.
 c3=b.new_context(service_workers='block');r=c3.new_page();ee=[];r.on('pageerror',lambda x:ee.append(str(x)));r.add_init_script("localStorage.setItem('ckmIslandState','not-json-raw')");r.goto(BASE,wait_until='networkidle')
 check('unparseable localStorage raw string preserved',not ee and r.evaluate('ckmState().storageRecoveryRaw')=='not-json-raw' and r.locator('#habit-system [role="alert"]').count()==1,str(ee))
 c3.close();b.close()
print(json.dumps({'browser':'Chromium Playwright','checks':out,'page_errors':errs},ensure_ascii=False,indent=2))
