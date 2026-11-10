// البيانات الأساسية للمتجر.
// بتنستعمل بحالتين:
// 1) لما Firebase مش مربوط لسا، الموقع بيعرض هاي البيانات.
// 2) من لوحة التحكم: كبسة "إضافة القطع الأساسية" بتنسخها لـ Firestore مرة وحدة.

const COL = {
  black: { name: { ar: "أسود", he: "שחור", en: "Black" }, hex: "#1a1a1a", img: "" },
  lpink: { name: { ar: "زهري فاتح", he: "ורוד בהיר", en: "Light Pink" }, hex: "#f1cfd6", img: "" },
  dpink: { name: { ar: "زهري غامق", he: "ורוד כהה", en: "Deep Pink" }, hex: "#b02a80", img: "" },
  brown: { name: { ar: "بني", he: "חום", en: "Brown" }, hex: "#4a2229", img: "" },
  green: { name: { ar: "أخضر", he: "ירוק", en: "Green" }, hex: "#1d4d4a", img: "" },
  white: { name: { ar: "أبيض", he: "לבן", en: "White" }, hex: "#ecebe7", img: "" },
  pink:  { name: { ar: "زهري", he: "ורוד", en: "Pink" }, hex: "#e3a9b8", img: "" },
};
const c = (...keys) => keys.map(k => structuredClone(COL[k]));
const SIZES = ["S", "M", "L", "XL"];

export const DEFAULTS = {
  categories: [
    { id: "sets",    order: 1, name: { ar: "الأطقم", he: "סטים", en: "Sets" } },
    { id: "jackets", order: 2, name: { ar: "الجاكيتات", he: "ג׳קטים", en: "Jackets" } },
    { id: "dresses", order: 3, name: { ar: "الفساتين", he: "שמלות", en: "Dresses" } },
  ],
  products: [
    { id: "classic-set", cat: "sets", order: 1, price: 280, sizes: SIZES, limited: false, hidden: false, colors: c("brown", "black", "lpink", "dpink"),
      name: { ar: "طقم كلاسيك", he: "סט קלאסיק", en: "Classic Set" },
      desc: { ar: "بلوزة نص كم + تايتس خصر وسط", he: "חולצה קצרה + טייץ מותן בינונית", en: "Short sleeve top + mid-rise leggings" } },
    { id: "open-back-set", cat: "sets", order: 2, price: 270, sizes: SIZES, limited: false, hidden: false, colors: c("black", "lpink", "dpink", "brown"),
      name: { ar: "طقم ظهر مفتوح", he: "סט גב פתוח", en: "Open Back Set" },
      desc: { ar: "شيال مبطّن ظهر مفتوح + تايتس خصر وسط", he: "גופייה מרופדת עם גב פתוח + טייץ מותן בינונית", en: "Padded open-back tank + mid-rise leggings" } },
    { id: "bra-shorts-set", cat: "sets", order: 3, price: 250, sizes: SIZES, limited: false, hidden: false, colors: c("black", "lpink", "dpink"),
      name: { ar: "طقم نص بطن وشورت", he: "סט טופ קרופ ושורט", en: "Crop Top & Shorts Set" },
      desc: { ar: "توب مبطّن نص بطن + شورت خصر وسط", he: "טופ קרופ מרופד + שורט מותן בינונית", en: "Padded crop top + mid-rise shorts" } },
    { id: "flare-set", cat: "sets", order: 4, price: 300, sizes: SIZES, limited: false, hidden: false, colors: c("green"),
      name: { ar: "طقم فلير", he: "סט פלייר", en: "Flare Set" },
      desc: { ar: "بلوزة نص كم + تايتس إجرين واسعة", he: "חולצה קצרה + טייץ מתרחב ברגליים", en: "Short sleeve top + wide-leg flare leggings" } },
    { id: "sport-jacket", cat: "jackets", order: 5, price: 230, sizes: SIZES, limited: false, hidden: false, colors: c("black", "lpink"),
      name: { ar: "جاكيت رياضي", he: "ג׳קט ספורט", en: "Sport Jacket" },
      desc: { ar: "طبقة خفيفة فوق أي طقم", he: "שכבה קלה מעל כל סט", en: "A light layer over any set" } },
    { id: "pilates-jacket", cat: "jackets", order: 6, price: 120, sizes: ["S", "M", "L"], limited: false, soldOut: false, hidden: false, colors: c("lpink"),
      name: { ar: "جاكيت بيلاتس", he: "ז׳קט פילאטיס", en: "Pilates Jacket" },
      desc: { ar: "جاكيت بيلاتس خفيف فوق أي طقم", he: "ז׳קט פילאטיס קליל מעל כל סט", en: "A light pilates jacket over any set" } },
    { id: "golf-dress", cat: "dresses", order: 7, price: 300, sizes: SIZES, limited: false, hidden: false, colors: c("white"),
      name: { ar: "فستان جولف", he: "שמלת גולף", en: "Golf Dress" },
      desc: { ar: "فستان رياضي بياقة وتنّورة واسعة", he: "שמלת ספורט עם צווארון וחצאית מתנפנפת", en: "Sporty collared dress with a flared skirt" } },
    { id: "tennis-dress", cat: "dresses", order: 8, price: 300, sizes: SIZES, limited: false, soldOut: true, hidden: false, colors: c("lpink"),
      name: { ar: "فستان تنس", he: "שמלת טניס", en: "Tennis Dress" },
      desc: { ar: "فستان تنس بسحّاب أمامي + تنّورة واسعة", he: "שמלת טניס עם רוכסן קדמי + חצאית מתנפנפת", en: "Front-zip tennis dress + flared skirt" } },
  ],
  settings: {
    rev: 2,
    whatsapp: "972500000000",
    zones: [
      { name: { ar: "دبورية", he: "דבורייה", en: "Daburiyya" }, price: 20 },
      { name: { ar: "شبلي – أم الغنم", he: "שבלי – אום אל־גנם", en: "Shibli – Umm al-Ghanam" }, price: 30 },
      { name: { ar: "باقي الشمال", he: "שאר הצפון", en: "Rest of the North" }, price: 50 },
    ],
  },
};

// تصليحات تلقائية للبيانات اللي انضافت قبل: سعر 0 ← السعر الأساسي، وشيلة "إصدار محدود" عن الفستان.
export function patchProduct(p) {
  const d = DEFAULTS.products.find(x => x.id === p.id);
  if (!d) return { p, changed: {} };
  const changed = {};
  if (!(+p.price) && d.price) changed.price = d.price;
  if (p.desc?.ar === "إصدار محدود") { changed.desc = d.desc; changed.limited = false; }
  const OLD = ["طقم الظهر المفتوح", "طقم الحزّية والشورت", "طقم حزّية وشورت", "الجاكيت الرياضي", "طقم الفلير", "فستان الجولف", "جرابات البيلاتس"];
  if (OLD.includes(p.name?.ar)) changed.name = { ...p.name, ar: d.name.ar };
  return { p: { ...p, ...changed }, changed };
}

/* ---------- تحديث أكتوبر 2026 (rev 2) ----------
   بيتطبّق مرة وحدة على البيانات اللي بقاعدة البيانات:
   الموقع بيطبّقه بالذاكرة لحد ما لوحة التحكم تحفظه، وبعدها بيصير settings.rev = 2
   وما بيتطبّق مرة تانية (عشان ما يمسح تعديلات نور اللي بعده). */
export const DATA_REV = 3;
const D = id => DEFAULTS.products.find(p => p.id === id);
export function migrate(data) {
  const rev = data.settings?.rev || 0;
  if (rev >= DATA_REV) return { data, ops: [] };
  const ops = [];
  const products = data.products.map(p => ({ ...p }));
  const set = (p, k, v) => { p[k] = v; ops.push(["update", "products", p.id, { [k]: v }]); };
  // rev 3: وصف طقم الفلير + اسم جاكيت البيلاتس بالإنجليزي
  for (const p of products) {
    if (p.id === "flare-set") set(p, "desc", D(p.id).desc);
    if (p.id === "pilates-jacket" && p.name?.en === "Pilates Wrap Jacket") set(p, "name", { ...p.name, en: "Pilates Jacket" });
  }
  if (rev >= 2) {
    const settings = { ...data.settings, rev: DATA_REV };
    ops.push(["update-settings", "settings", "store", { rev: DATA_REV }]);
    return { data: { products, categories: data.categories, settings }, ops };
  }
  for (const p of products) {
    if (["classic-set", "open-back-set", "bra-shorts-set"].includes(p.id)) set(p, "desc", D(p.id).desc);
    if (p.id === "classic-set") {
      const order = ["بني", "أسود", "زهري فاتح", "زهري غامق"];
      const cs = [...(p.colors || [])].sort((a, b) => (order.indexOf(a.name?.ar) + 99) % 99 - (order.indexOf(b.name?.ar) + 99) % 99);
      set(p, "colors", cs);
    }
    if (p.id === "bra-shorts-set") set(p, "colors", (p.colors || []).filter(c => c.name?.ar !== "بني"));
  }
  const kept = products.filter(p => p.id !== "pilates-socks" && p.cat !== "acc");
  products.filter(p => !kept.includes(p)).forEach(p => ops.push(["delete", "products", p.id]));
  for (const id of ["pilates-jacket", "tennis-dress"]) if (!kept.some(p => p.id === id)) {
    const { id: _, ...doc } = structuredClone(D(id)); kept.push({ id, ...doc }); ops.push(["set", "products", id, doc]);
  }
  const categories = data.categories.filter(c => c.id !== "acc");
  if (categories.length !== data.categories.length) ops.push(["delete", "categories", "acc"]);
  const settings = { ...(data.settings || DEFAULTS.settings), rev: DATA_REV };
  ops.push(["update-settings", "settings", "store", { rev: DATA_REV }]);
  return { data: { products: kept, categories, settings }, ops };
}
