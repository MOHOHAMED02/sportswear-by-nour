// صور القطع اللي بتنرفع مع الموقع (مجلد assets/products).
// المفتاح: رقم القطعة ← اسم اللون بالعربي ← قائمة الصور (أول وحدة هي الرئيسية).
// إذا انرفعت صورة من لوحة التحكم، هي بتنعرض أول.
const P = "assets/products/";
export const IMAGES = {
  "classic-set": {
    "بني": [P + "classic-set/brown-1.jpg", P + "classic-set/brown-2b.jpg", P + "classic-set/brown-3b.jpg"],
    "أسود": [P + "classic-set/black-1.jpg", P + "classic-set/black-2b.jpg", P + "classic-set/black-3.jpg"],
    "زهري فاتح": [P + "classic-set/lpink-1b.jpg", P + "classic-set/lpink-2.jpg", P + "classic-set/lpink-3.jpg"],
    "زهري غامق": [P + "classic-set/dpink-1b.jpg", P + "classic-set/dpink-2b.jpg", P + "classic-set/dpink-3b.jpg"],
  },
  "open-back-set": {
    "أسود": [P + "open-back-set/black-1b.jpg", P + "open-back-set/black-2b.jpg", P + "open-back-set/black-3b.jpg"],
    "زهري فاتح": [P + "open-back-set/lpink-1.jpg", P + "open-back-set/lpink-2.jpg", P + "open-back-set/lpink-3.jpg"],
    "زهري غامق": [P + "open-back-set/dpink-1.jpg", P + "open-back-set/dpink-2.jpg", P + "open-back-set/dpink-3.jpg"],
    "بني": [P + "open-back-set/brown-1.jpg", P + "open-back-set/brown-2.jpg", P + "open-back-set/brown-3b.jpg"],
  },
  "bra-shorts-set": {
    "أسود": [P + "bra-shorts-set/black-1b.jpg", P + "bra-shorts-set/black-2b.jpg", P + "bra-shorts-set/black-3.jpg"],
    "زهري فاتح": [P + "bra-shorts-set/lpink-1.jpg", P + "bra-shorts-set/lpink-2b.jpg", P + "bra-shorts-set/lpink-3b.jpg"],
    "زهري غامق": [P + "bra-shorts-set/dpink-1b.jpg", P + "bra-shorts-set/dpink-2b.jpg", P + "bra-shorts-set/dpink-3b.jpg"],
  },
  "flare-set": {
    "أخضر": [P + "flare-set/green-1b.jpg", P + "flare-set/green-2b.jpg", P + "flare-set/green-3b.jpg", P + "flare-set/green-4b.jpg"],
  },
  "sport-jacket": {
    "أسود": [P + "sport-jacket/black-1.jpg", P + "sport-jacket/black-2.jpg", P + "sport-jacket/black-3.jpg"],
    "زهري فاتح": [P + "sport-jacket/lpink-1.jpg", P + "sport-jacket/lpink-2.jpg", P + "sport-jacket/lpink-3.jpg"],
  },
  "pilates-jacket": {
    "زهري فاتح": [P + "pilates-jacket/lpink-2.jpg", P + "pilates-jacket/lpink-1.jpg", P + "pilates-jacket/lpink-3.jpg"],
  },
  "golf-dress": {
    "أبيض": [P + "golf-dress/white-1b.jpg", P + "golf-dress/white-2b.jpg", P + "golf-dress/white-3b.jpg"],
  },
  "tennis-dress": {
    "زهري فاتح": [P + "tennis-dress/lpink-1.jpg", P + "tennis-dress/lpink-2.jpg", P + "tennis-dress/lpink-3.jpg"],
  },
};
