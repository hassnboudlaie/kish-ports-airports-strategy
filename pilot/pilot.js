/* Kish Perdoo-inspired pilot. Browser-local workspace. No central user access. */
(function(){
"use strict";
var KEY="kish_perdoo_pilot_data_v1";
var schema=1;
var pilot={version:schema,cycle:{title:"چرخه آزمایشی",start:"",end:"",active:[]},measurements:[],tasks:[],meetings:[]};
var notice="";
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function fmt(n){return Number(n).toLocaleString("fa-IR",{maximumFractionDigits:2})}
function id(){return "k"+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(pilot));return true}catch(e){alert("ذخیره روی این مرورگر ممکن نیست. فایل پشتیبان تهیه کنید.");return false}}
function valid(x){return x&&x.version===1&&x.cycle&&Array.isArray(x.cycle.active)&&Array.isArray(x.measurements)&&Array.isArray(x.tasks)&&Array.isArray(x.meetings)}
try{var saved=JSON.parse(localStorage.getItem(KEY)||"null");if(valid(saved))pilot=saved}catch(e){notice="خواندن اطلاعات قبلی با خطا مواجه شد."}
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
function renderSelect(target,includeNone){var x=document.getElementById(target);if(!x)return;var value=x.value;x.innerHTML=(includeNone?'<option value="">بدون ارتباط به KR</option>':'')+objectives.map(objectiveOption).join("");if(value&&[...x.options].some(function(op){return op.value===value}))x.value=value}
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
    pilot=d.pilot;checkins=d.checkins;kpiData=d.kpiData;owners=d.owners;
    persist();save();renderAllDynamic();renderHub();notice="فایل بازیابی شد.";
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
  pilot.measurements.push(row);
  checkins.unshift({goal:"kr-"+oid+"-"+ki,progress:p,conf:risk,owner:own,win:note,blocker:"",next:"",ts:at,pilotMeasured:true});
  if(own)owners["kr-"+oid+"-"+ki]=own;
  persist();save();renderAllDynamic();renderMetricHistory();metricPreview();alert("نتیجه عددی و Check-in ثبت شد.");return;
 }
 if(e.target.id==="taskForm"){
  var title=document.getElementById("taskTitle").value.trim();if(!title)return;
  pilot.tasks.push({id:id(),title:title,objectiveId:Number(document.getElementById("taskObjective").value),krIndex:document.getElementById("taskKr").value,owner:document.getElementById("taskOwner").value.trim(),due:document.getElementById("taskDue").value,status:document.getElementById("taskStatus").value,note:document.getElementById("taskNote").value.trim(),at:Date.now()});
  if(save()){e.target.reset();renderTasks()}return;
 }
 if(e.target.id==="meetingForm"){
  var obj=document.getElementById("meetingObjective").value,title2=document.getElementById("meetingTitle").value.trim(),next=document.getElementById("meetingNext").value.trim(),due=document.getElementById("meetingDue").value,owner=document.getElementById("meetingOwner").value.trim();
  if(!title2)return;
  var x={id:id(),title:title2,date:document.getElementById("meetingDate").value,objectiveId:obj,owner:owner,notes:document.getElementById("meetingNotes").value.trim(),decision:document.getElementById("meetingDecision").value.trim(),next:next,due:due,at:Date.now()};
  pilot.meetings.push(x);
  if(next&&obj){pilot.tasks.push({id:id(),title:next,objectiveId:Number(obj),krIndex:"",owner:owner,due:due,status:"todo",note:"پیگیری از جلسه: "+title2,at:Date.now(),meetingId:x.id})}
  if(save()){e.target.reset();renderMeetings();alert("جلسه ذخیره شد"+(next&&obj?" و اقدام پیگیری به وظایف اضافه شد.":"."))}return;
 }
});
/* The original app and the pilot share a page, not storage keys or credentials. */
var hash=window.location.hash.slice(1);
if(extra[hash]){setTimeout(function(){go(hash)},0)}
renderHub();
})();
