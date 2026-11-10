// لوحة تحكم NOUR: الطلبيات، القطع، الأقسام، الإعدادات.
import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";
import { DEFAULTS, patchProduct, migrate } from "./data.js";
import { IMAGES } from "./images.js";
// صور كل لون: الصور اللي انرفعت من اللوحة (fs:ID بقاعدة البيانات) أول، بعدها الصور اللي مع الموقع (إلا المحذوفة)
const imgsOf = (pid, c) => [...(c?.imgs || []), c?.img, ...(IMAGES[pid]?.[c?.name?.ar] || []).filter(u => !(c?.removed || []).includes(u))].filter((v, i, a) => v && a.indexOf(v) === i);
const IMGC = new Map();
async function imgURL(ref) {
  if (!ref?.startsWith("fs:")) return ref;
  const id = ref.slice(3);
  if (!IMGC.has(id)) IMGC.set(id, F.getDoc(F.doc(db, "images", id)).then(d => d.exists() ? d.data().data : "").catch(() => ""));
  return IMGC.get(id);
}
function hydrate(root = document) {
  root.querySelectorAll("[data-ref]").forEach(async el => {
    const u = await imgURL(el.dataset.ref);
    if (u && el.isConnected) el.style.backgroundImage = `url('${u}')`;
  });
}
// صورة القطعة باللون اللي اختارته الزبونة
function itemThumb(i) {
  const p = D.products.find(x => x.id === i.pid);
  const c = p?.colors?.find(x => x.name?.ar === i.color);
  const ref = i.img || (c ? imgsOf(p.id, c)[0] : (IMAGES[i.pid]?.[i.color] || [])[0]) || "";
  return `<span class="othumb"${ref.startsWith("fs:") ? ` data-ref="${esc(ref)}"` : ""} style="--sw:${esc(c?.hex || "#ddd")}${bgStyle(ref)}"></span>`;
}
const bgStyle = ref => ref && !ref.startsWith("fs:") ? `;background-image:url('${esc(ref)}')` : "";
import { setupI18n, langSwitcher, tr, adminLang } from "./admin-i18n.js";
const nl = o => (o && (o[adminLang()] || o.ar)) || "";
setupI18n();

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
const app = document.getElementById("app");
let A, F, auth, db;

/* ---------- أدوات ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "₪" + (Math.round((+n || 0) * 100) / 100);
const q = s => document.querySelector(s);
let toastT;
function toast(msg) { const t = q("#toast"); t.textContent = tr(msg); t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }
const fmtDate = ts => { const d = ts?.toDate?.(); return d ? d.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "…"; };
const STATUS = {
  new:    { label: "جديدة", color: "var(--new)" },
  prep:   { label: "قيد التحضير", color: "var(--prep)" },
  sent:   { label: "انبعتت", color: "var(--sent)" },
  done:   { label: "وصلت", color: "var(--done)" },
  cancel: { label: "ملغية", color: "var(--cancel)" },
};
const LANGS = [["ar", "عربي"], ["he", "עברית"], ["en", "English"]];
function getPath(o, p) { return p.split(".").reduce((a, k) => a?.[k], o); }
function setPath(o, p, v) { const ks = p.split("."); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ??= /^\d+$/.test(k) ? [] : {}), o); t[last] = v; }

/* ---------- تشغيل ---------- */
if (!firebaseConfig.apiKey) {
  app.innerHTML = `<div class="center"><div class="box"><div class="brand">NOUR<b></b></div><h1>لوحة التحكم</h1>
  <p>لسا ما انربط Firebase. حط إعدادات مشروعك بملف <code>js/firebase-config.js</code>، والشرح كامل بملف README.</p></div></div>`;
} else {
  boot().catch(e => { console.error(e); app.innerHTML = `<div class="center"><div class="box"><h1>صار خطأ بالتحميل</h1><p>${esc(e.message)}</p></div></div>`; });
}

async function boot() {
  const [{ initializeApp }, a, f] = await Promise.all([
    import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-firestore.js"),
  ]);
  A = a; F = f;
  const fb = initializeApp(firebaseConfig);
  auth = A.getAuth(fb); db = F.getFirestore(fb);
  A.onAuthStateChanged(auth, async user => {
    stopAll();
    if (!user) return loginView();
    let ok = false;
    try { ok = (await F.getDoc(F.doc(db, "admin", user.uid))).exists(); } catch (e) { console.warn(e); }
    ok ? mainView(user) : notAdminView(user);
  });
}

/* ---------- تسجيل الدخول ---------- */
function loginView() {
  app.innerHTML = `<div class="center"><div class="box">${langSwitcher()}<div class="brand">NOUR<b></b></div><h1>لوحة التحكم</h1>
  <form id="login">
    ${ADMIN_EMAIL ? `<input id="em" type="email" autocomplete="username" value="${esc(ADMIN_EMAIL)}" hidden>` : `<label class="f"><span>الإيميل</span><input id="em" type="email" autocomplete="username" required class="ltr"></label>`}
    <label class="f"><span>كلمة السر</span><div class="pwrap"><input id="pw" type="password" autocomplete="current-password" required class="ltr"><button type="button" class="eye" id="eye" aria-label="إظهار كلمة السر"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label>
    <p class="err" id="lerr" hidden></p>
    <button class="btn" id="lbtn">دخول</button>
    <button type="button" class="link" id="forgot">نسيت كلمة السر؟</button>
  </form></div></div>`;
  const err = m => { const e = q("#lerr"); e.textContent = m; e.hidden = !m; };
  q("#eye").onclick = () => { const p = q("#pw"); p.type = p.type === "password" ? "text" : "password"; p.focus(); };
  q("#login").onsubmit = async e => {
    e.preventDefault(); err(""); q("#lbtn").disabled = true;
    try { await A.signInWithEmailAndPassword(auth, q("#em").value.trim(), q("#pw").value); }
    catch (x) {
      q("#lbtn").disabled = false;
      err(/invalid|wrong|user-not-found/.test(x.code) ? (ADMIN_EMAIL ? "كلمة السر غلط." : "الإيميل أو كلمة السر غلط.") : x.code === "auth/too-many-requests" ? "محاولات كثيرة. استني شوي وجرّبي مرة ثانية." : "ما زبط الدخول: " + x.code);
    }
  };
  q("#forgot").onclick = async () => {
    const em = q("#em").value.trim();
    if (!em) return err("اكتبي الإيميل أول، وبعدين اكبسي نسيت كلمة السر.");
    try { await A.sendPasswordResetEmail(auth, em); err(""); toast("انبعت رابط لتغيير كلمة السر على " + em); } catch (x) { err("ما زبط: " + x.code); }
  };
}

function notAdminView(user) {
  app.innerHTML = `<div class="center"><div class="box"><div class="brand">NOUR<b></b></div><h1>الحساب مش مسجّل كمدير</h1>
  <p>عشان تفوتي على لوحة التحكم، لازم تضيفي هاد الرقم بـ Firestore بمجموعة <code>admin</code> (الشرح بـ README):</p>
  <code style="padding:10px;user-select:all;word-break:break-all">${esc(user.uid)}</code>
  <button class="btn ghost" id="cp">نسخ الرقم</button>
  <button class="link" id="out">تسجيل خروج</button></div></div>`;
  q("#cp").onclick = () => navigator.clipboard?.writeText(user.uid).then(() => toast("انسخ ✓"), () => {});
  q("#out").onclick = () => A.signOut(auth);
}

/* ---------- الواجهة الرئيسية ---------- */
const D = { orders: [], products: [], categories: [], settings: null, loaded: { orders: false } };
let unsubs = [], tab = "orders", ofilter = "all", osearch = "", modalOpen = false, firstOrders = true;
function stopAll() { unsubs.forEach(u => u()); unsubs = []; firstOrders = true; }

function mainView(user) {
  app.innerHTML = `<div class="top"><div class="topin"><a class="brand" href="./" target="_blank" title="فتح الموقع">NOUR<b></b></a>
    <div style="display:flex;gap:10px;align-items:center">${langSwitcher()}<span class="odate ltr hide-sm">${esc(user.email)}</span><button class="btn ghost sm" id="out">خروج</button></div></div>
    <nav class="tabs" id="tabs"></nav></div>
  <main id="view"></main><div id="modal"></div>`;
  q("#out").onclick = () => A.signOut(auth);
  q("#tabs").onclick = e => { const b = e.target.closest("button"); if (b) { tab = b.dataset.tab; drawTabs(); drawView(); } };

  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
  unsubs.push(F.onSnapshot(F.query(F.collection(db, "orders"), F.orderBy("createdAt", "desc"), F.limit(500)), snap => {
    if (!firstOrders) {
      const added = snap.docChanges().filter(c => c.type === "added" && !c.doc.metadata.hasPendingWrites).length;
      if (added) toast(added === 1 ? "🛍 وصلت طلبية جديدة!" : `🛍 وصلوا ${added} طلبيات جديدة!`);
    }
    firstOrders = false;
    D.orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    D.loaded.orders = true;
    const n = D.orders.filter(o => o.status === "new").length;
    document.title = (n ? `(${n}) ` : "") + "NOUR · لوحة التحكم";
    drawTabs(); if (tab === "orders") drawOrders();
  }, e => toast("خطأ بقراءة الطلبيات: " + e.code)));
  let patched = false;
  unsubs.push(F.onSnapshot(F.collection(db, "products"), s => {
    D.products = s.docs.map(d => ({ id: d.id, ...d.data() })).sort(byOrder);
    if (!patched) {
      patched = true;
      const fixes = D.products.map(p => [p.id, patchProduct(p).changed]).filter(([, c]) => Object.keys(c).length);
      if (fixes.length) { const b = F.writeBatch(db); fixes.forEach(([id, c]) => b.update(F.doc(db, "products", id), c)); b.commit().then(() => toast("انحدّثت الأسعار ✓"), e => console.warn(e)); }
    }
    drawView();
  }));
  unsubs.push(F.onSnapshot(F.collection(db, "categories"), s => { D.categories = s.docs.map(d => ({ id: d.id, ...d.data() })).sort(byOrder); if (tab !== "orders") drawView(); }));
  unsubs.push(F.onSnapshot(F.doc(db, "settings", "store"), s => { D.settings = s.exists() ? s.data() : null; if (tab === "settings") drawView(); }));
  drawTabs(); drawView();
  runMigration();
}

// تحديث البيانات مرة وحدة (أوصاف جديدة، قطع جديدة، شيل قسم الإكسسوارات…)
async function runMigration() {
  try {
    const [ps, cs, st] = await Promise.all([F.getDocs(F.collection(db, "products")), F.getDocs(F.collection(db, "categories")), F.getDoc(F.doc(db, "settings", "store"))]);
    if (ps.empty) return;
    const data = { products: ps.docs.map(d => ({ id: d.id, ...d.data() })), categories: cs.docs.map(d => ({ id: d.id, ...d.data() })), settings: st.exists() ? st.data() : null };
    const { data: out, ops } = migrate(data);
    if (!ops.length) return;
    const b = F.writeBatch(db);
    for (const [kind, col, id, val] of ops) {
      if (kind === "update") b.update(F.doc(db, col, id), val);
      else if (kind === "set") b.set(F.doc(db, col, id), val);
      else if (kind === "delete") b.delete(F.doc(db, col, id));
      else if (kind === "update-settings") b.set(F.doc(db, "settings", "store"), out.settings);
    }
    await b.commit();
    toast("انحدّث المتجر ✓ (قطع وأوصاف جديدة)");
  } catch (e) { console.warn("migration failed", e); }
}

function drawTabs() {
  const n = D.orders.filter(o => o.status === "new").length;
  const T = [["orders", "الطلبيات", n], ["products", "القطع"], ["categories", "الأقسام"], ["settings", "الإعدادات"]];
  q("#tabs").innerHTML = T.map(([k, l, b]) => `<button data-tab="${k}" aria-pressed="${tab === k}">${l}${b ? `<span class="badge">${b}</span>` : ""}</button>`).join("");
}
function drawView() {
  if (!q("#view")) return;
  ({ orders: viewOrders, products: viewProducts, categories: viewCategories, settings: viewSettings })[tab]();
}

/* ---------- الطلبيات ---------- */
function viewOrders() {
  q("#view").innerHTML = `<div class="stats" id="stats"></div>
  <div class="head"><div class="chips" id="chips"></div>
  <input type="text" id="osearch" placeholder="بحث بالاسم، التلفون أو رقم الطلب" style="max-width:280px" value="${esc(osearch)}"></div>
  <div class="list" id="olist"></div>`;
  q("#osearch").oninput = e => { osearch = e.target.value.trim().toLowerCase(); drawOrders(); };
  q("#chips").onclick = e => { const b = e.target.closest("button"); if (b) { ofilter = b.dataset.s; drawOrders(); } };
  q("#olist").onchange = async e => {
    if (!e.target.matches("[data-status]")) return;
    try { await F.updateDoc(F.doc(db, "orders", e.target.dataset.status), { status: e.target.value }); toast("انحفظت الحالة ✓"); }
    catch (x) { toast("ما انحفظت: " + x.code); }
  };
  q("#olist").onclick = async e => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "متأكدة؟ اكبسي كمان مرة"; setTimeout(() => { if (b.isConnected) { b.dataset.armed = ""; b.textContent = "حذف"; } }, 3500); return; }
    try { await F.deleteDoc(F.doc(db, "orders", b.dataset.del)); toast("انحذفت الطلبية"); } catch (x) { toast("ما انحذفت: " + x.code); }
  };
  drawOrders();
}

function drawOrders() {
  if (!q("#olist")) return;
  const O = D.orders, now = new Date();
  const today = O.filter(o => { const d = o.createdAt?.toDate?.(); return d && d.toDateString() === now.toDateString(); });
  const month = O.filter(o => { const d = o.createdAt?.toDate?.(); return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.status !== "cancel"; });
  q("#stats").innerHTML = `
    <div class="stat"><b>${O.filter(o => o.status === "new").length}</b><span>طلبيات جديدة</span></div>
    <div class="stat"><b>${today.length}</b><span>طلبيات اليوم</span></div>
    <div class="stat"><b>${money(month.reduce((a, o) => a + (+o.total || 0), 0))}</b><span>مبيعات هالشهر (${month.length} طلبية)</span></div>`;
  const cnt = k => k === "all" ? O.length : O.filter(o => o.status === k).length;
  q("#chips").innerHTML = [["all", "الكل"], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])]
    .map(([k, l]) => `<button data-s="${k}" aria-pressed="${ofilter === k}">${l} (${cnt(k)})</button>`).join("");

  let list = ofilter === "all" ? O : O.filter(o => o.status === ofilter);
  if (osearch) list = list.filter(o => [o.no, o.customer?.name, o.customer?.phone].some(v => String(v || "").toLowerCase().includes(osearch)));
  if (!D.loaded.orders) { q("#olist").innerHTML = `<div class="empty">جاري التحميل…</div>`; return; }
  if (!list.length) { q("#olist").innerHTML = `<div class="empty">${O.length ? "ما في طلبيات بهاد الفلتر." : "لسا ما وصلت طلبيات. أول ما زبونة تطلب من الموقع، الطلبية بتظهر هون فوراً."}</div>`; return; }

  q("#olist").innerHTML = list.map(o => {
    const s = STATUS[o.status] || STATUS.new, c = o.customer || {}, dl = o.delivery || {};
    const phone = String(c.phone || "").replace(/\D/g, "").replace(/^0/, "972");
    return `<article class="order ${o.status === "new" ? "new" : ""}" style="--st:${s.color}">
      <div class="ohead"><div><div class="ono">#${esc(o.no || o.id.slice(0, 6).toUpperCase())}</div><div class="odate ltr">${fmtDate(o.createdAt)}</div></div><span class="pill">${s.label}</span></div>
      <div class="ocust">
        <div><small>الاسم</small>${esc(c.name)}</div>
        <div><small>التلفون</small><a class="ltr" href="tel:${esc(c.phone)}">${esc(c.phone)}</a> · <a href="https://wa.me/${esc(phone)}" target="_blank" rel="noopener">واتساب</a></div>
        <div><small>الاستلام</small>${dl.type === "pickup" ? "<span>استلام ذاتي</span>" : `<span>توصيل</span> — <span>${esc(dl.zone)}</span> (${dl.free ? "مجاني فوق ₪500" : money(dl.price)})`}</div>
        ${o.payment ? `<div><small>الدفع</small>${esc(o.payment)}</div>` : ""}
        ${c.city ? `<div><small>العنوان</small>${esc(c.city)}</div>` : ""}
        ${c.notes ? `<div style="grid-column:1/-1"><small>ملاحظات</small>${esc(c.notes)}</div>` : ""}
      </div>
      <table class="items">${(o.items || []).map(i => `<tr><td class="ith">${itemThumb(i)}</td><td>${esc(i.name)} — ${esc(i.color)}${i.size ? " — " + esc(i.size) : ""} × ${+i.qty || 0}</td><td>${i.price ? money(i.price * i.qty) : "—"}</td></tr>`).join("")}</table>
      <div class="tot"><span>المجموع الكلي</span><span>${money(o.total)}</span></div>
      <div class="oact"><select data-status="${esc(o.id)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}"${o.status === k ? " selected" : ""}>${v.label}</option>`).join("")}</select>
        <button class="btn danger sm" data-del="${esc(o.id)}">حذف</button></div>
    </article>`;
  }).join("");
  hydrate(q("#olist"));
}

/* ---------- القطع ---------- */
const catName = id => D.categories.find(c => c.id === id)?.name ? nl(D.categories.find(c => c.id === id).name) : "بدون قسم";
function viewProducts() {
  if (modalOpen) return;
  const P = D.products;
  const groups = [...D.categories.map(c => c.id), ...new Set(P.map(p => p.cat).filter(id => !D.categories.some(c => c.id === id)))];
  q("#view").innerHTML = `<div class="head"><h2>القطع (${P.length})</h2><button class="btn" id="addp">+ قطعة جديدة</button></div>
  ${P.length ? groups.map(g => {
    const items = P.filter(p => p.cat === g); if (!items.length) return "";
    return `<div class="pgroup"><h3>${esc(catName(g))}</h3>${items.map(p => {
      const c0 = p.colors?.find(c => imgsOf(p.id, c).length) || p.colors?.[0] || {}, u0 = imgsOf(p.id, c0)[0];
      return `<div class="prow ${p.hidden ? "off" : ""}"><div class="thumb"${u0?.startsWith("fs:") ? ` data-ref="${esc(u0)}"` : ""} style="--sw:${esc(c0.hex || "#ccc")}${bgStyle(u0)}"></div>
        <div><h4>${esc(nl(p.name))}${p.soldOut ? " · نفذت الكمية" : ""}${p.limited ? " · ليميتد" : ""}${p.hidden ? " · مخفية" : ""}</h4>
        <p>${p.price ? money(p.price) : "بدون سعر"} · ${(p.colors || []).length} ألوان<span class="dots">${(p.colors || []).map(c => `<i style="--c:${esc(c.hex)}"></i>`).join("")}</span>${(p.colors || []).some(c => !imgsOf(p.id, c).length) ? " · ناقص صور" : ""}</p></div>
        <div class="row-act"><button class="btn ghost sm" data-hide="${esc(p.id)}">${p.hidden ? "إظهار" : "إخفاء"}</button><button class="btn sm" data-edit="${esc(p.id)}">تعديل</button></div></div>`;
    }).join("")}</div>`;
  }).join("") : `<div class="empty">ما في قطع بالمتجر لسا.<br>بتقدري تبلّشي بالقطع اللي جهّزناها (7 قطع، 4 أقسام، وأسعار التوصيل)، وبعدين تضيفي صور وأسعار.<button class="btn" id="seed">إضافة القطع الأساسية</button></div>`}`;
  hydrate(q("#view"));
  q("#addp").onclick = () => productEditor(null);
  q("#seed")?.addEventListener("click", seed);
  q("#view").onclick = async e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.edit) productEditor(D.products.find(p => p.id === b.dataset.edit));
    if (b.dataset.hide) { const p = D.products.find(x => x.id === b.dataset.hide); await F.updateDoc(F.doc(db, "products", p.id), { hidden: !p.hidden }).then(() => toast(p.hidden ? "صارت ظاهرة بالموقع" : "انخفت من الموقع"), x => toast("ما زبط: " + x.code)); }
  };
}

async function seed(e) {
  e.target.disabled = true;
  try {
    const b = F.writeBatch(db);
    DEFAULTS.categories.forEach(({ id, ...c }) => b.set(F.doc(db, "categories", id), c));
    DEFAULTS.products.forEach(({ id, ...p }) => b.set(F.doc(db, "products", id), p));
    if (!D.settings) b.set(F.doc(db, "settings", "store"), DEFAULTS.settings);
    await b.commit(); toast("انضافوا ✓ هلأ ضيفي الصور والأسعار");
  } catch (x) { e.target.disabled = false; toast("ما زبط: " + x.code); }
}

/* ---------- محرر عام (نافذة) ---------- */
let draft = null;
function openModal(html, bind) {
  modalOpen = true;
  q("#modal").innerHTML = `<div class="modal" id="mbg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  hydrate(q("#modal"));
  const m = q("#mbg");
  m.oninput = e => {
    const el = e.target, p = el.dataset.b; if (!p) return;
    let v = el.type === "checkbox" ? el.checked : el.type === "number" ? (el.value === "" ? 0 : +el.value) : el.value;
    if (el.dataset.list) v = String(v).split(",").map(s => s.trim()).filter(Boolean);
    setPath(draft, p, v);
    if (el.type === "color") { const tw = el.closest(".colorbox")?.querySelector(".img"); if (tw) tw.style.setProperty("--sw", v); }
  };
  m.onclick = e => { if (e.target === m) closeModal(); bind(e); };
}
function closeModal() { modalOpen = false; draft = null; const m = q("#modal"); m.innerHTML = ""; m.onchange = null; drawView(); }
const langInputs = (path, label, area = false) => `<div class="f"><span>${label}</span><div class="grid3">${LANGS.map(([l, n]) =>
  area ? `<textarea data-b="${path}.${l}" placeholder="${n}" dir="${l === "en" ? "ltr" : "rtl"}">${esc(getPath(draft, path + "." + l))}</textarea>`
       : `<input type="text" data-b="${path}.${l}" placeholder="${n}" dir="${l === "en" ? "ltr" : "rtl"}" value="${esc(getPath(draft, path + "." + l))}">`).join("")}</div></div>`;

/* ---------- محرر القطعة ---------- */
function productEditor(p) {
  const isNew = !p;
  const id = p?.id || F.doc(F.collection(db, "products")).id;
  draft = structuredClone(p ? (({ id, ...r }) => r)(p) : {
    cat: D.categories[0]?.id || "", order: (D.products.at(-1)?.order || 0) + 1, price: 0, sizes: ["S", "M", "L", "XL"], limited: false, hidden: false,
    name: { ar: "", he: "", en: "" }, desc: { ar: "", he: "", en: "" }, colors: [{ name: { ar: "", he: "", en: "" }, hex: "#1a1a1a", img: "" }],
  });
  draft.colors ||= []; draft.sizes ||= [];
  const uploaded = [], toDelete = [];
  const draw = () => openModal(`<h3>${isNew ? "قطعة جديدة" : "تعديل: " + esc(draft.name?.ar)}</h3>
    ${langInputs("name", "اسم القطعة *")}
    ${langInputs("desc", "وصف قصير", true)}
    <div class="grid3">
      <label class="f"><span>القسم</span><select data-b="cat">${D.categories.map(c => `<option value="${esc(c.id)}"${draft.cat === c.id ? " selected" : ""}>${esc(nl(c.name))}</option>`).join("")}</select></label>
      <label class="f"><span>السعر ₪</span><input type="number" min="0" step="1" data-b="price" value="${+draft.price || 0}"></label>
      <label class="f"><span>الترتيب بالموقع</span><input type="number" step="1" data-b="order" value="${+draft.order || 0}"></label>
    </div>
    <label class="f"><span>المقاسات (افصلي بفاصلة · فاضي = بدون مقاسات)</span><input type="text" class="ltr" data-b="sizes" data-list="1" value="${esc(draft.sizes.join(", "))}"></label>
    <div style="display:flex;gap:20px;flex-wrap:wrap"><label class="chk"><input type="checkbox" data-b="soldOut"${draft.soldOut ? " checked" : ""}> نفذت الكمية (Sold out)</label><label class="chk"><input type="checkbox" data-b="limited"${draft.limited ? " checked" : ""}> ليميتد إيديشن</label><label class="chk"><input type="checkbox" data-b="hidden"${draft.hidden ? " checked" : ""}> مخفية من الموقع</label></div>
    <section><b>الألوان والصور</b>
      ${draft.colors.map((c, i) => { const list = imgsOf(id, c); return `<div class="colorbox">
        <div class="gal-ed">${list.map((u, k) => `<div class="gi"${u.startsWith("fs:") ? ` data-ref="${esc(u)}"` : ""} style="--sw:${esc(c.hex)}${bgStyle(u)}">${k === 0 ? `<span class="main">رئيسية</span>` : ""}<button type="button" class="gx" data-rmi="${i}" data-ref2="${esc(u)}" aria-label="حذف الصورة">✕</button></div>`).join("")}
          <label class="gadd"><span>+ صور</span><input type="file" accept="image/*" multiple data-up="${i}"></label></div>
        <div class="fields">${langInputs(`colors.${i}.name`, "اسم اللون")}
          <div class="hexrow"><input type="color" data-b="colors.${i}.hex" value="${esc(c.hex || "#000000")}"><span class="odate">لون النقطة (لما ما يكون في صورة)</span>
          <span style="flex:1"></span>${draft.colors.length > 1 ? `<button class="btn danger sm" data-rmc="${i}">حذف اللون</button>` : ""}</div>
          <p class="odate" id="up${i}" hidden></p></div></div>`; }).join("")}
      <button class="btn ghost" data-addc="1">+ لون جديد</button>
    </section>
    <p class="err" id="perr" hidden></p>
    <div class="foot"><div>${isNew ? "" : `<button class="btn danger" data-delp="1">حذف القطعة</button>`}</div><div><button class="btn ghost" data-cancel="1">إلغاء</button><button class="btn" data-save="1">حفظ</button></div></div>`,
    async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.cancel) { uploaded.forEach(x => F.deleteDoc(F.doc(db, "images", x)).catch(() => {})); return closeModal(); }
      if (b.dataset.addc) { draft.colors.push({ name: { ar: "", he: "", en: "" }, hex: "#cccccc", imgs: [] }); return draw(); }
      if (b.dataset.rmi) {
        const c = draft.colors[+b.dataset.rmi], ref = b.dataset.ref2;
        if ((c.imgs || []).includes(ref)) { c.imgs = c.imgs.filter(x => x !== ref); if (ref.startsWith("fs:")) toDelete.push(ref.slice(3)); }
        else if (c.img === ref) c.img = "";
        else (c.removed ||= []).push(ref);
        return draw();
      }
      if (b.dataset.rmc) { draft.colors.splice(+b.dataset.rmc, 1); return draw(); }
      if (b.dataset.delp) {
        if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "متأكدة؟ اكبسي كمان مرة"; return; }
        try { await F.deleteDoc(F.doc(db, "products", id)); toast("انحذفت القطعة"); closeModal(); } catch (x) { toast("ما انحذفت: " + x.code); }
        return;
      }
      if (b.dataset.save) {
        const err = q("#perr");
        if (!draft.name.ar.trim()) { err.textContent = "لازم اسم بالعربي على الأقل."; err.hidden = false; return; }
        if (!draft.colors.length) { err.textContent = "لازم لون واحد على الأقل."; err.hidden = false; return; }
        draft.colors.forEach(c => { c.name ||= {}; if (!c.name.ar) c.name.ar = "—"; });
        b.disabled = true;
        try {
          await F.setDoc(F.doc(db, "products", id), { ...draft, price: +draft.price || 0, order: +draft.order || 0 });
          toDelete.forEach(x => F.deleteDoc(F.doc(db, "images", x)).catch(() => {}));
          toast("انحفظت ✓"); closeModal();
        }
        catch (x) { b.disabled = false; err.textContent = "ما انحفظت: " + x.code; err.hidden = false; }
      }
    });
  draw();
  // رفع الصور: بتتصغّر وبتنحفظ بقاعدة البيانات (بدون Storage)
  q("#modal").onchange = async e => {
    const inp = e.target; if (!inp.dataset.up || !inp.files.length) return;
    const i = +inp.dataset.up, msg = q("#up" + i), files = [...inp.files];
    msg.hidden = false;
    for (let k = 0; k < files.length; k++) {
      msg.textContent = `جاري تجهيز الصورة ${k + 1} من ${files.length}…`;
      try {
        const data = await toDataURL(files[k]);
        const ref = F.doc(F.collection(db, "images"));
        await F.setDoc(ref, { data, pid: id, createdAt: F.serverTimestamp() });
        IMGC.set(ref.id, Promise.resolve(data));
        uploaded.push(ref.id);
        (draft.colors[i].imgs ||= []).push("fs:" + ref.id);
      } catch (x) { console.error(x); msg.textContent = "ما انرفعت: " + (x.code || x.message); return; }
    }
    draw(); toast(files.length > 1 ? `انرفعوا ${files.length} صور ✓ لا تنسي تكبسي حفظ` : "انرفعت الصورة ✓ لا تنسي تكبسي حفظ");
  };
}

async function toDataURL(file) {
  const img = await createImageBitmap(file);
  for (const [max, qlt] of [[1400, 0.82], [1200, 0.75], [1000, 0.7], [800, 0.65]]) {
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const d = c.toDataURL("image/jpeg", qlt);
    if (d.length < 900000) return d;
  }
  throw new Error("الصورة كبيرة كتير");
}
async function compress(file) {
  try {
    const img = await createImageBitmap(file);
    const s = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(b => r(b || file), "image/jpeg", 0.85));
  } catch { return file; }
}

/* ---------- الأقسام ---------- */
function viewCategories() {
  if (modalOpen) return;
  const C = D.categories;
  q("#view").innerHTML = `<div class="head"><h2>الأقسام (${C.length})</h2><button class="btn" id="addc">+ قسم جديد</button></div>
  ${C.length ? C.map(c => { const n = D.products.filter(p => p.cat === c.id).length;
    return `<div class="prow" style="grid-template-columns:1fr auto"><div><h4>${esc(nl(c.name))} <span class="odate">· ${esc(c.name?.he)} · ${esc(c.name?.en)}</span></h4><p>${n} قطع · ترتيب ${+c.order || 0}</p></div>
    <div class="row-act"><button class="btn sm" data-editc="${esc(c.id)}">تعديل</button></div></div>`; }).join("")
  : `<div class="empty">ما في أقسام لسا. روحي على "القطع" واكبسي "إضافة القطع الأساسية"، أو ضيفي قسم جديد.</div>`}`;
  q("#addc").onclick = () => catEditor(null);
  q("#view").onclick = e => { const b = e.target.closest("[data-editc]"); if (b) catEditor(D.categories.find(c => c.id === b.dataset.editc)); };
}
function catEditor(c) {
  const isNew = !c, id = c?.id || F.doc(F.collection(db, "categories")).id;
  const used = D.products.filter(p => p.cat === id).length;
  draft = structuredClone(c ? (({ id, ...r }) => r)(c) : { name: { ar: "", he: "", en: "" }, order: (D.categories.at(-1)?.order || 0) + 1 });
  openModal(`<h3>${isNew ? "قسم جديد" : "تعديل القسم"}</h3>
    ${langInputs("name", "اسم القسم *")}
    <label class="f" style="max-width:160px"><span>الترتيب</span><input type="number" data-b="order" value="${+draft.order || 0}"></label>
    <p class="err" id="cerr" hidden></p>
    <div class="foot"><div>${isNew ? "" : `<button class="btn danger" data-delc="1"${used ? " disabled title=\"لازم تنقلي أو تحذفي القطع اللي فيه أول\"" : ""}>حذف القسم${used ? ` (فيه ${used} قطع)` : ""}</button>`}</div>
    <div><button class="btn ghost" data-cancel="1">إلغاء</button><button class="btn" data-save="1">حفظ</button></div></div>`,
    async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.cancel) return closeModal();
      if (b.dataset.delc) {
        if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "متأكدة؟ اكبسي كمان مرة"; return; }
        try { await F.deleteDoc(F.doc(db, "categories", id)); toast("انحذف القسم"); closeModal(); } catch (x) { toast("ما انحذف: " + x.code); }
        return;
      }
      if (b.dataset.save) {
        if (!draft.name.ar.trim()) { const er = q("#cerr"); er.textContent = "لازم اسم بالعربي على الأقل."; er.hidden = false; return; }
        b.disabled = true;
        try { await F.setDoc(F.doc(db, "categories", id), { ...draft, order: +draft.order || 0 }); toast("انحفظ ✓"); closeModal(); }
        catch (x) { b.disabled = false; toast("ما انحفظ: " + x.code); }
      }
    });
}

/* ---------- الإعدادات والتوصيل ---------- */
function viewSettings() {
  if (modalOpen) return;
  const s = D.settings;
  q("#view").innerHTML = `<div class="head"><h2>التوصيل والإعدادات</h2><button class="btn" id="edits">تعديل</button></div>
  ${s ? `<div class="prow" style="grid-template-columns:1fr"><div><h4>رقم الواتساب للطلبات</h4><p class="ltr" style="text-align:start">+${esc(s.whatsapp)}</p></div></div>
  <div class="pgroup"><h3>مناطق التوصيل</h3>${(s.zones || []).map(z => `<div class="prow" style="grid-template-columns:1fr auto"><div><h4>${esc(nl(z.name))}</h4><p>${esc(z.name?.he)} · ${esc(z.name?.en)}</p></div><b class="ono">${money(z.price)}</b></div>`).join("")}
  <div class="prow" style="grid-template-columns:1fr auto"><div><h4>استلام ذاتي</h4><p>دايماً موجود بالموقع</p></div><b class="ono">${money(0)}</b></div></div>`
  : `<div class="empty">لسا ما في إعدادات. اكبسي "تعديل" عشان تضيفي رقم الواتساب ومناطق التوصيل.</div>`}
  <div class="head" style="margin-top:12px"><h2>الحساب</h2></div>
  <div class="prow" style="grid-template-columns:1fr auto"><div><h4>كلمة السر</h4><p class="ltr" style="text-align:start">${esc(auth.currentUser?.email)}</p></div>
  <button class="btn sm" id="chpw">تغيير كلمة السر</button></div>`;
  q("#edits").onclick = settingsEditor;
  q("#chpw").onclick = passwordEditor;
}
function settingsEditor() {
  draft = structuredClone(D.settings || DEFAULTS.settings);
  draft.zones ||= [];
  const draw = () => openModal(`<h3>التوصيل والإعدادات</h3>
    <label class="f"><span>رقم الواتساب (مع 972 وبدون 0 بالأول)</span><input type="tel" class="ltr" data-b="whatsapp" value="${esc(draft.whatsapp)}" placeholder="972500000000"></label>
    <section><b>مناطق التوصيل</b>
    ${draft.zones.map((z, i) => `<div class="zone">${LANGS.map(([l, n]) => `<label class="f"><span>${n}</span><input type="text" data-b="zones.${i}.name.${l}" dir="${l === "en" ? "ltr" : "rtl"}" value="${esc(z.name?.[l])}"></label>`).join("")}
      <label class="f"><span>السعر ₪</span><input type="number" min="0" data-b="zones.${i}.price" value="${+z.price || 0}"></label>
      <button class="btn danger sm" data-rmz="${i}">حذف</button></div>`).join("")}
    <button class="btn ghost" data-addz="1">+ منطقة جديدة</button></section>
    <div class="foot"><div></div><div><button class="btn ghost" data-cancel="1">إلغاء</button><button class="btn" data-save="1">حفظ</button></div></div>`,
    async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.cancel) return closeModal();
      if (b.dataset.addz) { draft.zones.push({ name: { ar: "", he: "", en: "" }, price: 0 }); return draw(); }
      if (b.dataset.rmz) { draft.zones.splice(+b.dataset.rmz, 1); return draw(); }
      if (b.dataset.save) {
        draft.whatsapp = String(draft.whatsapp || "").replace(/\D/g, "").replace(/^0/, "972");
        draft.zones = draft.zones.filter(z => z.name?.ar?.trim()).map(z => ({ ...z, price: +z.price || 0 }));
        b.disabled = true;
        try { await F.setDoc(F.doc(db, "settings", "store"), draft); toast("انحفظ ✓"); closeModal(); }
        catch (x) { b.disabled = false; toast("ما انحفظ: " + x.code); }
      }
    });
  draw();
}

/* ---------- تغيير كلمة السر ---------- */
function passwordEditor() {
  draft = {};
  openModal(`<h3>تغيير كلمة السر</h3>
    <label class="f"><span>كلمة السر الحالية</span><input type="password" id="pw0" class="ltr" autocomplete="current-password"></label>
    <label class="f"><span>كلمة السر الجديدة (6 حروف على الأقل)</span><input type="password" id="pw1" class="ltr" autocomplete="new-password"></label>
    <label class="f"><span>كرّري كلمة السر الجديدة</span><input type="password" id="pw2" class="ltr" autocomplete="new-password"></label>
    <p class="err" id="pwerr" hidden></p>
    <div class="foot"><div></div><div><button class="btn ghost" data-cancel="1">إلغاء</button><button class="btn" data-save="1">حفظ</button></div></div>`,
    async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.cancel) return closeModal();
      if (!b.dataset.save) return;
      const err = m => { const x = q("#pwerr"); x.textContent = m; x.hidden = !m; };
      const p0 = q("#pw0").value, p1 = q("#pw1").value, p2 = q("#pw2").value;
      if (!p0 || !p1) return err("عبّي كل الحقول.");
      if (p1.length < 6) return err("كلمة السر الجديدة لازم تكون 6 حروف على الأقل.");
      if (p1 !== p2) return err("كلمتين السر الجداد مش متطابقات.");
      if (p1 === p0) return err("كلمة السر الجديدة نفس القديمة.");
      b.disabled = true; err("");
      try {
        const u = auth.currentUser;
        await A.reauthenticateWithCredential(u, A.EmailAuthProvider.credential(u.email, p0));
        await A.updatePassword(u, p1);
        toast("تغيّرت كلمة السر ✓"); closeModal();
      } catch (x) {
        b.disabled = false;
        err(/invalid|wrong/.test(x.code) ? "كلمة السر الحالية غلط." : x.code === "auth/weak-password" ? "كلمة السر ضعيفة، جرّبي وحدة أطول." : x.code === "auth/too-many-requests" ? "محاولات كثيرة. استني شوي وجرّبي مرة ثانية." : "ما زبط: " + x.code);
      }
    });
  q("#pw0").focus();
}
