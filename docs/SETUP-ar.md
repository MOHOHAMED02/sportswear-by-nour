# Sportswear By NOUR

متجر NOUR مع لوحة تحكم لصاحبة المشروع، مربوط على Firebase.

- **الموقع:** `index.html`
- **لوحة التحكم:** `admin.html`، وبعد الرفع بتنفتح على `your-site.web.app/admin`

## الملفات

```
SPORTSWEARBYNOUR/
├── index.html            ← المتجر
├── admin.html            ← لوحة التحكم
├── css/
│   ├── style.css         ← تصميم المتجر
│   └── admin.css         ← تصميم لوحة التحكم
├── js/
│   ├── firebase-config.js  ← إعدادات مشروعك (لازم تعبّيها)
│   ├── data.js             ← القطع الأساسية (بتنضاف لـ Firebase بكبسة)
│   ├── store.js            ← منطق المتجر والسلة والطلب
│   └── admin.js            ← منطق لوحة التحكم
├── assets/logo.jpeg
├── firestore.rules       ← حماية قاعدة البيانات
├── storage.rules         ← حماية الصور
└── firebase.json         ← إعدادات الرفع
```

---

## خطوات التشغيل (مرة وحدة بس)

### 1. افتح مشروع Firebase
1. روح على https://console.firebase.google.com
2. اكبس **Create a project**، وسمّيه مثلاً `sportswear-by-nour`. Google Analytics مش ضروري.

### 2. فعّل قاعدة البيانات (Firestore)
1. من القائمة: **Build ← Firestore Database ← Create database**
2. اختار منطقة قريبة، متل `europe-west`، واختار **Production mode**

### 3. فعّل تسجيل الدخول
1. **Build ← Authentication ← Get started**
2. بـ **Sign-in method** فعّل **Email/Password**
3. بـ **Users** اكبس **Add user**، وحط إيميل صاحبة المشروع وكلمة سر قوية
4. بعد ما ينعمل الحساب، انسخ الـ **User UID** تبعه. رح نحتاجه بالخطوة 6.

### 4. الصور
ما في داعي لـ Storage ولا لبطاقة. الصور اللي بترفعها نور من لوحة التحكم بتتصغّر وبتنحفظ جوّا Firestore (مجاني).

### 5. اربط الموقع بالمشروع
1. ⚙️ **Project settings ← General ← Your apps**، واكبس على أيقونة الويب `</>`
2. سجّل التطبيق. Firebase Hosting مش ضروري تفعّله من هون.
3. رح يطلعلك كود فيه `firebaseConfig`. انسخ القيم وحطهن بملف `js/firebase-config.js`:

```js
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "sportswear-by-nour.firebaseapp.com",
  projectId: "sportswear-by-nour",
  storageBucket: "sportswear-by-nour.firebasestorage.app",
  messagingSenderId: "...",
  appId: "...",
};
```
> هاي القيم مش سرية وعادي تكون بالموقع. الحماية الحقيقية موجودة بملفات الـ rules.

وبنفس الملف عبّي إيميل صاحبة المشروع، عشان شاشة الدخول تطلب **كلمة السر بس**:
```js
export const ADMIN_EMAIL = "nour@gmail.com";
```

### 6. سجّل صاحبة المشروع كمديرة
1. **Firestore Database ← Data ← Start collection**
2. Collection ID: `admin`
3. Document ID: الصق الـ **UID** من الخطوة 3
4. ضيف حقل: `role` = `owner`، واكبس **Save**

### 7. ارفع الموقع والحماية
بالـ Terminal بـ VS Code، جوّا مجلد المشروع:

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # اختار المشروع
firebase deploy
```

بعد الرفع رح يطلعلك رابط متل: `https://sportswear-by-nour.web.app`

### 8. أول دخول للوحة التحكم
1. افتح `https://sportswear-by-nour.web.app/admin`
2. ادخل بالإيميل وكلمة السر من الخطوة 3
3. روح على **القطع** واكبس **إضافة القطع الأساسية**. هيك بينضافوا الـ 8 قطع والأقسام وأسعار التوصيل.
4. ادخل على كل قطعة، ضيف صورة لكل لون والسعر، واكبس **حفظ**

---

## شو بتقدر تعمل صاحبة المشروع من لوحة التحكم
- **الطلبيات:** بتظهر فوراً لما زبونة تطلب، مع كل التفاصيل. بتقدر تغيّر الحالة (جديدة ← قيد التحضير ← انبعتت ← وصلت، أو ملغية)، وتبحث، وتفتح واتساب الزبونة بكبسة.
- **الإحصائيات:** الطلبيات الجديدة، طلبيات اليوم، ومبيعات الشهر
- **القطع:** إضافة، تعديل، حذف، إخفاء. اسم ووصف بالثلاث لغات، سعر، مقاسات، ألوان، وصورة لكل لون. الصور بتتصغّر تلقائياً قبل الرفع.
- **الأقسام:** إضافة، تعديل، ترتيب، حذف
- **التوصيل:** تغيير المناطق والأسعار، ورقم الواتساب

## كيف بتشتغل الطلبية
1. الزبونة بتعبّي السلة والتفاصيل، وبتكبس إرسال
2. الطلبية **بتنحفظ بـ Firebase** مع رقم طلب، متل `#A1B2C3`، وبتظهر بلوحة التحكم
3. بنفس الوقت بتنفتح رسالة واتساب جاهزة فيها نفس رقم الطلب، عشان التأكيد

---

## تجربة على الكمبيوتر قبل الرفع
- افتح المجلد بـ VS Code، ونزّل إضافة **Live Server**
- كبسة يمين على `index.html` ← **Open with Live Server**
- **مهم:** افتح الرابط على `http://localhost:5500` مش `127.0.0.1`، لإن Firebase بيسمح بتسجيل الدخول من `localhost` بس. أو ضيف `127.0.0.1` بـ **Authentication ← Settings ← Authorized domains**.
- لازم تفتحه من سيرفر، متل Live Server. فتح الملف مباشرة بالمتصفح (`file://`) ما بيشتغل.

## دومين خاص
**Hosting ← Add custom domain**، واتبع الخطوات. مثلاً `nourbrand.com`. بعدها ضيف الدومين بـ **Authentication ← Settings ← Authorized domains**.

## بعد كل تعديل بالكود
```bash
firebase deploy --only hosting
```
