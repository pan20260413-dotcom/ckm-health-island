from playwright.sync_api import sync_playwright
from test_config import BASE_URL
from datetime import datetime
from zoneinfo import ZoneInfo
import json
checks=[]
def check(n,ok,d=''):
 checks.append({'name':n,'result':'PASS' if ok else 'FAIL','detail':d})
 if not ok:raise AssertionError(n+': '+d)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);ctx=b.new_context(timezone_id='Asia/Taipei',service_workers='block');page=ctx.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.clock.install(time=datetime(2026,11,24,10,0,tzinfo=ZoneInfo('Asia/Taipei')))
 page.goto(BASE_URL,wait_until='networkidle');page.wait_for_selector('#habit-system .habit-card')
 page.evaluate("HabitSystem.choose('food_01');HabitSystem.complete('food_01')")
 day1=page.evaluate('ckmState().habitSystem.records.at(-1).date')
 check('fixed local date is used for first-day record',day1=='2026-11-24',day1)
 page.clock.fast_forward(24*60*60*1000);page.reload(wait_until='networkidle')
 page.evaluate("HabitSystem.choose('food_02');HabitSystem.complete('food_02')")
 state=page.evaluate('ckmState()');records=state['habitSystem']['records']
 check('next calendar day allows a new same-theme habit',len(records)==2 and records[1]['date']=='2026-11-25' and records[0]['date']!=records[1]['date'],json.dumps([r['date'] for r in records]))
 summary=page.locator('#habit-system').inner_text()
 check('consecutive day count crosses midnight correctly','連續打卡 2 天' in summary)
 check('daily reward applies once per date',state['passport']['xp']==8 and len(records)==2)
 check('date rollover has no page errors',not errs,str(errs))
 ctx.close();b.close()
print(json.dumps({'browser':'Chromium clock-controlled simulation','checks':checks},ensure_ascii=False,indent=2))
