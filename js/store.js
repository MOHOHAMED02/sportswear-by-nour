// واجهة المتجر: بتقرا القطع والأقسام والتوصيل من Firebase،
// وبتحفظ كل طلبية بـ Firestore وبتبعتها كمان على الواتساب.
import { firebaseConfig } from "./firebase-config.js";
import { DEFAULTS, patchProduct, migrate } from "./data.js";
import { IMAGES } from "./images.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const CONFIGURED = !!(firebaseConfig && firebaseConfig.apiKey);
let db = null, fs = null;

/* ---------- نصوص الواجهة ---------- */
const T = {
  ar: { pay: "طريقة الدفع", payBit: "Bit", payCourier: "الدفع للمندوب (كاش)", payBank: "تحويل بنكي", payPickup: "الدفع عند الاستلام", freeOver: "🚚 توصيل مجاني للطلبيات من ₪500 وفوق", rules: "القوانين", r1a: "التبديل بيتم خلال", r1b: "10 أيام", r1c: "من يوم استلام الطلبية.", r2: "ما في إرجاع مصاري، بس بتقدري تشتري بالمبلغ قطعة تانية من عنا.", rno: "ما بنقدر نبدّل أو نرجّع قطعة:", n1: "انلبست أو انستعملت.", n2: "غير نظيفة، أو انمطّت، أو فيها ضرر.", n3: "بدون التيكت الأصلي.", n4: "انغسلت أو انتظّفت.", rthx: "شكراً على تفهّمك وتعاونك ♡", soldOut: "نفذت الكمية", ourValues: "قيمنا", v0: "براند NOUR", v1: "بيوفّرلك أواعي رياضة بتجمع ما بين الجودة العالية، الراحة، المرونة، والتصميم اللي بيبرز جمال الجسم وبيزيد الشعور بالثقة وقت الحركة.", v2: "هدفي ما بيوقف عند البيع، بل بسعى إنه يكون مشروعي وسيلة لتشجيعك تدخلي عالم الرياضة وتستمرّي فيه.", v3: "لإنّي بآمن إنّ الرياضة أسلوب حياة، مش بس بتغيّر شكل الجسم، بل بتغيّر النفسية، بتزيد القوة، وبترفع الثقة بالنفس.", v4: "بتمنّى يكون NOUR بداية تغيير لكل بنت بتدوّر على الراحة والجودة، والدافع لتبلّش رحلتها الرياضية.", shop: "تسوّقي الآن", ourStory: "قصتنا", s1: "بدأ طريقي بعالم الرياضة، وخلال هاي الرحلة واجهت مشاكل كثيرة مع أواعي الرياضة: تلف القماش، وإنها ما بتعطي الجسم الشكل المرتّب والدعم اللي بحتاجه أثناء التمرين، ومشاكل كثيرة غيرها.", s2: "مع الوقت فهمت إنه أواعي الرياضة مش مجرد قطعة منلبسها، بل جزء أساسي من التمرين نفسه، لأنها بتأثّر على الراحة والأداء والثقة بالنفس.", s3: "من هون إجى NOUR، من تجربة حقيقية ومعرفة واقعية بالاحتياجات اللي لازم أواعي الرياضة توفّرها.", intro: "قطع رياضية مُصمّمة لِتتحرّك معكِ. توصيل لكل البلاد.", cats: "الأقسام", all: "الصفحة الرئيسية", coll: "المجموعة", pieces: "قطع", limited: "إصدار محدود", color: "اللون", size: "المقاس", add: "أضيفي للسلة", added: "✓ انضافت للسلة", cart: "السلة", empty: "السلة فاضية", cont: "متابعة التسوق", details: "تفاصيل الطلب", name: "الاسم الكامل", phone: "رقم الهاتف", how: "طريقة الاستلام", choose: "اختاري…", pickup: "استلام ذاتي", city: "البلد / العنوان", notes: "ملاحظات (اختياري)", delivery: "التوصيل", free: "مجاناً", send: "إرسال الطلب", sending: "جاري الإرسال…", req: "عبّي الحقول المطلوبة", ok: "شكراً!", okp: "وصلنا طلبك. انفتحت رسالة واتساب فيها كل التفاصيل، كبسي إرسال عشان نأكّد معك.", again: "افتحي واتساب مرة ثانية", newo: "طلب جديد", msg: "طلب جديد من الموقع", orderNo: "رقم الطلب", back: "رجوع", viewall: "عرض الكل", colors: "ألوان", pick: "اختاري المقاس", subtotal: "المجموع", total: "المجموع الكلي" },
  he: { pay: "אמצעי תשלום", payBit: "Bit", payCourier: "תשלום לשליח (מזומן)", payBank: "העברה בנקאית", payPickup: "תשלום באיסוף", freeOver: "🚚 משלוח חינם בהזמנה מ־₪500 ומעלה", rules: "תקנון", r1a: "ניתן להחליף פריטים תוך", r1b: "10 ימים", r1c: "ממועד קבלת ההזמנה.", r2: "אין החזר כספי, אבל אפשר לנצל את הסכום לרכישת פריט אחר אצלנו.", rno: "לא תתאפשר החלפה או החזרה של פריטים אשר:", n1: "נעשה בהם שימוש.", n2: "אינם נקיים, נמתחו או נפגמו.", n3: "ללא התווית (טיקט) המקורית.", n4: "עברו כביסה או ניקוי.", rthx: "תודה על ההבנה ושיתוף הפעולה ♡", soldOut: "אזל מהמלאי", ourValues: "הערכים שלנו", v0: "המותג NOUR", v1: "מציע לך בגדי ספורט שמשלבים איכות גבוהה, נוחות, גמישות ועיצוב שמבליט את יופי הגוף ומגביר את תחושת הביטחון בזמן תנועה.", v2: "המטרה שלי לא נעצרת במכירה. אני שואפת שהמיזם יהיה דרך לעודד אותך להיכנס לעולם הספורט ולהתמיד בו.", v3: "כי אני מאמינה שספורט הוא אורח חיים. הוא לא משנה רק את מראה הגוף, אלא גם את מצב הרוח, מוסיף כוח ומעלה את הביטחון העצמי.", v4: "אני מקווה ש-NOUR יהיה תחילת שינוי לכל בחורה שמחפשת נוחות ואיכות, והדחיפה להתחיל את המסע הספורטיבי שלה.", shop: "לקנייה", ourStory: "הסיפור שלנו", s1: "הדרך שלי בעולם הספורט התחילה, ולאורך המסע נתקלתי בהרבה בעיות עם בגדי ספורט: בד שנהרס מהר, בגדים שלא נותנים לגוף מראה מסודר ואת התמיכה שצריך באימון, ועוד הרבה.", s2: "עם הזמן הבנתי שבגדי ספורט הם לא סתם פריט שלובשים, אלא חלק מהאימון עצמו, כי הם משפיעים על הנוחות, על הביצועים ועל הביטחון העצמי.", s3: "מכאן נולד NOUR, מתוך ניסיון אמיתי והיכרות מעשית עם מה שבגדי ספורט צריכים לתת.", intro: "פריטי ספורט שעוצבו לזוז איתך. משלוחים לכל הארץ.", cats: "קטגוריות", all: "דף הבית", coll: "הקולקציה", pieces: "פריטים", limited: "מהדורה מוגבלת", color: "צבע", size: "מידה", add: "הוספה לסל", added: "✓ נוסף לסל", cart: "סל קניות", empty: "הסל ריק", cont: "המשך קנייה", details: "פרטי ההזמנה", name: "שם מלא", phone: "טלפון", how: "אופן קבלה", choose: "בחרי…", pickup: "איסוף עצמי", city: "יישוב / כתובת", notes: "הערות (לא חובה)", delivery: "משלוח", free: "חינם", send: "שליחת ההזמנה", sending: "שולחת…", req: "נא למלא את שדות החובה", ok: "תודה!", okp: "ההזמנה התקבלה. נפתחה הודעת וואטסאפ עם כל הפרטים, לחצי שליחה כדי שנאשר איתך.", again: "לפתוח וואטסאפ שוב", newo: "הזמנה חדשה", msg: "הזמנה חדשה מהאתר", orderNo: "מספר הזמנה", back: "חזרה", viewall: "לכל הפריטים", colors: "צבעים", pick: "נא לבחור מידה", subtotal: "סכום ביניים", total: "סה״כ" },
  en: { pay: "Payment method", payBit: "Bit", payCourier: "Pay the courier (cash)", payBank: "Bank transfer", payPickup: "Pay at pickup", freeOver: "🚚 Free delivery on orders of ₪500+", rules: "Policy", r1a: "Exchanges are accepted within", r1b: "10 days", r1c: "of receiving your order.", r2: "No cash refunds, but you can use the amount toward another item from us.", rno: "We can't exchange or return items that:", n1: "have been worn or used.", n2: "are not clean, stretched or damaged.", n3: "are missing the original tag.", n4: "have been washed or cleaned.", rthx: "Thank you for your understanding ♡", soldOut: "Sold out", ourValues: "Our Values", v0: "The NOUR brand", v1: "offers activewear that brings together high quality, comfort, flexibility and a design that brings out the body's beauty and builds confidence as you move.", v2: "My goal doesn't stop at selling. I want this project to encourage you to step into the world of sport and stay in it.", v3: "Because I believe sport is a way of life. It doesn't only change how the body looks; it changes your mindset, builds strength and raises self-confidence.", v4: "I hope NOUR becomes the start of a change for every woman looking for comfort and quality, and the push to begin her fitness journey.", shop: "Shop now", ourStory: "Our Story", s1: "My journey in sport began, and along the way I kept running into problems with activewear: fabric that wore out, pieces that didn't shape the body or give the support I needed while training, and much more.", s2: "Over time I understood that activewear isn't just something we put on. It's part of the workout itself, because it shapes comfort, performance and confidence.", s3: "That's where NOUR came from: real experience and a practical understanding of what activewear has to deliver.", intro: "Activewear designed to move with you. Delivery nationwide.", cats: "Categories", all: "Home", coll: "Collection", pieces: "pieces", limited: "Limited Edition", color: "Color", size: "Size", add: "Add to Bag", added: "✓ Added", cart: "Your Bag", empty: "Your bag is empty", cont: "Continue shopping", details: "Order details", name: "Full name", phone: "Phone", how: "Delivery method", choose: "Choose…", pickup: "Self pickup", city: "Town / address", notes: "Notes (optional)", delivery: "Delivery", free: "Free", send: "Place Order", sending: "Sending…", req: "Please fill in the required fields", ok: "Thank you!", okp: "We got your order. A WhatsApp message with the details has opened; tap send so we can confirm with you.", again: "Open WhatsApp again", newo: "New order", msg: "New order from the website", orderNo: "Order no.", back: "Back", viewall: "View all", colors: "colors", pick: "Please choose a size", subtotal: "Subtotal", total: "Total" },
};

/* ---------- البيانات ---------- */
let P = [], CATS = [], S = DEFAULTS.settings;

async function initFirebase() {
  if (!CONFIGURED) return;
  try {
    const [{ initializeApp }, firestore] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-firestore.js")]);
    fs = firestore;
    db = fs.getFirestore(initializeApp(firebaseConfig));
  } catch (e) { console.warn("Firebase init failed", e); db = null; }
}

async function loadData() {
  if (db) {
    try {
      const [ps, cs, st] = await Promise.all([
        fs.getDocs(fs.collection(db, "products")),
        fs.getDocs(fs.collection(db, "categories")),
        fs.getDoc(fs.doc(db, "settings", "store")),
      ]);
      if (!ps.empty) return {
        products: ps.docs.map(d => ({ id: d.id, ...d.data() })),
        categories: cs.docs.map(d => ({ id: d.id, ...d.data() })),
        settings: st.exists() ? st.data() : DEFAULTS.settings,
      };
    } catch (e) { console.warn("Load from Firestore failed, using defaults", e); }
  }
  return structuredClone(DEFAULTS);
}

function applyData(d) {
  d = migrate(d).data;
  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
  P = d.products.map(p => patchProduct(p).p).filter(p => !p.hidden && (p.colors || []).length).map(p => ({
    ...p, price: +p.price || 0, sizes: p.sizes || [],
    colors: p.colors.map(c => {
      const local = (IMAGES[p.id]?.[c.name?.ar] || []).filter(u => !(c.removed || []).includes(u));
      const imgs = [...(c.imgs || []), ...(c.img ? [c.img] : []), ...local].filter((v, i, a) => v && a.indexOf(v) === i);
      return { ...c, imgs, img: imgs[0] || "" };
    }),
  })).sort(byOrder);
  CATS = [...d.categories].sort(byOrder);
  S = { whatsapp: "972500000000", zones: [], ...d.settings };
  const wa = document.getElementById("wa-link");
  if (wa) wa.href = "https://wa.me/" + S.whatsapp;
}

/* صور محفوظة بقاعدة البيانات (fs:ID) ← بنجيبها قبل الرسم */
async function resolveImages() {
  const ids = new Set();
  P.forEach(p => p.colors.forEach(c => c.imgs.forEach(u => u.startsWith("fs:") && ids.add(u.slice(3)))));
  const map = {};
  if (db && ids.size) await Promise.all([...ids].map(id => fs.getDoc(fs.doc(db, "images", id)).then(d => { if (d.exists()) map[id] = d.data().data; }).catch(() => {})));
  P.forEach(p => p.colors.forEach(c => {
    c.imgs = c.imgs.map(u => u.startsWith("fs:") ? map[u.slice(3)] : u).filter(Boolean);
    c.img = c.imgs[0] || "";
  }));
}

/* ---------- أدوات ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nm = (o, l = L) => (o && (o[l] || o.ar || o.en)) || "";
const byId = id => P.find(p => p.id === id);
// لون الصورة بالصفحة الرئيسية لكل قطعة، عشان الألوان تكون مخلوطة مش كلها أسود
const COVER = { "classic-set": "بني", "open-back-set": "زهري غامق", "bra-shorts-set": "زهري فاتح", "sport-jacket": "أسود" };
const firstImg = p => {
  const want = COVER[p.id], i = want ? p.colors.findIndex(c => c.img && (c.name?.ar || c.name) === want) : -1;
  return i >= 0 ? i : Math.max(0, p.colors.findIndex(c => c.img));
};
const money = n => "₪" + (Math.round(n * 100) / 100);
function isLight(hex) {
  const n = parseInt(String(hex || "#888").slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 165;
}
const phCls = (c, extra = "") => `ph${extra}${c.img ? " has-img" : isLight(c.hex) ? " light" : ""}`;
const phStyle = c => `--sw:${esc(c.hex || "#ccc")}${c.img ? `;background-image:url('${esc(c.img)}')` : ""}`;

/* ---------- الحالة ---------- */
let L = "ar", F = "all", OPEN = null, cart = [], view = "cart", flash = "", lastUrl = "", lastNo = "";
let pd = null, pc = 0, pz = null, swap = false;
const SEEN = new Set();
const form = { name: "", phone: "", how: "", city: "", notes: "", pay: "" };
const FREE_OVER = 500; // توصيل مجاني من هالمبلغ وفوق
const PAYS = { bit: "payBit", courier: "payCourier", bank: "payBank", pickup: "payPickup" };
const payKeys = so => so ? (so.pickup ? ["bit", "bank", "pickup"] : ["bit", "courier", "bank"]) : ["bit", "courier", "bank", "pickup"];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
try { L = localStorage.getItem("lang") || "ar"; cart = JSON.parse(localStorage.getItem("cart2") || "[]"); } catch (_) {}
function save() { try { localStorage.setItem("cart2", JSON.stringify(cart)); } catch (_) {} }

/* ---------- حركة ---------- */
function closeOv(el) {
  if (typeof el === "string") el = $(el);
  if (el.hidden) return;
  if (RM) { el.hidden = true; return; }
  el.classList.add("closing");
  setTimeout(() => { el.hidden = true; el.classList.remove("closing"); }, 300);
}
function openOv(id) { const el = $(id); el.classList.remove("closing"); el.hidden = false; }
let IO = null;
function observe() {
  const els = [...document.querySelectorAll(".card.rv:not(.in)")];
  const show = e => { e.classList.add("in"); SEEN.add(e.dataset.rk); };
  if (RM || !("IntersectionObserver" in window)) { els.forEach(show); return; }
  if (!IO) IO = new IntersectionObserver(es => {
    let n = 0;
    es.forEach(en => { if (en.isIntersecting) { en.target.style.setProperty("--d", (n++ * 0.12) + "s"); show(en.target); IO.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach(e => IO.observe(e));
  setTimeout(() => els.forEach(e => { if (!e.classList.contains("in") && e.getBoundingClientRect().top < innerHeight) show(e); }), 1500);
}
function pulseBag() { const b = $("bag"); b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse"); }

/* ---------- الصفحة الرئيسية ---------- */
function render() {
  const t = T[L], de = document.documentElement;
  de.lang = L; de.dir = L === "en" ? "ltr" : "rtl";
  document.querySelectorAll("[data-t]").forEach(e => e.textContent = t[e.dataset.t]);
  document.querySelectorAll(".langs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.l === L));

  const inCat = k => P.filter(p => p.cat === k);
  const KS = CATS.filter(c => inCat(c.id).length);
  const shown = F === "all" ? KS : KS.filter(c => c.id === F);
  $("ctitle").textContent = F === "all" ? t.coll : nm(CATS.find(c => c.id === F)?.name);
  $("ccount").textContent = `${shown.reduce((a, c) => a + inCat(c.id).length, 0)} ${t.pieces}`;

  $("cats").innerHTML = `<button data-f="all" aria-pressed="${F === "all"}">${t.all}</button>` + KS.map(c => {
    const o = OPEN === c.id;
    return `<button class="acc-h" data-acc="${esc(c.id)}" aria-expanded="${o}"><span>${esc(nm(c.name))}</span><span class="pm">${o ? "−" : "+"}</span></button>
    <div class="sub" ${o ? "" : "hidden"}>${inCat(c.id).map(p => `<button data-p="${esc(p.id)}" data-m="1">${esc(nm(p.name))}</button>`).join("")}<button class="subAll" data-f="${esc(c.id)}">${t.viewall}</button></div>`;
  }).join("") + `<button data-story="1">${t.ourStory}</button><button data-story="rules">${t.rules}</button>`;

  const card = p => {
    const c0 = p.colors[firstImg(p)];
    const many = c0.imgs.length > 1;
    return `<div class="card${SEEN.has(p.id) ? "" : " rv"}" data-p="${esc(p.id)}" data-rk="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(nm(p.name))}">
      <div class="phw">${many
        ? `<div class="ctrack">${c0.imgs.map((u, i) => `<img src="${esc(u)}" alt="" ${i ? 'loading="lazy"' : ""}>`).join("")}</div>
           <button class="carr prev" data-ca="-1" aria-label="‹">‹</button><button class="carr next" data-ca="1" aria-label="›">›</button>
           <div class="cdots">${c0.imgs.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>`
        : `<div class="${phCls(c0)}" style="${phStyle(c0)}"></div>`}${p.soldOut ? `<span class="tag so">${t.soldOut}</span>` : p.limited ? `<span class="tag">${t.limited}</span>` : ""}</div>
      <div class="cardline"><h3>${esc(nm(p.name))}</h3>${p.price ? `<span class="price">${money(p.price)}</span>` : ""}</div>
      <div class="dots">${p.colors.map(c => `<i style="--c:${esc(c.hex)}"></i>`).join("")}<small>${p.colors.length > 1 ? p.colors.length + " " + t.colors : esc(nm(c0.name))}</small></div>
    </div>`;
  };
  $("grid").innerHTML = shown.map(c => {
    const items = inCat(c.id);
    return `<section class="cat">${F === "all" ? `<div class="cat-h"><h2>${esc(nm(c.name))}</h2><button class="more" data-f="${esc(c.id)}">${t.viewall} (${items.length})</button></div>` : ""}<div class="row">${items.map(card).join("")}</div></section>`;
  }).join("");

  renderPD();
  observe();
  const n = cart.reduce((a, x) => a + x.q, 0);
  $("bagn").hidden = !n; $("bagn").textContent = n;
  renderCart();
}

/* ---------- صفحة القطعة ---------- */
function renderPD() {
  const box = $("pd");
  if (pd === null) { if (!box.hidden) closeOv(box); return; }
  const t = T[L], p = byId(pd);
  if (!p) { pd = null; return renderPD(); }
  const c = p.colors[pc] || p.colors[0];
  box.hidden = false; box.classList.remove("closing");
  $("pdbody").innerHTML = `<div class="backbar"><button class="back" data-close="pd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>${t.back}</button><span class="logo">NOUR<b></b></span></div>
  ${c.imgs.length ? `<div class="gal${swap ? " swap" : ""}"><div class="track" id="track">${c.imgs.map((u, i) => `<img src="${esc(u)}" alt="${esc(nm(p.name))} — ${esc(nm(c.name))} ${i + 1}" ${i ? 'loading="lazy"' : ""}>`).join("")}</div>
    ${p.soldOut ? `<span class="tag so">${t.soldOut}</span>` : p.limited ? `<span class="tag">${t.limited}</span>` : ""}
    ${c.imgs.length > 1 ? `<div class="thumbs">${c.imgs.map((u, i) => `<button data-gi="${i}" aria-pressed="${i === 0}" aria-label="${i + 1}" style="background-image:url('${esc(u)}')"></button>`).join("")}</div>` : ""}</div>`
  : `<div class="${phCls(c, " big")}${swap ? " swap" : ""}" style="${phStyle(c)}">${p.limited ? `<span class="tag">${t.limited}</span>` : ""}</div>`}
  <div class="info"><h2>${esc(nm(p.name))}</h2>${p.price ? `<div class="price big-price">${money(p.price)}</div>` : ""}<p class="d">${esc(nm(p.desc))}</p>
  <div><div class="label">${t.color} — ${esc(nm(c.name))}</div><div class="sw">${p.colors.map((x, i) => `<button aria-label="${esc(nm(x.name))}" aria-pressed="${i === pc}" style="--c:${esc(x.hex)}" data-pc="${i}"></button>`).join("")}</div></div>
  ${p.sizes.length ? `<div><div class="label">${t.size}</div><div class="sizes">${p.sizes.map(z => `<button data-pz="${esc(z)}" aria-pressed="${pz === z}">${esc(z)}</button>`).join("")}</div><p class="err" id="szerr" hidden>${t.pick}</p></div>` : ""}
  ${p.soldOut ? `<button class="add soldout" disabled>${t.soldOut}</button>` : `<button class="add${flash ? " done" : ""}" data-add="1">${flash ? t.added : t.add}</button>`}</div>`;
  swap = false;
  const tr = $("track");
  if (tr) tr.onscroll = () => {
    const i = Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth);
    document.querySelectorAll(".thumbs button").forEach((b, k) => b.setAttribute("aria-pressed", k === i));
  };
}

/* ---------- السلة ---------- */
function shipOpt() {
  const t = T[L];
  if (form.how === "") return null;
  if (form.how === "p") return { label: t.pickup, labelAr: T.ar.pickup, price: 0, pickup: true };
  const z = S.zones[+form.how];
  if (!z) return null;
  const free = subtotal() >= FREE_OVER;
  return { label: nm(z.name), labelAr: nm(z.name, "ar"), price: free ? 0 : +z.price || 0, base: +z.price || 0, pickup: false, free };
}
const lineOf = x => { const p = byId(x.pid); return p ? { p, c: p.colors[x.ci] || p.colors[0] } : null; };
const subtotal = () => cart.reduce((a, x) => { const l = lineOf(x); return a + (l ? l.p.price * x.q : 0); }, 0);

function renderCart() {
  const t = T[L], b = $("cartbody");
  cart = cart.filter(x => { const l = lineOf(x); return l && !l.p.soldOut; });
  const head = `<div class="top"><h3>${view === "ok" ? "" : t.cart}</h3><button class="x" data-close="cart" aria-label="close">✕</button></div>`;
  if (view === "ok") {
    b.innerHTML = head + `<div class="okbox"><h3>${t.ok}</h3>${lastNo ? `<p class="label">${t.orderNo}: ${esc(lastNo)}</p>` : ""}<p class="d">${t.okp}</p><a class="go" href="${esc(lastUrl)}" target="_blank" rel="noopener">${t.again}</a><button class="rm" data-new="1">${t.newo}</button></div>`;
    return;
  }
  if (!cart.length) { b.innerHTML = head + `<p class="empty">${t.empty}</p><button class="go" data-close="cart">${t.cont}</button>`; return; }
  const items = cart.map((x, j) => {
    const { p, c } = lineOf(x);
    return `<div class="item"><div class="th ${c.img ? "has-img" : ""}" style="${phStyle(c)}"></div>
      <div><h4>${esc(nm(p.name))}</h4><p class="d">${esc(nm(c.name))}${x.z ? " · " + esc(x.z) : ""}${p.price ? " · " + money(p.price * x.q) : ""}</p><button class="rm" data-rm="${j}">✕</button></div>
      <div class="qty"><button data-q="${j}" data-d="-1" aria-label="-">−</button><span>${x.q}</span><button data-q="${j}" data-d="1" aria-label="+">+</button></div></div>`;
  }).join("");
  const so = shipOpt(), sub = subtotal(), fr = sub >= FREE_OVER;
  if (form.pay && !payKeys(so).includes(form.pay)) form.pay = "";
  b.innerHTML = head + items + `<form id="co" novalidate>
    <span class="label">${t.details}</span>
    <div class="f"><label for="f-name">${t.name} *</label><input id="f-name" name="name" autocomplete="name" maxlength="80" value="${esc(form.name)}"></div>
    <div class="f"><label for="f-phone">${t.phone} *</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" value="${esc(form.phone)}"></div>
    <div class="f"><label for="f-how">${t.how} *</label><select id="f-how" name="how"><option value="">${t.choose}</option><option value="p"${form.how === "p" ? " selected" : ""}>${t.pickup} — ${t.free}</option>${S.zones.map((z, k) => `<option value="${k}"${form.how === String(k) ? " selected" : ""}>${t.delivery}: ${esc(nm(z.name))} — ${fr ? t.free : money(+z.price || 0)}</option>`).join("")}</select><small class="free-note${fr ? " on" : ""}">${t.freeOver}</small></div>
    ${so && !so.pickup ? `<div class="f"><label for="f-city">${t.city} *</label><input id="f-city" name="city" autocomplete="street-address" maxlength="160" value="${esc(form.city)}"></div>` : ""}
    <div class="f"><label for="f-pay">${t.pay} *</label><select id="f-pay" name="pay"><option value="">${t.choose}</option>${payKeys(so).map(k => `<option value="${k}"${form.pay === k ? " selected" : ""}>${t[PAYS[k]]}</option>`).join("")}</select></div>
    <div class="f"><label for="f-notes">${t.notes}</label><textarea id="f-notes" name="notes" maxlength="400">${esc(form.notes)}</textarea></div>
    ${sub ? `<div class="sum"><span>${t.subtotal}</span><span>${money(sub)}</span></div>` : ""}
    ${so ? `<div class="sum"><span>${t.delivery}</span><span>${so.price ? money(so.price) : t.free}</span></div>` : ""}
    ${sub && so ? `<div class="sum t"><span>${t.total}</span><span>${money(sub + so.price)}</span></div>` : ""}
    <p class="err" id="err" hidden>${t.req}</p>
    <button class="go" type="submit" id="sendbtn">${t.send}</button></form>`;
}

/* ---------- إرسال الطلب ---------- */
async function submitOrder() {
  const t = T[L];
  const need = form.name.trim() && form.phone.trim() && form.how !== "" && (form.how === "p" || form.city.trim()) && form.pay;
  if (!need) { $("err").hidden = false; return; }
  const btn = $("sendbtn"); btn.disabled = true; btn.textContent = t.sending;
  // منفتح نافذة الواتساب فوراً (قبل الانتظار) عشان المتصفح ما يمنعها
  const win = window.open("about:blank", "_blank");

  const so = shipOpt();
  const items = cart.map(x => {
    const { p, c } = lineOf(x);
    const ref = (c.imgs || [])[0] || c.img || "";
    return { pid: p.id, name: nm(p.name, "ar"), color: nm(c.name, "ar"), size: x.z || "", qty: x.q, price: p.price, ...(ref && !ref.startsWith("data:") ? { img: ref } : {}) };
  });
  const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = sub + so.price;
  const customer = { name: form.name.trim(), phone: form.phone.trim(), city: so.pickup ? "" : form.city.trim(), notes: form.notes.trim() };
  const delivery = { type: so.pickup ? "pickup" : "delivery", zone: so.pickup ? "" : so.labelAr, price: so.price, ...(so.free ? { free: true } : {}) };
  const payment = T.ar[PAYS[form.pay]];

  let no = "";
  if (db) {
    try {
      const ref = fs.doc(fs.collection(db, "orders"));
      no = ref.id.slice(0, 6).toUpperCase();
      await fs.setDoc(ref, { no, items, customer, delivery, payment, subtotal: sub, total, status: "new", lang: L, createdAt: fs.serverTimestamp() });
    } catch (e) { console.warn("Order save failed, sending on WhatsApp only", e); no = ""; }
  }

  const A = T.ar;
  const lines = items.map((i, j) => `${j + 1}. ${i.name} — ${i.color}${i.size ? " — " + i.size : ""} × ${i.qty}${i.price ? ` — ${money(i.price * i.qty)}` : ""}`);
  const msg = [
    `🛍 ${A.msg}${no ? ` #${no}` : ""}`, "", ...lines, "",
    `${A.name}: ${customer.name}`, `${A.phone}: ${customer.phone}`,
    `${A.how}: ${so.pickup ? A.pickup : `${A.delivery} ${so.labelAr} (${so.free ? A.free : money(so.price)})`}`,
    `${A.pay}: ${payment}`,
    ...(customer.city ? [`${A.city}: ${customer.city}`] : []),
    ...(customer.notes ? [`${A.notes}: ${customer.notes}`] : []),
    ...(sub ? ["", `${A.total}: ${money(total)}`] : []),
  ].join("\n");
  lastUrl = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  lastNo = no;
  if (win) win.location.href = lastUrl; else location.href = lastUrl;

  view = "ok"; cart = []; save();
  Object.assign(form, { notes: "", pay: "" });
  render();
}

/* ---------- أحداث ---------- */
document.addEventListener("input", e => { if (e.target.closest("#co")) form[e.target.name] = e.target.value; });
document.addEventListener("change", e => { if (e.target.name === "how") { form.how = e.target.value; renderCart(); } if (e.target.name === "pay") form.pay = e.target.value; });
document.addEventListener("submit", e => { e.preventDefault(); submitOrder(); });
document.addEventListener("click", e => {
  const ov = e.target.classList && e.target.classList.contains("ov") ? e.target : null;
  if (ov) { if (ov.id === "pd") pd = null; closeOv(ov); return; }
  const b = e.target.closest("button,[data-p]"); if (!b) return;
  const d = b.dataset;
  if (d.ca) {
    const tr = b.parentElement.querySelector(".ctrack"), w = tr.clientWidth, rtl = getComputedStyle(tr).direction === "rtl";
    const n = tr.children.length, i = Math.round(Math.abs(tr.scrollLeft) / w);
    const j = (i + +d.ca + n) % n;
    tr.scrollTo({ left: (rtl ? -1 : 1) * j * w, behavior: RM ? "auto" : "smooth" });
    return;
  }
  if (d.close === "pd") { pd = null; renderPD(); return; }
  if (d.close) { closeOv(d.close); if (view === "ok") { view = "cart"; render(); } return; }
  if (b.id === "totop") { scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (d.story) { closeOv("drawer"); $(d.story === "rules" ? "rules" : "story").scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); return; }
  if (b.id === "menu") { openOv("drawer"); return; }
  if (b.id === "bag") { openOv("cart"); return; }
  if (d.new) { view = "cart"; render(); return; }
  if (d.f) {
    F = d.f; closeOv("drawer"); render();
    if (F === "all") scrollTo({ top: 0, behavior: "smooth" }); else $("grid").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (d.l) { L = d.l; try { localStorage.setItem("lang", L); } catch (_) {} render(); return; }
  if (d.acc) { OPEN = OPEN === d.acc ? null : d.acc; render(); return; }
  if (d.m) closeOv("drawer");
  if (d.p) { pd = d.p; pc = firstImg(byId(d.p)); pz = null; flash = ""; renderPD(); return; }
  if (d.pc) { pc = +d.pc; swap = true; renderPD(); return; }
  if (d.pz) { pz = d.pz; renderPD(); return; }
  if (d.gi) { const tr = $("track"); tr?.children[+d.gi]?.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "nearest", inline: "start" }); return; }
  if (d.add) {
    const p = byId(pd);
    if (p.soldOut) return;
    if (p.sizes.length && !pz) { $("szerr").hidden = false; return; }
    const z = p.sizes.length ? pz : null;
    const ex = cart.find(x => x.pid === p.id && x.ci === pc && x.z === z);
    ex ? ex.q++ : cart.push({ pid: p.id, ci: pc, z, q: 1 });
    save(); view = "cart"; flash = "1"; render(); pulseBag();
    setTimeout(() => { flash = ""; render(); }, 1400);
    return;
  }
  if (d.rm) { cart.splice(+d.rm, 1); save(); render(); return; }
  if (d.q) { const x = cart[+d.q]; x.q += +d.d; if (x.q < 1) cart.splice(+d.q, 1); save(); render(); }
});
addEventListener("scroll", () => { $("totop").hidden = scrollY < 500; }, { passive: true });
document.addEventListener("scroll", e => {
  const tr = e.target; if (!tr.classList || !tr.classList.contains("ctrack")) return;
  const i = Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth);
  tr.parentElement.querySelectorAll(".cdots i").forEach((d, k) => d.classList.toggle("on", k === i));
}, true);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { const o = [...document.querySelectorAll(".ov")].reverse().find(x => !x.hidden); if (o) { const b = o.querySelector("[data-close]"); if (b) { b.click(); return; } } }
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.(".card[data-p]")) { e.preventDefault(); e.target.click(); }
});
{
  const st = $("strip"), dots = [...document.querySelectorAll("#sdots button")];
  if (st && dots.length) {
    st.addEventListener("scroll", () => {
      const w = st.children[0].getBoundingClientRect().width;
      const i = Math.min(dots.length - 1, Math.round(Math.abs(st.scrollLeft) / w));
      dots.forEach((d, k) => d.setAttribute("aria-pressed", k === i));
      document.querySelector("#sdots .swipe")?.remove();
    }, { passive: true });
    dots.forEach(d => d.addEventListener("click", e => { e.stopPropagation(); st.children[+d.dataset.si].scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "nearest", inline: "center" }); }));
  }
}

/* ---------- تشغيل ---------- */
(async () => {
  await initFirebase();
  applyData(await loadData());
  await resolveImages();
  render();
})();
