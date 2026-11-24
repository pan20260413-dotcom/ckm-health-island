from playwright.sync_api import sync_playwright
from test_config import BASE_URL
from pathlib import Path
import json, tempfile, copy

checks=[]
def check(name,ok,detail=''):
    checks.append({'name':name,'result':'PASS' if ok else 'FAIL','detail':detail})
    if not ok: raise AssertionError(name+': '+detail)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    context=browser.new_context(accept_downloads=True,service_workers='block')
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('dialog',lambda d:d.accept())
    page.goto(BASE_URL,wait_until='networkidle');page.wait_for_selector('#habit-system')
    # A completely isolated profile with multiple data types and special characters.
    page.locator('#passportName').fill('QA & <居民>')
    page.get_by_role('button',name='儲存角色設定').click()
    page.locator('#goalText').fill('外出時記得帶水 & 休息')
    page.get_by_role('button',name='設定為進行中').click()
    page.evaluate("checkTask(document.querySelector('.task button'),'food')")
    page.evaluate("HabitSystem.choose('move_01');HabitSystem.complete('move_01')")
    page.locator('#habit-system input[data-metric-type="activity"]').fill('35');page.keyboard.press('Tab')
    page.locator('#habit-system input[data-metric-type="sleep"]').fill('7.25');page.keyboard.press('Tab')
    page.locator('#habit-system input[data-metric-type="sodium"]').fill('1750');page.keyboard.press('Tab')
    page.evaluate("ckmState().passport.activityLog.push({date:HabitSystem._backupEnvelope().data.passport.history[0].date,activity:'散步',minutes:20});ckmSave()")
    page.evaluate("HabitSystem.note(HabitSystem._backupEnvelope().data.habitSystem.records.slice(-1)[0].key,'特殊字元 & <安全>')")
    baseline=page.evaluate('HabitSystem._backupEnvelope().data')
    # Export from the UI, then clear only this disposable Playwright browser profile.
    with page.expect_download() as download_info:
        page.locator('#habit-system [data-action="export"]').click()
    backup_path=Path(tempfile.gettempdir())/'ckm-v312-roundtrip-backup.json'
    download_info.value.save_as(str(backup_path))
    page.evaluate('localStorage.clear()')
    page.reload(wait_until='networkidle')
    check('disposable browser profile cleared before restore',page.evaluate('ckmState().trees===0 && ckmState().passport.xp===0 && ckmState().habitSystem.records.length===0'))
    with page.expect_file_chooser() as chooser:
        page.locator('#habit-system [data-action="import"]').click()
    chooser.value.set_files(str(backup_path));page.wait_for_timeout(400)
    restored=page.evaluate('HabitSystem._backupEnvelope().data')
    check('export-clear-import restores all domains exactly',json.dumps(restored,sort_keys=True,ensure_ascii=False)==json.dumps(baseline,sort_keys=True,ensure_ascii=False))
    check('roundtrip includes island, passport, habit, metrics and goal',all(k in restored for k in ('days','trees','passport','habitSystem')) and all(k in restored['habitSystem'] for k in ('records','selections','level','metrics')) and all(k in restored['passport'] for k in ('activityLog','sleepLogs','moodLogs','goal')))
    before=page.evaluate('JSON.stringify(ckmState())')
    for name,content in [('empty file',''),('empty object','{}'),('malformed JSON','{broken')]:
        f=Path(tempfile.gettempdir())/('ckm-v312-'+name.replace(' ','-')+'.json');f.write_text(content,encoding='utf-8')
        with page.expect_file_chooser() as chooser: page.locator('#habit-system [data-action="import"]').click()
        chooser.value.set_files(str(f));page.wait_for_timeout(150)
        check(name+' rejected without changing data',page.evaluate('JSON.stringify(ckmState())')==before)
    valid_backup=json.loads(backup_path.read_text(encoding='utf-8'))
    invalid_cases=[]
    bad_date=copy.deepcopy(valid_backup);bad_date['data']['habitSystem']['metrics']['sleep']['2026-99-99']=7
    invalid_cases.append(('invalid metric date',bad_date))
    bad_metric=copy.deepcopy(valid_backup);bad_metric['data']['habitSystem']['metrics']['activity']['2026-11-24']=99999
    invalid_cases.append(('out-of-range metric',bad_metric))
    bad_theme=copy.deepcopy(valid_backup);bad_theme['data']['habitSystem']['records'].append({'date':'2026-11-24','taskId':'food_01','theme':'sleep','title':'invalid','status':'cancelled','rewardVersion':0,'completedAt':'2026-11-24T12:00:00.000Z','treeAwarded':False,'xpAwarded':False,'note':''})
    invalid_cases.append(('task ID and theme mismatch',bad_theme))
    for name,body in invalid_cases:
        f=Path(tempfile.gettempdir())/('ckm-v312-'+name.replace(' ','-')+'.json');f.write_text(json.dumps(body),encoding='utf-8')
        with page.expect_file_chooser() as chooser:page.locator('#habit-system [data-action="import"]').click()
        chooser.value.set_files(str(f));page.wait_for_timeout(150)
        check(name+' rejected without changing data',page.evaluate('JSON.stringify(ckmState())')==before)
    big=Path(tempfile.gettempdir())/'ckm-v312-oversized.json';big.write_bytes(b'0'*(5*1024*1024+1))
    with page.expect_file_chooser() as chooser:page.locator('#habit-system [data-action="import"]').click()
    chooser.value.set_files(str(big));page.wait_for_timeout(200)
    check('file over 5 MB rejected without changing data',page.evaluate('JSON.stringify(ckmState())')==before)
    check('roundtrip and invalid-import flows no page errors',not errors,str(errors))
    context.close();browser.close()
print(json.dumps({'browser':'Chromium Playwright isolated profile','checks':checks,'page_errors':errors},ensure_ascii=False,indent=2))
