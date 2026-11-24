/* 健康生活種樹計畫擴充：獨立任務模組，沿用 ckmIslandState，不外傳資料。 */
(() => {
  const sources = {
    food:{name:'國民健康署《我的餐盤》與每日飲食指南（2018；網站持續更新）',year:'2018',url:'https://www.hpa.gov.tw/3821/ebc'},
    move:{name:'WHO《身體活動與久坐行為指引》（2020）',year:'2020',url:'https://www.who.int/publications/i/item/9789240015128'},
    salt:{name:'國民健康署：少吃鹽（鈉）及營養標示（2017；成人鈉建議）',year:'2017',url:'https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=1161&pid=6648'},
    sleep:{name:'AASM/SRS 成人睡眠時間共識聲明（2015；18–60歲）',year:'2015',url:'https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf'},
    sodiumWho:{name:'WHO《成人與兒童鈉攝取指引》（2012；成人群體建議）',year:'2012',url:'https://www.who.int/publications/i/item/9789241504836'},
    physicalHpa:{name:'國民健康署《成人身體活動指引》（2018）',year:'2018',url:'https://health.hpa.gov.tw/common/Download.ashx?f=5f477f5f-ac75-4e79-ad55-533ac0118c41.pdf&o=%E5%85%A8%E6%B0%91%E8%BA%AB%E9%AB%94%E6%B4%BB%E5%8B%95%E6%8C%87%E5%BC%95.pdf'},
    healthyDiet:{name:'WHO Healthy diet fact sheet（網頁版，查閱 2026）',year:'2026 查閱',url:'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'},
    foodLabels:{name:'食品藥物管理署「三步看懂營養標示」（2018 官方衛教資料）',year:'2018',url:'https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f636694198793143402'},
    ingredientLabels:{name:'食品藥物管理署《食品標示問答集彙整手冊》（2025；成分依含量由高至低標示）',year:'2025',url:'https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639057138540044743'},
    sleepHabits:{name:'NHLBI Healthy Sleep Habits（更新 2022）',year:'2022',url:'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits'},
    sleepDiary:{name:'NHLBI Sleep Diary（2019）',year:'2019',url:'https://www.nhlbi.nih.gov/resources/sleep-diary'}
  };
  const themeInfo={
    food:{title:'均衡飲食',icon:'🥗',src:'food',caution:'腎臟病、糖尿病、食物過敏或有特殊營養需求者，食物種類、份量、蛋白質、鉀、磷及水分請依醫療團隊或營養師個別建議。'},
    move:{title:'身體活動',icon:'🚶',src:'move',caution:'高血壓、心血管疾病、腎臟病、近期手術、懷孕或行動不便者，先依醫療人員建議選擇強度；胸悶、暈眩、異常喘或疼痛時停止並求助。'},
    salt:{title:'少一點鈉',icon:'🧂',src:'salt',caution:'台灣成人一般建議與 WHO 群體建議略有不同；疾病患者的目標可能是個別處方。腎臟病或服用影響鉀的藥物者，勿自行改用含鉀低鈉鹽。'},
    sleep:{title:'睡眠與休息',icon:'🌙',src:'sleep',caution:'睡眠時數需求因年齡與個人狀況不同；AASM 成人共識適用 18–60 歲。若長期失眠、嚴重打鼾或白天嗜睡，請與醫療人員討論。'}
  };
  const rows={
    food:[
      ['餐盤六大類觀察','記下這餐出現的食物類別數（0–6 類）','用「我的餐盤」認出全穀雜糧、豆魚蛋肉、乳品、蔬菜、水果、油脂與堅果種子。','餐盤比例是均衡飲食的視覺提醒；各類需求會因年齡、活動量及健康狀況而不同。'],
      ['讓蔬菜上桌','記下有蔬菜的一餐數（0–3 餐）','挑一餐加一道蔬菜或增加原有蔬菜，並記錄餐次。','國健署建議每餐蔬菜比水果多一點；種類與份量依個人飲食計畫調整。'],
      ['水果份量觀察','記錄水果份數或拳頭份數（自行選一種單位）','以一個拳頭大小作為一般成人「我的餐盤」的視覺參考，記錄今天實際吃到多少。','水果提供多種營養；水果不等同果汁。糖尿病或腎臟病者請依個人建議調整種類與份量。'],
      ['全穀雜糧替換','記錄替換的餐次（0–3 餐）','選一餐以糙米、燕麥、玉米、地瓜等全穀雜糧替代部分精製主食。','全穀雜糧是六大類之一；逐步替換更容易融入日常。'],
      ['蛋白質來源多樣化','記錄今天不同來源種類數','辨認豆類、魚、蛋、肉等來源，選一餐嘗試未常吃的原型食物。','食物來源可多元選擇；腎臟病患者蛋白質份量須個別化。'],
      ['乳品或適合替代選擇','記錄選擇與份量（自選單位）','查看餐點中是否有乳品，或記錄依個人需求選擇的替代品。','乳品屬六大類；乳糖不耐、過敏或腎臟疾病者可請營養師協助選擇。'],
      ['堅果種子辨識','記錄是否選擇一份及估量方式','辨識原味堅果種子並記錄是否加入餐點；避免以大把零食取代正餐。','堅果種子屬六大類之一；若需限鉀、磷或有過敏，先依個人建議。'],
      ['含糖飲料替換','記錄今天含糖飲料杯數','把一杯含糖飲料改為白開水或無糖飲品，記下替換前後杯數。','減少游離糖有助健康飲食；若有水分限制，飲品仍須遵守醫囑。'],
      ['飲食多樣性打卡','記錄今天吃到的不同蔬果種類數','在一天中挑選不同顏色或種類的蔬菜、水果，記錄種類而非追求高分。','多樣化選擇可涵蓋不同食物；不代表越多越好，特殊飲食限制優先。'],
      ['外食餐盤找一項','記錄一項選擇（菜、全穀、蛋白質）','在便當或自助餐中辨認蔬菜、主食、蛋白質，選一項可調整處。','「我的餐盤」可作為外食觀察工具；不需一次改變所有餐點。'],
      ['看懂每份標示','記下每份量與每包份數','找一件包裝食品，記錄每份量及每包份數，再對照自己實際吃的量。','營養標示的每份數值不一定等於整包；比較前先確認單位相同。'],
      ['糖分線索偵查','記錄每份糖克數與本包裝份數；無標示則記未提供','查看營養標示每份糖含量及本包裝份數；配料表可辨認糖類原料名稱，但不要用名稱數推算糖量。','糖類原料名稱可作線索，不能由名稱數推算總糖；比較時看每份糖克數及實際食用份量。標示糖含量不等於單獨標示添加糖。'],
      ['份量工具練習','選一項食物並記錄估量工具','用碗、拳頭、掌心或包裝份量估量一項食物，記下採用的工具。','手部份量是方便的教育工具，不是所有人的精準處方。'],
      ['組合一份餐盤','記錄餐盤涵蓋的類別數（0–6）','為一餐寫下六類中實際出現的類別，並挑一項下一次可補充的食物。','六類食物提供不同營養；依個別疾病飲食計畫調整。'],
      ['設定下一餐小目標','寫下一個具體目標並選日期','例如「下一餐先看蔬菜選項」；此項只登記目標，做完須另行確認。','設定目標不等於已實踐，系統只在你完成後才記為完成。']
    ],
    move:[
      ['舒服散步','記錄實際活動分鐘數','選擇安全路線，以可負荷的速度散步；記錄分鐘數。','WHO 指引鼓勵成人累積有氧活動；任何活動量也比完全不動好。'],
      ['中等強度自我辨識','記錄活動分鐘及說話感受','活動時觀察能否說話、是否明顯喘，記下感受；不舒服立即停止。','強度感受因人而異；不需為達標勉強自己。'],
      ['每週活動累積','記錄本週中等強度分鐘數','把本週已做的中等強度活動加總；以自己的起點逐步增加。','WHO 成人一般建議每週 150–300 分鐘中等強度，或等量其他強度；慢性病需個別調整。'],
      ['短時段活動','記錄一段 5–15 分鐘活動','選擇 5、10 或 15 分鐘舒適活動，完成後記錄實際分鐘。','短段活動也可累積；任務時間是自我追蹤選項，不是醫療標準。'],
      ['肌力活動入門','記錄動作種類與回合數','選擇安全的坐站、彈力帶或牆面推壓等動作，依能力完成並記錄。','WHO 建議成人每週至少兩天進行涵蓋主要肌群的肌力活動；起步動作需因人調整。'],
      ['平衡練習','記錄練習分鐘數及扶靠方式','在穩固支撐物旁練習重心轉移或腳跟腳尖站立，記下時間。','年長者可納入多元活動；有跌倒風險者需旁人陪同及安全支撐。'],
      ['柔軟度舒展','記錄伸展部位與分鐘數','挑選舒適、不疼痛的肩頸或下肢伸展，保持自然呼吸。','柔軟度活動可作為日常活動的一部分；避免彈震或勉強拉伸。'],
      ['久坐中斷觀察','記錄起身活動次數','設定提醒，在方便時起身走動或做坐姿活動一次，累計今天次數。','WHO 建議限制久坐並以活動取代；沒有適用所有人的固定中斷間隔。'],
      ['家務也算活動','記錄家務活動分鐘數','選擇安全的打掃、整理或園藝活動並記錄實際分鐘。','家務屬身體活動，但強度不一定達中等強度，也不能只憑家務分鐘推定已達有氧活動建議；依實際感受記錄。'],
      ['坐姿活動練習','記錄動作與分鐘數','坐穩後做抬膝、踝泵或手臂活動，選擇無痛且適合的動作。','行動受限者仍可按能力活動；若有醫囑限制先諮詢醫療人員。'],
      ['暖身與緩和','記錄暖身及緩和分鐘數','在活動前後安排舒適的慢走或關節活動並記錄時間。','暖身與緩和可協助平順進入或結束活動；時間依自身情況安排。'],
      ['找一種喜歡的有氧','記錄活動種類與分鐘數','從走路、騎乘、舞蹈或水中活動擇一，記錄實際參與時間。','可持續且喜歡的活動較容易融入生活；強度與種類須符合安全能力。'],
      ['安排活動時段','記錄預定時段與實際分鐘','在行事曆選一個可行時段；完成後補記實際活動時間。','計畫只算進行中；實際完成並確認後才列入任務成果。'],
      ['一週活動回顧','記錄本週活動天數及總分鐘','回看一週活動紀錄，填入活動日數與分鐘總數，不評價好壞。','WHO 成人建議可分散於一週；健康趨勢用於自我觀察，不等於風險評估。'],
      ['安全情境檢查','記錄活動前安全檢查項目數','開始前確認地面、鞋具、支撐與身體狀態，記錄已確認項目數。','心血管或慢性病患者依醫療建議調整；若出現警訊要停止並求助。']
    ],
    salt:[
      ['每日鈉攝取選填紀錄','記錄估計鈉毫克數或選「未估算」','若食品標示資料足夠，可記錄鈉毫克；不確定時可只記錄來源與餐次。','台灣成人一般建議每日鈉不超過 2400 毫克（食鹽約 6 克）；WHO 成人建議低於 2000 毫克。個人處方另計。'],
      ['營養標示找鈉','記錄每份鈉毫克數與每包份數','挑一件包裝食品，抄下每份鈉與每包份數，注意實際食用量。','鈉攝取需把天然食物、加工食品和調味料一起考量。'],
      ['鈉與食鹽換算練習','記錄鈉毫克數及換算結果','用食鹽約等於鈉 2.5 倍作為概算，並註明只是估算。','國健署成人建議 2400 毫克鈉約相當 6 克鹽；標示與換算均為近似值。'],
      ['醬油少量使用','記錄使用的調味次數或茶匙數','先用小碟分裝醬油或沾醬，記錄實際使用量；不需刻意完全不吃。','醬油、醬料也是鈉來源；個人鈉處方以醫療團隊指示為準。'],
      ['沾醬另放','記錄一次外食選擇','點餐時請醬料另放，實際依口味少量使用並記錄。','調味分開有助自己掌握用量；不等於餐點整體鈉含量已知。'],
      ['外食少湯選項','記錄今天是否喝完湯','外食時觀察湯品是否偏鹹，可選擇少喝湯並記錄。','湯汁可能含較多鈉；不應把喝水量或湯量建議套用腎病患者。'],
      ['加工食品辨識','記錄今天辨認的品項數','查看一項加工肉品、醃漬物或即食食品標示，記錄鈉含量或未標示。','加工食品可能是鈉來源之一；需綜合整體飲食判斷。'],
      ['香草辛香料替代','記錄使用的天然香料種類','用蔥、蒜、薑、檸檬或香草增添風味，並記錄種類。','天然調味可幫助增加風味；仍需注意加工醬料或調味粉可能含鈉。'],
      ['同類產品比鈉','記錄比較品項數與選擇','選兩件份量單位相同的產品比較鈉，記下每份量及每份鈉。','比較前先核對每份量；較低鈉不代表可以不限量食用。'],
      ['留意調味包','記錄是否使用整包','查看泡麵或即食食品調味包用量，記錄使用全包、部分或未使用。','調味包常是額外鈉來源；此練習不宣稱能精算整餐鈉含量。'],
      ['低鈉烹調嘗試','記錄一道料理及調味變化','烹調時先以食材原味、香料調味，再按需要少量加入鹽或醬料。','烹調方式可協助掌握調味；腎臟病與心衰竭等族群依個別處方。'],
      ['菜單先看再點','記錄比較過的餐點數','點餐前看菜名或詢問醬汁、湯底、加工配料，選一個較能掌握調味的選項。','外食資訊有限時不必猜測鈉數字，可記錄自己詢問或選擇了什麼。'],
      ['醃漬食品觀察','記錄品項及食用份量','查看醃漬物標示或記錄當餐食用份量，並注意搭配其他來源。','醃漬食物可能含鈉；不必採取極端禁食，按個人飲食建議調整。'],
      ['一日鈉來源盤點','記錄至少三種可能來源','回想一天飲食，標出天然食物、調味料、加工食品中的鈉來源。','總鈉不只來自餐桌鹽；估算不完整時應標示為粗略紀錄。'],
      ['下一餐低鈉目標','寫下一項可執行調味目標','例如「醬料另放」或「先嚐味再加鹽」；完成後另行確認。','一般成人參考值不等於每位慢性病患者的治療目標。']
    ],
    sleep:[
      ['睡眠時數日誌','記錄昨夜估計睡眠小時數','記錄大約入睡、起床與估計睡眠時數；不需追求精確到分鐘。','AASM/SRS 2015 共識建議 18–60 歲成人規律每晚至少 7 小時；其他年齡需求不同。'],
      ['固定起床時間觀察','記錄起床時間及與平日差異','選一個可行起床時間，記錄實際起床時間；不以打卡要求改變醫囑。','規律作息可作為自我觀察方向；輪班、照顧責任或疾病會影響可行性。'],
      ['睡前手機安放','記錄睡前停止滑手機的分鐘','睡前把手機放到伸手不易拿到處，記錄距離上床前多久停止使用。','本任務追蹤個人習慣，沒有宣稱所有人必須採用相同禁用時長。'],
      ['睡前放鬆選一項','記錄放鬆活動與分鐘數','選擇閱讀、舒展、緩慢呼吸或安靜音樂，記錄實際分鐘。','放鬆活動是生活練習，不是失眠治療或醫療替代。'],
      ['睡眠環境巡視','完成環境檢查項目數','睡前檢查光線、噪音、溫度與床鋪舒適度，記錄改善項數。','環境偏好因人而異；不需要購買特定設備。'],
      ['下午咖啡因覺察','記錄含咖啡因飲品時間與杯數','記錄茶、咖啡、能量飲品的飲用時間和杯數，觀察與睡眠感受的關係。','咖啡因反應與代謝不同；此任務用於觀察，不設定人人相同的停用時刻。'],
      ['睡前情緒卸載','記錄寫下的煩惱或待辦項目數','花一小段時間寫下待辦或擔心，並選一件明日可處理的小事。','書寫是自我整理方法；持續焦慮或情緒困擾可尋求專業協助。'],
      ['睡眠品質自評','用 1–5 分記錄醒來感受','起床後用 1（很差）至 5（很好）記錄主觀睡眠感受，留意連續變化。','主觀評分不是診斷；若持續疲倦或睡不好，請諮詢醫療人員。'],
      ['白天精神觀察','記錄精神程度 1–5 分','下午選一個固定時段，為精神狀態打 1–5 分並記下明顯疲勞。','分數只供個人趨勢觀察，不能用來判斷睡眠疾病。'],
      ['週末作息回顧','記錄平日與休假起床時間','比較最近一個平日和休假日起床時間，觀察差異而不責備自己。','作息受工作與照顧因素影響；以可行的規律化為目標。'],
      ['睡前光線調整','記錄調整的環境項目數','睡前調暗室內燈光或選擇較安靜的活動，記錄採取的項目。','此為睡眠環境自我照護點子，不是正式治療處方。'],
      ['睡眠干擾源辨識','記錄一個可能干擾因素','回想夜間噪音、疼痛、照護或工作等因素，記下一項可能影響睡眠的情境。','辨識原因不等於能自行診斷；持續困擾可與專業人員討論。'],
      ['白天小休息紀錄','記錄休息時間及醒後感受','需要休息時記下大約時段及醒後精神，不因任務而減少必要休息。','休息需求因人而異；若白天嗜睡嚴重應尋求醫療評估。'],
      ['建立睡前流程','記錄完成的流程步驟數','選兩三個容易重複的小步驟，如盥洗、整理明日物品、閱讀，完成後記錄。','流程因生活型態而異，目標是可持續，不是必須照固定清單。'],
      ['一週睡眠趨勢回看','記錄本週日誌天數與平均時數','回看最近七天的睡眠日誌，記錄有資料的天數與估計平均時數。','平均值是自我追蹤，不是診斷；若長期不適請尋求專業協助。']
    ]
  };
  const levelFor=i=>i<5?1:i<10?2:3;
  const levelText={1:'Level 1｜入門養成',2:'Level 2｜持續改善',3:'Level 3｜健康維持'};
  const verbs={1:'先觀察一次，從不費力的小步驟開始。',2:'在一週中重複練習並留下紀錄。',3:'持續追蹤趨勢，找到適合長期維持的方法。'};
  const tasks=[];
  Object.entries(rows).forEach(([theme,list])=>list.forEach((r,i)=>{
    const info=themeInfo[theme],source=sources[info.src];
    let frequency=i<5?'今日一次；可在不同日重複練習':i<10?'每週練習 2–3 次或依生活安排':'每週回顧一次；實踐日可自行選擇';
    let method=r[2]+' '+verbs[levelFor(i)];
    let src=source;
    if(theme==='move'&&(i===2||i===4||i===5||i===13))src=sources.physicalHpa;
    if(theme==='salt'&&(i===0||i===2))src=sources.sodiumWho;
    if(theme==='food'&&(i===10||i===11))src=sources.foodLabels;
    if(theme==='salt'&&(i===1||i===8||i===9))src=sources.foodLabels;
    if(theme==='food'&&i===7)src=sources.healthyDiet;
    if(theme==='sleep')src=i===0?sources.sleep:i===7||i===8||i===14?sources.sleepDiary:sources.sleepHabits;
    tasks.push({id:theme+'_'+String(i+1).padStart(2,'0'),theme,title:r[0],description:r[3],method,frequency,metric:r[1],education:r[3],source:src.name,sourceYear:src.year,url:src.url,references:[{name:src.name,year:src.year,url:src.url}],standardType:'B',standardNote:'此項量化門檻為 PWA 自行設計的習慣養成目標，不是醫療標準。',applicability:'一般成人生活習慣教育；特定疾病或飲食限制者依醫療團隊建議。',caution:info.caution,level:levelFor(i),reward:'完成並主動確認後，首次種下一棵樹苗並獲 4 XP（同日同主題只計一次）。'});
  }));
  const sugarTask=tasks.find(x=>x.id==='food_12');if(sugarTask)sugarTask.references.push({name:sources.ingredientLabels.name,year:sources.ingredientLabels.year,url:sources.ingredientLabels.url});
  const formalStandards={
    food_01:{source:sources.food,note:'國健署「我的餐盤」以全穀雜糧、豆魚蛋肉、乳品、蔬菜、水果、油脂與堅果種子六大類呈現飲食概念（2018）。任務的 0–6 類只是自我觀察。'},
    food_02:{source:sources.food,note:'國健署「我的餐盤」的口訣為菜比水果多一點（2018）；任務記錄餐次是自我追蹤，不是疾病處方。'},
    food_03:{source:sources.food,note:'國健署「我的餐盤」以水果拳頭大小作為一般成人視覺份量參考（2018），各人實際需求可能不同。'},
    move_03:{source:sources.move,note:'WHO 2020 指引：成人每週 150–300 分鐘中等強度有氧活動，或等量組合；慢性病或能力限制者需個別調整。'},
    move_05:{source:sources.move,note:'WHO 2020 指引：成人每週至少 2 天進行涵蓋主要肌群的肌力活動。此為一般成人群體建議。'},
    salt_01:{source:sources.salt,note:'台灣國健署一般成人鈉建議每日不超過 2,400 mg（食鹽約 6 g）；WHO 成人群體建議低於 2,000 mg 鈉（食鹽低於 5 g）。兩者是群體指引，不是個人處方。',extra:sources.sodiumWho},
    salt_03:{source:sources.sodiumWho,extra:sources.salt,note:'WHO 2012 成人群體基準為鈉低於 2,000 mg，相當食鹽低於 5 g；國健署台灣成人一般建議為 2,400 mg／6 g。兩者分開呈現；鈉與食鹽換算為近似值，個人處方優先。'},
    sleep_01:{source:sources.sleep,note:'AASM/SRS 2015 共識適用 18–60 歲成人，建議規律每晚至少 7 小時；不套用於其他年齡或個別疾病。'}
  };
  for(const [id,entry] of Object.entries(formalStandards)){const t=tasks.find(x=>x.id===id);if(!t)continue;t.standardType='A';t.standardNote=entry.note;t.source=entry.source.name;t.sourceYear=entry.source.year;t.url=entry.source.url;t.references=[entry.source,...(entry.extra?[entry.extra]:[])].map(x=>({name:x.name,year:x.year,url:x.url}));}
  const labels={food:'均衡飲食',move:'身體活動',salt:'少一點鈉',sleep:'睡眠與休息'};
  const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const datePattern=/^\d{4}-\d{2}-\d{2}$/;
  const dateKey=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;};
  const todayKey=()=>dateKey(new Date());
  const taskById=id=>tasks.find(t=>t.id===id);
  const dailyThemes=['food','move','salt','sleep'];
  function validDate(value){if(typeof value!=='string'||!datePattern.test(value))return false;const d=new Date(value+'T00:00:00');return Number.isFinite(d.getTime())&&dateKey(d)===value;}
  function plainObject(v){if(!v||typeof v!=='object'||Array.isArray(v)||Object.prototype.toString.call(v)!=='[object Object]')return false;const proto=Object.getPrototypeOf(v);return proto===null||proto.constructor?.name==='Object';}
  function asCount(v,label){if(!Number.isSafeInteger(v)||v<0)throw Error(`${label} 必須是 0 以上整數`);return v;}
  function normalizeTaskRecords(input){if(!Array.isArray(input))throw Error('任務紀錄必須是陣列');const seen=new Set(),dailyTheme=new Set();return input.map((r,i)=>{if(!plainObject(r))throw Error(`第 ${i+1} 筆任務紀錄格式錯誤`);const t=taskById(r.taskId);if(!t)throw Error(`第 ${i+1} 筆任務 ID 不存在`);if(r.theme!==t.theme)throw Error(`第 ${i+1} 筆主題與任務 ID 不相符`);if(!validDate(r.date))throw Error(`第 ${i+1} 筆任務日期無效`);if(!['completed','cancelled'].includes(r.status))throw Error(`第 ${i+1} 筆任務狀態無效`);const rewardVersion=r.rewardVersion===1?1:0,key=r.date+'|'+t.id,themeKey=r.date+'|'+t.theme;if(seen.has(key)||(rewardVersion===1&&dailyTheme.has(themeKey)))throw Error(`同日任務重複：${themeKey}`);seen.add(key);if(rewardVersion===1)dailyTheme.add(themeKey);if(r.note!==undefined&&(typeof r.note!=='string'||r.note.length>160))throw Error(`第 ${i+1} 筆筆記格式錯誤`);const treeAwarded=r.status==='completed'&&r.treeAwarded===true,xpAwarded=r.status==='completed'&&Number.isSafeInteger(r.xpAwarded)&&r.xpAwarded===4?4:false;if(rewardVersion===1&&r.status==='completed'&&(!treeAwarded||!xpAwarded))throw Error(`第 ${i+1} 筆獎勵帳目不完整`);if(r.status==='cancelled'&&(r.treeAwarded===true||r.xpAwarded===4))throw Error(`第 ${i+1} 筆取消任務仍保留獎勵`);return {key,date:r.date,taskId:t.id,theme:t.theme,title:t.title,status:r.status,rewardVersion,completedAt:typeof r.completedAt==='string'&&r.completedAt.length<40?r.completedAt:r.date+'T12:00:00.000Z',cancelledAt:r.status==='cancelled'&&typeof r.cancelledAt==='string'?r.cancelledAt:undefined,note:typeof r.note==='string'?r.note:'',treeAwarded,xpAwarded};});}
  function normalizeSelections(value){if(!plainObject(value))throw Error('自選任務資料格式錯誤');const result={};for(const [day,choices] of Object.entries(value)){if(!validDate(day)||!plainObject(choices))throw Error('自選任務日期或內容格式錯誤');const row={};for(const [theme,id] of Object.entries(choices)){const t=taskById(id);if(!dailyThemes.includes(theme)||!t||t.theme!==theme)throw Error(`自選任務 ID／主題錯誤：${id}`);row[theme]=id;}result[day]=row;}return result;}
  function normalizeMetrics(value){if(!plainObject(value))throw Error('每日數據格式錯誤');const result={activity:{},sleep:{},sodium:{}};for(const type of Object.keys(result)){const input=value[type]??{};if(!plainObject(input))throw Error(`${type} 紀錄格式錯誤`);for(const [day,n] of Object.entries(input)){if(!validDate(day)||typeof n!=='number'||!Number.isFinite(n)||n<0)throw Error(`${type} 日期或數值無效`);const max={activity:1440,sleep:24,sodium:20000}[type];if(n>max)throw Error(`${type} 數值超出可記錄範圍`);result[type][day]=n;}}return result;}
  function normalizeHabitSystem(value){if(!plainObject(value))throw Error('健康任務資料格式錯誤');const level=Number(value.level||1);if(![1,2,3].includes(level))throw Error('任務難度必須為 Level 1、2 或 3');return {version:1,legacyTrees:asCount(value.legacyTrees??0,'舊版小島樹木'),records:normalizeTaskRecords(value.records??[]),selections:normalizeSelections(value.selections??{}),level,metrics:normalizeMetrics(value.metrics??{activity:{},sleep:{},sodium:{}})};}
  function preserveRecovery(s,key,value){if(!plainObject(s.ckmRecoveryData))s.ckmRecoveryData={};if(!Object.prototype.hasOwnProperty.call(s.ckmRecoveryData,key))s.ckmRecoveryData[key]=value;}
  function emptyHabitSystem(legacyTrees,level=1){return {version:1,legacyTrees,records:[],selections:{},level,metrics:{activity:{},sleep:{},sodium:{}}};}
  function migrate(){
    const s=typeof window.ckmState==='function'?window.ckmState():null;if(!s||!plainObject(s))return null;let changed=false;
    if(!plainObject(s.passport)){if(s.passport!==undefined)preserveRecovery(s,'passport',s.passport);s.passport={};changed=true;}const p=s.passport;
    if(!Number.isSafeInteger(s.trees)||s.trees<0){if(s.trees!==undefined)preserveRecovery(s,'trees',s.trees);s.trees=0;changed=true;}
    if(!plainObject(s.days)){if(s.days!==undefined)preserveRecovery(s,'days',s.days);s.days={};changed=true;}
    if(!Number.isSafeInteger(p.xp)||p.xp<0){if(p.xp!==undefined)preserveRecovery(s,'passportXp',p.xp);p.xp=0;changed=true;}
    if(!Object.prototype.hasOwnProperty.call(p,'goal')){p.goal=null;changed=true;}
    if(!s.habitSystem){
      const legacy={habitRecords:p.habitRecords,habitSelections:p.habitSelections,habitMetrics:p.habitMetrics,habitLevel:p.habitLevel};
      try{const records=Array.isArray(p.habitRecords)?p.habitRecords:[],validOld=records.filter(r=>r&&taskById(r.taskId)&&r.theme===taskById(r.taskId).theme&&validDate(r.date)&&['completed','cancelled'].includes(r.status)),oldAwards=validOld.filter(r=>r.status==='completed'&&r.treeAwarded===true).length,normalized=normalizeTaskRecords(validOld.map(r=>({...r,rewardVersion:0,treeAwarded:r.treeAwarded===true,xpAwarded:false})));s.habitSystem={version:1,legacyTrees:Math.max(0,s.trees-oldAwards),records:normalized,selections:normalizeSelections(p.habitSelections||{}),level:[1,2,3].includes(Number(p.habitLevel))?Number(p.habitLevel):1,metrics:normalizeMetrics(p.habitMetrics||{activity:{},sleep:{},sodium:{}})};}
      catch(error){preserveRecovery(s,'legacyHabitData',legacy);s.habitSystem=emptyHabitSystem(s.trees);}
      changed=true;
    }else{
      try{const before=JSON.stringify(s.habitSystem);s.habitSystem=normalizeHabitSystem(s.habitSystem);if(JSON.stringify(s.habitSystem)!==before)changed=true;}
      catch(error){preserveRecovery(s,'habitSystem',s.habitSystem);s.habitSystem=emptyHabitSystem(s.trees);changed=true;}
    }
    for(const key of ['habitRecords','habitSelections','habitMetrics','habitLevel'])if(Object.prototype.hasOwnProperty.call(p,key)){delete p[key];changed=true;}
    if(s.trees!==s.habitSystem.legacyTrees){s.trees=s.habitSystem.legacyTrees;changed=true;}
    if(changed){if(typeof window.ckmSave==='function')window.ckmSave();else if(typeof window.save==='function')window.save();}return s;
  }
  function state(){return migrate();}
  function persist(){if(typeof window.ckmSave==='function')window.ckmSave();else if(typeof window.save==='function')window.save();}
  function commitOrRollback(snapshot){try{persist();return true;}catch(error){if(typeof window.ckmRestoreState==='function')window.ckmRestoreState(JSON.parse(snapshot));alert('瀏覽器無法儲存資料，這次操作已復原。請檢查本機儲存空間或瀏覽器設定。');return false;}}
  function selectedTask(theme,day,level,hs){const chosen=hs.selections[day]?.[theme],custom=taskById(chosen);if(custom&&custom.theme===theme&&custom.level===level)return custom;const choices=tasks.filter(t=>t.theme===theme&&t.level===level);let hash=0;for(const c of day)hash=(hash*31+c.charCodeAt(0))>>>0;return choices[(hash+({food:0,move:7,salt:13,sleep:19}[theme]))%choices.length];}
  function referencesMarkup(t){return `<div class="habit-sources">${t.references.map(ref=>`<a href="${htmlEscape(ref.url)}" target="_blank" rel="noopener">${htmlEscape(ref.name)}（${htmlEscape(ref.year)}）↗</a>`).join('')}</div>`;}
  function completedRecord(hs,day,id){return hs.records.find(r=>r.date===day&&r.taskId===id&&r.status==='completed');}
  function themeChecked(hs,day,theme){return hs.records.some(r=>r.date===day&&r.theme===theme);}
  function streakDays(hs){const active=new Set(hs.records.filter(r=>r.status==='completed').map(r=>r.date));let d=new Date(),n=0;if(!active.has(dateKey(d)))d.setDate(d.getDate()-1);while(active.has(dateKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
  function summaryMarkup(hs){const now=new Date(),day=todayKey(),w=new Date(now);w.setDate(w.getDate()-6);const weekStart=dateKey(w),monthStart=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`,active=hs.records.filter(r=>r.status==='completed'),week=active.filter(r=>r.date>=weekStart&&r.date<=day),month=active.filter(r=>r.date>=monthStart&&r.date<=day),days=new Set(active.map(r=>r.date));
    const bars=Object.keys(labels).map(k=>{const n=new Set(week.filter(r=>r.theme===k).map(r=>r.date)).size,pct=Math.round(n/7*100);return `<div class="habit-bar"><span>${labels[k]}</span><div class="habit-progress"><span style="width:${pct}%"></span></div><b>${pct}%</b></div>`;}).join('');
    const daily=Array.from({length:7},(_,i)=>{const d=new Date(now);d.setDate(d.getDate()-6+i);const key=dateKey(d),n=active.filter(r=>r.date===key).length;return `<div class="habit-bar"><span>${key.slice(5)}</span><div class="habit-progress"><span style="width:${Math.min(100,n*25)}%"></span></div><b>${n}</b></div>`;}).join('');
    const monthly=Array.from({length:4},(_,i)=>{const end=new Date(now);end.setDate(end.getDate()-7*(3-i));const start=new Date(end);start.setDate(start.getDate()-6);const a=dateKey(start),b=dateKey(end),n=active.filter(r=>r.date>=a&&r.date<=b).length;return `<div class="habit-bar"><span>${a.slice(5)}–${b.slice(5)}</span><div class="habit-progress"><span style="width:${Math.min(100,n/28*100)}%"></span></div><b>${n}</b></div>`;}).join('');
    const sum=(type,min,max)=>Object.entries(hs.metrics[type]).filter(([d])=>d>=weekStart&&d<=day).map(([,v])=>v).filter(v=>v>=min&&v<=max);const act=sum('activity',0,1440).reduce((a,b)=>a+b,0),sleep=sum('sleep',0,24),sodium=sum('sodium',0,20000),sleepAvg=sleep.length?(sleep.reduce((a,b)=>a+b,0)/sleep.length).toFixed(1):'—',sodiumAvg=sodium.length?Math.round(sodium.reduce((a,b)=>a+b,0)/sodium.length):'—';
    const themeDates=k=>new Set(active.filter(r=>r.theme===k).map(r=>r.date)).size;
    return `<div class="habit-columns"><div class="habit-box"><h3>🌲 森林成長與本週進度</h3><div class="habit-statrow"><span class="habit-pill">連續打卡 ${streakDays(hs)} 天</span><span class="habit-pill">本週 ${week.length} 項</span><span class="habit-pill">本月 ${month.length} 項</span><span class="habit-pill">健康任務樹 ${active.length} 棵</span><span class="habit-pill">活動 ${act} 分鐘／週</span><span class="habit-pill">睡眠均值 ${sleepAvg} 小時／週</span><span class="habit-pill">鈉均值 ${sodiumAvg} mg／週（選填）</span></div><p class="habit-forest" aria-label="健康任務森林成長">${'🌱'.repeat(Math.min(12,active.length))}${Object.keys(labels).some(k=>themeDates(k)>=3)?'🌿':''}${Object.keys(labels).some(k=>themeDates(k)>=7)?'🌳':''}${Object.keys(labels).every(k=>themeDates(k)>=7)?'🌳🌳🌳':''}${streakDays(hs)>=28?'🏅':''}</p><p class="small">每筆首次完成種一株苗；同主題累積 3 個不同日期成長樹苗、7 天成為大樹；四主題各累積 7 天解鎖森林；連續 28 天每日完成至少一項可獲徽章。這些是遊戲里程碑。</p></div><div class="habit-box"><h3>四主題｜本週完成率</h3><div class="habit-chart">${bars}</div><p class="small">以每主題 7 個日曆日為遊戲統計基準，非醫療依從率。</p></div></div><div class="habit-columns"><div class="habit-box"><h3>近七日完成趨勢</h3><div class="habit-chart">${daily}</div></div><div class="habit-box"><h3>近四週趨勢</h3><div class="habit-chart">${monthly}</div><p class="small">數據由你輸入；空白表示未紀錄，不代表零攝取或零睡眠。</p></div></div>`;}
  function bind(root){if(root.dataset.bound)return;root.dataset.bound='1';root.addEventListener('click',event=>{const el=event.target.closest('[data-action]');if(!el)return;const act=el.dataset.action;if(act==='complete')complete(el.dataset.taskId);else if(act==='cancel')cancel(el.dataset.recordKey);else if(act==='choose')choose(el.dataset.taskId);else if(act==='export')exportData();else if(act==='import')importData();});root.addEventListener('change',event=>{const el=event.target;if(el.matches('[data-action="level"]'))level(el.value);else if(el.matches('[data-action="filter"]')||el.matches('[data-action="filter-level"]'))library();else if(el.matches('[data-action="metric"]'))metric(el.dataset.metricType,el.value);else if(el.matches('[data-action="note"]'))note(el.dataset.recordKey,el.value);});}
  function render(){const root=document.getElementById('habit-system');if(!root)return;bind(root);const s=state();if(!s)return;const hs=s.habitSystem,day=todayKey(),level=hs.level,recoveryNotice=(s.ckmRecoveryData||s.storageRecoveryRaw)?'<div class="habit-notice" role="alert"><b>本機資料格式提醒：</b>部分舊資料無法讀取，原始資料已保留在完整備份的復原欄位；目前以安全預設值繼續。請先匯出完整備份，再聯絡管理者協助檢視。資料不會上傳。</div>':'';const todays=dailyThemes.map(theme=>{const t=selectedTask(theme,day,level,hs),done=themeChecked(hs,day,theme);const classification=t.standardType==='A'?'A｜正式指引標準':t.metricType==='C'?'C｜使用者紀錄':'B｜PWA習慣養成目標';return `<article class="habit-card"><div class="habit-meta"><span class="habit-pill">${themeInfo[theme].icon} ${labels[theme]}</span><span class="habit-pill">${levelText[t.level]}</span>${hs.selections[day]?.[theme]===t.id?'<span class="habit-pill">自選任務</span>':''}<span class="habit-pill">${classification}</span></div><h3>${htmlEscape(t.title)}</h3><p>${htmlEscape(t.description)}</p><details><summary>完整任務規格與健康知識</summary><p><b>執行方法：</b>${htmlEscape(t.method)}</p><p><b>建議頻率：</b>${htmlEscape(t.frequency)}（任務節奏，非個人醫療處方）</p><p><b>A｜正式醫學／公共衛生指引：</b>${t.standardType==="A"?htmlEscape(t.standardNote):"此任務沒有額外的數值醫療門檻。"}</p><p><b>B｜PWA 習慣養成目標：</b>${htmlEscape(t.metric)}（系統自訂追蹤方式，非指引處方）</p><p><b>C｜使用者紀錄：</b>活動分鐘、睡眠時數、鈉估值及任務筆記為使用者自填或估算，非檢驗數據。</p><p><b>健康知識：</b>${htmlEscape(t.education)}</p><p><b>適用對象：</b>${htmlEscape(t.applicability)}</p><p><b>注意事項：</b>${htmlEscape(t.caution)}</p><p><b>種樹獎勵：</b>首次完成 1 棵健康任務樹 + 4 XP；同一日期、同主題只計一次。</p>${referencesMarkup(t)}</details><button class="btn ${done?'ghost':'primary'}" data-action="complete" data-task-id="${t.id}" ${done?'disabled':''}>${done?'今日該主題已完成 ✓':'實際完成後確認並種樹'}</button>${theme==='move'?`<label>今日活動分鐘（C｜自填）<input type="number" min="0" max="1440" value="${hs.metrics.activity[day]??''}" data-action="metric" data-metric-type="activity"></label>`:''}${theme==='salt'?`<label>今日估計鈉毫克（C｜自填／選填）<input type="number" min="0" max="20000" value="${hs.metrics.sodium[day]??''}" data-action="metric" data-metric-type="sodium"></label>`:''}${theme==='sleep'?`<label>昨夜睡眠小時（C｜自填）<input type="number" min="0" max="24" step="0.1" value="${hs.metrics.sleep[day]??''}" data-action="metric" data-metric-type="sleep"></label>`:''}</article>`;}).join('');
    const history=hs.records.slice().reverse().slice(0,100).map(r=>`<div class="habit-record"><div><span>${htmlEscape(r.date)}｜${themeInfo[r.theme].icon} ${htmlEscape(r.title)}｜${r.status==='completed'?'已完成':'已取消'}</span><label class="small">每日補充筆記（C｜自填）<input maxlength="160" value="${htmlEscape(r.note)}" data-action="note" data-record-key="${htmlEscape(r.key)}" placeholder="例如：做法或感受"></label></div>${r.status==='completed'?`<span class="habit-history-buttons"><button class="habit-cancel" data-action="cancel" data-record-key="${htmlEscape(r.key)}">取消紀錄</button></span>`:''}</div>`).join('')||'<p class="habit-empty">尚無任務紀錄。</p>';
    root.innerHTML=`<div class="wrap"><div class="sectionHead"><div class="eyebrow">HEALTHY HABIT TREE PLAN · V3.1.1</div><h2>健康生活種樹計畫｜60 項循序任務</h2><p>每天四個主題各有一項穩定輪替任務，也可自選同難度任務。選擇是計畫，實際執行後再確認完成。</p></div>${recoveryNotice}<div class="habit-notice"><b>健康安全提醒：</b>此系統提供一般衛教與習慣追蹤，不診斷、不取代醫療。腎臟病患者的蛋白質、鉀、磷、水分與鈉目標需個別化；心血管疾病、高血壓或其他慢性病族群請依醫療團隊建議調整活動與飲食。使用含鉀代鹽前應先詢問醫療人員。</div><div class="habit-controls"><label>任務難度　<select data-action="level"><option value="1" ${level===1?'selected':''}>Level 1｜入門養成</option><option value="2" ${level===2?'selected':''}>Level 2｜持續改善</option><option value="3" ${level===3?'selected':''}>Level 3｜健康維持</option></select></label><span class="habit-pill">${day}｜同日任務固定</span><button class="btn ghost" data-action="export">匯出完整備份</button><button class="btn ghost" data-action="import">匯入備份</button></div><p class="small">A 正式指引標準｜B 系統自訂習慣目標｜C 使用者自填紀錄；三者分開標示。所有健康紀錄只存在此瀏覽器。</p><div class="habit-grid">${todays}</div>${summaryMarkup(hs)}<div class="habit-box"><details class="habit-library-toggle"><summary>📚 四主題任務資料庫（60 項）｜展開探索與自選任務</summary><div class="habit-library-content"><div class="habit-controls"><label>主題　<select data-action="filter"><option value="all">全部主題</option>${Object.entries(labels).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>難度　<select data-action="filter-level"><option value="all">全部難度</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option></select></label></div><div id="habitLibrary" class="habit-grid"></div></div></details></div><div class="habit-box" style="margin-top:18px"><h3>📝 過往任務及筆記</h3><p class="small">取消會撤回此紀錄新增的樹與 XP，保留取消軌跡；已完成或已取消的主題當日不可再次領獎。</p><div>${history}</div></div><div class="habit-sources"><h3>醫學指引與官方來源</h3>${Object.values(sources).map(src=>`<a href="${src.url}" target="_blank" rel="noopener">${htmlEscape(src.name)} ↗</a>`).join('')}</div></div>`;library();}
  function library(){const host=document.getElementById('habitLibrary');if(!host)return;const theme=host.parentElement.querySelector('[data-action="filter"]').value,lv=host.parentElement.querySelector('[data-action="filter-level"]').value;host.innerHTML=tasks.filter(t=>(theme==='all'||t.theme===theme)&&(lv==='all'||t.level===Number(lv))).map(t=>`<article class="habit-card"><div class="habit-meta"><span class="habit-pill">${themeInfo[t.theme].icon} ${labels[t.theme]}</span><span class="habit-pill">${levelText[t.level]}</span><span class="habit-pill">${t.standardType==='A'?'A｜正式指引':t.metricType==='C'?'C｜自填':'B｜自訂目標'}</span></div><h3>${htmlEscape(t.title)}</h3><p>${htmlEscape(t.description)}</p><details><summary>完整任務規格</summary><p><b>執行方法：</b>${htmlEscape(t.method)}</p><p><b>建議頻率：</b>${htmlEscape(t.frequency)}（非個人處方）</p><p><b>A｜正式指引：</b>${t.standardType==="A"?htmlEscape(t.standardNote):"本任務未訂醫療數值門檻。"}</p><p><b>B｜系統自訂習慣目標：</b>${htmlEscape(t.metric)}（不是醫療標準）</p><p><b>C｜使用者紀錄：</b>日誌、筆記及可選數據為自填或估算。</p><p><b>健康知識：</b>${htmlEscape(t.education)}</p><p><b>適用對象：</b>${htmlEscape(t.applicability)}</p><p><b>注意事項：</b>${htmlEscape(t.caution)}</p><p><b>獎勵：</b>首次完成 1 棵健康任務樹 + 4 XP。</p>${referencesMarkup(t)}</details><button class="btn ghost" data-action="choose" data-task-id="${t.id}">安排為今日任務</button></article>`).join('');}
  function level(value){const s=state();if(!s)return;const levelValue=Number(value);if(![1,2,3].includes(levelValue))return;const snapshot=JSON.stringify(s),hs=s.habitSystem,day=todayKey();hs.level=levelValue;const row=hs.selections[day];if(row)for(const [theme,id] of Object.entries(row)){const t=taskById(id);if(!t||t.level!==levelValue||themeChecked(hs,day,theme))delete row[theme];}if(!commitOrRollback(snapshot)){render();return;}render();}
  function choose(id){const s=state(),t=taskById(id);if(!s||!t)return;const hs=s.habitSystem,day=todayKey();if(t.level!==hs.level){alert('請先切換到這項任務的難度，再安排。');return;}if(themeChecked(hs,day,t.theme)){alert('這個主題今天已有完成或取消紀錄；可在歷史查看。');return;}const snapshot=JSON.stringify(s);if(!hs.selections[day])hs.selections[day]={};hs.selections[day][t.theme]=t.id;if(!commitOrRollback(snapshot)){render();return;}render();document.getElementById('habit-system')?.scrollIntoView({behavior:'smooth',block:'start'});}
  function complete(id){const s=state(),t=taskById(id);if(!s||!t)return;const hs=s.habitSystem,day=todayKey(),key=day+'|'+id;if(themeChecked(hs,day,t.theme))return;if((hs.selections[day]?.[t.theme]||selectedTask(t.theme,day,hs.level,hs).id)!==id)return;const snapshot=JSON.stringify(s),r={key,date:day,taskId:t.id,theme:t.theme,title:t.title,status:'completed',rewardVersion:1,completedAt:new Date().toISOString(),note:'',treeAwarded:true,xpAwarded:4};hs.records.push(r);s.passport.xp+=4;if(!commitOrRollback(snapshot)){render();return;}render();if(typeof window.renderIsland==='function')window.renderIsland();if(typeof window.renderPassport==='function')window.renderPassport();}
  function cancel(key){const s=state();if(!s||!confirm('取消這筆任務並撤回它新增的樹木與 XP？取消軌跡會保留，當日不可再次領獎。'))return;const r=s.habitSystem.records.find(x=>x.key===key);if(!r||r.status!=='completed')return;const snapshot=JSON.stringify(s);r.status='cancelled';r.cancelledAt=new Date().toISOString();if(r.treeAwarded)r.treeAwarded=false;if(r.xpAwarded){s.passport.xp=Math.max(0,s.passport.xp-r.xpAwarded);r.xpAwarded=false;}if(!commitOrRollback(snapshot)){render();return;}render();if(typeof window.renderIsland==='function')window.renderIsland();if(typeof window.renderPassport==='function')window.renderPassport();}
  function note(key,value){const s=state(),r=s?.habitSystem.records.find(x=>x.key===key);if(!r)return;const snapshot=JSON.stringify(s);r.note=String(value).slice(0,160);if(!commitOrRollback(snapshot))render();}
  function metric(type,value){const s=state(),hs=s?.habitSystem;if(!hs||!['activity','sleep','sodium'].includes(type))return;const snapshot=JSON.stringify(s),day=todayKey(),n=Number(value),max={activity:1440,sleep:24,sodium:20000}[type];if(value===''||!Number.isFinite(n)||n<0||n>max){delete hs.metrics[type][day];}else hs.metrics[type][day]=n;if(!commitOrRollback(snapshot)){render();return;}render();}
  function backupEnvelope(){const s=state();return {appId:'CKM-Health-Island',backupVersion:2,exportedAt:new Date().toISOString(),data:JSON.parse(JSON.stringify(s))};}
  function exportData(){const payload=backupEnvelope(),blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='CKM_Health_Island_V3.1.1_Backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function normalizePassport(p){if(!plainObject(p))throw Error('健康護照格式錯誤');if(p.tasks!==undefined&&!plainObject(p.tasks))throw Error('護照任務資料必須是物件');if(p.history!==undefined&&!Array.isArray(p.history))throw Error('護照歷史資料必須是陣列');const roles=['探險居民','餐盤觀察員','行動隊長','護腎學徒','睡眠守護員','壓力調節員'];if(typeof p.role!=='string'||!roles.includes(p.role))throw Error('護照角色不在允許清單');if(typeof p.nickname!=='string'||p.nickname.length>16)throw Error('暱稱格式錯誤');const result={role:p.role,nickname:p.nickname,xp:asCount(p.xp??0,'XP'),tasks:{},history:[],activityLog:[],sleepLogs:[],moodLogs:[],sleepChallengeDays:[],goal:null};
    for(const [id,v] of Object.entries(p.tasks||{})){if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id)||['__proto__','constructor','prototype'].includes(id)||!plainObject(v)||!['in_progress','completed'].includes(v.status))throw Error('護照任務 ID 或狀態格式錯誤');if(typeof v.title!=='string'||v.title.length>300||typeof v.category!=='string'||v.category.length>40||!validDate(v.startedAt))throw Error('護照任務欄位無效');if(v.status==='completed'&&!validDate(v.completedAt))throw Error('已完成護照任務缺少有效日期');if(v.progress!==undefined&&(typeof v.progress!=='string'||v.progress.length>40))throw Error('任務進度格式錯誤');result.tasks[id]={title:v.title,category:v.category,status:v.status,startedAt:v.startedAt,...(v.status==='completed'?{completedAt:v.completedAt}:{}),...(v.progress!==undefined?{progress:v.progress}:{}),xp:asCount(v.xp??0,'單項 XP')};}
    for(const [name,max] of [['activityLog',500],['sleepLogs',500],['moodLogs',500],['sleepChallengeDays',366]]){if(p[name]!==undefined&&!Array.isArray(p[name]))throw Error(`${name} 必須是陣列`);if((p[name]||[]).length>max)throw Error(`${name} 超過可匯入筆數`);}
    result.activityLog=(p.activityLog||[]).map(x=>{if(!plainObject(x)||!validDate(x.date)||typeof x.activity!=='string'||!['散步','家務走動','伸展','坐姿活動','騎乘／輪椅移動','肌力或平衡練習'].includes(x.activity)||typeof x.minutes!=='number'||!Number.isFinite(x.minutes)||x.minutes<0||x.minutes>1440)throw Error('活動日誌資料無效');return {date:x.date,activity:x.activity,minutes:x.minutes};});
    result.sleepLogs=(p.sleepLogs||[]).map(x=>{if(!plainObject(x)||!validDate(x.date)||typeof x.bed!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(x.bed)||typeof x.wake!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(x.wake)||typeof x.feeling!=='string'||!['還算休息到','普通','有點疲倦','不想記錄感受'].includes(x.feeling))throw Error('睡眠日誌資料無效');return {date:x.date,bed:x.bed,wake:x.wake,feeling:x.feeling};});
    result.moodLogs=(p.moodLogs||[]).map(x=>{if(!plainObject(x)||!validDate(x.date)||typeof x.mood!=='string'||!['平穩','緊繃','疲憊','不確定','不想記錄感受'].includes(x.mood))throw Error('心情日誌資料無效');return {date:x.date,mood:x.mood};});
    result.sleepChallengeDays=[...new Set((p.sleepChallengeDays||[]).map(d=>{if(!validDate(d))throw Error('睡眠挑戰日期無效');return d;}))].slice(-366);
    if((p.history||[]).length>500)throw Error('護照歷史紀錄超過可匯入筆數');result.history=(p.history||[]).map(x=>{if(!plainObject(x)||typeof x.id!=='string'||x.id.length>120||!validDate(x.date)||typeof x.title!=='string'||x.title.length>300||typeof x.category!=='string'||x.category.length>40)throw Error('護照歷史資料無效');return {id:x.id,title:x.title,date:x.date,xp:asCount(x.xp??0,'歷史 XP'),category:x.category};});
    if(p.goal!=null){const g=p.goal;if(!plainObject(g)||typeof g.text!=='string'||g.text.length>100||!['food','movement','kidney','sleep','stress','citizen'].includes(g.island)||!['in_progress','completed'].includes(g.status)||!validDate(g.createdAt)||(g.status==='completed'&&!validDate(g.completedAt)))throw Error('健康目標資料無效');result.goal={text:g.text,island:g.island,status:g.status,createdAt:g.createdAt,...(g.status==='completed'?{completedAt:g.completedAt}:{})};}return result;}
  function validateBackup(raw,currentState){if(!plainObject(raw))throw Error('備份根資料必須是 JSON 物件');if(raw.appId==='CKM-Health-Island'&&raw.backupVersion===2&&plainObject(raw.data)){const d=raw.data;if(!plainObject(d.days)||!plainObject(d.passport))throw Error('缺少小島紀錄或健康護照');const days={};for(const [date,arr] of Object.entries(d.days)){if(!validDate(date)||!Array.isArray(arr)||arr.some(k=>!dailyThemes.includes(k)))throw Error('舊版每日打卡格式錯誤');days[date]=[...new Set(arr)];}const hs=normalizeHabitSystem(d.habitSystem);if(d.trees!==hs.legacyTrees)throw Error('舊版小島樹木計數與獎勵帳本不一致');if(d.lastDate!==''&&!validDate(d.lastDate))throw Error('lastDate 日期無效');const passport=normalizePassport(d.passport);for(const r of hs.records)if(r.rewardVersion===1&&hs.selections[r.date]?.[r.theme]&&hs.selections[r.date][r.theme]!==r.taskId)throw Error(`第 ${r.date} 日自選任務與完成歷史不一致`);const awards=hs.records.filter(r=>r.status==='completed'&&r.xpAwarded).reduce((n,r)=>n+r.xpAwarded,0);if(passport.xp<awards)throw Error('XP 總數小於任務已發 XP，備份資料不一致');return {...d,days,trees:hs.legacyTrees,lastDate:d.lastDate,passport,habitSystem:hs};}
    // V3.0 exported only habit data. Safely merge that legacy file into a clone of current state.
    if(!Array.isArray(raw.habitRecords))throw Error('備份版本不支援；請選擇 CKM 全資料備份 JSON');if(!currentState)throw Error('舊版任務備份需要先有本機 CKM 資料');const merged=JSON.parse(JSON.stringify(currentState)),hs=normalizeHabitSystem(merged.habitSystem);const legacy=normalizeTaskRecords(raw.habitRecords.map(r=>({...r,rewardVersion:0,xpAwarded:false}))),known=new Set(hs.records.map(r=>r.key));for(const r of legacy)if(!known.has(r.key)){hs.records.push(r);known.add(r.key);}if(raw.habitSelections!==undefined)Object.assign(hs.selections,normalizeSelections(raw.habitSelections));if(raw.habitMetrics!==undefined){const metrics=normalizeMetrics(raw.habitMetrics);for(const type of ['activity','sleep','sodium'])Object.assign(hs.metrics[type],metrics[type]);}if(raw.habitLevel!==undefined){const lev=Number(raw.habitLevel);if(![1,2,3].includes(lev))throw Error('舊版任務難度無效');hs.level=lev;}merged.habitSystem=normalizeHabitSystem(hs);merged.trees=merged.habitSystem.legacyTrees;return merged;}
  function importData(){
    if(!confirm('匯入會取代本機 CKM 全部資料；V3.0 舊版任務備份則會安全合併。請先匯出完整備份。'))return;
    const input=document.createElement('input');input.type='file';input.accept='application/json,.json';
    input.onchange=()=>{const file=input.files?.[0];if(!file)return;if(file.size>5*1024*1024){alert('備份超過 5 MB，已拒絕匯入。');return;}
      const reader=new FileReader();reader.onerror=()=>alert('讀取備份檔失敗。');
      reader.onload=()=>{let next;try{const raw=JSON.parse(String(reader.result));next=validateBackup(raw,state());}catch(error){alert('匯入失敗，原資料未變更：'+error.message);return;}
        if(!confirm('備份已驗證。確定還原？完整備份會取代現有資料，V3.0 舊版任務檔只會合併任務紀錄。'))return;
        try{if(typeof window.ckmSetState!=='function')throw Error('無法安全更新本機資料');window.ckmSetState(next);}catch(error){alert('無法寫入本機資料，原資料已保留：'+error.message);return;}
        render();if(typeof window.renderIsland==='function')window.renderIsland();if(typeof window.renderPassport==='function')window.renderPassport();alert('還原完成，資料已寫回此瀏覽器。');
      };reader.readAsText(file);
    };input.click();
  }  window.HabitSystem={tasks,render,library,level,choose,complete,cancel,note,metric,exportData,importData,_validateBackup:validateBackup,_backupEnvelope:backupEnvelope,_migrate:migrate};
  function mount(){const actions=document.getElementById('actions');if(!actions)return;let root=document.getElementById('habit-system');if(!root){root=document.createElement('section');root.id='habit-system';root.className='soft';actions.insertAdjacentElement('afterend',root);}migrate();render();if(typeof window.renderIsland==='function')window.renderIsland();if(typeof window.renderPassport==='function')window.renderPassport();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
