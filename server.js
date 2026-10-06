import http from "node:http";

const PORT = Number(process.env.PORT || 10000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-6-sol";
const ALLOWED_ORIGINS = new Set([
  "https://hassnboudlaie.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

const buckets = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQ = 30;

function json(res, status, data, origin) {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

function rateLimited(req) {
  const raw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const ip = String(raw).split(",")[0].trim();
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.start > WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    return false;
  }
  b.count += 1;
  return b.count > MAX_REQ;
}

function extractOutputText(data) {
  if (!data || !Array.isArray(data.output)) return "";
  const parts = [];
  for (const item of data.output) {
    if (item?.type !== "message" || !Array.isArray(item.content)) continue;
    for (const c of item.content) {
      if (c?.type === "output_text" && typeof c.text === "string") parts.push(c.text);
    }
  }
  return parts.join("\n").trim();
}

function cleanJsonText(s) {
  return String(s || "")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

const SYSTEM = `
تو «همراه مربیگری کارگاه رهبری بهپرور» هستی؛ یک AI Coach کوتاه، دقیق و حرفه‌ای که کنار تسهیل‌گر انسانی کار می‌کند، نه جای او.

زمینه:
- دوره: برنامه توسعه مدیران و سرپرستان شرکت بهپرور
- جلسه ۱: «از مدیر بودن تا مدیر حرفه‌ای شدن»
- منطق جلسه: Managing Work + Leading People + Context
- موضوعات این جلسه: نقش مدیر، اثر رفتار مدیر بر رفتار کارکنان، اعتماد/احترام/اقتدار/مرزبندی، سبک مدیریت تحت فشار، تفویض و کاهش وابستگی.
- فضای سازمانی: یک مجموعه عملیاتی/تولیدی با مدیران و سرپرستان، کارکنان باسابقه و جوان‌تر، فشار نتیجه، هماهنگی بین واحدها و موقعیت‌های واقعی عملیاتی.
- لحن: فارسی روان، بزرگسالانه، حرفه‌ای و غیرآکادمیک. فقط اصطلاحات مهم انگلیسی را در پرانتز یا کنار معادل فارسی بیاور.
- سطح: ساده و کاربردی؛ از jargon اضافی پرهیز کن.
- رویکرد مربیگری: agency را حفظ کن؛ تشخیص قطعی درباره شخصیت یا انگیزه افراد نده؛ ابتدا رفتار قابل مشاهده، زمینه و سهم رفتار مدیریتی را روشن کن.
- اگر پاسخ کاربر مبهم است، آن را «حقیقت قطعی» تلقی نکن. با یک reframe و یک سؤال روشن کمک کن مسئله دقیق‌تر شود.
- اگر پاسخ کاربر روشن است، یک تحلیل کوتاه بده، نه مقاله.
- هرجا لازم است بین نتیجه کوتاه‌مدت و capability بلندمدت تمایز بگذار.
- هرگز اطلاعات محرمانه شرکت یا نام افراد را درخواست نکن.
- پاسخ باید برای نمایش روی موبایل کوتاه باشد.

فقط JSON معتبر برگردان با این ساختار:
{
  "theme": "عنوان کوتاه مسئله",
  "reflection": "برداشت کوتاه و دقیق از پاسخ کاربر، حداکثر 2 جمله",
  "possible_factors": ["عامل محتمل 1","عامل محتمل 2","عامل محتمل 3"],
  "coach_question": "فقط یک سؤال مربیگری قوی و متناسب",
  "micro_lesson": "یک نکته آموزشی 1 تا 2 جمله‌ای از چارچوب جلسه اول",
  "facilitator_prompt": "یک پیشنهاد یک‌جمله‌ای برای تسهیل‌گر جهت باز کردن بحث"
}
`;

async function coach(payload) {
  const role = payload.role === "manager" ? "مدیر" : payload.role === "supervisor" ? "سرپرست" : "نامشخص";
  const stage = String(payload.stage || "reflection").slice(0, 80);
  const answer = String(payload.answer || "").trim().slice(0, 900);
  const context = String(payload.context || "").trim().slice(0, 600);

  const input = `
نقش شرکت‌کننده: ${role}
مرحله کارگاه: ${stage}
پاسخ شرکت‌کننده:
«${answer}»
${context ? `زمینه تکمیلی: ${context}` : ""}

پاسخ را فقط در قالب JSON تعیین‌شده بده.
`;

  const apiRes = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: SYSTEM,
      input,
      max_output_tokens: 420,
      store: false
    })
  });

  const data = await apiRes.json();
  if (!apiRes.ok) {
    const msg = data?.error?.message || "OpenAI request failed";
    throw new Error(msg);
  }

  const text = cleanJsonText(extractOutputText(data));
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {
      theme: "بازاندیشی مدیریتی",
      reflection: text.slice(0, 500) || "پاسخ دریافت شد، اما تحلیل ساختاریافته در دسترس نیست.",
      possible_factors: [],
      coach_question: "اگر بخواهید این مسئله را فقط با یک رفتار قابل مشاهده توصیف کنید، چه می‌گویید؟",
      micro_lesson: "مدیر حرفه‌ای هم‌زمان کار، افراد و موقعیت را می‌بیند.",
      facilitator_prompt: "از شرکت‌کننده بخواهید یک مثال واقعی و بدون نام از همین هفته بیان کند."
    };
  }

  return {
    theme: String(parsed.theme || "").slice(0, 100),
    reflection: String(parsed.reflection || "").slice(0, 700),
    possible_factors: Array.isArray(parsed.possible_factors)
      ? parsed.possible_factors.slice(0, 3).map(x => String(x).slice(0, 180))
      : [],
    coach_question: String(parsed.coach_question || "").slice(0, 300),
    micro_lesson: String(parsed.micro_lesson || "").slice(0, 500),
    facilitator_prompt: String(parsed.facilitator_prompt || "").slice(0, 300)
  };
}

const server = http.createServer(async (req, res) => {
  const origin = String(req.headers.origin || "");

  if (req.method === "OPTIONS") {
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Vary", "Origin");
    }
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    json(res, 200, { ok: true, model: MODEL, ai_ready: Boolean(OPENAI_API_KEY) }, origin);
    return;
  }

  if (req.method !== "POST" || req.url !== "/coach") {
    json(res, 404, { error: "Not found" }, origin);
    return;
  }

  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    json(res, 403, { error: "Origin not allowed" }, origin);
    return;
  }

  if (rateLimited(req)) {
    json(res, 429, { error: "تعداد درخواست‌ها زیاد شده است. کمی بعد دوباره امتحان کنید." }, origin);
    return;
  }

  if (!OPENAI_API_KEY) {
    json(res, 503, { error: "AI coach is not configured yet." }, origin);
    return;
  }

  let raw = "";
  req.on("data", chunk => {
    raw += chunk;
    if (raw.length > 12000) req.destroy();
  });

  req.on("end", async () => {
    try {
      const body = JSON.parse(raw || "{}");
      const answer = String(body.answer || "").trim();
      if (answer.length < 3) {
        json(res, 400, { error: "پاسخ خیلی کوتاه است." }, origin);
        return;
      }
      const result = await coach(body);
      json(res, 200, result, origin);
    } catch (err) {
      console.error("coach_error", err?.message || err);
      json(res, 500, { error: "تحلیل هوشمند موقتاً در دسترس نیست. دوباره امتحان کنید." }, origin);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Behparvar AI Coach listening on ${PORT}`);
});