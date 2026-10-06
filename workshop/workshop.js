
(function(){
  var objectives=[
    {id:1,pillar:'ایمنی و کیفیت',title:'ارتقاء مستمر کیفیت و ایمنی خدمات حمل‌ونقل هوایی و دریایی',krs:['نرخ حوادث / Accident Rate','زمان پاسخ‌گویی RFFS / RFFS Response Time','نرخ بستن عدم انطباق / Compliance Closure Rate','پوشش گواهی‌های ISO / ISO Certification Coverage']},
    {id:2,pillar:'بهره‌وری و مدیریت هزینه',title:'افزایش بهره‌وری و بهینه‌سازی هزینه‌ها در فرآیندهای سازمانی',krs:['بهره‌وری عملیاتی / Operational Productivity','هزینه واحد عملیات / Unit Cost per Operation','بهینه‌سازی فرایند ناب / Lean Process Optimization','کارایی استفاده از منابع / Resource Utilization Efficiency']},
    {id:3,pillar:'نوآوری و هوشمندسازی',title:'توسعه خدمات نوآورانه و هوشمندسازی عملیات کلیدی',krs:['نرخ دیجیتالی‌شدن / Digitalization Rate','استفاده از خدمات دیجیتال / Digital Service Usage','کاهش زمان ارائه خدمت / Service Time Reduction']},
    {id:4,pillar:'سرمایه‌گذاری و توسعه پایدار',title:'تقویت مدل‌های پایدار درآمدزایی و کاهش وابستگی به منابع سنتی',krs:['سهم درآمدهای غیرهوانوردی و غیربندری','سهم مشارکت عمومی–خصوصی در پروژه‌ها','شاخص تنوع کسب‌وکار']},
    {id:5,pillar:'سرمایه‌گذاری و توسعه پایدار',title:'جذب و هدایت سرمایه‌گذاری‌های راهبردی در پروژه‌های زیرساختی',krs:['حجم سرمایه‌گذاری زیرساختی','سهم PPP','تنوع منابع سرمایه‌گذاری','زمان شروع پروژه']},
    {id:6,pillar:'جایگاه و برند ملی/منطقه‌ای',title:'حفظ و تقویت جایگاه شرکت در سطح ملی و ارتقاء اعتبار منطقه‌ای',krs:['نرخ پوشش مثبت رسانه‌ای','جوایز و گواهی‌های کسب‌شده']},
    {id:7,pillar:'جایگاه و برند ملی/منطقه‌ای',title:'ارتقاء تجربه ذی‌نفعان و برند ملی',krs:['شاخص رضایت مشتری (CSI)','امتیاز خالص ترویج‌کنندگان (NPS)','شاخص اعتبار برند','سهم پوشش مثبت رسانه‌ای']},
    {id:8,pillar:'جایگاه و برند ملی/منطقه‌ای',title:'افزایش تعاملات راهبردی با نهادهای کلیدی داخلی و بین‌المللی',krs:['تعداد تفاهم‌نامه‌ها / توافق‌نامه‌ها']},
    {id:9,pillar:'سرمایه انسانی و فرهنگ سازمانی',title:'نهادینه‌سازی فرهنگ سازمانی مبتنی بر اخلاق، پاسخگویی و حرفه‌ای‌گرایی',krs:['شاخص همسویی با ارزش‌ها','ساعات یادگیری مستمر به ازای هر کارمند']},
    {id:10,pillar:'نوآوری و هوشمندسازی',title:'توسعه زیرساخت‌های داده‌محور برای تصمیم‌سازی و پایش عملکرد',krs:['شاخص بلوغ تحلیل داده','نرخ تصمیم‌گیری داده‌محور','زمان دسترس‌پذیری داده‌های حیاتی','شاخص شفافیت سازمانی']},
    {id:11,pillar:'سرمایه‌گذاری و توسعه پایدار',title:'پایش و ارتقاء اثرپذیری اجتماعی و زیست‌محیطی فعالیت‌های شرکت',krs:['شدت انتشار کربن','بهره‌وری انرژی','سهم انرژی تجدیدپذیر','شاخص مسئولیت اجتماعی شرکت']},
    {id:12,pillar:'سرمایه‌گذاری و توسعه پایدار',title:'افزایش تاب‌آوری سازمانی در برابر تحولات محیطی، اقتصادی و فناورانه',krs:['شاخص تاب‌آوری سازمانی','میانگین زمان بازیابی (MTTR)','شاخص تاب‌آوری زنجیره تأمین','نوآوری در تاب‌آوری']},
    {id:13,pillar:'سرمایه انسانی و فرهنگ سازمانی',title:'توسعه سرمایه انسانی با تأکید بر توانمندسازی تخصصی و شایستگی‌های رفتاری',krs:['ساعات آموزش به ازای هر کارمند','نرخ دریافت گواهی حرفه‌ای','امتیاز مشارکت کارکنان']}
  ];

  var departments=[
    {id:'executive',name:'مدیریت ارشد / مدیرعامل',sub:'Executive Management',recommended:[1,2,3,4,5,6,7,8,9,10,11,12,13]},
    {id:'airport',name:'فرودگاه بین‌المللی کیش',sub:'Airport General Directorate',recommended:[1,2,3,7,10,11,12]},
    {id:'ports',name:'بنادر کیش',sub:'Ports General Directorate',recommended:[1,2,4,5,7,10,11,12]},
    {id:'economic',name:'معاونت اقتصادی و فنی',sub:'Economic & Technical',recommended:[2,4,5,10,11,12]},
    {id:'admin',name:'معاونت مالی، اداری و پشتیبانی',sub:'Finance, Administration & Support',recommended:[2,4,5,9,10,12,13]},
    {id:'security',name:'حراست',sub:'Security',recommended:[1,9,10,12]},
    {id:'hr',name:'منابع انسانی',sub:'Human Resources',recommended:[2,9,13]},
    {id:'finance',name:'امور مالی',sub:'Finance',recommended:[2,4,5,10]},
    {id:'inspection',name:'بازرسی و پاسخگویی به شکایات',sub:'Inspection & Complaints',recommended:[1,7,9,10]},
    {id:'legal',name:'حقوقی و امور قراردادها',sub:'Legal & Contracts',recommended:[1,5,8,9,12]},
    {id:'other',name:'سایر / واحد خودم',sub:'Other / Custom Department',recommended:[1,2,3,4,5,6,7,8,9,10,11,12,13]}
  ];

  var STORAGE='kish-workshop-v1';
  var EDIT_STORAGE='kish-workshop-edit-v1';
  var state={profile:{name:'',role:'',department:'',customDepartment:''},selected:[],answers:{}};
  var currentStep=1;
  var editMode=false;

  function $(id){return document.getElementById(id)}
  function fa(n){return Number(n).toLocaleString('fa-IR')}
  function save(){localStorage.setItem(STORAGE,JSON.stringify(state));toast('ذخیره شد')}
  function load(){
    try{
      var x=JSON.parse(localStorage.getItem(STORAGE)||'null');
      if(x&&x.profile) state=x;
    }catch(e){}
  }
  function toast(msg){
    var t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},1200);
  }
  function step(n){
    currentStep=n;
    document.querySelectorAll('.section').forEach(function(x){x.classList.toggle('active',Number(x.dataset.step)===n)});
    document.querySelectorAll('.step').forEach(function(x){x.classList.toggle('active',Number(x.dataset.step)===n)});
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function dept(){return departments.find(function(d){return d.id===state.profile.department})||null}
  function deptLabel(){
    var d=dept();
    if(!d)return '—';
    return d.id==='other'&&state.profile.customDepartment?state.profile.customDepartment:d.name;
  }

  function renderDepartments(){
    $('departmentGrid').innerHTML=departments.map(function(d){
      return '<button type="button" class="dept-card '+(state.profile.department===d.id?'active':'')+'" data-dept="'+d.id+'"><strong>'+d.name+'</strong><span>'+d.sub+'</span></button>';
    }).join('');
    document.querySelectorAll('[data-dept]').forEach(function(b){
      b.addEventListener('click',function(){
        state.profile.department=b.dataset.dept;
        if(!state.selected.length || b.dataset.dept!=='other'){
          var d=dept();state.selected=(d?d.recommended:[]).slice(0,4);
        }
        save();renderDepartments();renderProfile();renderObjectives();renderExercises();renderCanvas();
        $('customDeptWrap').classList.toggle('hidden',b.dataset.dept!=='other');
      });
    });
  }

  function renderProfile(){
    $('pName').value=state.profile.name||'';
    $('pRole').value=state.profile.role||'';
    $('customDept').value=state.profile.customDepartment||'';
    $('customDeptWrap').classList.toggle('hidden',state.profile.department!=='other');
    var html='';
    if(state.profile.name)html+='<span class="pill">'+state.profile.name+'</span>';
    if(state.profile.role)html+='<span class="pill">'+state.profile.role+'</span>';
    if(state.profile.department)html+='<span class="pill">'+deptLabel()+'</span>';
    $('profileSummary').innerHTML=html;
  }

  function recommendedSet(){
    var d=dept();return new Set((d&&d.recommended)||[]);
  }
  function renderObjectives(){
    var rec=recommendedSet();
    var selected=new Set(state.selected||[]);
    $('objectiveGrid').innerHTML=objectives.map(function(o){
      var r=rec.has(o.id),checked=selected.has(o.id);
      return '<article class="objective '+(r?'recommended':'')+'"><div class="objective-head"><div class="objective-title"><div class="oid">O'+o.id+'</div><div><h4>'+o.title+'</h4><div class="objective-meta"><span>'+o.pillar+'</span>'+(r?'<span class="pill">پیشنهادی برای واحد شما</span>':'')+'</div></div></div><input type="checkbox" aria-label="انتخاب هدف '+o.id+'" data-oid="'+o.id+'" '+(checked?'checked':'')+'></div><div class="kr-list">'+o.krs.map(function(k,i){return '<div class="kr"><b>KR'+(i+1)+'</b> — '+k+'</div>'}).join('')+'</div></article>';
    }).join('');
    document.querySelectorAll('[data-oid]').forEach(function(c){
      c.addEventListener('change',function(){
        var id=Number(c.dataset.oid),set=new Set(state.selected||[]);
        if(c.checked)set.add(id);else set.delete(id);
        state.selected=Array.from(set).sort(function(a,b){return a-b});
        save();renderExercises();renderCanvas();
      });
    });
  }

  var exercises=[
    {id:'mission',title:'ترجمه راهبرد به مأموریت واحد',prompt:'این واحد دقیقاً چه نقشی در تحقق راهبرد شرکت دارد؟ خروجی ملموس واحد شما چیست؟',ph:'در ۳ تا ۵ جمله بنویسید…'},
    {id:'evidence',title:'شواهد وضعیت فعلی',prompt:'برای اهداف انتخاب‌شده چه شواهد واقعی از وضعیت امروز دارید؟ عدد، رفتار، مسئله، شکایت یا نمونه عملی.',ph:'حداقل ۳ شاهد واقعی…'},
    {id:'gap',title:'شکاف عملکرد',prompt:'بزرگ‌ترین فاصله بین وضعیت فعلی و وضعیت مطلوب چیست؟ چه چیزی مانع تحقق هدف است؟',ph:'شکاف‌ها و ریشه‌های اصلی…'},
    {id:'metric',title:'تعریف شاخص واحد',prompt:'برای واحد خود ۱ تا ۳ شاخص بسازید. هر شاخص باید تعریف، واحد، منبع داده و تناوب گزارش داشته باشد.',ph:'مثال: زمان پاسخ‌گویی | دقیقه | سیستم X | هفتگی'},
    {id:'initiative',title:'اقدام راهبردی',prompt:'یک Initiative واقعی طراحی کنید که مستقیماً یکی از اهداف/KRهای انتخاب‌شده را جلو ببرد.',ph:'نام اقدام، خروجی، صاحب اقدام، مهلت…'},
    {id:'dependency',title:'وابستگی بین‌واحدی',prompt:'برای موفقیت به کدام واحدها وابسته‌اید؟ دقیقاً چه همکاری یا تصمیمی از آن‌ها لازم دارید؟',ph:'واحد / نیاز / زمان…'},
    {id:'risk',title:'ریسک و مانع',prompt:'مهم‌ترین ریسک اجرای راهبرد در واحد شما چیست و چه کنترل یا تصمیمی نیاز دارد؟',ph:'ریسک، احتمال/اثر، اقدام کنترلی…'},
    {id:'commitment',title:'تعهد ۳۰ روزه',prompt:'تا ۳۰ روز آینده یک تعهد قابل سنجش تعریف کنید که در جلسه بعد بتوانیم آن را مرور کنیم.',ph:'تا تاریخ …، من/واحد ما … را انجام می‌دهیم و با … می‌سنجیم.'}
  ];

  function applyAdminConfig(){
    var cfg=window.WORKSHOP_ADMIN_CONFIG||{};
    if(cfg.exercises){
      exercises=exercises.map(function(ex){
        var o=cfg.exercises[ex.id]||{};
        return {id:ex.id,title:o.title||ex.title,prompt:o.prompt||ex.prompt,ph:o.ph||ex.ph};
      });
    }
    if(cfg.editable){
      document.querySelectorAll('[data-editable]').forEach(function(el){
        var k=el.dataset.editable;
        if(cfg.editable[k]!=null)el.innerHTML=cfg.editable[k];
      });
    }
  }

  function answerKey(ex){return deptLabel()+'::'+ex}
  function renderExercises(){
    var ids=state.selected||[];
    $('selectedObjectives').innerHTML=ids.length?ids.map(function(id){var o=objectives.find(function(x){return x.id===id});return '<span class="pill">O'+id+' · '+(o?o.title:'')+'</span>'}).join(''):'<span class="pill">هنوز هدفی انتخاب نشده</span>';
    $('exerciseGrid').innerHTML=exercises.map(function(ex,i){
      var key=answerKey(ex.id),v=(state.answers&&state.answers[key])||'';
      return '<article class="exercise"><div class="exercise-no">تمرین '+fa(i+1)+'</div><h4 data-editable="exercise-title-'+ex.id+'">'+ex.title+'</h4><p data-editable="exercise-prompt-'+ex.id+'">'+ex.prompt+'</p><textarea class="textarea exercise-input" data-ex="'+ex.id+'" placeholder="'+ex.ph+'">'+escapeHtml(v)+'</textarea></article>';
    }).join('');
    applyEditableOverrides();
    document.querySelectorAll('.exercise-input').forEach(function(t){
      t.addEventListener('input',function(){
        var key=answerKey(t.dataset.ex);state.answers[key]=t.value;localStorage.setItem(STORAGE,JSON.stringify(state));renderCanvas(false);
      });
    });
  }

  function escapeHtml(x){return String(x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function renderCanvas(scroll){
    var ids=state.selected||[];
    $('canvasHeader').innerHTML='<div class="profile-summary"><span class="pill">'+escapeHtml(deptLabel())+'</span>'+(state.profile.name?'<span class="pill">'+escapeHtml(state.profile.name)+'</span>':'')+'</div>';
    $('canvasObjectives').innerHTML=ids.length?ids.map(function(id){var o=objectives.find(function(x){return x.id===id});return '<div class="canvas-card"><h4>O'+id+'</h4><p>'+escapeHtml(o?o.title:'')+'</p></div>'}).join(''):'<div class="empty">هدف‌های واحد هنوز انتخاب نشده‌اند.</div>';
    $('canvasAnswers').innerHTML=exercises.map(function(ex){
      var v=(state.answers&&state.answers[answerKey(ex.id)])||'';
      return '<div class="canvas-card"><h4>'+ex.title+'</h4><p>'+(v?escapeHtml(v):'—')+'</p></div>';
    }).join('');
    if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }

  function bindProfile(){
    ['pName','pRole','customDept'].forEach(function(id){
      $(id).addEventListener('input',function(){
        if(id==='pName')state.profile.name=this.value;
        if(id==='pRole')state.profile.role=this.value;
        if(id==='customDept')state.profile.customDepartment=this.value;
        localStorage.setItem(STORAGE,JSON.stringify(state));renderProfile();renderExercises();renderCanvas(false);
      });
    });
  }

  function exportData(){
    var payload={version:'Kish Workshop v1',exportedAt:new Date().toISOString(),profile:state.profile,selectedObjectives:state.selected,answers:state.answers,editableCopy:getEditableOverrides()};
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='kish-workshop-'+(state.profile.name||'participant')+'.json';a.click();URL.revokeObjectURL(a.href);
    toast('فایل تمرین آماده شد');
  }
  function importData(file){
    var reader=new FileReader();reader.onload=function(){
      try{
        var x=JSON.parse(reader.result);
        if(x.profile)state.profile=x.profile;if(x.selectedObjectives)state.selected=x.selectedObjectives;if(x.answers)state.answers=x.answers;
        localStorage.setItem(STORAGE,JSON.stringify(state));
        if(x.editableCopy)localStorage.setItem(EDIT_STORAGE,JSON.stringify(x.editableCopy));
        init();toast('فایل وارد شد');
      }catch(e){alert('فایل معتبر نیست.')}
    };reader.readAsText(file);
  }
  function resetParticipant(){
    if(!confirm('پاسخ‌ها و پروفایل این شرکت‌کننده روی این دستگاه پاک شود؟'))return;
    localStorage.removeItem(STORAGE);state={profile:{name:'',role:'',department:'',customDepartment:''},selected:[],answers:{}};init();toast('پاک شد');
  }

  function getEditableOverrides(){
    try{return JSON.parse(localStorage.getItem(EDIT_STORAGE)||'{}')}catch(e){return {}}
  }
  function applyEditableOverrides(){
    var central=(window.WORKSHOP_ADMIN_CONFIG&&window.WORKSHOP_ADMIN_CONFIG.editable)||{};
    var o=getEditableOverrides();
    document.querySelectorAll('[data-editable]').forEach(function(el){
      var k=el.dataset.editable;
      if(central[k]!=null)el.innerHTML=central[k];
      if(o[k]!=null)el.innerHTML=o[k];
      el.contentEditable=editMode?'true':'false';
      el.spellcheck=editMode;
      if(!el.dataset.editBound){
        el.addEventListener('input',function(){
          if(!editMode)return;
          var x=getEditableOverrides();x[k]=el.innerHTML;localStorage.setItem(EDIT_STORAGE,JSON.stringify(x));
        });
        el.dataset.editBound='1';
      }
    });
  }
  function toggleEdit(){
    editMode=!editMode;document.body.classList.toggle('edit-mode',editMode);
    $('editToggle').textContent=editMode?'پایان ویرایش متن':'ویرایش متن کارگاه';
    applyEditableOverrides();toast(editMode?'حالت ویرایش فعال شد':'ویرایش متن ذخیره شد');
  }
  function resetEdits(){
    if(!confirm('متن‌های ویرایش‌شده این دستگاه به نسخه اصلی برگردد؟'))return;
    localStorage.removeItem(EDIT_STORAGE);location.reload();
  }

  function init(){
    load();
    applyAdminConfig();
    renderDepartments();renderProfile();renderObjectives();renderExercises();renderCanvas(false);applyEditableOverrides();
    document.querySelectorAll('.step').forEach(function(b){b.addEventListener('click',function(){step(Number(b.dataset.step))})});
    document.querySelectorAll('[data-next]').forEach(function(b){b.addEventListener('click',function(){step(Number(b.dataset.next))})});
    document.querySelectorAll('[data-prev]').forEach(function(b){b.addEventListener('click',function(){step(Number(b.dataset.prev))})});
  }

  window.workshop={
    step:step,save:save,exportData:exportData,resetParticipant:resetParticipant,toggleEdit:toggleEdit,resetEdits:resetEdits,
    importClick:function(){$('importFile').click()},
    print:function(){step(5);setTimeout(function(){window.print()},150)},
    importChanged:function(el){if(el.files&&el.files[0])importData(el.files[0])}
  };

  bindProfile();
  init();
})();
