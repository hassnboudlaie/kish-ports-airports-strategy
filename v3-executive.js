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

    const dashboard=document.getElementById('