(() => {
  const TERM_FA={
    'Accident Rate':'نرخ حوادث','RFFS Response Time':'زمان پاسخ‌گویی خدمات آتش‌نشانی و نجات فرودگاهی','Compliance Rate':'نرخ انطباق','Compliance Closure Rate':'نرخ بستن موارد عدم انطباق','ISO Certification Coverage':'پوشش گواهی‌های ISO','Operational Productivity':'بهره‌وری عملیاتی','Unit Cost per Operation':'هزینه واحد عملیات','Lean Process Optimization':'بهینه‌سازی فرایندهای ناب','Resource Utilization Efficiency':'کارایی استفاده از منابع','Digitalization Rate':'نرخ دیجیتالی‌شدن','Passenger Digital Service Usage':'میزان استفاده مسافر از خدمات دیجیتال','Digital Service Usage':'میزان استفاده از خدمات دیجیتال','Service Time Reduction':'کاهش زمان ارائه خدمت','Infrastructure Investment Volume':'حجم سرمایه‌گذاری زیرساختی','PPP Share':'سهم مشارکت عمومی–خصوصی','Non-Aeronautical & Non-Port Revenues Share':'سهم درآمدهای غیرهوانوردی و غیربندری','Public-Private Partnerships Share in Projects':'سهم مشارکت عمومی–خصوصی در پروژه‌ها','Business Diversification Index':'شاخص تنوع کسب‌وکار','Investment Source Diversification Index':'شاخص تنوع منابع سرمایه‌گذاری','Project Kick-off Time':'زمان شروع پروژه','Positive Media Coverage Rate':'نرخ پوشش مثبت رسانه‌ای','Awards & Certifications Achieved':'جوایز و گواهی‌های کسب‌شده','Customer Satisfaction Index (CSI)':'شاخص رضایت مشتری (CSI)','Customer Satisfaction Index':'شاخص رضایت مشتری','Net Promoter Score (NPS)':'امتیاز خالص ترویج‌کنندگان (NPS)','Net Promoter Score':'امتیاز خالص ترویج‌کنندگان','Reputation / Brand Index':'شاخص اعتبار / برند','Brand Reputation Index':'شاخص اعتبار برند','Positive Media Coverage Share':'سهم پوشش مثبت رسانه‌ای','Number of MoUs / Agreements':'تعداد تفاهم‌نامه‌ها / توافق‌نامه‌ها','Values Alignment Index':'شاخص همسویی با ارزش‌ها','Continuous Learning Hours per Employee':'ساعات یادگیری مستمر به ازای هر کارمند','Analytics Maturity Index':'شاخص بلوغ تحلیل داده','Data-Driven Decision Rate':'نرخ تصمیم‌گیری داده‌محور','Critical Data Availability Time':'زمان دسترس‌پذیری داده‌های حیاتی','Organizational Transparency Index':'شاخص شفافیت سازمانی','Carbon Emission Intensity':'شدت انتشار کربن','Energy Efficiency':'بهره‌وری انرژی','Share of Renewable Energy':'سهم انرژی تجدیدپذیر','Corporate Social Responsibility Index (CSR Index)':'شاخص مسئولیت اجتماعی شرکت (CSR)','Organizational Resilience Index':'شاخص تاب‌آوری سازمانی','Mean Time to Recovery (MTTR)':'میانگین زمان بازیابی (MTTR)','Supply Chain Resilience Index':'شاخص تاب‌آوری زنجیره تأمین','Innovation in Resilience':'نوآوری در تاب‌آوری','Training Hours per Employee':'ساعات آموزش به ازای هر کارمند','Certification Rate':'نرخ دریافت گواهی حرفه‌ای','Employee Retention Rate':'نرخ ماندگاری کارکنان','Employee Engagement Score':'امتیاز مشارکت کارکنان'
  };
  const termFa=k=>TERM_FA[k]||k;
  const STALE_DAYS=7;
  let goalQuery='';

  function ensureV3UI(){
    const brand=document.querySelector('.brand-app small');
    if(brand) brand.textContent='STRATEGY EXECUTION · EXECUTIVE V3';

    const toolbar=document.querySelector('#goals .toolbar');
    if(toolbar && !document.getElementById('goalSearch')){
      const input=document.createElement('input');
      input.className='input search-input';
      input.id='goalSearch'; input.type='search';
      input.placeholder='جست‌وجوی هدف یا نتیجه کلیدی…';
      input.setAttribute('aria-label','جست‌وجوی هدف یا نتیجه کلیدی');
      toolbar.appendChild(input);
      input.addEventListener('input',e=>{goalQuery=e.target.value||'';renderGoals();});
    }

    const kpiView=document.getElementById('kpiView');
    if(kpiView && !kpiView.querySelector('.kpi-note')){
      const note=document.createElement('div'); note.className='kpi-note';
      note.innerHTML='<b>KPI Dictionary:</b> عنوان شاخص‌ها از نسخه فعلی مدل آمده است؛ واحد، فرمول، تناوب گزارش‌دهی، مالک و منبع داده در این Prototype قطعی نشده‌اند و پیش از استفاده عملیاتی باید با سند مبنا تأیید شوند.';
      kpiView.prepend(note);
    }
    const initiativeView=document.getElementById('initiativeView');
    if(initiativeView && !initiativeView.querySelector('.initiative-note')){
      const note=document.createElement('div'); note.className='initiative-note';
      note.innerHTML='<b>Linkage Note:</b> ارتباط هر Initiative با Objective / KR در نسخه فعلی به‌صورت صریح تعریف نشده است؛ تا زمان تأیید معماری راهبرد، سامانه از ساختن ارتباط فرضی خودداری می‌کند.';
      initiativeView.prepend(note);
    }
    const saveRow=document.querySelector('#checkin .save-row');
    if(saveRow && !document.getElementById('checkValidation')){
      const v=document.createElement('div'); v.className='validation'; v.id='checkValidation';
      v.setAttribute('role','alert'); v.setAttribute('aria-live','polite');
      v.textContent='برای ثبت مدیریتی معتبر، «مسئول» و «گام بعدی» را تکمیل کنید.';
      saveRow.parentElement.insertBefore(v,saveRow);
    }
    const saved=document.getElementById('savedMsg');
    if(saved){saved.setAttribute('role','status');saved.setAttribute('aria-live','polite');}

    const dashboard=document.getElementById('dashboard');
    if(dashboard && !document.getElementById('sCoverage')){
      dashboard.innerHTML=`
        <div class="section-head"><div><h3>داشبورد مدیرعامل · Executive View</h3><p>تمرکز روی سلامت راهبرد، پوشش داده، ریسک و موارد نیازمند تصمیم.</p></div></div>
        <div class="dashboard-principle"><b>اصل نمایش:</b> «پیشرفت» و «پوشش داده» دو مفهوم جدا هستند. اگر همه نتایج کلیدی یک هدف به‌روز نشده باشند، درصد پیشرفت با برچسب <b>داده جزئی</b> نمایش داده می‌شود تا برداشت مدیریتی گمراه‌کننده ایجاد نشود.</div>
        <div class="stats">
          <div class="stat"><strong id="sUpdated">۰</strong><span>هدف دارای داده</span><small>از ۱۳ هدف راهبردی</small></div>
          <div class="stat"><strong id="sRisk">۰</strong><span>نیازمند توجه / عقب</span><small>براساس آخرین Check-in</small></div>
          <div class="stat"><strong id="sCoverage">۰٪</strong><span>پوشش داده KR</span><small>نتایج کلیدی به‌روزشده</small></div>
          <div class="stat"><strong id="sFresh">—</strong><span>آخرین به‌روزرسانی</span><small id="sStale">—</small></div>
        </div>
        <div class="dash-grid"><div class="panel"><h3>سلامت اهداف راهبردی</h3><div class="hint">پیشرفت ثبت‌شده همراه با Coverage و تازگی داده نمایش داده می‌شود.</div><div id="execProgress"></div></div><div class="panel"><h3>نیازمند توجه مدیریت</h3><div class="hint">اهدافی که وضعیت آن‌ها «نیازمند توجه» یا «عقب از برنامه» است.</div><div class="risk-list" id="riskList"></div></div></div>
        <div class="executive-grid"><div class="panel"><h3>سلامت ستون‌های راهبردی</h3><div class="hint">نمای فشرده از وضعیت ۶ ستون راهبردی.</div><div class="pillar-health-list" id="pillarHealth"></div></div><div class="panel"><h3>تصمیم‌های مورد نیاز</h3><div class="hint">مانع و گام بعدی از آخرین Check-inهای دارای ریسک.</div><div class="decision-list" id="decisionList"></div></div></div>
        <div class="dashboard-note">این نسخه هنوز <b>Prototype / Pilot</b> است و داده‌ها فقط روی همین دستگاه ذخیره می‌شوند. برای استفاده سازمانی واقعی، احراز هویت، پایگاه داده مرکزی، سطح دسترسی، Audit Trail و Backup لازم است.</div>
        <div style="text-align:left;margin-top:8px"><button class="danger-link" onclick="resetDemo()">پاک‌کردن داده‌های این دستگاه</button></div>`;
    }
  }

  ensureV3UI();

  objectiveState=function(id){
    const o=objectives.find(x=>x.id===id),direct=latestState(`obj-${id}`),all=(o?.krs||[]),states=all.map((_,i)=>krState(id,i)).filter(Boolean);
    const total=all.length,coverage=states.length,coveragePct=total?Math.round((coverage/total)*100):100;
    if(!states.length) return direct?{...direct,coverage:0,total,coveragePct:0,partial:true,derived:false}:null;
    if(direct && direct.ts>Math.max(...states.map(x=>x.ts))) return {...direct,coverage,total,coveragePct,partial:coverage<total,derived:false};
    const progress=Math.round(states.reduce((a,c)=>a+Number(c.progress||0),0)/states.length);
    const conf=states.some(c=>c.conf==='off-track')?'off-track':states.some(c=>c.conf==='at-risk')?'at-risk':'on-track';
    const latest=[...states].sort((a,b)=>b.ts-a.ts)[0];
    return {...latest,progress,conf,coverage,total,coveragePct,partial:coverage<total,derived:true};
  };

  goalLabel=function(g){
    if(g.startsWith('obj-')){const id=+g.split('-')[1],o=objectives.find(x=>x.id===id);return `هدف ${faNum(id)} — ${o?.title||''}`;}
    if(g.startsWith('kr-')){const p=g.split('-'),id=+p[1],idx=+p[2],o=objectives.find(x=>x.id===id),k=o?.krs?.[idx]||'';return `هدف ${faNum(id)} · KR${idx+1} — ${termFa(k)} / ${k}`;}
    return g;
  };

  renderGoals=function(){
    const pf=document.getElementById('pillarFilter').value,q=goalQuery.trim().toLowerCase();
    const arr=objectives.filter(o=>(!pf||String(o.pillar)===pf)&&(!q||o.title.toLowerCase().includes(q)||o.krs.some(k=>k.toLowerCase().includes(q)||termFa(k).toLowerCase().includes(q))));
    document.getElementById('goalList').innerHTML=arr.map(o=>{
      const p=pillarOf(o.pillar),c=objectiveState(o.id),st=statusInfo(c),pct=st.pct??0,coverage=c?.coverage??0,total=o.krs.length;
      const krs=o.krs.map((k,i)=>{const kc=krState(o.id,i),ks=statusInfo(kc),kp=ks.pct??0;return `<div class="kr-row"><div class="kr-id">KR${i+1}</div><div><div class="kr-name"><span class="term-fa">${termFa(k)}</span><span class="term-en">${k}</span></div><div class="kr-meta"><span class="status"><i class="dot ${ks.cls}"></i>${ks.label}</span>${owners[`kr-${o.id}-${i}`]?`<span>مسئول: ${owners[`kr-${o.id}-${i}`]}</span>`:''}<span>${ks.pct==null?'به‌روزرسانی نشده':faNum(ks.pct)+'٪'}</span></div><div class="progress mini"><span style="width:${kp}%"></span></div></div></div>`;}).join('');
      const note=c?.derived?(coverage===total?`همه ${faNum(total)} نتیجه کلیدی به‌روز است`:`${faNum(coverage)} از ${faNum(total)} نتیجه کلیدی به‌روز است`):'آخرین ثبت مستقیم هدف';
      const cov=c?`<span class="coverage-badge ${c.partial?'partial':''}">پوشش KR: ${faNum(c.coveragePct)}٪</span>`:'';
      const pctLabel=st.pct==null?'بدون داده':(c?.partial?'داده‌های موجود: ':'')+faNum(st.pct)+'٪';
      return `<article class="goal-card"><div class="goal-main"><div class="goal-title"><div class="goal-id">O${o.id}</div><div><h4>${o.title}</h4><div class="goal-meta"><span>${p.fa}</span><span class="status"><i class="dot ${st.cls}"></i>${st.label}</span>${cov}${owners[`obj-${o.id}`]?`<span>مسئول: ${owners[`obj-${o.id}`]}</span>`:''}</div></div></div><div class="progress-box"><div class="progress"><span style="width:${pct}%"></span></div><div class="progress-label"><span>${pctLabel}</span><span>${st.pct==null?'—':note}</span></div></div></div><details class="kr-details"><summary>نتایج کلیدی <span class="count">${faNum(o.krs.length)}</span></summary><div class="kr-list">${krs}</div></details></article>`;
    }).join('')||'<div class="empty">موردی مطابق فیلتر یا جست‌وجو پیدا نشد.</div>';
  };

  renderKPIs=function(){
    const pf=document.getElementById('pillarFilter').value,ps=pillars.filter(p=>!pf||String(p.id)===pf);
    document.getElementById('kpiGrid').innerHTML=ps.flatMap(p=>p.kpis.map(k=>{const d=kpiData[kKey(p.id,k)]||{},st=kStatus(k,d.current,d.target),dir=lowerBetter.has(k)?'کمتر بهتر':'بیشتر بهتر';return `<article class="kpi-card"><h4><span class="term-fa">${termFa(k)}</span><span class="term-en">${k}</span></h4><div class="kpi-pillar">${p.fa}</div><div class="kpi-fields"><label>مقدار فعلی<input inputmode="decimal" class="input" value="${d.current??''}" onchange="saveKpi('${escapeAttr(kKey(p.id,k))}','current',this.value)" placeholder="—"></label><label>هدف<input inputmode="decimal" class="input" value="${d.target??''}" onchange="saveKpi('${escapeAttr(kKey(p.id,k))}','target',this.value)" placeholder="—"></label></div><div class="kpi-health"><span class="status"><i class="dot ${st[1]}"></i>${st[0]}</span><span>${dir}</span></div></article>`;})).join('');
  };

  renderInitiatives=function(){
    const pf=document.getElementById('pillarFilter').value;let arr=initiatives;
    if(pf){const p=pillarOf(+pf);arr=initiatives.filter(i=>i[2]===p?.en);}
    document.getElementById('initiativeGrid').innerHTML=arr.map(i=>`<article class="initiative"><h4><span class="term-fa">${i[1]}</span><span class="term-en">${i[0]}</span></h4><span class="tag en">${i[2]}</span></article>`).join('')||'<div class="empty">اقدامی برای این فیلتر ثبت نشده است.</div>';
  };

  renderCheckGoal=function(){
    const type=document.getElementById('checkType').value,s=document.getElementById('checkGoal');
    if(type==='objective') s.innerHTML=objectives.map(o=>`<option value="obj-${o.id}">هدف ${faNum(o.id)} — ${o.title}</option>`).join('');
    else s.innerHTML=objectives.flatMap(o=>o.krs.map((k,i)=>`<option value="kr-${o.id}-${i}">O${o.id} · KR${i+1} — ${termFa(k)} / ${k}</option>`)).join('');
    prefillOwner();
  };

  saveCheckin=function(){
    const goal=document.getElementById('checkGoal').value,progress=Number(document.getElementById('checkProgress').value||0),conf=document.getElementById('checkConfidence').value,owner=document.getElementById('checkOwner').value.trim(),win=document.getElementById('checkWin').value.trim(),blocker=document.getElementById('checkBlocker').value.trim(),next=document.getElementById('checkNext').value.trim(),v=document.getElementById('checkValidation');
    if(!goal)return;
    if(!owner||!next){if(v)v.classList.add('show');return;}
    if(v)v.classList.remove('show'); owners[goal]=owner;
    checkins.unshift({goal,progress,conf,owner,win,blocker,next,ts:Date.now()}); persist();
    document.getElementById('savedMsg').classList.add('show'); setTimeout(()=>document.getElementById('savedMsg').classList.remove('show'),1600);
    document.getElementById('checkWin').value=''; document.getElementById('checkBlocker').value=''; document.getElementById('checkNext').value=''; renderAllDynamic();
  };

  renderDashboard=function(){
    const rows=objectives.map(o=>({o,c:objectiveState(o.id)})),states=rows.filter(x=>x.c),risk=states.filter(x=>x.c.conf!=='on-track');
    const krTotal=objectives.reduce((a,o)=>a+o.krs.length,0),krUpdated=objectives.reduce((a,o)=>a+o.krs.filter((_,i)=>krState(o.id,i)).length,0),coveragePct=krTotal?Math.round((krUpdated/krTotal)*100):0;
    const latest=checkins[0]?.ts,staleMs=STALE_DAYS*86400000,stale=states.filter(x=>Date.now()-x.c.ts>staleMs);
    document.getElementById('sUpdated').textContent=faNum(states.length); document.getElementById('sRisk').textContent=faNum(risk.length); document.getElementById('sCoverage').textContent=faNum(coveragePct)+'٪';
    document.getElementById('sFresh').textContent=latest?new Date(latest).toLocaleDateString('fa-IR',{month:'short',day:'numeric'}):'—';
    document.getElementById('sStale').textContent=states.length?faNum(stale.length)+' هدف با داده قدیمی‌تر از '+faNum(STALE_DAYS)+' روز':'هنوز داده‌ای ثبت نشده';
    const ep=document.getElementById('execProgress');
    if(!states.length) ep.innerHTML='<div class="empty">هنوز داده مدیریتی وجود ندارد.<br>با ثبت اولین پیشرفت، تصویر این بخش ساخته می‌شود.</div>';
    els