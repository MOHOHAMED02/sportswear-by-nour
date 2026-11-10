// ترجمة لوحة التحكم: النصوص الأصلية بالعربي، وهون مقابلها بالعبري والإنجليزي.
// بتشتغل تلقائياً على كل إشي بينعرض بالصفحة.
const D = {
  "جديدة": ["חדשה", "New"],
  "قيد التحضير": ["בהכנה", "Preparing"],
  "انبعتت": ["נשלחה", "Shipped"],
  "وصلت": ["נמסרה", "Delivered"],
  "ملغية": ["בוטלה", "Cancelled"],
  "عربي": ["ערבית", "Arabic"],
  "لوحة التحكم": ["לוח בקרה", "Dashboard"],
  "لسا ما انربط": ["עדיין לא חובר", "Not connected yet:"],
  "حط إعدادات مشروعك بملف": ["הכניסו את הגדרות הפרויקט בקובץ", "add your project settings in"],
  "، والشرح كامل بملف": [", ההסבר המלא בקובץ", ", full guide in"],
  "صار خطأ بالتحميل": ["אירעה שגיאה בטעינה", "Loading error"],
  "الإيميل": ["אימייל", "Email"],
  "كلمة السر": ["סיסמה", "Password"],
  "إظهار كلمة السر": ["הצגת סיסמה", "Show password"],
  "دخول": ["כניסה", "Sign in"],
  "نسيت كلمة السر؟": ["שכחתי סיסמה", "Forgot password?"],
  "كلمة السر غلط.": ["סיסמה שגויה.", "Wrong password."],
  "الإيميل أو كلمة السر غلط.": ["אימייל או סיסמה שגויים.", "Wrong email or password."],
  "محاولات كثيرة. استني شوي وجرّبي مرة ثانية.": ["יותר מדי ניסיונות. חכי קצת ונסי שוב.", "Too many attempts. Wait a bit and try again."],
  "ما زبط الدخول": ["הכניסה נכשלה", "Sign-in failed"],
  "اكتبي الإيميل أول، وبعدين اكبسي نسيت كلمة السر.": ["כתבי קודם אימייל ואז לחצי על שכחתי סיסמה.", "Enter your email first, then tap Forgot password."],
  "انبعت رابط لتغيير كلمة السر على": ["נשלח קישור לאיפוס סיסמה אל", "Password reset link sent to"],
  "ما زبط": ["נכשל", "Failed"],
  "الحساب مش مسجّل كمدير": ["החשבון לא רשום כמנהל", "This account is not an admin"],
  "عشان تفوتي على لوحة التحكم، لازم تضيفي هاد الرقم بـ": ["כדי להיכנס ללוח הבקרה צריך להוסיף את המספר הזה ב-", "To use the dashboard, add this ID in"],
  "بمجموعة": ["באוסף", "in collection"],
  "الشرح بـ": ["הסבר ב-", "see"],
  "نسخ الرقم": ["העתקת המספר", "Copy ID"],
  "تسجيل خروج": ["התנתקות", "Sign out"],
  "انسخ ✓": ["הועתק ✓", "Copied ✓"],
  "فتح الموقع": ["פתיחת האתר", "Open site"],
  "خروج": ["יציאה", "Sign out"],
  "وصلت طلبية جديدة!": ["התקבלה הזמנה חדשה!", "New order received!"],
  "وصلوا": ["התקבלו", ""],
  "طلبيات جديدة!": ["הזמנות חדשות!", "new orders!"],
  "خطأ بقراءة الطلبيات": ["שגיאה בטעינת הזמנות", "Error loading orders"],
  "الطلبيات": ["הזמנות", "Orders"],
  "القطع": ["מוצרים", "Products"],
  "الأقسام": ["קטגוריות", "Categories"],
  "الإعدادات": ["הגדרות", "Settings"],
  "بحث بالاسم، التلفون أو رقم الطلب": ["חיפוש לפי שם, טלפון או מספר הזמנה", "Search by name, phone or order no."],
  "انحفظت الحالة ✓": ["הסטטוס נשמר ✓", "Status saved ✓"],
  "ما انحفظت": ["לא נשמר", "Not saved"],
  "متأكدة؟ اكبسي كمان مرة": ["בטוחה? לחצי שוב", "Sure? Tap again"],
  "حذف": ["מחיקה", "Delete"],
  "انحذفت الطلبية": ["ההזמנה נמחקה", "Order deleted"],
  "ما انحذفت": ["לא נמחק", "Not deleted"],
  "طلبيات جديدة": ["הזמנות חדשות", "New orders"],
  "طلبيات اليوم": ["הזמנות היום", "Orders today"],
  "مبيعات هالشهر": ["מכירות החודש", "Sales this month"],
  "طلبية)": ["הזמנות)", "orders)"],
  "الكل": ["הכול", "All"],
  "جاري التحميل…": ["טוען…", "Loading…"],
  "ما في طلبيات بهاد الفلتر.": ["אין הזמנות בסינון הזה.", "No orders match this filter."],
  "لسا ما وصلت طلبيات. أول ما زبونة تطلب من الموقع، الطلبية بتظهر هون فوراً.": ["עדיין אין הזמנות. ברגע שלקוחה מזמינה מהאתר, ההזמנה תופיע כאן מיד.", "No orders yet. As soon as a customer orders on the site, it shows up here instantly."],
  "الاسم": ["שם", "Name"],
  "التلفون": ["טלפון", "Phone"],
  "واتساب": ["וואטסאפ", "WhatsApp"],
  "الاستلام": ["קבלה", "Delivery"],
  "الدفع": ["תשלום", "Payment"],
  "مجاني فوق ₪500": ["חינם מעל ₪500", "Free over ₪500"],
  "استلام ذاتي": ["איסוף עצמי", "Self pickup"],
  "توصيل": ["משלוח", "Delivery"],
  "العنوان": ["כתובת", "Address"],
  "ملاحظات": ["הערות", "Notes"],
  "المجموع الكلي": ["סה״כ", "Total"],
  "بدون قسم": ["ללא קטגוריה", "No category"],
  "قطعة جديدة": ["מוצר חדש", "New product"],
  "ليميتد": ["לימיטד", "Limited"],
  "مخفية": ["מוסתר", "Hidden"],
  "بدون سعر": ["ללא מחיר", "No price"],
  "ألوان": ["צבעים", "colors"],
  "ناقص صور": ["חסרות תמונות", "missing photos"],
  "إظهار": ["הצגה", "Show"],
  "إخفاء": ["הסתרה", "Hide"],
  "تعديل": ["עריכה", "Edit"],
  "ما في قطع بالمتجر لسا.": ["עדיין אין מוצרים בחנות.", "No products in the store yet."],
  "بتقدري تبلّشي بالقطع اللي جهّزناها (7 قطع، 4 أقسام، وأسعار التوصيل)، وبعدين تضيفي صور وأسعار.": ["אפשר להתחיל עם המוצרים שהכנו (7 מוצרים, 4 קטגוריות ומחירי משלוח) ואז להוסיף תמונות ומחירים.", "Start with the products we prepared (7 products, 4 categories and delivery prices), then add photos and prices."],
  "إضافة القطع الأساسية": ["הוספת המוצרים הבסיסיים", "Add starter products"],
  "صارت ظاهرة بالموقع": ["מוצג עכשיו באתר", "Now visible on the site"],
  "انخفت من الموقع": ["הוסתר מהאתר", "Hidden from the site"],
  "انضافوا ✓ هلأ ضيفي الصور والأسعار": ["נוספו ✓ עכשיו הוסיפי תמונות ומחירים", "Added ✓ Now add photos and prices"],
  "اسم القطعة": ["שם המוצר", "Product name"],
  "وصف قصير": ["תיאור קצר", "Short description"],
  "القسم": ["קטגוריה", "Category"],
  "السعر": ["מחיר", "Price"],
  "الترتيب بالموقع": ["סדר באתר", "Order on site"],
  "المقاسات (افصلي بفاصلة · فاضي = بدون مقاسات)": ["מידות (מופרדות בפסיק · ריק = ללא מידות)", "Sizes (comma separated · empty = no sizes)"],
  "ليميتد إيديشن": ["מהדורה מוגבלת", "Limited edition"],
  "مخفية من الموقع": ["מוסתר מהאתר", "Hidden from site"],
  "الألوان والصور": ["צבעים ותמונות", "Colors & photos"],
  "تغيير الصورة": ["החלפת תמונה", "Change photo"],
  "صورة": ["תמונה", "photo"],
  "اسم اللون": ["שם הצבע", "Color name"],
  "لون النقطة (لما ما يكون في صورة)": ["צבע הנקודה (כשאין תמונה)", "Dot color (when there's no photo)"],
  "حذف اللون": ["מחיקת צבע", "Delete color"],
  "لون جديد": ["צבע חדש", "New color"],
  "حذف القطعة": ["מחיקת מוצר", "Delete product"],
  "إلغاء": ["ביטול", "Cancel"],
  "حفظ": ["שמירה", "Save"],
  "انحذفت القطعة": ["המוצר נמחק", "Product deleted"],
  "لازم اسم بالعربي على الأقل.": ["חובה שם בערבית לפחות.", "An Arabic name is required."],
  "لازم لون واحد على الأقل.": ["חובה צבע אחד לפחות.", "At least one color is required."],
  "انحفظت ✓": ["נשמר ✓", "Saved ✓"],
  "جاري تجهيز الصورة…": ["מכינה את התמונה…", "Preparing photo…"],
  "جاري الرفع…": ["מעלה…", "Uploading…"],
  "انرفعت الصورة ✓ لا تنسي تكبسي حفظ": ["התמונה הועלתה ✓ לא לשכוח ללחוץ שמירה", "Photo uploaded ✓ Don't forget to Save"],
  "ما انرفعت": ["ההעלאה נכשלה", "Upload failed"],
  "قسم جديد": ["קטגוריה חדשה", "New category"],
  "قطع": ["מוצרים", "products"],
  "ترتيب": ["סדר", "order"],
  "ما في أقسام لسا. روحي على \"القطع\" واكبسي \"إضافة القطع الأساسية\"، أو ضيفي قسم جديد.": ["עדיין אין קטגוריות. עברי ל\"מוצרים\" ולחצי \"הוספת המוצרים הבסיסיים\", או הוסיפי קטגוריה חדשה.", "No categories yet. Go to \"Products\" and tap \"Add starter products\", or add a new category."],
  "تعديل القسم": ["עריכת קטגוריה", "Edit category"],
  "اسم القسم": ["שם הקטגוריה", "Category name"],
  "الترتيب": ["סדר", "Order"],
  "لازم تنقلي أو تحذفي القطع اللي فيه أول": ["צריך קודם להעביר או למחוק את המוצרים שבה", "Move or delete its products first"],
  "حذف القسم": ["מחיקת קטגוריה", "Delete category"],
  "فيه": ["יש בה", "has"],
  "قطع)": ["מוצרים)", "products)"],
  "انحذف القسم": ["הקטגוריה נמחקה", "Category deleted"],
  "ما انحذف": ["לא נמחק", "Not deleted"],
  "انحفظ ✓": ["נשמר ✓", "Saved ✓"],
  "ما انحفظ": ["לא נשמר", "Not saved"],
  "التوصيل والإعدادات": ["משלוחים והגדרות", "Delivery & settings"],
  "رقم الواتساب للطلبات": ["מספר וואטסאפ להזמנות", "WhatsApp number for orders"],
  "مناطق التوصيل": ["אזורי משלוח", "Delivery zones"],
  "دايماً موجود بالموقع": ["תמיד זמין באתר", "Always available on the site"],
  "لسا ما في إعدادات. اكبسي \"تعديل\" عشان تضيفي رقم الواتساب ومناطق التوصيل.": ["עדיין אין הגדרות. לחצי \"עריכה\" כדי להוסיף מספר וואטסאפ ואזורי משלוח.", "No settings yet. Tap \"Edit\" to add the WhatsApp number and delivery zones."],
  "الحساب": ["חשבון", "Account"],
  "تغيير كلمة السر": ["שינוי סיסמה", "Change password"],
  "رقم الواتساب (مع 972 وبدون 0 بالأول)": ["מספר וואטסאפ (עם 972 ובלי 0 בהתחלה)", "WhatsApp number (with 972, no leading 0)"],
  "منطقة جديدة": ["אזור חדש", "New zone"],
  "كلمة السر الحالية": ["סיסמה נוכחית", "Current password"],
  "كلمة السر الجديدة (6 حروف على الأقل)": ["סיסמה חדשה (6 תווים לפחות)", "New password (at least 6 characters)"],
  "كرّري كلمة السر الجديدة": ["חזרי על הסיסמה החדשה", "Repeat new password"],
  "عبّي كل الحقول.": ["מלאי את כל השדות.", "Fill in all fields."],
  "كلمة السر الجديدة لازم تكون 6 حروف على الأقل.": ["הסיסמה החדשה חייבת להיות לפחות 6 תווים.", "The new password must be at least 6 characters."],
  "كلمتين السر الجداد مش متطابقات.": ["הסיסמאות החדשות לא תואמות.", "The new passwords don't match."],
  "كلمة السر الجديدة نفس القديمة.": ["הסיסמה החדשה זהה לישנה.", "The new password is the same as the old one."],
  "تغيّرت كلمة السر ✓": ["הסיסמה שונתה ✓", "Password changed ✓"],
  "كلمة السر الحالية غلط.": ["הסיסמה הנוכחית שגויה.", "Current password is wrong."],
  "كلمة السر ضعيفة، جرّبي وحدة أطول.": ["הסיסמה חלשה, נסי סיסמה ארוכה יותר.", "Weak password, try a longer one."],
  "رئيسية": ["ראשית", "Main"],
  "+ صور": ["+ תמונות", "+ Photos"],
  "حذف الصورة": ["מחיקת תמונה", "Delete photo"],
  "جاري تجهيز الصورة": ["מכינה תמונה", "Preparing photo"],
  "صور ✓ لا تنسي تكبسي حفظ": ["תמונות ✓ לא לשכוח ללחוץ שמירה", "photos uploaded ✓ Don't forget to Save"],
  "انرفعوا": ["הועלו", ""],
  "الصورة كبيرة كتير": ["התמונה גדולה מדי", "Photo is too large"],
  "من": ["מתוך", "of"],
  "نفذت الكمية (Sold out)": ["אזל מהמלאי (Sold out)", "Sold out"],
  "نفذت الكمية": ["אזל מהמלאי", "Sold out"],
  "انحدّث المتجر ✓ (قطع وأوصاف جديدة)": ["החנות עודכנה ✓ (מוצרים ותיאורים חדשים)", "Store updated ✓ (new products & descriptions)"],
  "الإيميل أول": ["", ""],
};

const LANGS = ["ar", "he", "en"];
let lang = "ar";
try { lang = localStorage.getItem("adminLang") || "ar"; } catch (_) {}
if (!LANGS.includes(lang)) lang = "ar";
export const adminLang = () => lang;

const KEYS = Object.keys(D).filter(k => D[k][0] || D[k][1]).sort((a, b) => b.length - a.length);
const AR = /[؀-ۿ]/;

export function tr(v) {
  if (lang === "ar" || !v || !AR.test(v)) return v;
  const i = lang === "he" ? 0 : 1;
  let out = v;
  for (const k of KEYS) if (out.includes(k)) out = out.split(k).join(D[k][i]);
  // إذا ضل نص عربي (اسم قطعة أو ملاحظة زبونة)، منخلّي الأصل متل ما هو
  return AR.test(out) ? v : out.replace(/\s{2,}/g, " ").trim() === "" ? v : out;
}

function translateNode(root) {
  if (lang === "ar") return;
  if (root.nodeType === 3) { const n = tr(root.nodeValue); if (n !== root.nodeValue) root.nodeValue = n; return; }
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n = root;
  do {
    if (n.nodeType === 3) {
      const p = n.parentElement;
      if (p && !p.closest("textarea,script,style,[data-nt]")) { const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    } else {
      for (const a of ["placeholder", "title", "aria-label"]) {
        const v = n.getAttribute?.(a); if (v) { const t = tr(v); if (t !== v) n.setAttribute(a, t); }
      }
    }
  } while ((n = w.nextNode()));
}

export function setupI18n() {
  const de = document.documentElement;
  de.lang = lang; de.dir = lang === "en" ? "ltr" : "rtl";
  if (lang !== "ar") {
    document.title = tr(document.title);
    translateNode(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === "characterData") translateNode(m.target);
      else m.addedNodes.forEach(translateNode);
    })).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
}

export function langSwitcher() {
  return `<div class="alang" role="group" aria-label="Language">${[["ar", "عربي"], ["he", "עב"], ["en", "EN"]]
    .map(([k, l]) => `<button type="button" data-alang="${k}" aria-pressed="${lang === k}" data-nt>${l}</button>`).join("")}</div>`;
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-alang]"); if (!b) return;
  try { localStorage.setItem("adminLang", b.dataset.alang); } catch (_) {}
  location.reload();
});
