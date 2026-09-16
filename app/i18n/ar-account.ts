/**
 * The citizen side of the account: sign-in, the portal shell, and the seeded
 * requests, fines, documents and notices the demo opens with.
 */
export const arAccount: Record<string, string> = {
  // --- sign in -------------------------------------------------------------
  "Sign In": "تسجيل الدخول",
  "Sign in": "تسجيل الدخول",
  "Sign out": "تسجيل الخروج",
  "Signed in as": "تم تسجيل الدخول باسم",
  "Sign in with UAE PASS": "تسجيل الدخول بالهوية الرقمية UAE PASS",
  "Continue with UAE PASS": "المتابعة بالهوية الرقمية UAE PASS",
  "UAE PASS is the national digital identity, and the fastest way in — no separate Dubai Police account needed.":
    "الهوية الرقمية UAE PASS هي الهوية الوطنية الرقمية وأسرع طريقة للدخول — دون الحاجة إلى حساب منفصل لدى شرطة دبي.",
  "Or use your Dubai Police account": "أو استخدم حسابك لدى شرطة دبي",
  "Sign in as an officer": "تسجيل الدخول كضابط",
  "Officers reach the operations console with their force credentials.":
    "يدخل الضباط إلى منصة العمليات ببيانات اعتماد القيادة.",
  "Open the operations console": "فتح منصة العمليات",
  "Force credentials required": "مطلوب بيانات اعتماد القيادة",
  "UAE PASS sign-in required": "مطلوب تسجيل الدخول بالهوية الرقمية UAE PASS",
  "Checking credentials…": "جارٍ التحقق من بيانات الاعتماد…",
  "Loading your account": "جارٍ تحميل حسابك",
  "Email address": "البريد الإلكتروني",
  Password: "كلمة المرور",
  "Full name": "الاسم الكامل",
  "Mobile number": "رقم الهاتف المتحرك",
  "Phone number (optional)": "رقم الهاتف (اختياري)",
  "Your name": "اسمك",
  "I am": "أنا",
  "Sign in to track your requests, settle fines and reach personalised services.":
    "سجّل الدخول لمتابعة طلباتك وسداد مخالفاتك والوصول إلى خدمات مخصّصة لك.",
  "This is a rebuild of the Dubai Police website, not the real one. There is no account system behind it: signing in opens a sample account stored in this browser, and anything you submit stays on this device. Never enter a real Emirates ID or password here.":
    "هذه نسخة تجريبية من موقع شرطة دبي وليست الموقع الرسمي. لا يوجد نظام حسابات خلفها: تسجيل الدخول يفتح حسابًا تجريبيًا محفوظًا في هذا المتصفح، وكل ما ترسله يبقى على هذا الجهاز. لا تُدخل هنا رقم هوية إماراتية أو كلمة مرور حقيقية أبدًا.",
  "Name and Emirates ID come from UAE PASS and cannot be edited here.":
    "الاسم ورقم الهوية الإماراتية يأتيان من الهوية الرقمية UAE PASS ولا يمكن تعديلهما هنا.",
  "Reset the demo": "إعادة ضبط النسخة التجريبية",
  "Reset the demo data": "إعادة ضبط بيانات النسخة التجريبية",

  // --- portal shell --------------------------------------------------------
  "My Dubai Police": "شرطة دبي الخاصة بي",
  "My Requests": "طلباتي",
  Overview: "نظرة عامة",
  Profile: "الملف الشخصي",
  Documents: "المستندات",
  Fines: "المخالفات",
  Notices: "الإشعارات",
  "Public site": "الموقع العام",
  "Dubai Police personnel": "منتسبو شرطة دبي",
  "New request": "طلب جديد",
  "Start a service": "ابدأ خدمة",
  "Recent requests": "أحدث الطلبات",
  "Open requests": "الطلبات المفتوحة",
  "Unpaid fines": "المخالفات غير المسددة",
  "Unread notices": "إشعارات غير مقروءة",
  "Payable today": "المستحق اليوم",
  "Black points at risk": "النقاط السوداء المعرضة للتسجيل",
  "Nothing outstanding": "لا يوجد مستحق",
  "Nothing to read": "لا توجد إشعارات",
  "No requests yet": "لا توجد طلبات بعد",
  "No documents yet": "لا توجد مستندات بعد",
  "Mark all read": "تعليم الكل كمقروء",
  "Find a request": "ابحث عن طلب",
  "Service name or reference": "اسم الخدمة أو الرقم المرجعي",
  "Reference or service": "الرقم المرجعي أو الخدمة",
  "About this service": "عن هذه الخدمة",
  "Ask about it": "استفسر عنها",
  "Track it": "تتبّعها",
  "Need help": "تحتاج مساعدة",
  "Saved. Updates about your requests go to these details.":
    "تم الحفظ. سيتم إرسال مستجدات طلباتك إلى هذه البيانات.",
  "Open only": "المفتوحة فقط",
  "before the early-payment discount": "قبل خصم السداد المبكر",
  "25% off": "خصم 25%",
  "Free of Charge": "مجانًا",
  Payable: "المبلغ المستحق",
  Paid: "مسددة",
  Unpaid: "غير مسددة",
  Issued: "تاريخ الإصدار",
  Station: "المركز",
  Rank: "الرتبة",

  // --- the two demo accounts ----------------------------------------------
  // Earlier builds of the demo stored this station; a browser that still has
  // that session should not suddenly read half in English.

  // --- statuses ------------------------------------------------------------
  Submitted: "تم الإرسال",
  "In review": "قيد المراجعة",
  "Action needed": "مطلوب إجراء",
  Completed: "مكتملة",
  Rejected: "مرفوضة",
  Matched: "تم العثور على مطابقة",

  // --- seeded records ------------------------------------------------------
  "Police Clearance Certificate": "شهادة حسن السيرة والسلوك",
  "Traffic Status Certificate": "شهادة الحالة المرورية",
  "Report Lost Item": "الإبلاغ عن مفقودات",
  "HQ Entry Permit": "تصريح دخول القيادة العامة",
  "Lost Item Report — receipt": "بلاغ مفقودات — الإيصال",
  "Received by Dubai Police.": "تم الاستلام من قِبل شرطة دبي.",
  "Documents verified": "تم التحقق من المستندات",
  "Emirates ID and passport copy accepted.":
    "تم قبول الهوية الإماراتية ونسخة جواز السفر.",
  "With the Criminal Records department.": "لدى إدارة السجل الجنائي.",
  "Certificate available to download.": "الشهادة متاحة للتنزيل.",
  "Collected. Case closed.": "تم الاستلام. أُغلقت الحالة.",
  "A matching item was handed in at Bur Dubai station.":
    "تم تسليم غرض مطابق في مركز شرطة بر دبي.",
  "The visit date you chose is a public holiday. Pick another date.":
    "تاريخ الزيارة الذي اخترته يوافق عطلة رسمية. يُرجى اختيار تاريخ آخر.",
  "The date you chose falls on a public holiday. Open the request to pick another one.":
    "التاريخ الذي اخترته يوافق عطلة رسمية. افتح الطلب لاختيار تاريخ آخر.",
  "Upload a clearer copy of the passport photo page.":
    "يُرجى رفع نسخة أوضح من صفحة صورة جواز السفر.",
  "Your Police Clearance Certificate moved to review":
    "انتقلت شهادة حسن السيرة والسلوك إلى المراجعة",
  "Request DP-2026-4417 is with the Criminal Records department. No action is needed from you.":
    "الطلب DP-2026-4417 لدى إدارة السجل الجنائي. لا يلزم أي إجراء من جانبك.",
  "HQ Entry Permit needs a new date":
    "تصريح دخول القيادة العامة يحتاج تاريخًا جديدًا",
  "New fine recorded": "تم تسجيل مخالفة جديدة",
  "Fine TF-88214 was issued on Sheikh Zayed Road. Paying within 30 days gets a 25% discount.":
    "صدرت المخالفة TF-88214 على شارع الشيخ زايد. السداد خلال 30 يومًا يمنحك خصمًا بنسبة 25%.",
  "Exceeding the speed limit by 20 km/h": "تجاوز السرعة المقررة بمقدار 20 كم/س",
  "Using a mobile phone while driving": "استخدام الهاتف المتحرك أثناء القيادة",
  "Parking in a space reserved for people of determination":
    "الوقوف في موقف مخصص لأصحاب الهمم",
  "Sheikh Zayed Road, before Interchange 3":
    "شارع الشيخ زايد، قبل التقاطع الثالث",
  "Al Khail Road": "شارع الخيل",
  "Al Barsha 1": "البرشاء 1",
  "Smart Police Station": "مركز الشرطة الذكي",
  "Dubai Police App": "تطبيق شرطة دبي",
  "Dubai Police Website": "موقع شرطة دبي",
  "Received via": "تم الاستلام عبر",
  "Your reply": "ردّك",
  "Tell us what you have done, or what you are sending.":
    "أخبرنا بما قمت به، أو بما سترسله.",
  "Send reply": "إرسال الرد",
  "AED 120": "120 درهمًا",
  "AED 220": "220 درهمًا",
};
