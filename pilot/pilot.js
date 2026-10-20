/* Kish Perdoo-inspired pilot. Browser-local workspace. No central user access. */
(function(){
"use strict";
var KEY="kish_perdoo_pilot_data_v1";
var schema=1;
var pilot={version:schema,cycle:{title:"چرخه آزمایشی",start:"",end:"",active:[]},measurements:[],tasks:[],meetings:[]};
var notice="";
pilot.people=pilot.people||[];pilot.unitPlans=pilot.unitPlans||{};pilot.scope=pilot.scope||"";
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function fmt(n){return Number(n).toLocaleString("fa-IR",{maximumFractionDigits:2})}
function id(){return "k"+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pilot));return true}catch(e){alert("ذخیره روی این مرورگر ممکن نیست. فایل پشتیبان تهیه کنید.");return false}}
function valid(x){return x&&x.version===1&&x.cycle&&Array.isArray(x.cycle.active)&&Array.isArray(x.measurements)&&Array.isArray(x.tasks)&&Array.isArray(x.meetings)}
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(valid(saved))pilot=saved}catch(e){notice="خواندن اطلاعات قبلی با خطا مواجه شد."}
pilot.people=Array.isArray(pilot.people)?pilot.people:[];pilot.unitPlans=pilot.unitPlans&&typeof pilot.unitPlans==="object"?pilot.unitPlans:{};pilot.scope=pilot.scope||"";
var originalGo=go;
var extra={pilotHub:"میز کار آزمایشی",pilotCycle:"چرخه و اولویت‌ها",pilotMetrics:"ثبت نتایج واقعی",pilotProjects:"پروژه‌ها و وظایف",pilotMeetings:"جلسات و پیگیری"};
Object.keys(extra).forEach(function(k){titles[k]=extra[k]});
function el(tag,klass){var x=document.createElement(tag);if(klass)x.className=klass;return x}
function navButton(name,label,ico){var b=el("button");b.setAttribute("data-page",name);b.innerHTML='<span aria-hidden="true">'+ico+'</span><span>'+label+'</span>';document.getElementById("desktopNav").appendChild(b)}
navButton("pilotHub","میز کار Pilot","◈");
navButton("pilotCycle","چرخه و اولویت‌ها","◎");
navButton("pilotMetrics","نتایج واقعی KR","◉");
navButton("pilotProjects","پروژه‌ها و وظایف","☷");
navButton("pilotMeetings","جلسات و پیگیری","▣");
var m=el("button");m.dataset.page="pilotHub";m.innerHTML='<span aria-hidden="true">◈</span><span>Pilot</span>';document.getElementById("mobileNav").appendChild(m);
var content=document.querySelector(".content");
var pages={
pilotHub:'<div class="pilot-head"><div><span class="pilot-kicker">KISH · STRATEGY EXECUTION PILOT</span><h3>میز کار یکپارچه اجرای راهبرد</h3><p>از سند راهبردی تا نتایج قابل اندازه‌گیری، اجرای پروژه و بازبینی مدیریتی.</p></div><span class="pilot-pill">نسخه آزمایشی · ذخیره در این مرورگر</span></div><div class="pilot-stats" id="pilotStats"></div><div class="pilot-grid-links"><button data-goto="pilotCycle"><b>۱. اولویت‌های دوره</b><small>انتخاب اهداف فعال از میان ۱۳ هدف سند</small><span>ورود ←</span></button><button data-goto="pilotMetrics"><b>۲. اندازه‌گیری نتایج</b><small>Start / Current / Target و تاریخچه</small><span>ورود ←</span></button><button data-goto="pilotProjects"><b>۳. پروژه‌ها و وظایف</b><small>مالک، سررسید و ارتباط با اهداف</small><span>ورود ←</span></button><button data-goto="pilotMeetings"><b>۴. جلسات و تعهدات</b><small>تصمیم، اقدام و پیگیری مسئول</small><span>ورود ←</span></button></div><div class="pilot-row"><section class="pilot-card"><h4>اهداف فعال این دوره</h4><div id="pilotActiveList"></div></section><section class="pilot-card"><h4>توجه مدیریت و اقدامات معوق</h4><div id="pilotAttention"></div></section></div><div class="pilot-card"><h4>پشتیبان‌گیری داده‌های آزمایشی</h4><p class="pilot-muted">هیچ‌یک از اطلاعات این نسخه با سامانه جامع یا سایر دستگاه‌ها Sync نمی‌شود. برای انتقال، خروجی JSON بگیرید.</p><div class="pilot-actions"><button class="btn primary" id="pilotExport">دانلود JSON</button><label class="btn" for="pilotImportFile">بازیابی JSON</label><input type="file" id="pilotImportFile" accept=".json,application/json" hidden><a class="btn" href="https://hassnboudlaie.github.io/hasan-boudlaie/okr-system/" target="_blank" rel="noopener">سند کامل و ۵۳ KR ↗</a></div><div class="pilot-notice" id="pilotNotice"></div></div>',
pilotCycle:'<div class="pilot-head"><div><span class="pilot-kicker">FOCUS & ALIGNMENT</span><h3>انتخاب چرخه و اهداف فعال</h3><p>۱۳ هدف راهبردی مرجع حفظ می‌شوند؛ برای هر چرخه فقط اولویت‌های واقعاً قابل پیگیری را فعال کنید.</p></div></div><form id="cycleForm" class="pilot-card"><div class="pilot-fields"><label>عنوان چرخه<input name="title" required maxlength="120" placeholder="مثلاً چرخه اول استقرار"></label><label>تاریخ شروع<input name="start" type="date"></label><label>تاریخ پایان<input name="end" type="date"></label></div><h4>اولویت‌های دوره (پیشنهاد: ۳ تا ۵ هدف)</h4><div id="cycleGoals" class="pilot-checklist"></div><div class="pilot-actions"><button type="submit" class="btn primary">ذخیره چرخه</button><span class="pilot-muted">انتخاب‌ها صرفاً برنامه Pilot هستند؛ به معنای تصویب رسمی سازمان نیستند.</span></div></form>',
pilotMetrics:'<div class="pilot-head"><div><span class="pilot-kicker">MEASURABLE OUTCOMES</span><h3>ثبت نتیجه کلیدی با داده واقعی</h3><p>درصد پیشرفت از مقادیر عددی محاسبه می‌شود. مقدار اولیه و هدف را بدون حدس و بر اساس داده معتبر ثبت کنید.</p></div></div><div class="pilot-row"><form class="pilot-card" id="metricForm"><h4>به‌روزرسانی نتیجه کلیدی</h4><div class="pilot-fields single"><label>هدف راهبردی<select id="pilotMetricObjective" required></select></label><label>نتیجه کلیدی (KR)<select id="pilotMetricKr" required></select></label></div><div class="pilot-fields"><label>Baseline / Start<input id="pilotMetricBaseline" type="number" step="any" required placeholder="عدد اولیه"></label><label>Target<input id="pilotMetricTarget" type="number" step="any" required placeholder="عدد هدف"></label><label>Current<input id="pilotMetricCurrent" type="number" step="any" required placeholder="عدد امروز"></label></div><div class="pilot-fields"><label>وضعیت اجرایی<select id="pilotMetricRisk"><option value="on-track">طبق برنامه</option><option value="at-risk">نیازمند توجه</option><option value="off-track">عقب از برنامه</option></select></label><label>مالک نتیجه<input id="pilotMetricOwner" maxlength="100" placeholder="نام مسئول"></label></div><label class="pilot-field">شواهد، مانع یا توضیح<textarea id="pilotMetricNote" rows="3" placeholder="منبع داده و آنچه تغییر کرده است"></textarea></label><div class="pilot-calc" id="pilotMetricPreview">برای مشاهده پیشرفت، سه عدد وارد کنید.</div><div class="pilot-actions"><button class="btn primary" type="submit">ثبت Check-in عددی</button></div></form><section class="pilot-card"><h4>تاریخچه نتایج عددی</h4><div class="pilot-muted">تکمیل فعالیت به‌خودی‌خود پیشرفت KR را تغییر نمی‌دهد.</div><div id="pilotMetricHistory"></div></section></div>',
pilotProjects:'<div class="pilot-head"><div><span class="pilot-kicker">EXECUTION & ACCOUNTABILITY</span><h3>پروژه‌ها و وظایف</h3><p>هر اقدام باید مالک، وضعیت و ارتباط مشخص با یک هدف داشته باشد. تکمیل وظیفه با تحقق KR یکسان نیست.</p></div></div><div class="pilot-row"><form id="taskForm" class="pilot-card"><h4>ثبت اقدام جدید</h4><label class="pilot-field">عنوان اقدام<input id="taskTitle" required maxlength="180" placeholder="مثلاً استانداردسازی فرایند پذیرش"></label><div class="pilot-fields"><label>هدف مرتبط<select id="taskObjective" required></select></label><label>نتیجه کلیدی مرتبط<select id="taskKr"></select></label><label>مسئول<input id="taskOwner" maxlength="100" placeholder="نام فرد یا واحد"></label><label>موعد اقدام<input id="taskDue" type="date"></label><label>وضعیت<select id="taskStatus"><option value="todo">شروع‌نشده</option><option value="doing">در حال انجام</option><option value="done">تکمیل‌شده</option><option value="blocked">متوقف / مانع</option></select></label></div><label class="pilot-field">یادداشت<textarea id="taskNote" rows="2"></textarea></label><div class="pilot-actions"><button class="btn primary" type="submit">افزودن اقدام</button></div></form><section class="pilot-card"><h4>فهرست اقدامات</h4><div id="pilotTasks"></div></section></div>',
pilotMeetings:'<div class="pilot-head"><div><span class="pilot-kicker">MEETINGS & FOLLOW THROUGH</span><h3>جلسات بازبینی و پیگیری</h3><p>برای هر گفت‌وگو، موضوع، تصمیم و اقدام بعدی ثبت کنید؛ پیگیری را به یک وظیفه عملیاتی متصل کنید.</p></div></div><div class="pilot-row"><form id="meetingForm" class="pilot-card"><h4>ثبت جلسه یا Review</h4><div class="pilot-fields"><label>عنوان جلسه<input id="meetingTitle" required maxlength="160" placeholder="مرور هفتگی معاونت"></label><label>تاریخ<input id="meetingDate" type="date" required></label><label>هدف مرتبط<select id="meetingObjective"></select></label><label>مسئول پیگیری<input id="meetingOwner" maxlength="100"></label></div><label class="pilot-field">مشاهدات و مسائل مطرح‌شده<textarea id="meetingNotes" rows="3"></textarea></label><label class="pilot-field">تصمیم جلسه<textarea id="meetingDecision" rows="2" required></textarea></label><div class="pilot-fields"><label>گام بعدی (اختیاری)<input id="meetingNext" maxlength="180"></label><label>سررسید اقدام<input id="meetingDue" type="date"></label></div><div class="pilot-actions"><button class="btn primary" type="submit">ذخیره جلسه</button></div></form><section class="pilot-card"><h4>آخرین جلسات ثبت‌شده</h4><div id="pilotMeetingList"></div></section></div>'
};
Object.keys(pages).forEach(function(k){var section=el("section","page pilot-page");section.id=k;section.innerHTML=pages[k];content.appendChild(section)});
var originalHero=document.querySelector("#home .info-strip");
if(originalHero){var banner=el("div","pilot-entry");banner.innerHTML='<div><b>نسخه جدید آزمایشی اجرا و پایش راهبرد</b><span>چرخه‌های فعال، نتایج عددی، وظایف و جلسات؛ مستقل از داده‌های نسخه اصلی</span></div><button class="btn primary" data-goto="pilotHub">ورود به Pilot ←</button>';originalHero.after(banner)}
go=function(page){originalGo(page);if(extra[page]){renderPilot(page);history.replaceState(null,"","#"+page)}};
function textOrEmpty(x,fallback){return x?esc(x):'<span class="pilot-muted">'+(fallback||"هنوز ثبت نشده")+'</span>'}
function objectiveOption(o){return '<option value="'+o.id+'">هدف '+fmt(o.id)+' — '+esc(o.title)+'</option>'}
function renderSelect(target,includeNone){var x=document.getElementById(target);if(!x)return;var value=x.value;x.innerHTML=(includeNone?'<option value="">بدون هدف مشخص</option>':'')+objectives.map(objectiveOption).join("");if(value&&[...x.options].some(function(op){return op.value===value}))x.value=value}
function renderKrSelect(objId,selectId,allowEmpty){var x=document.getElementById(selectId);if(!x)return;var o=objectives.find(function(a){return String(a.id)===String(objId)});var old=x.value;x.innerHTML=(allowEmpty?'<option value="">بدون KR مشخص</option>':'')+(o?o.krs.map(function(k,i){return '<option value="'+i+'">KR'+(i+1)+' · '+esc(k)+'</option>'}).join(""):"");if([...x.options].some(function(op){return op.value===old}))x.value=old}
function metricProgress(a,b,c){if(![a,b,c].every(Number.isFinite)||a===b)return null;return Math.max(0,Math.min(100,Math.round(100*(c-a)/(b-a))))}
function statusLabel(st){return {"todo":"شروع‌نشده","doing":"در حال انجام","done":"تکمیل‌شده","blocked":"متوقف","on-track":"طبق برنامه","at-risk":"نیازمند توجه","off-track":"عقب از برنامه"}[st]||"نامشخص"}
function renderPilot(page){
 if(!page||page==="pilotHub"){renderHub();return}
 if(page==="pilotCycle"){renderCycle();return}
 if(page==="pilotMetrics"){renderMetrics();return}
 if(page==="pilotProjects"){renderTasks();return}
 if(page==="pilotMeetings"){renderMeetings();return}
}
function renderHub(){
 var active=pilot.cycle.active||[];var tasks=pilot.tasks||[];var late=tasks.filter(function(t){return t.status!=="done"&&t.due&&t.due<new Date().toISOString().slice(0,10)});var metrics=pilot.measurements||[];
 var latest={};metrics.forEach(function(x){var k=x.objectiveId+"-"+x.krIndex;if(!latest[k]||x.at>latest[k].at)latest[k]=x});
 var average=Object.values(latest).length?Math.round(Object.values(latest).reduce(function(s,x){return s+x.progress},0)/Object.values(latest).length):null;
 document.getElementById("pilotStats").innerHTML=[
 ["اهداف فعال",fmt(active.length)],
 ["نتایج دارای داده",fmt(Object.keys(latest).length)],
 ["میانگین پیشرفت ثبت‌شده",average==null?"—":fmt(average)+"٪"],
 ["وظایف معوق",fmt(late.length)]
 ].map(function(x){return '<div><strong>'+x[1]+'</strong><span>'+x[0]+'</span></div>'}).join("");
 document.getElementById("pilotActiveList").innerHTML=active.length?active.map(function(i){var o=objectives.find(function(a){return a.id===i});return o?'<div class="pilot-list-item"><b>هدف '+fmt(i)+'</b><span>'+esc(o.title)+'</span></div>':""}).join(""):'<p class="pilot-muted">هنوز هدف فعالی برای این چرخه انتخاب نکرده‌اید.</p>';
 var risks=Object.values(latest).filter(function(x){return x.risk!=="on-track"});
 document.getElementById("pilotAttention").innerHTML=late.length||risks.length?
 late.slice(0,5).map(function(t){return '<div class="pilot-list-item"><b>اقدام معوق</b><span>'+esc(t.title)+' · '+esc(t.due)+'</span></div>'}).join("")+
 risks.slice(0,5).map(function(x){return '<div class="pilot-list-item"><b>'+statusLabel(x.risk)+'</b><span>'+esc(x.label)+' · '+fmt(x.progress)+'٪</span></div>'}).join("")
 :'<p class="pilot-muted">موردی ثبت نشده است. نبود داده به معنای عملکرد مطلوب نیست.</p>';
 document.getElementById("pilotNotice").textContent=notice;
}
function renderCycle(){
 var f=document.getElementById("cycleForm");f.elements.title.value=pilot.cycle.title||"";f.elements.start.value=pilot.cycle.start||"";f.elements.end.value=pilot.cycle.end||"";
 document.getElementById("cycleGoals").innerHTML=objectives.map(function(o){return '<label><input type="checkbox" name="activeGoal" value="'+o.id+'" '+(pilot.cycle.active.includes(o.id)?"checked":"")+'><span><b>هدف '+fmt(o.id)+'</b>'+esc(o.title)+'</span></label>'}).join("");
}
function renderMetrics(){
 renderSelect("pilotMetricObjective",false);var o=document.getElementById("pilotMetricObjective");if(!o.dataset.picked){o.dataset.picked="1";var focus=pilot.cycle.active[0];if(focus)o.value=String(focus)}
 renderKrSelect(o.value,"pilotMetricKr",false);
 renderMetricHistory();metricPreview();
}
function renderMetricHistory(){
 var xs=pilot.measurements.slice().sort(function(a,b){return b.at-a.at}).slice(0,12);
 document.getElementById("pilotMetricHistory").innerHTML=xs.length?xs.map(function(x){return '<div class="pilot-list-item"><div class="pilot-item-top"><b>'+esc(x.label)+'</b><strong>'+fmt(x.progress)+'٪</strong></div><span>'+fmt(x.current)+' از '+fmt(x.baseline)+' به '+fmt(x.target)+' · '+new Date(x.at).toLocaleDateString("fa-IR")+'</span><span>'+statusLabel(x.risk)+' · '+textOrEmpty(x.owner,"بدون مسئول")+'</span>'+ (x.note?'<small>'+esc(x.note)+'</small>':"")+'</div>'}).join(""):'<p class="pilot-muted">هنوز نتیجه عددی ثبت نشده است.</p>';
}
function metricPreview(){
 var a=Number(document.getElementById("pilotMetricBaseline").value),b=Number(document.getElementById("pilotMetricTarget").value),c=Number(document.getElementById("pilotMetricCurrent").value);
 var filled=["pilotMetricBaseline","pilotMetricTarget","pilotMetricCurrent"].every(function(k){return document.getElementById(k).value.trim()!==""});
 var p=filled?metricProgress(a,b,c):null;
 document.getElementById("pilotMetricPreview").textContent=!filled?"Baseline، Current و Target را وارد کنید.":p===null?"خطا: Baseline و Target باید متفاوت باشند.":"پیشرفت محاسبه‌شده: "+fmt(p)+"٪ · "+(b<a?"کاهش مقدار مطلوب است.":"افزایش مقدار مطلوب است.");
}
function renderTasks(){
 renderSelect("taskObjective",false);
 renderKrSelect(document.getElementById("taskObjective").value,"taskKr",true);
 var list=pilot.tasks.slice().sort(function(a,b){return (a.status==="done")-(b.status==="done")||(a.due||"9999").localeCompare(b.due||"9999")});
 document.getElementById("pilotTasks").innerHTML=list.length?list.map(function(t){var o=objectives.find(function(x){return x.id===t.objectiveId});return '<div class="pilot-list-item"><div class="pilot-item-top"><b>'+esc(t.title)+'</b><span class="pilot-state">'+statusLabel(t.status)+'</span></div><span>هدف '+fmt(t.objectiveId)+(t.krIndex!==""?" · KR"+(Number(t.krIndex)+1):"")+' · '+textOrEmpty(t.owner,"بدون مسئول")+'</span><span>سررسید: '+textOrEmpty(t.due,"نامشخص")+'</span>'+(t.note?'<small>'+esc(t.note)+'</small>':"")+'<div class="pilot-mini-actions"><button data-task-toggle="'+esc(t.id)+'" class="btn small">'+(t.status==="done"?"بازگشایی":"تکمیل")+'</button><button data-task-delete="'+esc(t.id)+'" class="btn small">حذف</button></div></div>'}).join(""):'<p class="pilot-muted">اقدامی ثبت نشده است.</p>';
}
function renderMeetings(){
 renderSelect("meetingObjective",true);
 var sel=document.getElementById("meetingObjective");if(!sel.options[0]||sel.options[0].value!==""){sel.insertAdjacentHTML("afterbegin",'<option value="">بدون هدف مشخص</option>')}
 if(!document.getElementById("meetingDate").value)document.getElementById("meetingDate").value=new Date().toISOString().slice(0,10);
 document.getElementById("pilotMeetingList").innerHTML=pilot.meetings.length?pilot.meetings.slice().reverse().slice(0,12).map(function(x){return '<div class="pilot-list-item"><div class="pilot-item-top"><b>'+esc(x.title)+'</b><span>'+esc(x.date)+'</span></div><span>تصمیم: '+esc(x.decision)+'</span>'+(x.notes?'<small>'+esc(x.notes)+'</small>':"")+(x.next?'<span>پیگیری: '+esc(x.next)+'</span>':"")+'</div>'}).join(""):'<p class="pilot-muted">هنوز جلسه‌ای ثبت نشده است.</p>';
}
document.addEventListener("click",function(e){
 var g=e.target.closest("[data-goto]");if(g){go(g.dataset.goto);return}
 var tog=e.target.closest("[data-task-toggle]");if(tog){var t=pilot.tasks.find(function(x){return x.id===tog.dataset.taskToggle});if(t){t.status=t.status==="done"?"todo":"done";save();renderTasks()}return}
 var del=e.target.closest("[data-task-delete]");if(del){if(confirm("این اقدام آزمایشی حذف شود؟")){pilot.tasks=pilot.tasks.filter(function(x){return x.id!==del.dataset.taskDelete});save();renderTasks()}return}
 if(e.target.closest("#pilotExport")){var out={format:"kish-perdoo-pilot",schemaVersion:1,exportedAt:new Date().toISOString(),pilot:pilot,checkins:checkins,kpiData:kpiData,owners:owners};var blob=new Blob([JSON.stringify(out,null,2)],{type:"application/json"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="kish-okr-pilot-backup.json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},2000)}
});
document.addEventListener("change",function(e){
 if(e.target.id==="pilotMetricObjective")renderKrSelect(e.target.value,"pilotMetricKr",false);
 if(e.target.id==="taskObjective")renderKrSelect(e.target.value,"taskKr",true);
 if(e.target.id==="pilotImportFile"){
  var file=e.target.files[0];if(!file)return;
  if(file.size>3000000){alert("اندازه فایل بیش از حد مجاز است.");e.target.value="";return}
  var reader=new FileReader();reader.onload=function(){
   try{var d=JSON.parse(reader.result);if(d.format!=="kish-perdoo-pilot"||!valid(d.pilot)||!Array.isArray(d.checkins)||!d.kpiData||!d.owners)throw Error("Invalid schema");
    if(!confirm("اطلاعات فعلی Pilot با محتوای فایل جایگزین شوند؟"))return;
    pilot=d.pilot;pilot.people=Array.isArray(pilot.people)?pilot.people:[];pilot.unitPlans=pilot.unitPlans||{};pilot.scope=pilot.scope||"";checkins=d.checkins;kpiData=d.kpiData;owners=d.owners;
    persist();save();renderAllDynamic();renderHub();renderOrganization();notice="فایل بازیابی شد.";
   }catch(err){alert("این فایل پشتیبان معتبر Pilot نیست.")}finally{e.target.value=""}
  };reader.readAsText(file);
 }
});
document.addEventListener("input",function(e){if(["pilotMetricBaseline","pilotMetricTarget","pilotMetricCurrent"].includes(e.target.id))metricPreview()});
document.addEventListener("submit",function(e){
 if(!["cycleForm","metricForm","taskForm","meetingForm"].includes(e.target.id))return;
 e.preventDefault();
 if(e.target.id==="cycleForm"){
  var f=e.target;var active=[...f.querySelectorAll('input[name="activeGoal"]:checked')].map(function(x){return Number(x.value)});
  if(active.length<1||active.length>5){alert("برای حفظ تمرکز، بین ۱ تا ۵ هدف فعال انتخاب کنید.");return}
  if(f.elements.start.value&&f.elements.end.value&&f.elements.end.value<f.elements.start.value){alert("تاریخ پایان نمی‌تواند زودتر از شروع باشد.");return}
  pilot.cycle={title:f.elements.title.value.trim(),start:f.elements.start.value,end:f.elements.end.value,active:active};
  if(save()){alert("چرخه آزمایشی ذخیره شد.");renderCycle()}return;
 }
 if(e.target.id==="metricForm"){
  var oid=Number(document.getElementById("pilotMetricObjective").value);
  var ki=Number(document.getElementById("pilotMetricKr").value);
  var o=objectives.find(function(x){return x.id===oid});if(!o||!o.krs[ki])return;
  var a=Number(document.getElementById("pilotMetricBaseline").value),b=Number(document.getElementById("pilotMetricTarget").value),c=Number(document.getElementById("pilotMetricCurrent").value);
  var p=metricProgress(a,b,c);if(p===null){alert("مقادیر نامعتبر یا Baseline برابر Target است.");return}
  var own=document.getElementById("pilotMetricOwner").value.trim(),risk=document.getElementById("pilotMetricRisk").value,note=document.getElementById("pilotMetricNote").value.trim(),at=Date.now();
  var row={id:id(),objectiveId:oid,krIndex:ki,label:"هدف "+oid+" · "+o.krs[ki],baseline:a,target:b,current:c,progress:p,risk:risk,owner:own,note:note,at:at};
  row.unitId=document.getElementById("metricUnit").value;row.personId=document.getElementById("metricPerson").value;pilot.measurements.push(row);
  checkins.unshift({goal:"kr-"+oid+"-"+ki,progress:p,conf:risk,owner:own,win:note,blocker:"",next:"",ts:at,pilotMeasured:true});
  if(own)owners["kr-"+oid+"-"+ki]=own;
  persist();save();renderAllDynamic();renderMetricHistory();metricPreview();alert("نتیجه عددی و Check-in ثبت شد.");return;
 }
 if(e.target.id==="taskForm"){
  var title=document.getElementById("taskTitle").value.trim();if(!title)return;
  pilot.tasks.push({id:id(),title:title,unitId:document.getElementById("taskUnit").value,personId:document.getElementById("taskPerson").value,workstream:document.getElementById("taskWorkstream").value,objectiveId:Number(document.getElementById("taskObjective").value),krIndex:document.getElementById("taskKr").value,owner:document.getElementById("taskOwner").value.trim(),due:document.getElementById("taskDue").value,status:document.getElementById("taskStatus").value,note:document.getElementById("taskNote").value.trim(),at:Date.now()});
  if(save()){e.target.reset();renderTasks()}return;
 }
 if(e.target.id==="meetingForm"){
  var obj=document.getElementById("meetingObjective").value,title2=document.getElementById("meetingTitle").value.trim(),next=document.getElementById("meetingNext").value.trim(),due=document.getElementById("meetingDue").value,owner=document.getElementById("meetingOwner").value.trim();
  if(!title2)return;
  var x={id:id(),title:title2,unitId:document.getElementById("meetingUnit").value,personId:document.getElementById("meetingPerson").value,workstream:document.getElementById("meetingWorkstream").value,date:document.getElementById("meetingDate").value,objectiveId:obj,owner:owner,notes:document.getElementById("meetingNotes").value.trim(),decision:document.getElementById("meetingDecision").value.trim(),next:next,due:due,at:Date.now()};
  pilot.meetings.push(x);
  if(next&&obj){pilot.tasks.push({id:id(),title:next,unitId:document.getElementById("meetingUnit").value,personId:document.getElementById("meetingPerson").value,workstream:document.getElementById("meetingWorkstream").value,objectiveId:Number(obj),krIndex:"",owner:owner,due:due,status:"todo",note:"پیگیری از جلسه: "+title2,at:Date.now(),meetingId:x.id})}
  if(save()){e.target.reset();renderMeetings();alert("جلسه ذخیره شد"+(next&&obj?" و اقدام پیگیری به وظایف اضافه شد.":"."))}return;
 }
});

/* Organization-wide source-of-truth layer (65 official chart units).
   Only personal details typed by the visitor are saved locally in this browser. */
var orgTopRoots=[
 {id:"ceo",label:"حوزه مدیرعامل و واحدهای ستادی"},
 {id:"org-finance-admin",label:"معاونت مالی، اداری و پشتیبانی"},
 {id:"org-economic-technical",label:"معاونت اقتصادی و فنی"},
 {id:"org-airports",label:"اداره کل فرودگاه‌های کیش"},
 {id:"org-ports",label:"اداره کل بنادر کیش"}
];
var orgIndex=Object.fromEntries(ORG_CHART.map(function(n){return [n.id,n]}));
var rootIds=new Set(orgTopRoots.filter(function(x){return x.id!=="ceo"}).map(function(x){return x.id}));
function belongsToGroup(unitId){
 var node=orgIndex[unitId];if(!node)return "";
 while(node.parentId&&orgIndex[node.parentId])node=orgIndex[node.parentId];
 return rootIds.has(node.id)?node.id:"ceo";
}
function scopedTo(unitId,scope){
 if(!scope)return true;
 if(!unitId)return false;
 if(scope==="ceo")return belongsToGroup(unitId)==="ceo";
 var n=orgIndex[unitId];
 while(n){if(n.id===scope)return true;n=orgIndex[n.parentId]}
 return false;
}
function treePath(unitId){
 var a=[],n=orgIndex[unitId],seen=new Set();
 while(n&&!seen.has(n.id)){seen.add(n.id);a.unshift(n.fa);n=orgIndex[n.parentId]}
 return a;
}
function unitLabel(unitId){return orgIndex[unitId]?.fa||"کل شرکت"}
function selectedOrgUnit(){for(var i=4;i>=1;i--){var e=document.getElementById("orgTier"+i);if(e&&e.value)return e.value}var b=document.getElementById("orgBranch");return b?b.value||"":""}
function childrenOf(parent){
 return ORG_CHART.filter(function(n){return n.parentId===parent})
}
function orgSelectorOptions(withNone){
 return (withNone?'<option value="">کل شرکت / انتخاب نشده</option>':'')+ORG_CHART.map(function(n){
  var path=treePath(n.id).join(" ← ");
  return '<option value="'+esc(n.id)+'">'+esc(path)+'</option>';
 }).join("")
}
function addUnitAndPersonFields(formId,afterId,unitId,personId,includeStream){
 var anchor=document.getElementById(afterId);if(!anchor)return;
 var container=el("div","pilot-fields");
 container.innerHTML=
 '<label>واحد سازمانی (از چارت رسمی)<select id="'+unitId+'">'+orgSelectorOptions(true)+'</select></label>'+
 '<label>مسئول / فرد (فهرست محلی)<select id="'+personId+'"><option value="">نامشخص / ثبت‌نشده</option></select></label>'+
 (includeStream?'<label>مسیر اقدام<select id="'+includeStream+'"><option value="revision">بازنگری و تدوین سند راهبردی</option><option value="execution">استقرار و اجرای OKR</option></select></label>':"");
 (anchor.closest(".pilot-fields")||anchor.closest(".pilot-field")||anchor.closest("label")||anchor).insertAdjacentElement("afterend",container);
 var u=document.getElementById(unitId),p=document.getElementById(personId);
 u.value=pilot.scope&&pilot.scope!=="ceo"&&orgIndex[pilot.scope]?pilot.scope:"";
 fillPeople(p,u.value);
 u.addEventListener("change",function(){fillPeople(p,u.value)});
}
function fillPeople(select,unit){
 var previous=select.value;
 var list=pilot.people.filter(function(person){return !unit||person.unitId===unit});
 select.innerHTML='<option value="">انتخاب شخص / هنوز معرفی نشده</option>'+list.map(function(person){return '<option value="'+esc(person.id)+'">'+esc(person.name+" · "+(person.job||unitLabel(person.unitId)))+'</option>'}).join("");
 if(list.some(function(person){return person.id===previous}))select.value=previous;
}
function setScope(scope){
 pilot.scope=scope||"";save();
 ["taskUnit","metricUnit","meetingUnit"].forEach(function(id){
  var x=document.getElementById(id);if(x){x.value=pilot.scope!=="ceo"&&orgIndex[pilot.scope]?pilot.scope:"";var personId={taskUnit:"taskPerson",metricUnit:"metricPerson",meetingUnit:"meetingPerson"}[id];fillPeople(document.getElementById(personId),x.value)}
 });
 if(document.getElementById("pilotGlobalScope"))document.getElementById("pilotGlobalScope").value=scope||"";
 renderHub();
}
function orgDepth(n){var i=0;while(n?.parentId){i++;n=orgIndex[n.parentId]}return i}
function renderOrgDirectory(){
 var list=document.getElementById("orgTreeList");if(!list)return;
 var q=(document.getElementById("orgSearch").value||"").trim().replaceAll("ي","ی").replaceAll("ك","ک");
 var group=document.getElementById("orgBranch").value||"";
 var vals=ORG_CHART.filter(function(n){
  return (!group||belongsToGroup(n.id)===group)&&(!q||treePath(n.id).join(" ").includes(q)||n.en.toLowerCase().includes(q.toLowerCase()));
 }).sort(function(a,b){
  var ia=ORG_CHART.indexOf(a),ib=ORG_CHART.indexOf(b);
  return belongsToGroup(a.id).localeCompare(belongsToGroup(b.id))||ia-ib;
 });
 document.getElementById("orgTreeCount").textContent=fmt(vals.length)+" واحد از ۶۵";
 list.innerHTML=vals.map(function(n){
  var d=Math.min(3,orgDepth(n));
  return '<button type="button" class="pilot-org-node" style="--depth:'+d+'" data-org-pick="'+esc(n.id)+'"><b>'+esc(n.fa)+'</b><small>'+esc(ORG_LEVELS[n.level]?.[0]||n.level)+' · صفحه '+fmt(n.page)+' چارت</small></button>';
 }).join("")||'<p class="pilot-muted">واحدی با این جست‌وجو وجود ندارد.</p>';
}
function setupCascades(){
 var branch=document.getElementById("orgBranch");
 branch.innerHTML='<option value="">تمام حوزه‌های شرکت</option>'+orgTopRoots.map(function(x){return '<option value="'+x.id+'">'+esc(x.label)+'</option>'}).join("");
 for(var level=1;level<=4;level++){
  var t=document.getElementById("orgTier"+level);
  t.innerHTML='<option value="">انتخاب کنید…</option>';
  t.disabled=true;
 }
 refreshOrgTier(1,"");
 branch.addEventListener("change",function(){refreshOrgTier(1,this.value);setScope(this.value||"");renderOrgDirectory()});
 for(let level=1;level<=4;level++){
  document.getElementById("orgTier"+level).addEventListener("change",function(){
   refreshOrgTier(level+1,this.value);
   var selection=selectedOrgUnit();
   setScope(selection);
   renderOrgUnitPlan();
  });
 }
}
function refreshOrgTier(from,parent){
 var b=document.getElementById("orgBranch"),branch=b.value;
 for(var i=from;i<=4;i++){
  var tier=document.getElementById("orgTier"+i);if(!tier)continue;
  var units=[];
  if(i===1){
   if(branch==="ceo")units=ORG_CHART.filter(function(n){return !n.parentId&&belongsToGroup(n.id)==="ceo"});
   else if(branch&&orgIndex[branch])units=[orgIndex[branch]];
  }else if(parent&&orgIndex[parent])units=childrenOf(parent);
  tier.innerHTML='<option value="">'+(units.length?"انتخاب پست / واحد…":"بدون واحد زیرمجموعه")+'</option>'+
    units.map(function(n){return '<option value="'+esc(n.id)+'">'+esc(n.fa)+'</option>'}).join("");
  tier.disabled=!units.length;
  if(i===from)parent="";
 }
 renderOrgUnitPlan();
}
function renderOrgUnitPlan(){
 var target=document.getElementById("orgUnitSelected");if(!target)return;
 var scope=selectedOrgUnit();
 target.textContent=orgIndex[scope]?treePath(scope).join(" ← "):"برای تعیین وضعیت و مسئولیت، یک واحد سازمانی را انتخاب کنید.";
 var controls=document.getElementById("orgPlanControls");controls.hidden=!orgIndex[scope];
 if(!orgIndex[scope])return;
 var state=pilot.unitPlans[scope]||{};
 document.getElementById("orgRevisionStatus").value=state.revision||"unstarted";
 document.getElementById("orgExecutionStatus").value=state.execution||"unstarted";
 document.getElementById("orgRevisionOwner").value=state.revisionOwner||"";
 document.getElementById("orgExecutionOwner").value=state.executionOwner||"";
 document.getElementById("orgUnitNotes").value=state.notes||"";
 document.getElementById("orgChosenPeople").innerHTML=pilot.people.filter(function(p){return p.unitId===scope}).map(function(p){return '<span class="pilot-people-chip">'+esc(p.name)+' · '+esc(p.job)+'</span>'}).join("")||'<span class="pilot-muted">برای این واحد هنوز نام هیچ فردی ثبت نشده است.</span>';
}
function focusOrgNode(nodeId){
 var n=orgIndex[nodeId];if(!n)return;
 var branch=belongsToGroup(nodeId),b=document.getElementById("orgBranch");
 b.value=branch;
 refreshOrgTier(1,branch);
 var path=[],cur=n;
 while(cur){path.unshift(cur.id);cur=orgIndex[cur.parentId]}
 if(branch==="ceo"){
  // One root office/management, then its subordinate offices.
 }else if(path[0]!==branch)path.unshift(branch);
 for(var i=0;i<Math.min(4,path.length);i++){
  var tier=document.getElementById("orgTier"+(i+1));
  tier.value=path[i];if(i<3)refreshOrgTier(i+2,path[i]);
 }
 setScope(nodeId);renderOrgUnitPlan();renderOrgDirectory();
}
function renderOrganization(){
 renderOrgDirectory();
 renderOrgUnitPlan();
 document.getElementById("orgPeopleList").innerHTML=pilot.people.map(function(p){
  return '<div class="pilot-list-item"><div class="pilot-item-top"><b>'+esc(p.name)+'</b><button type="button" class="btn small" data-org-person-remove="'+esc(p.id)+'">حذف</button></div><span>'+esc(p.job||"نقش نامشخص")+' · '+esc(unitLabel(p.unitId))+'</span></div>';
 }).join("")||'<p class="pilot-muted">اطلاعات اسامی کارکنان در چارت موجود نیست؛ پس از تأیید منابع انسانی تکمیل شود.</p>';
}
var navOrg=el("button");navOrg.dataset.page="pilotOrg";navOrg.innerHTML='<span aria-hidden="true">♙</span><span>چارت و واحدهای سازمانی</span>';
document.getElementById("desktopNav").appendChild(navOrg);
extra.pilotOrg="ساختار سازمانی و نقش واحدها";titles.pilotOrg=extra.pilotOrg;
var orgPage=el("section","page pilot-page");orgPage.id="pilotOrg";
orgPage.innerHTML=
'<div class="pilot-head"><div><span class="pilot-kicker">ORGANIZATION STRUCTURE · SOURCE 1404</span><h3>چارت سازمانی و مسئولیت واحدها</h3><p>مبنای انتخاب واحد در هر دو مسیر «بازنگری سند راهبردی» و «استقرار OKR»، چارت رسمی ۱۱صفحه‌ای شرکت است.</p></div><span class="pilot-pill">۶۵ واحد رسمی · ۵ حوزه نمایشی</span></div>'+
'<div class="pilot-org-layout"><div class="pilot-card"><h4>فیلتر و انتخاب آبشاری واحد</h4><div class="pilot-fields single">'+
 '<label>حوزه سازمانی<select id="orgBranch"></select></label>'+
 '<label>سطح نخست: اداره کل / معاونت / مدیریت<select id="orgTier1"></select></label>'+
 '<label>سطح دوم: معاونت / مدیریت / اداره<select id="orgTier2"></select></label>'+
 '<label>سطح سوم: واحد زیرمجموعه<select id="orgTier3"></select></label>'+
 '<label>سطح چهارم: واحد تابعه (در صورت وجود)<select id="orgTier4"></select></label>'+
 '</div><label class="pilot-field">جست‌وجوی سازمانی<input id="orgSearch" type="search" placeholder="نام مدیریت، اداره، بندر، فرودگاه…"></label><div class="pilot-item-top"><h4 style="margin:6px 0">فهرست ساختار سازمانی</h4><span class="pilot-muted" id="orgTreeCount"></span></div><div id="orgTreeList" class="pilot-org-tree"></div></div>'+
 '<div class="pilot-card"><h4>دو مسیر مدیریتی برای هر واحد</h4><div class="pilot-org-selection" id="orgUnitSelected"></div>'+
 '<div id="orgPlanControls" hidden><form id="orgPlanForm">'+
 '<div class="pilot-tracks"><div><b>۱. بازنگری سند راهبردی</b><label>وضعیت مشارکت<select id="orgRevisionStatus"><option value="unstarted">شروع‌نشده</option><option value="collecting">جمع‌آوری نظر و اطلاعات</option><option value="reviewing">در دست بازبینی</option><option value="validated">بازبینی‌شده / نیازمند تصویب نهایی</option></select></label><label>مسئول/نماینده واحد<input id="orgRevisionOwner" maxlength="100" placeholder="پس از تأیید معرفی شود"></label></div>'+
 '<div><b>۲. استقرار نظام OKR</b><label>وضعیت اجرا<select id="orgExecutionStatus"><option value="unstarted">شروع‌نشده</option><option value="preparing">آماده‌سازی و آموزش</option><option value="pilot">پایلوت در واحد</option><option value="live">اجرای جاری / در حال پایش</option></select></label><label>مسئول/سفیر OKR<input id="orgExecutionOwner" maxlength="100" placeholder="پس از تأیید معرفی شود"></label></div></div>'+
 '<label class="pilot-field">نکات و نیازهای واحد<textarea id="orgUnitNotes" rows="3" placeholder="تعاملات بین‌واحدی، چالش‌ها، پیشنهادهای بازنگری…"></textarea></label><button class="btn primary" type="submit">ذخیره وضعیت و مسئولیت واحد</button></form><h4 style="margin-top:22px">افراد تعریف‌شده این واحد</h4><div id="orgChosenPeople"></div></div>'+
 '<div class="pilot-org-warning">چارت، نام افراد و انتصابات فعلی را تأیید نمی‌کند. اسامی پایین فقط داده‌هایی هستند که خودتان در این مرورگر وارد می‌کنید؛ این نسخه پایگاه منابع انسانی یا سامانه ثبت هویت نیست.</div>'+
 '<form id="orgPersonForm"><h4 style="margin-top:20px">افزودن مسئول به فهرست محلی</h4><div class="pilot-fields"><label>نام فرد<input id="orgNewPerson" required maxlength="100" placeholder="صرفاً اطلاعات تأییدشده"></label><label>عنوان شغلی<input id="orgNewJob" required maxlength="100" placeholder="مدیر، رئیس اداره، کارشناس…"></label></div><button class="btn" type="submit">ثبت فرد برای واحد انتخاب‌شده</button></form>'+
 '<div style="margin-top:14px" id="orgPeopleList"></div></div></div>'+
 '<div class="pilot-card"><h4>مبنای داده و حدود استفاده</h4><p class="pilot-muted">عنوان فایل ارسالی «چارت جدید مهر ۱۴۰۴» است؛ روی خود سند، تاریخ اصلاح «خرداد ۱۴۰۴» درج شده است. ۶۵ شناسه سازمانی از همین منبع در نسخه آموزشی قبلی تهیه شده‌اند و اکنون برای این Pilot استفاده می‌شوند. تغییر انتصابات یا ساختار رسمی باید با تأیید سازمان انجام شود.</p></div>';
content.appendChild(orgPage);
document.getElementById("orgSearch").addEventListener("input",renderOrgDirectory);
setupCascades();
var topHub=document.getElementById("pilotHub");
var firstCards=topHub.querySelector(".pilot-grid-links");
if(firstCards){
 var orgShortcut=el("button");
 orgShortcut.dataset.goto="pilotOrg";
 orgShortcut.innerHTML='<b>۵. ساختار سازمانی</b><small>انتخاب معاونت، مدیریت، اداره و مسئول</small><span>ورود ←</span>';
 firstCards.appendChild(orgShortcut);
}
var scopePicker=el("div","pilot-card pilot-global-filter");
scopePicker.innerHTML='<label>حوزه / واحد مورد بررسی در داشبورد <select id="pilotGlobalScope">'+orgSelectorOptions(true)+'</select></label>'+
 '<button class="btn small" data-goto="pilotOrg">انتخاب آبشاری واحد ←</button>';
topHub.querySelector(".pilot-stats").before(scopePicker);
document.getElementById("pilotGlobalScope").value=orgIndex[pilot.scope]?pilot.scope:"";
document.getElementById("pilotGlobalScope").addEventListener("change",function(){setScope(this.value)});
addUnitAndPersonFields("metricForm","pilotMetricRisk","metricUnit","metricPerson",null);
addUnitAndPersonFields("taskForm","taskObjective","taskUnit","taskPerson","taskWorkstream");
addUnitAndPersonFields("meetingForm","meetingObjective","meetingUnit","meetingPerson","meetingWorkstream");
var oldRenderPilot=renderPilot;
renderPilot=function(page){if(page==="pilotOrg"){renderOrganization();return;}oldRenderPilot(page)};
var oldRenderHub=renderHub;
renderHub=function(){
 oldRenderHub();
 var s=pilot.scope;
 document.getElementById("pilotGlobalScope").value=orgIndex[s]?s:"";
 if(!s)return;
 var metrics=pilot.measurements.filter(function(x){return scopedTo(x.unitId,s)});
 var tasks=pilot.tasks.filter(function(x){return scopedTo(x.unitId,s)});
 var latest={};
 metrics.forEach(function(x){var key=x.objectiveId+"-"+x.krIndex;if(!latest[key]||x.at>latest[key].at)latest[key]=x});
 var xs=Object.values(latest),avg=xs.length?Math.round(xs.reduce(function(v,x){return v+x.progress},0)/xs.length):null;
 var late=tasks.filter(function(t){return t.status!=="done"&&t.due&&t.due<new Date().toISOString().slice(0,10)});
 var stat=document.querySelectorAll("#pilotStats>div strong");
 if(stat[0])stat[0].textContent=fmt(pilot.cycle.active.length);
 if(stat[1])stat[1].textContent=fmt(xs.length);
 if(stat[2])stat[2].textContent=avg===null?"—":fmt(avg)+"٪";
 if(stat[3])stat[3].textContent=fmt(late.length);
 document.getElementById("pilotAttention").innerHTML=late.length||xs.some(function(x){return x.risk!=="on-track"})?
 late.map(function(t){return '<div class="pilot-list-item"><b>اقدام معوق</b><span>'+esc(t.title)+' · '+esc(t.due)+'</span></div>'}).join("")+
 xs.filter(function(x){return x.risk!=="on-track"}).map(function(x){return '<div class="pilot-list-item"><b>'+statusLabel(x.risk)+'</b><span>'+esc(x.label)+'</span></div>'}).join("") :
 '<p class="pilot-muted">در حوزه انتخاب‌شده هنوز داده یا مانعی ثبت نشده است.</p>';
};
document.addEventListener("click",function(e){
 var b=e.target.closest("[data-org-pick]");if(b){focusOrgNode(b.dataset.orgPick);document.getElementById("orgUnitSelected").scrollIntoView({block:"nearest",behavior:"smooth"});return}
 var del=e.target.closest("[data-org-person-remove]");if(del){if(!confirm("شخص از فهرست محلی حذف شود؟"))return;pilot.people=pilot.people.filter(function(p){return p.id!==del.dataset.orgPersonRemove});save();renderOrganization();fillPeople(document.getElementById("taskPerson"),document.getElementById("taskUnit").value);fillPeople(document.getElementById("metricPerson"),document.getElementById("metricUnit").value);fillPeople(document.getElementById("meetingPerson"),document.getElementById("meetingUnit").value)}
});
document.addEventListener("submit",function(e){
 if(e.target.id==="orgPlanForm"){
  e.preventDefault();var u=selectedOrgUnit();if(!orgIndex[u]){alert("یک واحد سازمانی انتخاب کنید.");return}
  pilot.unitPlans[u]={revision:document.getElementById("orgRevisionStatus").value,execution:document.getElementById("orgExecutionStatus").value,revisionOwner:document.getElementById("orgRevisionOwner").value.trim(),executionOwner:document.getElementById("orgExecutionOwner").value.trim(),notes:document.getElementById("orgUnitNotes").value.trim()};
  save();alert("وضعیت این واحد در هر دو مسیر ذخیره شد.");return;
 }
 if(e.target.id==="orgPersonForm"){
  e.preventDefault();var u=selectedOrgUnit();if(!orgIndex[u]){alert("ابتدا یک واحد از چارت انتخاب کنید.");return}
  var name=document.getElementById("orgNewPerson").value.trim(),job=document.getElementById("orgNewJob").value.trim();
  if(!name||!job)return;
  if(pilot.people.some(function(p){return p.unitId===u&&p.name===name})){alert("این نام در واحد انتخابی قبلاً ثبت شده است.");return}
  pilot.people.push({id:id(),name:name,job:job,unitId:u});
  save();e.target.reset();renderOrganization();
  ["taskUnit","metricUnit","meetingUnit"].forEach(function(x){var s=document.getElementById(x),q=document.getElementById({taskUnit:"taskPerson",metricUnit:"metricPerson",meetingUnit:"meetingPerson"}[x]);fillPeople(q,s.value)});
 }
});

/* The original app and the pilot share a page, not storage keys or credentials. */
var hash=window.location.hash.slice(1);
if(extra[hash]){setTimeout(function(){go(hash)},0)}
renderHub();
})();
