/**
 * The operations console: dispatch board, calls, units and the officer view of
 * service requests. Control-room Arabic — short, literal labels, no marketing
 * register. Callsigns keep their Latin form because that is what goes out over
 * a radio in either language.
 */
export const arOps: Record<string, string> = {
  // --- frame ---------------------------------------------------------------
  Console: "منصة العمليات",
  Command: "القيادة",
  "& Control": "والسيطرة",
  "Command board": "لوحة القيادة",
  "Status board": "لوحة الحالة",
  "GST · Shift {shift}": "بتوقيت الإمارات · الوردية {shift}",
  "End shift": "إنهاء الوردية",
  Calls: "البلاغات",
  Units: "الوحدات",
  "Service requests": "طلبات الخدمة",
  "Illustrative data — a rebuild of the Dubai Police website, connected to no operational system.":
    "بيانات توضيحية — نسخة تجريبية من موقع شرطة دبي، غير متصلة بأي نظام تشغيلي.",
  "You are signed in as {name}, a public account. The operations console is for Dubai Police personnel.":
    "أنت مسجّل الدخول باسم {name}، وهو حساب عام. منصة العمليات مخصصة لمنتسبي شرطة دبي.",
  "Live picture for Bur Dubai control. Grades run P1 immediate to P4 scheduled.":
    "الصورة اللحظية لغرفة عمليات بر دبي. تتدرج الأولويات من P1 فوري إلى P4 مجدول.",

  // --- readouts ------------------------------------------------------------
  Waiting: "في الانتظار",
  "Past target": "تجاوز المستهدف",
  Running: "قيد التنفيذ",
  Available: "متاحة",
  Committed: "مرتبطة ببلاغ",
  "Median dispatch": "وسيط زمن الإرسال",
  "Response time": "زمن الاستجابة",
  "On duty": "في الخدمة",
  "Off the air": "خارج الخدمة",
  "On the air": "على الهواء",
  "Back on the air": "العودة للخدمة",
  "In the queue": "في قائمة الانتظار",
  "With the applicant": "لدى مقدّم الطلب",
  Pending: "قيد الانتظار",
  "unassigned calls": "بلاغات دون وحدة",
  "queue clear": "لا يوجد انتظار",
  "dispatch now": "أرسل الآن",
  "all within target": "الكل ضمن المستهدف",
  "units committed": "وحدات مرتبطة ببلاغ",
  "units on the air": "وحدات على الهواء",
  "on the air": "على الهواء",
  "on a call": "على بلاغ",
  "refuelling, training": "تزوّد بالوقود، تدريب",
  "awaiting a decision": "بانتظار قرار",
  "we asked for more": "طلبنا مستندات إضافية",
  "conditions not met": "لم تُستوفَ الشروط",
  "{n} calls closed": "{n} بلاغًا مغلقًا",
  "{n} divisions": "{n} أقسام",
  "{n} waiting": "{n} في الانتظار",
  "{n} committed": "{n} مرتبطة ببلاغ",
  "{n} free": "{n} متاحة",
  "{shown} of {total} calls": "{shown} من {total} بلاغًا",
  "{shown} of {total} units": "{shown} من {total} وحدة",
  "{shown} of {total} requests": "{shown} من {total} طلبًا",

  // --- calls board ---------------------------------------------------------
  "Every call of the shift, newest first. Pick a row to dispatch it, move it on, or write the log.":
    "جميع بلاغات الوردية، الأحدث أولًا. اختر صفًا لإرسال وحدة، أو نقل البلاغ، أو تدوين السجل.",
  "Calls, with grade, type, area, status, assigned unit and elapsed time":
    "البلاغات، مع الأولوية والنوع والمنطقة والحالة والوحدة المكلّفة والزمن المنقضي",
  "Take a call": "استقبال بلاغ",
  "Call detail": "تفاصيل البلاغ",
  "Close call detail": "إغلاق تفاصيل البلاغ",
  "Pick a row to dispatch it, move it on, or read the log.":
    "اختر صفًا لإرسال وحدة، أو نقل البلاغ، أو قراءة السجل.",
  "No call matches those filters.": "لا يوجد بلاغ يطابق عوامل التصفية.",
  "Queue clear. Every call has a unit on it.":
    "قائمة الانتظار خالية. كل بلاغ لديه وحدة.",
  "Queue clear. Nothing is waiting on a decision.":
    "قائمة الانتظار خالية. لا يوجد ما ينتظر قرارًا.",
  "No request matches that search.": "لا يوجد طلب يطابق هذا البحث.",
  "No unit is currently committed to a call.":
    "لا توجد وحدة مرتبطة ببلاغ حاليًا.",
  "Every unit is committed. New calls will hold in the queue.":
    "جميع الوحدات مرتبطة ببلاغات. ستبقى البلاغات الجديدة في قائمة الانتظار.",
  "No unit matches that filter.": "لا توجد وحدة تطابق عامل التصفية.",
  "All calls": "جميع البلاغات",
  "Filter calls": "تصفية البلاغات",
  "Filter units": "تصفية الوحدات",
  "Filter requests": "تصفية الطلبات",
  "Reference, type, area, officer or callsign":
    "الرقم المرجعي أو النوع أو المنطقة أو الضابط أو رمز النداء",
  "Callsign, officer or area": "رمز النداء أو الضابط أو المنطقة",
  "Any status": "كل الحالات",
  "Any grade": "كل الأولويات",
  "Every division": "كل الأقسام",
  "No unit": "بدون وحدة",
  "No unit free": "لا توجد وحدة متاحة",
  "Not dispatched": "لم تُرسَل",
  "Dispatch — {n} free": "إرسال — {n} متاحة",
  "Dispatch {ref} to a unit": "إرسال البلاغ {ref} إلى وحدة",
  Grade: "الأولوية",
  Ref: "المرجع",
  "Type / area": "النوع / المنطقة",
  Elapsed: "الزمن المنقضي",
  Unit: "الوحدة",
  Callsign: "رمز النداء",
  Officer: "الضابط",
  Division: "القسم",
  "On call": "على بلاغ",
  Location: "الموقع",
  "Move to": "نقل إلى",
  Area: "المنطقة",
  "Call type": "نوع البلاغ",
  Status: "الحالة",
  "since call": "منذ البلاغ",
  "of {n}m": "من أصل {n} د",
  "over {span}": "تجاوز {span}",
  "dispatch within {n}m": "الإرسال خلال {n} د",
  Log: "السجل",
  "Add to the log": "أضف إلى السجل",
  "Add a line to the log for {ref}": "أضف سطرًا إلى سجل البلاغ {ref}",
  "Reopen call": "إعادة فتح البلاغ",
  "Clear call": "إنهاء البلاغ",
  Arrived: "وصلت",
  "Put it in the queue": "أدرجه في قائمة الانتظار",
  "What was reported": "ما تم الإبلاغ عنه",
  "What the caller described, in their words where you can.":
    "ما وصفه المتصل، بكلماته قدر الإمكان.",
  "— held over 45 minutes": "— مستمرة منذ أكثر من 45 دقيقة",
  "Everyone on this shift and what they are on. The clock counts from the last status change.":
    "جميع أفراد هذه الوردية وما يقومون به. تُحتسب الساعة منذ آخر تغيير للحالة.",
  "Units on duty by division, with how many are available":
    "الوحدات في الخدمة حسب القسم، مع عدد المتاح منها",
  "Units on duty, with status, elapsed time in that status, and the call they are assigned to":
    "الوحدات في الخدمة، مع الحالة والزمن المنقضي فيها والبلاغ المكلّفة به",

  // --- call grades and types ----------------------------------------------
  "Road traffic collision": "حادث مروري",
  Assault: "اعتداء",
  Theft: "سرقة",
  "Suspicious vehicle": "مركبة مشبوهة",
  "Missing person": "شخص مفقود",
  "Noise disturbance": "إزعاج بالضوضاء",
  "Fraud report": "بلاغ احتيال",
  "Cybercrime report": "بلاغ جريمة إلكترونية",
  "Marine assistance": "مساندة بحرية",
  "Lost child": "طفل تائه",
  Shoplifting: "سرقة من متجر",
  "999 call": "اتصال 999",
  "Police Eye": "عين الشرطة",
  "Walk-in": "حضور شخصي",
  "Website report": "بلاغ عبر الموقع",
  eCrime: "الجرائم الإلكترونية",

  // --- divisions and officers ---------------------------------------------
  Traffic: "المرور",
  "e-Crime": "الجرائم الإلكترونية",
  "Cpl. H. Suleiman": "عريف ح. سليمان",
  "Cpl. F. Darwish": "عريف ف. درويش",
  "Cpl. K. Al Blooshi": "عريف خ. البلوشي",
  "Cpl. M. Al Ali": "عريف م. العلي",
  "Cpl. T. Rashed": "عريف ت. راشد",
  "Sgt. A. Khalifa": "رقيب أ. خليفة",
  "Sgt. M. Al Zaabi": "رقيب م. الزعابي",
  "Sgt. R. Al Marri": "رقيب ر. المري",
  "Sgt. Y. Al Hammadi": "رقيب ي. الحمادي",
  "Lt. N. Bin Haider": "ملازم ن. بن حيدر",
  "Lt. S. Al Suwaidi": "ملازم س. السويدي",
  "Capt. O. Al Falasi": "نقيب ع. الفلاسي",

  // --- officer view of requests -------------------------------------------
  "Applications waiting on a decision. Anything you do here appears on the applicant’s own screen within the second.":
    "الطلبات التي تنتظر قرارًا. كل إجراء تتخذه هنا يظهر على شاشة مقدّم الطلب خلال ثانية.",
  "{ref} · submitted {date} · {fee} · via {channel}":
    "{ref} · قُدّم في {date} · {fee} · عبر {channel}",
  "Start review": "بدء المراجعة",
  Approve: "اعتماد",
  Reject: "رفض",
  "Ask for more": "طلب مستندات إضافية",
  "Send to applicant": "إرسال إلى مقدّم الطلب",
  "What does the applicant need to do?": "ما المطلوب من مقدّم الطلب؟",

  // --- response chart ------------------------------------------------------
  "Median response time over the last 12 hours, in minutes":
    "وسيط زمن الاستجابة خلال آخر 12 ساعة، بالدقائق",
  "Median response time in minutes, by hour, over the last 12 hours":
    "وسيط زمن الاستجابة بالدقائق، حسب الساعة، خلال آخر 12 ساعة",
  "Call to arrival, last 12 hours. Target {n} minutes.":
    "من البلاغ إلى الوصول، آخر 12 ساعة. المستهدف {n} دقائق.",
  "{hour}:00 — {minutes} minutes": "{hour}:00 — {minutes} دقيقة",
  Hour: "الساعة",
  Minutes: "الدقائق",
  // --- unit callsigns (kept when the media dictionaries went) -------------
  "Patrol 04": "دورية 04",
  "Patrol 09": "دورية 09",
  "Patrol 12": "دورية 12",
  "Patrol 17": "دورية 17",
  "Patrol 21": "دورية 21",
  "Patrol 26": "دورية 26",
  "Traffic 07": "مرور 07",
  "Traffic 11": "مرور 11",
  "Marine 02": "بحري 02",
  "Air Wing 01": "جوي 01",
  "K9 03": "كلاب بوليسية 03",
  "e-Crime 01": "جرائم إلكترونية 01",

  // --- incident priority -----------------------------------------------
  "Immediate": "فوري",
  "Urgent": "عاجل",
  "Routine": "اعتيادي",
  "Scheduled": "مجدول",
};
