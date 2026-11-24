from playwright.sync_api import sync_playwright
from pathlib import Path
import json, time
BASE='http://127.0.0.1:4182/index.html'
report={'browser_simulation':'Chromium via installed Playwright browser','checks':[],'console_errors':[],'page_errors':[],'external_requests':[]}
def check(name,ok,detail=''):
    report['checks'].append({'name':name,'result':'PASS' if ok else 'FAIL','detail':detail})
    if not ok: raise AssertionError(name+': '+detail)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    context=browser.new_context(viewport={'width':1280,'height':900},accept_downloads=True,service_workers='block')
    page=context.new_page()
    page.on('console',lambda msg: report['console_errors'].append(msg.text) if msg.type=='error' else None)
    page.on('pageerror',lambda err: report['page_errors'].append(str(err)+'\n'+str(err.stack)))
    page.on('request',lambda req: report['external_requests'].append(req.url) if not req.url.startswith('http://127.0.0.1:4182/') else None)
    old={'trees':12,'days':{},'lastDate':'2026-11-23','passport':{'role':'探險居民','nickname':'QA居民','xp':37,'tasks':{'game_food':{'title':'舊學習紀錄','category':'food','status':'completed','startedAt':'2026-11-20','completedAt':'2026-11-20','xp':5}},'history':[{'id':'old-entry','title':'舊護照歷史','date':'2026-11-20','xp':5,'category':'food'}],'activityLog':[{'date':'2026-11-22','activity':'散步','minutes':15}],'sleepLogs':[{'date':'2026-11-22','bed':'23:00','wake':'07:00','feeling':'普通'}],'moodLogs':[{'date':'2026-11-22','mood':'平穩'}],'sleepChallengeDays':[],'habitRecords':[{'date':'2026-11-22','taskId':'food_01','theme':'food','title':'餐盤六大類觀察','status':'completed','treeAwarded':True,'note':'舊任務'}],'habitSelections':{},'habitLevel':1,'habitMetrics':{'activity':{},'sleep':{},'sodium':{}}}}
    page.add_init_script('if(!localStorage.getItem("ckmIslandState"))localStorage.setItem("ckmIslandState", '+json.dumps(json.dumps(old,ensure_ascii=False))+')')
    resp=page.goto(BASE,wait_until='networkidle'); check('HTTP page response',resp.status==200,str(resp.status))
    page.wait_for_selector('#habit-system .habit-card')
    check('60 tasks and 4×15',page.evaluate("HabitSystem.tasks.length===60 && ['food','move','salt','sleep'].every(t=>HabitSystem.tasks.filter(x=>x.theme===t).length===15)"))
    check('initial page keeps 60-card library collapsed',page.evaluate('document.documentElement.scrollHeight<16000'),str(page.evaluate('document.documentElement.scrollHeight'))+' px')
    check('six island map pins',page.locator('.islandPin').count()==6)
    state=page.evaluate('ckmState()')
    check('legacy migration preserves combined trees',state['trees']==11 and state['habitSystem']['legacyTrees']==11 and len(state['habitSystem']['records'])==1,json.dumps({'trees':state['trees'],'legacy':state['habitSystem']['legacyTrees']}))
    check('old XP, history and diary preserved',state['passport']['xp']==37 and len(state['passport']['history'])==1 and len(state['passport']['activityLog'])==1 and len(state['passport']['sleepLogs'])==1)
    # Difficulty options and stable day rotation
    level=page.locator('#habit-system select[data-action="level"]')
    level.select_option('2')
    check('Level 2 selection persisted',page.evaluate('ckmState().habitSystem.level')==2)
    check('daily cards follow selected level',page.locator('#habit-system .habit-grid').first.locator('article.habit-card').count()==4 and all('Level 2' in t for t in page.locator('#habit-system .habit-grid').first.locator('.habit-meta').all_text_contents()))
    ids1=page.locator('#habit-system .habit-grid').first.locator('button[data-action="complete"]').evaluate_all('(els)=>els.map(e=>e.dataset.taskId)')
    page.reload(wait_until='networkidle'); ids2=page.locator('#habit-system .habit-grid').first.locator('button[data-action="complete"]').evaluate_all('(els)=>els.map(e=>e.dataset.taskId)')
    check('daily rotation stable after reload',ids1==ids2,str(ids1)+' / '+str(ids2))
    # library filters and user choice
    page.locator('.habit-library-toggle > summary').click()
    page.locator('#habit-system select[data-action="filter-level"]').select_option('2')
    check('library level filter shows 20 level-2 tasks',page.locator('#habitLibrary article').count()==20,str(page.locator('#habitLibrary article').count()))
    page.locator('#habitLibrary [data-action="choose"][data-task-id="food_06"]').click()
    check('user selection recorded',page.evaluate('ckmState().habitSystem.selections') is not None and page.evaluate('Object.values(ckmState().habitSystem.selections).some(x=>x.food==="food_06")'))
    xp_before=page.evaluate('ckmState().passport.xp'); legacy_before=page.evaluate('ckmState().trees')
    page.locator('#habit-system button[data-action="complete"][data-task-id="food_06"]').click()
    after=page.evaluate('ckmState()')
    check('completion gives exactly one tree and 4 XP',after['passport']['xp']==xp_before+4 and after['habitSystem']['records'][-1]['treeAwarded'] and after['habitSystem']['records'][-1]['xpAwarded']==4)
    check('new health task tree separate from legacy island tree',after['trees']==legacy_before and after['habitSystem']['legacyTrees']==legacy_before)
    rec=after['habitSystem']['records'][-1]
    page.evaluate('(id)=>HabitSystem.complete(id)',rec['taskId'])
    check('duplicate completion idempotent',page.evaluate('ckmState().passport.xp')==xp_before+4 and len(page.evaluate('ckmState().habitSystem.records'))==2)
    page.once('dialog',lambda d:d.accept())
    page.locator('#habit-system [data-action="cancel"][data-record-key="'+rec['key']+'"]') .click()
    cancelled=page.evaluate('ckmState()')
    check('cancel revokes new XP and leaves cancellation record',cancelled['passport']['xp']==xp_before and cancelled['habitSystem']['records'][-1]['status']=='cancelled' and not cancelled['habitSystem']['records'][-1]['treeAwarded'])
    page.evaluate('(key)=>HabitSystem.cancel(key)',rec['key'])
    check('repeated cancellation idempotent',page.evaluate('ckmState().passport.xp')==xp_before)
    check('legacy tree remains after cancel',page.evaluate('ckmState().trees')==legacy_before)
    # numeric data metrics via actual form change
    page.locator('#habit-system input[data-metric-type="activity"]').fill('30'); page.keyboard.press('Tab')
    check('activity metric saved',page.evaluate('Object.values(ckmState().habitSystem.metrics.activity).includes(30)'))
    page.locator('#habit-system input[data-metric-type="sleep"]').fill('7.5');page.keyboard.press('Tab')
    check('sleep metric saved',page.evaluate('Object.values(ckmState().habitSystem.metrics.sleep).includes(7.5)'))
    page.locator('#habit-system input[data-metric-type="sodium"]').fill('1800');page.keyboard.press('Tab')
    check('sodium metric saved',page.evaluate('Object.values(ckmState().habitSystem.metrics.sodium).includes(1800)'))
    # Island routes and summary views
    pin_names=['探索穩糖飲食聯邦：生活市場','探索行動力建設島：活動公園','探索護腎守護自治區：社區診所','探索睡眠修復島：街區住家','探索壓力調節特區：安靜花園','探索健康公民共和國：社區中心']
    opened=[]
    for name in pin_names:
        page.get_by_role('button',name=name).click()
        opened.append(bool(page.locator('#islandDetailTitle').inner_text()))
    check('all six island routes open',all(opened))
    summary=page.locator('#habit-system').inner_text()
    check('weekly rate, 7-day and 4-week trends visible',all(x in summary for x in ['本週完成率','近七日完成趨勢','近四週趨勢']))
    # Legacy island stamp and new health-task ledger stay separate.
    xp_old=page.evaluate('ckmState().passport.xp');tree_old=page.evaluate('ckmState().trees');records_old=len(page.evaluate('ckmState().habitSystem.records'))
    page.locator('#actions .task button').first.click()
    day_state=page.evaluate('ckmState()')
    check('legacy daily stamp increments old tree and XP once',day_state['trees']==tree_old+1 and day_state['passport']['xp']==xp_old+4 and len(day_state['habitSystem']['records'])==records_old)
    page.locator('#actions .task button').first.click()
    check('legacy repeated stamp prevented',page.evaluate('ckmState().trees')==tree_old+1 and page.evaluate('ckmState().passport.xp')==xp_old+4)
    # Notes are rendered as text/value, never parsed as markup.
    note_payload='<img src=x onerror=window.__xssProbe=1>'
    note_input=page.locator('#habit-system input[data-action="note"]').first
    note_input.fill(note_payload);page.keyboard.press('Tab')
    check('task note saved literally',page.evaluate('(v)=>ckmState().habitSystem.records.some(r=>r.note===v)',note_payload))
    check('task note HTML injection inert',page.evaluate('document.querySelectorAll("#habit-system img").length===0 && window.__xssProbe===undefined'))
    page.get_by_role('button',name='探索行動力建設島：活動公園').click()
    check('movement island opens','行動力建設島' in page.locator('#islandDetailTitle').inner_text())
    page.get_by_role('button',name='探索睡眠修復島：街區住家').click()
    check('sleep island opens','睡眠修復島' in page.locator('#islandDetailTitle').inner_text())
    page.get_by_role('button',name='探索行動力建設島：活動公園').click()
    check('movement island opens','行動力建設島' in page.locator('#islandDetailTitle').inner_text())
    page.get_by_role('button',name='探索睡眠修復島：街區住家').click()
    check('sleep island opens','睡眠修復島' in page.locator('#islandDetailTitle').inner_text())
    # export actual download and inspect
    with page.expect_download() as download_info:
        page.locator('#habit-system button[data-action="export"]').click()
    download=download_info.value; backup_path=Path(__file__).with_name('roundtrip-backup.json');download.save_as(backup_path)
    exported=json.loads(backup_path.read_text(encoding='utf-8'))
    check('JSON UI export includes all domains',all(k in exported['data'] for k in ['days','trees','passport','habitSystem']) and all(k in exported['data']['habitSystem'] for k in ['records','selections','level','metrics']))
    before=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
    # Import backup through the real file input and both confirmation dialogs.
    page.on('dialog',lambda d:d.accept())
    with page.expect_file_chooser() as chooser_info:
        page.locator('#habit-system button[data-action="import"]').click()
    chooser=chooser_info.value;chooser.set_files(str(backup_path));page.wait_for_timeout(500)
    restored=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
    before_norm=json.loads(before);before_norm['passport'].setdefault('goal',None)
    check('actual file picker export/import roundtrip exact',json.dumps(before_norm,sort_keys=True,ensure_ascii=False)==restored,'expected normalized state')
    # Invalid backup should not mutate stored state.
    bad=json.loads(json.dumps(exported));bad['data']['habitSystem']['records'][0]['taskId']='<img src=x onerror=alert(1)>'
    bad_path=Path(__file__).with_name('invalid-backup.json');bad_path.write_text(json.dumps(bad),encoding='utf-8')
    before_bad=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
    with page.expect_file_chooser() as chooser_info:
        page.locator('#habit-system button[data-action="import"]').click()
    chooser_info.value.set_files(str(bad_path));page.wait_for_timeout(400)
    after_bad=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
    check('invalid task ID rejected without state change',before_bad==after_bad)
    malformed_path=Path(__file__).with_name('malformed-backup.json');malformed_path.write_text('{broken json',encoding='utf-8')
    before_malformed=json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False)
    with page.expect_file_chooser() as chooser_info:
        page.locator('#habit-system button[data-action="import"]').click()
    chooser_info.value.set_files(str(malformed_path));page.wait_for_timeout(300)
    check('malformed JSON rejected without state change',before_malformed==json.dumps(page.evaluate('ckmState()'),sort_keys=True,ensure_ascii=False))
    check('XSS payload did not execute',page.evaluate('typeof window.__xssProbe==="undefined"'))
    # Responsive layout
    page.set_viewport_size({'width':390,'height':844});page.reload(wait_until='networkidle')
    overflow=page.evaluate('document.documentElement.scrollWidth>window.innerWidth')
    check('mobile viewport has no horizontal page overflow',not overflow,'scrollWidth='+str(page.evaluate('document.documentElement.scrollWidth'))+' width=390')
    page.screenshot(path=str(Path(__file__).with_name('mobile-view.png')),full_page=True)
    check('no browser console/page errors',not report['console_errors'] and not report['page_errors'],json.dumps({'console':report['console_errors'],'page':report['page_errors']}))
    check('no external requests on initial flows',not report['external_requests'],str(report['external_requests']))
    context.close();browser.close()
print(json.dumps(report,ensure_ascii=False,indent=2))

