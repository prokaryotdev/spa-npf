/**
 * The information pages: traffic violations and black points, street speed
 * limits, laws and legislation, the organisational chart, customer centres,
 * and the three legal documents in the footer.
 *
 * Violation wording follows the UAE Federal Traffic Law's own Arabic, which
 * is the text a reader will have seen on an actual fine.
 */
export const arPages: Record<string, string> = {
  // --- black points: penalties ---------------------------------------------
  "7 days": "7 أيام",
  "15 days": "15 يومًا",
  "30 days": "30 يومًا",
  "60 days": "60 يومًا",
  "60 Days": "60 يومًا",
  "90 days": "90 يومًا",
  "90 Days": "90 يومًا",
  "by court": "بحكم المحكمة",
  "Decided by court": "تُحدَّد بحكم المحكمة",
  "100 AED/Day. Max 3000 AED": "100 درهم/يوم، بحد أقصى 3000 درهم",
  "50 AED/Day. Max 3000 AED": "50 درهمًا/يوم، بحد أقصى 3000 درهم",
  "3000 / Freezing the license for one year": "3000 / تجميد الرخصة لمدة سنة",
  "Learn how black points and fines impact your traffic record":
    "تعرّف على أثر النقاط السوداء والغرامات على سجلك المروري",

  // --- table captions and column headings ----------------------------------
  Information: "معلومات",

  // --- black points: violations --------------------------------------------
  "Causing death of others": "التسبب في وفاة شخص آخر",
  "Causing a serious accident or injuries.":
    "التسبب في حادث جسيم أو في إصابات.",
  "Driving under the influence of alcohol": "القيادة تحت تأثير الكحول",
  "Driving under the influence of narcotic, psychotropic or similar substances.":
    "القيادة تحت تأثير المخدرات أو المؤثرات العقلية أو ما شابهها.",
  "Driving in a way that poses danger to drivers life or lives, and safety of others":
    "القيادة بطريقة تعرّض حياة السائق أو حياة الآخرين وسلامتهم للخطر",
  "Driving in a way that harms public or private properties.":
    "القيادة بطريقة تُلحق الضرر بالممتلكات العامة أو الخاصة.",
  "Driving a heavy vehicle in a way that poses danger to drivers life or lives and safety of others.":
    "قيادة مركبة ثقيلة بطريقة تعرّض حياة السائق أو حياة الآخرين وسلامتهم للخطر.",
  "Driving a heavy vehicle in a way that causes harm to public or private properties":
    "قيادة مركبة ثقيلة بطريقة تُلحق الضرر بالممتلكات العامة أو الخاصة",
  "Driving a heavy vehicle that does not comply with security and safety standards.":
    "قيادة مركبة ثقيلة لا تستوفي اشتراطات الأمن والسلامة.",
  "Driving a vehicle that does not comply with safety and security standards.":
    "قيادة مركبة لا تستوفي اشتراطات الأمن والسلامة.",
  "Driving a vehicle that is unfit for driving.":
    "قيادة مركبة غير صالحة للسير.",
  "Driving a vehicle that causes pollution": "قيادة مركبة مسببة للتلوث",
  "Driving a noisy vehicle": "قيادة مركبة مصدرة للضجيج",
  "Driving a vehicle on a different license":
    "قيادة مركبة برخصة قيادة من فئة أخرى",
  "Driving a vehicle with an expired driving license.":
    "قيادة مركبة برخصة قيادة منتهية الصلاحية.",
  "Driving a vehicle with an expired registration.":
    "قيادة مركبة بترخيص سير منتهي الصلاحية.",
  "Driving an unlicensed vehicle.": "قيادة مركبة غير مرخصة.",
  "Driving a vehicle without insurance.": "قيادة مركبة بدون تأمين.",
  "Driving a vehicle with one number plate.": "قيادة مركبة بلوحة أرقام واحدة.",
  "Driving a vehicle without number plates": "قيادة مركبة بدون لوحات أرقام",
  "Driving against traffic.": "السير عكس اتجاه السير.",
  "Driving at night without lights.": "القيادة ليلًا بدون إنارة.",
  "Driving at residential areas, educational zones, hospitals in a way that endangers others lives.":
    "القيادة في المناطق السكنية والتعليمية والمستشفيات بطريقة تعرّض حياة الآخرين للخطر.",
  "Driving below the minimum speed set for the road (if any).":
    "القيادة بأقل من الحد الأدنى للسرعة المقررة للطريق (إن وُجد).",
  "Driving in a foggy weather in violation of concerned authorities instructions.":
    "القيادة في حالة الضباب بالمخالفة لتعليمات الجهات المختصة.",
  "Driving in a foggy weather without lights.":
    "القيادة في حالة الضباب بدون إنارة.",
  "Driving on lanes designated for taxis and buses except in permitted cases.":
    "السير في المسارات المخصصة لسيارات الأجرة والحافلات في غير الحالات المسموح بها.",
  "Driving with a driving license issued by a foreign country except in permitted cases.":
    "القيادة برخصة صادرة من دولة أجنبية في غير الحالات المسموح بها.",
  "Exceeding maximum speed limit by more than 60km/h":
    "تجاوز الحد الأقصى للسرعة بأكثر من 60 كم/س",
  "Exceeding maximum speed limit by more than 80km/h":
    "تجاوز الحد الأقصى للسرعة بأكثر من 80 كم/س",
  "Exceeding maximum speed limit by not more than 20km/h":
    "تجاوز الحد الأقصى للسرعة بما لا يزيد على 20 كم/س",
  "Exceeding maximum speed limit by not more than 30km/h":
    "تجاوز الحد الأقصى للسرعة بما لا يزيد على 30 كم/س",
  "Exceeding maximum speed limit by not more than 40km/h":
    "تجاوز الحد الأقصى للسرعة بما لا يزيد على 40 كم/س",
  "Exceeding maximum speed limit by not more than 50km/h":
    "تجاوز الحد الأقصى للسرعة بما لا يزيد على 50 كم/س",
  "Exceeding maximum speed limit by not more than 60km/h":
    "تجاوز الحد الأقصى للسرعة بما لا يزيد على 60 كم/س",
  "Exceeding passenger limit by a passenger transport vehicle.":
    "تجاوز عدد الركاب المسموح به في مركبة نقل الركاب.",
  "Exceeding permitted level of tinting.":
    "تجاوز النسبة المسموح بها لتظليل المركبة.",
  "Expired tires": "إطارات منتهية الصلاحية",
  "Allowing children under 10 years old or under 145 CM to sit in front seats":
    "السماح للأطفال دون سن 10 سنوات أو أقل من 145 سم بالجلوس في المقاعد الأمامية",
  "Any other distractions.": "أي مصادر إلهاء أخرى.",
  "Absence of trailers rear or side lights.":
    "عدم وجود الأنوار الخلفية أو الجانبية للمقطورة.",
  "Changing vehicle color without permission.": "تغيير لون المركبة دون إذن.",
  "Drivers failure to stop when school buss STOP SIGN is activated.":
    "عدم توقف السائق عند تشغيل علامة قف في حافلة المدرسة.",
  "Dropping or spilling load from light vehicles":
    "سقوط أو تسرب الحمولة من المركبات الخفيفة",
  "Entering road dangerously": "الدخول إلى الطريق بصورة خطرة",
  "Entering road without making sure it is clear.":
    "الدخول إلى الطريق دون التأكد من خلوه.",
  "Entry from a prohibited place.": "الدخول من مكان ممنوع.",
  "Failure of a heavy vehicle driver to stop after causing a minor accident":
    "عدم توقف قائد مركبة ثقيلة بعد التسبب في حادث بسيط",
  "Failure of a light vehicle driver to stop after causing a minor accident.":
    "عدم توقف قائد مركبة خفيفة بعد التسبب في حادث بسيط.",
  "Failure of a light vehicle to abide by lane discipline.":
    "عدم التزام المركبة الخفيفة بالمسار.",
  "Failure of a school bus driver to activate STOP SIGN or abide by traffic rules.":
    "عدم قيام سائق حافلة المدرسة بتشغيل علامة قف أو الالتزام بقواعد المرور.",
  "Failure of driver to fasten seatbelt.": "عدم ربط السائق حزام الأمان.",
  "Failure of motorcyclist to wear helmet.":
    "عدم ارتداء قائد الدراجة النارية الخوذة.",
  "Failure of passenger to fasten seatbelt": "عدم ربط الراكب حزام الأمان",
  "Failure of passenger to wear helmet.": "عدم ارتداء الراكب الخوذة.",
  "Failure of pedestrians to abide by traffic signals.":
    "عدم التزام المشاة بالإشارات الضوئية.",
  "Failure to abide by loading or unloading regulations in designated areas":
    "عدم الالتزام بأنظمة التحميل والتنزيل في الأماكن المخصصة",
  "Failure to abide by safety and security standards in towing a car or a boat.":
    "عدم الالتزام باشتراطات الأمن والسلامة عند قطر مركبة أو قارب.",
  "Failure to abide by traffic signs and instructions.":
    "عدم الالتزام بالعلامات والتعليمات المرورية.",
  "Failure to follow traffic policeman instructions.":
    "عدم الامتثال لتعليمات رجل المرور.",
  "Failure to get the car tested after carrying out major modification to chassis.":
    "عدم فحص المركبة بعد إجراء تعديل جوهري على الهيكل.",
  "Failure to get the car tested after carrying out major modification to engine.":
    "عدم فحص المركبة بعد إجراء تعديل جوهري على المحرك.",
  "Failure to give priority to vehicles coming from behind or the left side.":
    "عدم إعطاء الأولوية للمركبات القادمة من الخلف أو من الجهة اليسرى.",
  "Failure to hand over driving license when the maximum black points are accrued in the first traffic violation.":
    "عدم تسليم رخصة القيادة عند بلوغ الحد الأقصى للنقاط السوداء في المخالفة المرورية الأولى.",
  "Failure to hand over driving license when the maximum black points are accrued in the second traffic":
    "عدم تسليم رخصة القيادة عند بلوغ الحد الأقصى للنقاط السوداء في المخالفة المرورية الثانية",
  "Failure to hand over driving license when the maximum black points are accrued in the third traffic violation.":
    "عدم تسليم رخصة القيادة عند بلوغ الحد الأقصى للنقاط السوداء في المخالفة المرورية الثالثة.",
  "Failure to leave safety distance": "عدم ترك مسافة أمان كافية",
  "Failure to provide a child car seat for children under 4 years old.":
    "عدم توفير مقعد أطفال للأطفال دون سن 4 سنوات.",
  "Failure to raise exhaust pipe in trucks": "عدم رفع أنبوب العادم في الشاحنات",
  "Failure to receive the heavy vehicle after the expiry of the legal period for the vehicle reservation":
    "عدم استلام المركبة الثقيلة بعد انتهاء المدة القانونية لحجز المركبة",
  "Failure to receive the light vehicle after the expiry of the legal period for the vehicle reservation":
    "عدم استلام المركبة الخفيفة بعد انتهاء المدة القانونية لحجز المركبة",
  "Failure to take road safety measures during vehicle breakdown.":
    "عدم اتخاذ إجراءات السلامة على الطريق عند تعطل المركبة.",
  "Failure to use indicators when changing direction or turning.":
    "عدم استخدام إشارات الانعطاف عند تغيير الاتجاه أو الانعطاف.",
  "Falling or leaking of a heavy vehicles load.":
    "سقوط أو تسرب حمولة المركبة الثقيلة.",
  "Heavy vehicle driver causing his or another vehicle to overturn.":
    "تسبب قائد المركبة الثقيلة في انقلاب مركبته أو مركبة أخرى.",
  "Heavy vehicle not abiding by lane discipline.":
    "عدم التزام المركبة الثقيلة بالمسار.",
  "Heavy vehicle prohibited entry": "دخول المركبة الثقيلة إلى مكان محظور",
  "Illegal use of commercial number plates":
    "الاستخدام غير المشروع للوحات الأرقام التجارية",
  "Interrupting traffic in any other way not specified in this table.":
    "إعاقة الحركة المرورية بأي صورة أخرى غير واردة في هذا الجدول.",
  "Jumping a red signal by heavy vehicles":
    "تجاوز الإشارة الضوئية الحمراء بمركبة ثقيلة",
  "Jumping a red signal by light vehicles.":
    "تجاوز الإشارة الضوئية الحمراء بمركبة خفيفة.",
  "Jumping a red signal by motorbikes.":
    "تجاوز الإشارة الضوئية الحمراء بدراجة نارية.",
  "Littering from vehicle window while driving.":
    "إلقاء المخلفات من نافذة المركبة أثناء القيادة.",
  "load or protruding load from a light vehicle without permission.":
    "حمولة أو حمولة بارزة من مركبة خفيفة دون إذن.",
  "Loading a heavy vehicle in a way that causes harm to the road":
    "تحميل مركبة ثقيلة بطريقة تُلحق الضرر بالطريق",
  "Loading a heavy vehicle in a way that poses danger to others":
    "تحميل مركبة ثقيلة بطريقة تعرّض الآخرين للخطر",
  "Loading a light vehicle in a way that poses danger to others.":
    "تحميل مركبة خفيفة بطريقة تعرّض الآخرين للخطر.",
  "Loading a light vehicle in a way that poses danger to the road.":
    "تحميل مركبة خفيفة بطريقة تعرّض الطريق للضرر.",
  "Modifying engine or chassis without permission.":
    "تعديل المحرك أو الهيكل دون إذن.",
  "Not carrying Driving Learning permit while training.":
    "عدم حمل تصريح تعلّم القيادة أثناء التدريب.",
  "Not carrying vehicle registration card.": "عدم حمل بطاقة ترخيص المركبة.",
  "Not covering trucks loads": "عدم تغطية حمولة الشاحنات",
  "Not fixing reflective stickers at the back of trucks and transport vehicles":
    "عدم تثبيت الملصقات العاكسة في مؤخرة الشاحنات ومركبات النقل",
  "Not giving way to emergency, police and public service vehicles or official convoys.":
    "عدم إفساح الطريق لمركبات الطوارئ والشرطة والخدمة العامة أو المواكب الرسمية.",
  "Not giving way to pedestrians on pedestrian crossings.":
    "عدم إفساح الطريق للمشاة عند ممرات المشاة.",
  "Not securing vehicle while parked.": "عدم تأمين المركبة أثناء وقوفها.",
  "Number plates with unclear numbers.": "لوحات أرقام غير واضحة الأرقام.",
  "Operating industrial, construction and mechanical vehicles and tractors without permission from licensing authority":
    "تشغيل المركبات الصناعية والإنشائية والميكانيكية والجرارات دون إذن من جهة الترخيص",
  "Overtaking from a prohibited place by trucks.":
    "التجاوز من مكان ممنوع بواسطة الشاحنات.",
  "Overtaking from hard shoulder.": "التجاوز من كتف الطريق.",
  "Overtaking in a prohibited place": "التجاوز في مكان ممنوع",
  "Parking behind other cars and blocking their way.":
    "الوقوف خلف المركبات الأخرى وإعاقة طريقها.",
  "Parking cars in front of fire hydrants.":
    "وقوف المركبات أمام صنابير الإطفاء.",
  "Parking in a way that interrupts pedestrian movement.":
    "الوقوف بطريقة تعيق حركة المشاة.",
  "Parking in a way that poses danger to passersby.":
    "الوقوف بطريقة تعرّض المارة للخطر.",
  "Parking in a wrong way.": "الوقوف بطريقة خاطئة.",
  "Parking in spaces designated for people with special needs.":
    "الوقوف في المواقف المخصصة لأصحاب الهمم.",
  "parking on pavements": "الوقوف على الأرصفة",
  "Parking on the left side of the road in prohibited places.":
    "الوقوف على الجانب الأيسر من الطريق في الأماكن الممنوعة.",
  "Participating in a motorcade without permission except in permitted cases.":
    "المشاركة في موكب سيارات دون إذن في غير الحالات المسموح بها.",
  "Pedestrians crossing from undesignated areas.":
    "عبور المشاة من أماكن غير مخصصة.",
  "Placing signs on the road in a way that causes harm to the road or interrupts traffic.":
    "وضع علامات على الطريق بصورة تُلحق الضرر بالطريق أو تعيق الحركة المرورية.",
  "Poor condition of car lights": "سوء حالة أنوار المركبة",
  "Poor condition of indicators.": "سوء حالة إشارات الانعطاف.",
  "Poor condition of rear lights.": "سوء حالة الأنوار الخلفية.",
  "Poor condition of trailers rear or side lights.":
    "سوء حالة الأنوار الخلفية أو الجانبية للمقطورة.",
  "Reversing dangerously": "الرجوع إلى الخلف بصورة خطرة",
  "Rubbernecking and crowding at traffic accidents scenes.":
    "التجمهر والازدحام في مواقع الحوادث المرورية.",
  "Running a way from traffic policeman man (light vehicle)":
    "الهروب من رجل المرور (مركبة خفيفة)",
  "Running away from a traffic policeman by ( heavy vehicle)":
    "الهروب من رجل المرور (مركبة ثقيلة)",
  "Stopping at pedestrian crossings": "التوقف على ممرات المشاة",
  "Stopping on the road for no reason.": "التوقف على الطريق دون سبب.",
  "Stopping on the yellow box.": "التوقف على المربع الأصفر.",
  "Stopping the vehicle on a road junction or curve.":
    "توقف المركبة عند تقاطع أو منعطف.",
  "Sudden swerving": "الانحراف المفاجئ",
  "Taxis which have designated pickup areas stopping in undesignated ones.":
    "توقف سيارات الأجرة التي لها أماكن تحميل مخصصة في أماكن غير مخصصة.",
  "Teaching driving in a car that is not labelled as learning vehicle.":
    "تعليم القيادة في مركبة غير موسومة كمركبة تعليم.",
  "Teaching driving in a car that is undesignated for this purpose without permission from the licensing authority.":
    "تعليم القيادة في مركبة غير مخصصة لهذا الغرض دون إذن من جهة الترخيص.",
  "Teaching driving without a license.": "تعليم القيادة دون رخصة.",
  "Teaching driving without obtaining a permit from the licensing authority":
    "تعليم القيادة دون الحصول على تصريح من جهة الترخيص",
  "Tinting a vehicle not allowed to be tinted.":
    "تظليل مركبة غير مسموح بتظليلها.",
  "Towing a car or a boat without permission.": "قطر مركبة أو قارب دون إذن.",
  "Transporting inflammable or hazardous materials without permission.":
    "نقل مواد قابلة للاشتعال أو خطرة دون إذن.",
  "Transporting passengers illegally.": "نقل الركاب بصورة غير مشروعة.",
  "Transporting passengers in a vehicle that is not licensed for this purpose.":
    "نقل الركاب في مركبة غير مرخصة لهذا الغرض.",
  "Turning from undesignated areas.": "الانعطاف من أماكن غير مخصصة.",
  "Turning in a wrong way.": "الانعطاف بطريقة خاطئة.",
  "Using a hand held mobile phone while driving.":
    "استخدام الهاتف المتحرك باليد أثناء القيادة.",
  "Using driving learning vehicles in prohibited times and areas.":
    "استخدام مركبات تعليم القيادة في أوقات وأماكن محظورة.",
  "Using horn or car sound system in a disturbing way.":
    "استخدام المنبه أو نظام الصوت في المركبة بصورة مزعجة.",
  "Using three-wheel or more leisure bike on the road.":
    "استخدام دراجة ترفيهية ثلاثية العجلات أو أكثر على الطريق.",
  "Using vehicle for undesignated purpose.":
    "استخدام المركبة في غير الغرض المخصص لها.",
  "Writing phrases or placing stickers on vehicle without permission.":
    "كتابة عبارات أو وضع ملصقات على المركبة دون إذن.",

  // --- street names (speed limits table) -----------------------------------
  Airport: "المطار",
  "Airport Tunnel-Beirut": "نفق المطار - بيروت",
  "Al Amardi": "العمردي",
  "Al Asayel": "الأصايل",
  "Al Athar": "الأثر",
  "Al Aweer": "العوير",
  "Al Hadeeqa": "الحديقة",
  "Al Ittihad": "الاتحاد",
  "Al Jamayel": "الجمايل",
  "Al Jumeira": "الجميرا",
  "Al Khail": "الخيل",
  "Al Khaleej": "الخليج",
  "Al Khawaneej": "الخوانيج",
  "Al Mafraq": "المفرق",
  "Al Maidan": "الميدان",
  "Al Manama": "المنامة",
  "Al Manarah": "المنارة",
  "Al Mankhoul": "المنخول",
  "Al Minaa": "الميناء",
  "Al Nahda": "النهدة",
  "Al Orouba": "العروبة",
  "Al Qudra": "القدرة",
  "Al Quds": "القدس",
  "Al Rabat": "الرباط",
  "Al Seif": "السيف",
  "Al Soufouh 2": "الصفوح 2",
  "Al Thunaya": "الثنية",
  "Al Wasl": "الوصل",
  "Al Yalayes": "اليلايس",
  Algeria: "الجزائر",
  Amman: "عمّان",
  Baghdad: "بغداد",
  Beirut: "بيروت",
  Casablanca: "الدار البيضاء",
  Damascus: "دمشق",
  "Dubai Financial": "دبي المالي",
  "Dubai-Al Ain": "دبي - العين",
  Emirates: "الإمارات",
  Expo: "إكسبو",
  "Hatta Main": "حتا الرئيسي",
  Hessa: "حصة",
  "Jumeira Palm": "نخلة جميرا",
  "King Salman Bin Abdulaziz (ASoufouh previous )":
    "الملك سلمان بن عبدالعزيز (الصفوح سابقًا)",
  "Mohammad Bin Zayed": "محمد بن زايد",
  Muscat: "مسقط",
  "Nad Al Hamar": "ند الحمر",
  "Nad Al Shiba": "ند الشبا",
  "Oud Metha": "عود ميثاء",
  "Ras Al Khor": "رأس الخور",
  "Seeh Shuaib": "سيح شعيب",
  "Sheik Khalifa": "الشيخ خليفة",
  "Sheikh Rashid": "الشيخ راشد",
  "Sheikh Zayed": "الشيخ زايد",
  "Sheikh Zayed bin Hamdan Al Nahyan": "الشيخ زايد بن حمدان آل نهيان",
  Towers: "الأبراج",
  Tripoli: "طرابلس",
  Tunisia: "تونس",
  "Um Al Sheef": "أم الشيف",
  "Um Hurair": "أم هرير",
  "Um Suqaim": "أم سقيم",
  "Zaabeel second": "زعبيل الثاني",

  // --- laws and legislation ------------------------------------------------
  "Dubai Police's Laws and Legal Frameworks":
    "قوانين شرطة دبي وأطرها القانونية",
  "Administrative decision NO ( 986) for year 2018 to issue executive bylaws of executive council decision regarding Railways organization in Dubai Emirate":
    "القرار الإداري رقم (986) لسنة 2018 بإصدار اللائحة التنفيذية لقرار المجلس التنفيذي بشأن تنظيم السكك الحديدية في إمارة دبي",
  "Administrative Decision No. (1) of 2016 regarding the requirements and controls for found items and abandoned funds in the Emirate of Dubai":
    "القرار الإداري رقم (1) لسنة 2016 بشأن اشتراطات وضوابط الأشياء المعثور عليها والأموال المتروكة في إمارة دبي",
  "Concerning Disposition of Lost and Abandoned Property in Dubai":
    "بشأن التصرف في الأشياء المفقودة والأموال المتروكة في دبي",
  "Decision regarding the regulation of the use of bicycles in the Emirate of Dubai":
    "قرار بشأن تنظيم استخدام الدراجات الهوائية في إمارة دبي",
  "Decree No 49 for year 2013 to form preparatory committee for expo exhibition 2020":
    "المرسوم رقم 49 لسنة 2013 بتشكيل اللجنة التحضيرية لمعرض إكسبو 2020",
  "Decree No. (29) for the year 2015, for seizure/impounding of vehicles, in the Emirate of Dubai":
    "المرسوم رقم (29) لسنة 2015 بشأن حجز المركبات في إمارة دبي",
  "Decree No. (29) of 2015 regarding impounding vehicles in the Emirate of Dubai":
    "المرسوم رقم (29) لسنة 2015 بشأن حجز المركبات في إمارة دبي",
  "Decree No. (4) of 2021 regarding the Supreme Committee for Emergency, Crisis and Disaster Management in the Emirate of Dubai":
    "المرسوم رقم (4) لسنة 2021 بشأن اللجنة العليا لإدارة الطوارئ والأزمات والكوارث في إمارة دبي",
  "Decree No. (9) of 2015 regulating the collection of donations in the Emirate of Dubai":
    "المرسوم رقم (9) لسنة 2015 بتنظيم جمع التبرعات في إمارة دبي",
  "Degree NO ( 2) for year 2019 regarding classes ,allowances, wages, dependent allowances for Dubai government staff":
    "المرسوم رقم (2) لسنة 2019 بشأن الدرجات والبدلات والأجور وعلاوات المعالين لموظفي حكومة دبي",
  "Degree No (`17) for year 2018 regarding establishment of institution belong to Dubai health corporation and specify its powers":
    "المرسوم رقم (17) لسنة 2018 بشأن إنشاء مؤسسة تابعة لهيئة الصحة بدبي وتحديد اختصاصاتها",
  "Degree NO (1) for year 2019 regarding companies constitution organizing by Governmental in institutions In Dubai emirate":
    "المرسوم رقم (1) لسنة 2019 بشأن تنظيم تأسيس الشركات من قِبل الجهات الحكومية في إمارة دبي",
  "Degree No (14)for year 2018 to appoint head of financial control system":
    "المرسوم رقم (14) لسنة 2018 بتعيين رئيس جهاز الرقابة المالية",
  "Degree NO (5) for year 2019 for Dubai sport council forming":
    "المرسوم رقم (5) لسنة 2019 بتشكيل مجلس دبي الرياضي",
  "Executive council decision No (14) for year 2018 regarding official vacation in Emirate of Dubai":
    "قرار المجلس التنفيذي رقم (14) لسنة 2018 بشأن العطلات الرسمية في إمارة دبي",
  "Executive council decision No (3) for year 2019 regarding organizing of operational experiment of auto self-driving Vehicle":
    "قرار المجلس التنفيذي رقم (3) لسنة 2019 بشأن تنظيم التجربة التشغيلية للمركبات ذاتية القيادة",
  "Executive council decision No (5) for year 2019 regarding Instalment of some fees, fines, for governmental institutions in Dubai emirate":
    "قرار المجلس التنفيذي رقم (5) لسنة 2019 بشأن تقسيط بعض الرسوم والغرامات للجهات الحكومية في إمارة دبي",
  "Executive council decision No(4) for year 2019 regarding approval of grievances, complains , punitive regulations":
    "قرار المجلس التنفيذي رقم (4) لسنة 2019 باعتماد لائحة التظلمات والشكاوى والجزاءات",
  "Executive Council Decision No. (13) of 2022 regulating the use of bicycles in the Emirate of Dubai":
    "قرار المجلس التنفيذي رقم (13) لسنة 2022 بتنظيم استخدام الدراجات الهوائية في إمارة دبي",
  "Executive Council resolution No (10) for year 2015 Regulate the use of bicycles in the Emirate of Dubai":
    "قرار المجلس التنفيذي رقم (10) لسنة 2015 بتنظيم استخدام الدراجات الهوائية في إمارة دبي",
  "Executive Council resolution No (11) for year 2015 regarding Approval of vehicle inspection fees at Dubai Police":
    "قرار المجلس التنفيذي رقم (11) لسنة 2015 باعتماد رسوم فحص المركبات لدى شرطة دبي",
  "Executive Council Resolution No. (13) for the year 2015 On the framework of behavioral and technical competency for the staff of the Government of Dubai":
    "قرار المجلس التنفيذي رقم (13) لسنة 2015 بشأن إطار الجدارات السلوكية والفنية لموظفي حكومة دبي",
  "Executive Council Resolution No. 15 of 2013 on the regulation of Nature-of-Work Bonus, for the Government of Dubai Staff.":
    "قرار المجلس التنفيذي رقم 15 لسنة 2013 بشأن تنظيم بدل طبيعة العمل لموظفي حكومة دبي.",
  "Federal law No (12) for year 2018 regarding integrated management of wastes":
    "القانون الاتحادي رقم (12) لسنة 2018 بشأن الإدارة المتكاملة للنفايات",
  "Federal Ordinance No ( 12) for year 2007 for amendment some rules of Federal Ordinance No ( 21) regarding traffic":
    "المرسوم الاتحادي رقم (12) لسنة 2007 بتعديل بعض أحكام المرسوم الاتحادي رقم (21) بشأن السير والمرور",
  "Federal Ordinance No ( 51) for year 2006 regarding combating trafficking in people crime":
    "المرسوم الاتحادي رقم (51) لسنة 2006 بشأن مكافحة جرائم الاتجار بالبشر",
  "Federal Ordinance NO (21) for year 1995 regarding traffic":
    "المرسوم الاتحادي رقم (21) لسنة 1995 بشأن السير والمرور",
  "Federal Ordinance No (37) for year 2006 regarding private security companies":
    "المرسوم الاتحادي رقم (37) لسنة 2006 بشأن شركات الحراسة الخاصة",
  "Federal Ordinance No(43) for year 1992 regarding organizing penal institutions":
    "المرسوم الاتحادي رقم (43) لسنة 1992 بشأن تنظيم المنشآت العقابية",
  "Federal Ordinance no. (14) for Year 1995 regarding Combating Drugs and Mental Affects":
    "المرسوم الاتحادي رقم (14) لسنة 1995 بشأن مكافحة المواد المخدرة والمؤثرات العقلية",
  "Installment of Traffic Fines for government establishments, in Dubai":
    "تقسيط المخالفات المرورية للجهات الحكومية في دبي",
  "Law no (2) regarding fee of innovation Dirham":
    "القانون رقم (2) بشأن رسم درهم الابتكار",
  "Law No (4) for year 2018 to establish financial control system":
    "القانون رقم (4) لسنة 2018 بإنشاء جهاز الرقابة المالية",
  "Law NO (4) for year 2018 to form Board of directors for Dubai women and child care corporation":
    "القانون رقم (4) لسنة 2018 بتشكيل مجلس إدارة مؤسسة دبي لرعاية النساء والأطفال",
  "Law No (5) for year 2018 regarding organizing voluntary work in Dubai Emirate":
    "القانون رقم (5) لسنة 2018 بشأن تنظيم العمل التطوعي في إمارة دبي",
  "Law No (6) for year 2018 regarding Dubai health corporation":
    "القانون رقم (6) لسنة 2018 بشأن هيئة الصحة بدبي",
  "Law No( 1 ) regarding Knowledge Dirham": "القانون رقم (1) بشأن درهم المعرفة",
  "Law no(7) for year 2018to establish Emirates my country":
    "القانون رقم (7) لسنة 2018 بإنشاء مؤسسة الإمارات وطني",
  "Law No. (10) of 2023 amending some provisions of Law No. (4) of 2020 regulating drones in the Emirate of Dubai":
    "القانون رقم (10) لسنة 2023 بتعديل بعض أحكام القانون رقم (4) لسنة 2020 بتنظيم الطائرات دون طيار في إمارة دبي",
  "Law No. (21) for the year 2015, regarding legal fees, in Dubai courts":
    "القانون رقم (21) لسنة 2015 بشأن الرسوم القضائية في محاكم دبي",
  "Law No. (22) for the year 2015, on the organization of the partnership between the public and private sectors, in the Emirate of Dubai":
    "القانون رقم (22) لسنة 2015 بشأن تنظيم الشراكة بين القطاعين العام والخاص في إمارة دبي",
  "Law No. (23) for the year 2015, on the disposition of seized/impounded vehicles, in the Emirate of Dubai":
    "القانون رقم (23) لسنة 2015 بشأن التصرف في المركبات المحجوزة في إمارة دبي",
  "Law No. (23) of 2015 regarding the disposal of impounded vehicles in the Emirate of Dubai":
    "القانون رقم (23) لسنة 2015 بشأن التصرف في المركبات المحجوزة في إمارة دبي",
  "Law No. (4) of 2020 about Regulating drones in the Emirate of Dubai":
    "القانون رقم (4) لسنة 2020 بشأن تنظيم الطائرات دون طيار في إمارة دبي",
  "Law No. (4) of 2022 regulating virtual assets in the Emirate of Dubai":
    "القانون رقم (4) لسنة 2022 بتنظيم الأصول الافتراضية في إمارة دبي",
  "Law No. (5) of 2015 Concerning Disposal of Found Items and Abandoned Funds in the Emirate of Dubai":
    "القانون رقم (5) لسنة 2015 بشأن التصرف في الأشياء المعثور عليها والأموال المتروكة في إمارة دبي",
  "Law No. (9) of 2023 regulating the operation of self-driving vehicles in the Emirate of Dubai":
    "القانون رقم (9) لسنة 2023 بتنظيم تشغيل المركبات ذاتية القيادة في إمارة دبي",
  "Ministerial decision N0 24 for year 2013 regarding executive by laws of federal ordinance No 15 for year 2009 regarding tobacco combating":
    "القرار الوزاري رقم 24 لسنة 2013 بشأن اللائحة التنفيذية للمرسوم الاتحادي رقم 15 لسنة 2009 بشأن مكافحة التبغ",
  "Ministerial decision No (120) for year 2003 to a mend executive bylaws No (471) for year 1995 of Federal Ordinance No ( 43) regarding organizing penal institutions":
    "القرار الوزاري رقم (120) لسنة 2003 بتعديل اللائحة التنفيذية رقم (471) لسنة 1995 للمرسوم الاتحادي رقم (43) بشأن تنظيم المنشآت العقابية",
  "Ministerial decision No (228) for year 2019 regarding powers delegation":
    "القرار الوزاري رقم (228) لسنة 2019 بشأن تفويض الصلاحيات",
  "Ministerial decision No (471) for Year 1995 for issuance executive bylaws of Federal law No (43) For Year 1992 regarding organizing penal institutions":
    "القرار الوزاري رقم (471) لسنة 1995 بإصدار اللائحة التنفيذية للقانون الاتحادي رقم (43) لسنة 1992 بشأن تنظيم المنشآت العقابية",
  "Ministers council decision No (52) for year 2018 related to executive by law for federal law no (3) for year 2016 regarding child rights (wadima)":
    "قرار مجلس الوزراء رقم (52) لسنة 2018 بشأن اللائحة التنفيذية للقانون الاتحادي رقم (3) لسنة 2016 بشأن حقوق الطفل (وديمة)",
  "Ordinance No ( 3) for year 1996 regarding Governmental cases":
    "المرسوم رقم (3) لسنة 1996 بشأن القضايا الحكومية",
  "Ordinance No ( 7) for year 1995 regarding financial system of Dubai Governmental departments":
    "المرسوم رقم (7) لسنة 1995 بشأن النظام المالي لدوائر حكومة دبي",
  "Ordinance No (1) for year 1995 regarding establishment of financial auditing department":
    "المرسوم رقم (1) لسنة 1995 بشأن إنشاء دائرة التدقيق المالي",
  "Ordinance No (10) for year 2010 to a mend some rules of ordinance No ( 34) for year 2008 regarding dealing with seized vehicles and bicycles":
    "المرسوم رقم (10) لسنة 2010 بتعديل بعض أحكام المرسوم رقم (34) لسنة 2008 بشأن التعامل مع المركبات والدراجات المحجوزة",
  "Ordinance No (11) for year 2006 regarding establishment of Dubai corporation for Governmental Investments":
    "المرسوم رقم (11) لسنة 2006 بشأن إنشاء مؤسسة دبي للاستثمارات الحكومية",
  "Ordinance No (16) for year 2009 regarding establishment of amicable settlement center for disputes":
    "المرسوم رقم (16) لسنة 2009 بشأن إنشاء مركز التسوية الودية للمنازعات",
  "Ordinance No (18) for year 2006 regarding conducting and verification of public money":
    "المرسوم رقم (18) لسنة 2006 بشأن إدارة المال العام والتحقق منه",
  "Ordinance No (2) for year 2015 regarding human resources management for executives of Dubai Emirate":
    "المرسوم رقم (2) لسنة 2015 بشأن إدارة الموارد البشرية للقيادات التنفيذية في إمارة دبي",
  "Ordinance No (3) for year 2003 regarding establishment of Dubai Emirate Executive council":
    "المرسوم رقم (3) لسنة 2003 بشأن إنشاء المجلس التنفيذي لإمارة دبي",
  "Ordinance No (35) for year 2009 regarding conducting public money of Dubai Emirate":
    "المرسوم رقم (35) لسنة 2009 بشأن إدارة المال العام في إمارة دبي",
  "Ordinance No (5) for year 1995 regarding establishment of finance department":
    "المرسوم رقم (5) لسنة 1995 بشأن إنشاء دائرة المالية",
  "Ordinance No (5) for year 2007 to amend ordinance No (11) for year 2006 regarding establishment of Dubai corporation for Governmental Investment":
    "المرسوم رقم (5) لسنة 2007 بتعديل المرسوم رقم (11) لسنة 2006 بشأن إنشاء مؤسسة دبي للاستثمارات الحكومية",
  "Ordinance No (5) for year 2015 regarding Disposing of found items and money left in the Emirate of Dubai":
    "المرسوم رقم (5) لسنة 2015 بشأن التصرف في الأشياء المعثور عليها والأموال المتروكة في إمارة دبي",
  "Ordinance No (7) for year 2008 regarding public debt procedures":
    "المرسوم رقم (7) لسنة 2008 بشأن إجراءات الدين العام",
  "Ordinance No (7) for year 2015 regarding Security and safety of the airspace in the Emirate of Dubai":
    "المرسوم رقم (7) لسنة 2015 بشأن أمن وسلامة المجال الجوي في إمارة دبي",
  "Ordinance No (8) for year 2010 regarding financial control department":
    "المرسوم رقم (8) لسنة 2010 بشأن دائرة الرقابة المالية",
  "Ordinance No( 4) for year 1997 for amendment of ordinance No( 3) for year 1996 regarding Governmental cases":
    "المرسوم رقم (4) لسنة 1997 بتعديل المرسوم رقم (3) لسنة 1996 بشأن القضايا الحكومية",

  // --- organisational structure --------------------------------------------
  "to be added": "يُضاف لاحقًا",

  // --- customer centres ----------------------------------------------------
  "24 hours": "24 ساعة",
  "Al Faqaa Police Station": "مركز شرطة الفقع",
  "Al khawaneej Police Station": "مركز شرطة الخوانيج",
  "Al Raffa Police Station": "مركز شرطة الرفاعة",
  "Barsha Police Station": "مركز شرطة البرشاء",
  "Bur Dubai Police Station": "مركز شرطة بر دبي",
  "Jabal Ali Police Station": "مركز شرطة جبل علي",
  "Murqabat Police Station": "مركز شرطة المرقبات",
  "Naif Police Station": "مركز شرطة نايف",
  "Ports Police Station": "مركز شرطة المنافذ",
  "Qusais Police Station": "مركز شرطة القصيص",
  "Rashidiya Police Station": "مركز شرطة الراشدية",
  "Smart Police Station - Al Eyas": "مركز الشرطة الذكي - العياص",
  "Smart Police Station - Al lissali": "مركز الشرطة الذكي - الليسيلي",
  "Smart Police Station - Al Seef": "مركز الشرطة الذكي - السيف",
  "Smart Police Station - Alnkhla": "مركز الشرطة الذكي - النخلة",
  "Smart Police Station - Arabian Ranches":
    "مركز الشرطة الذكي - المرابع العربية",
  "Smart Police Station - City Walk": "مركز الشرطة الذكي - سيتي ووك",
  "Smart Police Station - Design District D3":
    "مركز الشرطة الذكي - حي دبي للتصميم",
  "Smart Police Station - Hatta (Wadi Hub)":
    "مركز الشرطة الذكي - حتا (وادي هب)",
  "Smart Police Station - Headquarters": "مركز الشرطة الذكي - القيادة العامة",
  "Smart Police Station - la Mer": "مركز الشرطة الذكي - لامير",
  "Smart Police Station - Lahbab": "مركز الشرطة الذكي - لهباب",
  "Smart Police Station - Sillicon Oasis": "مركز الشرطة الذكي - واحة السيليكون",
  "Smart Police Station - The World Islands": "مركز الشرطة الذكي - جزر العالم",
  "Abu Bakr Al Siddiq Street, after Warba Center":
    "شارع أبو بكر الصديق، بعد مركز وربة",
  "Al Khawaneej 2 area - Emirates Road - Exit No 67, next to Al Eyas Mosque":
    "منطقة الخوانيج 2 - شارع الإمارات - مخرج رقم 67، بجوار مسجد العياص",
  "Al khawaneej 2 -Dubai": "الخوانيج 2 - دبي",
  "Al Qusais No. (2) on Beirut Street": "القصيص (2) على شارع بيروت",
  "Al Seef Street – Near the Car Parks (Dubai Creek)":
    "شارع السيف – بالقرب من المواقف (خور دبي)",
  "Al Twar 1, on Al Nahda Street": "الطوار 1، على شارع النهدة",
  "Al-Rashidiya area - Opposite Nad Rashid Market - street number33":
    "منطقة الراشدية - مقابل سوق ند راشد - شارع رقم 33",
  "Arabian Ranches - Community Centre - 311A":
    "المرابع العربية - المركز المجتمعي - 311A",
  "Bur Dubai area - Al-Fahidi neighborhood": "منطقة بر دبي - حي الفهيدي",
  "D94 - Jumeirah Street - Port Rashid - Dubai":
    "D94 - شارع جميرا - ميناء راشد - دبي",
  "Dubai - Al Ain St- - Faqea - Dubai": "شارع دبي - العين - الفقع - دبي",
  "Dubai - Hatta Rd": "طريق دبي - حتا",
  "Dubai Design District - Building 3": "حي دبي للتصميم - مبنى 3",
  "Dubai Silicon Oasis area, near the Cedre Shopping Centre":
    "منطقة واحة دبي للسيليكون، بالقرب من سيدر شوبينغ سنتر",
  "E44 Al Khail Road - Al Barsha - Al Barsha South - Dubai":
    "E44 شارع الخيل - البرشاء - البرشاء جنوب - دبي",
  "In the Wadi Hub area": "في منطقة وادي هب",
  "Located in Palm Jumeirah area - Golden Mile Galleria 7":
    "تقع في منطقة نخلة جميرا - جولدن مايل جاليريا 7",
  "near The World Islands": "بالقرب من جزر العالم",
  "Sheikh Khalifa Bin Zayed st - Al Jafiliya -near the Trade Center roundabout":
    "شارع الشيخ خليفة بن زايد - الجافلية - بالقرب من دوار المركز التجاري",
  "Sheikh Mohammed bin Zayed Road in Jebel Ali Industrial Area":
    "شارع الشيخ محمد بن زايد في منطقة جبل علي الصناعية",
  "Sikkat Al Khail Rd": "طريق سكة الخيل",
  "The center is located in Jumeirah 1 - La Mer North":
    "يقع المركز في جميرا 1 - لامير الشمالية",
  "The center is located in the Al Wasl area - Al Mustaqbal Street":
    "يقع المركز في منطقة الوصل - شارع المستقبل",
  "The center is located on Dubai-Al Ain Road":
    "يقع المركز على طريق دبي - العين",

  // --- customer centre descriptions ---------------------------------------
  "Al Faqaa Smart Police Station was established on 04/07/1978 and upgraded to a full police centre on 09/02/2023. Situated on the Dubai – Al Ain Road, the centre serves as a comprehensive hub for criminal and traffic services, supporting the community across its broad jurisdiction — bordered by Abu Dhabi Emirate to the…":
    "تأسس مركز شرطة الفقع الذكي في 04/07/1978 وتم تحويله إلى مركز شرطة متكامل في 09/02/2023. ويقع المركز على طريق دبي – العين، ويعمل كمركز شامل للخدمات الجنائية والمرورية، ويخدم المجتمع في نطاق اختصاصه الواسع المحاذي لإمارة أبوظبي من…",
  "Al Khawaneej Police Station is a fully interactive, self-service police centre that operates without human intervention — the first of its kind in the Middle East. It provides community members with seamless access to four smart service packages: Reports, Traffic, Certificates and Permits, and Community Services. The…":
    "مركز شرطة الخوانيج مركز شرطي تفاعلي متكامل ذاتي الخدمة يعمل دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. يتيح لأفراد المجتمع وصولًا سلسًا إلى أربع باقات خدمات ذكية: البلاغات، والمرور، والشهادات والتصاريح، والخدمات المجتمعية. و…",
  "Al Lissali Smart Police Station is a fully interactive, self-service police centre that operates without human intervention. the first of its kind in the Middle East. Offering four smart service packages, Reports, Traffic, Certificates and Permits, and Community Services. the centre provides the community with…":
    "مركز شرطة الليسيلي الذكي مركز شرطي تفاعلي متكامل ذاتي الخدمة يعمل دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. يقدم أربع باقات خدمات ذكية: البلاغات، والمرور، والشهادات والتصاريح، والخدمات المجتمعية، ويوفر للمجتمع…",
  "Al Muraqqabat Police Station was established on 26 March 1974 . In 2004 , the station’s building was renovated to keep pace with the urban development of Dubai . Located on Abu Bakr Al Siddiq Street , near Warba Center , the station provides a wide range of services, including certificates, permits, criminal…":
    "تأسس مركز شرطة المرقبات في 26 مارس 1974. وفي عام 2004 جُدد مبنى المركز لمواكبة التطور العمراني في دبي. ويقع على شارع أبو بكر الصديق بالقرب من مركز وربة، ويقدم مجموعة واسعة من الخدمات تشمل الشهادات والتصاريح والعمليات الجنائية…",
  "Al Qusais Police Station was established in Al Qusais on 12 August 1977 . Due to the expansion of its jurisdiction, urban development, and population growth in the area, the station was upgraded to a police center on 26 January 1978 . The center is located in Al Qusais No. 2, on Beirut Street , and provides a wide…":
    "تأسس مركز شرطة القصيص في القصيص في 12 أغسطس 1977. ونظرًا لاتساع نطاق اختصاصه والتطور العمراني والنمو السكاني في المنطقة، تم تحويله إلى مركز شرطة في 26 يناير 1978. ويقع المركز في القصيص 2 على شارع بيروت، ويقدم مجموعة واسعة…",
  "Al Seef Police Station , inaugurated in 2019 , stands as a flagship Smart Police Station (SPS) and a symbol of Dubai Police’s commitment to innovation and excellence. Designed to redefine the policing experience, the station delivers a wide range of services through an advanced self-service system , enabling customers…":
    "افتُتح مركز شرطة السيف عام 2019 ليكون مركز شرطة ذكيًا رائدًا ورمزًا لالتزام شرطة دبي بالابتكار والتميز. صُمم لإعادة تعريف التجربة الشرطية، ويقدم مجموعة واسعة من الخدمات عبر نظام متقدم للخدمة الذاتية يمكّن المتعاملين…",
  "Al-Raffa Police Station was established in the early seventies, and its presence contributed to maintaining regular security in the Bur Dubai jurisdiction. Al-Raffa Police Station is located in the Bur Dubai area - Al-Fahidi neighborhood. The center provides a range of services and criminal and traffic operations.":
    "تأسس مركز شرطة الرفاعة في مطلع السبعينيات، وأسهم وجوده في حفظ الأمن المنتظم في نطاق بر دبي. ويقع المركز في منطقة بر دبي - حي الفهيدي، ويقدم مجموعة من الخدمات والعمليات الجنائية والمرورية.",
  "Al-Rashidiya Police Station was opened on 17 July 1976 , initially as a station administratively affiliated with Al Muraqqabat Police Station . It became independent on , 19 July 1984 . The station is located in the Al-Rashidiya area, opposite Nad Rashid Market , and provides a wide range of services, including…":
    "افتُتح مركز شرطة الراشدية في 17 يوليو 1976، وكان في البداية تابعًا إداريًا لمركز شرطة المرقبات، ثم استقل في 19 يوليو 1984. ويقع المركز في منطقة الراشدية مقابل سوق ند راشد، ويقدم مجموعة واسعة من الخدمات تشمل…",
  "An integrated, interactive and self-service police station without human intervention. It is considered the first of its kind in the Middle East region, allowing community members to apply for Dubai Police services that are provided in traditional police stations. The center provides many smart services, the most…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، ويُعد الأول من نوعه في منطقة الشرق الأوسط، ويتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم في مراكز الشرطة التقليدية. ويوفر المركز خدمات ذكية عديدة أبرزها…",
  "Design District D3 Smart Police Station is a fully interactive, self-service police centre without human intervention. the first of its kind in the Middle East. Designed to serve Dubai's creative community, it provides four smart service packages: Reports, Traffic, Certificates and Permits, and Community Services.…":
    "مركز الشرطة الذكي في حي دبي للتصميم مركز شرطي تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. صُمم لخدمة المجتمع الإبداعي في دبي، ويقدم أربع باقات خدمات ذكية: البلاغات، والمرور، والشهادات والتصاريح، والخدمات المجتمعية.…",
  "Fully interactive, self-service police station without human intervention. It is the first of its kind in the Middle East, allowing community members to request Dubai Police services that are typically provided at traditional police stations. The center offers numerous smart services, including a package of reporting…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط، ويتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم عادةً في مراكز الشرطة التقليدية. ويقدم المركز خدمات ذكية عديدة تشمل باقة خدمات البلاغات…",
  "In 1939 , the late His Highness Sheikh Rashid bin Saeed Al Maktoum, may God rest his soul, ordered the construction of Naif Fort . Naif Police Station is located on Al Khail – Naif Railway Road , opposite the Hyatt Regency Hotel , and provides a wide range of criminal and traffic services and operations , serving the…":
    "في عام 1939 أمر المغفور له صاحب السمو الشيخ راشد بن سعيد آل مكتوم، طيب الله ثراه، ببناء حصن نايف. ويقع مركز شرطة نايف على طريق سكة الخيل – نايف مقابل فندق حياة ريجنسي، ويقدم مجموعة واسعة من الخدمات والعمليات الجنائية والمرورية، ويخدم…",
  "It is a fully interactive, self-service police station without human intervention, considered the first of its kind in the Middle East. It allows community members to request Dubai Police services typically provided at traditional police stations. The center offers many smart services, including (Reports Services…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، ويُعد الأول من نوعه في الشرق الأوسط، ويتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم عادةً في مراكز الشرطة التقليدية. ويقدم المركز خدمات ذكية عديدة تشمل (باقة خدمات البلاغات…",
  "It is an integrated, interactive, self-service police center without human intervention, and it is considered the first of its kind in the Middle East. It allows members of the community to request Dubai Police services provided in traditional police stations. The center offers many smart services, including packages…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، ويُعد الأول من نوعه في الشرق الأوسط، ويتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم في مراكز الشرطة التقليدية. ويقدم المركز خدمات ذكية عديدة تشمل باقات…",
  "It is an integrated, interactive, self-service police station without human intervention. It is considered the first of its kind in the Middle East region, allowing community members to apply for Dubai Police services that are provided in traditional police stations. The center provides many smart services, the most…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، ويُعد الأول من نوعه في منطقة الشرق الأوسط، ويتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم في مراكز الشرطة التقليدية. ويوفر المركز خدمات ذكية عديدة أبرزها…",
  "Its an integrated interactive self-service police center without human intervention, the first of its kind in the Middle East. It allows community members to apply for Dubai Police services typically provided in traditional police stations. The center offers many smart services, including packages for reports, traffic…":
    "مركز شرطة تفاعلي متكامل ذاتي الخدمة دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. يتيح لأفراد المجتمع طلب خدمات شرطة دبي التي تُقدَّم عادةً في مراكز الشرطة التقليدية، ويقدم خدمات ذكية عديدة تشمل باقات البلاغات والمرور…",
  "Jebel Ali Police Station was established on 14 May 1971 , initially operating from a group of tents. With the development of the Jebel Ali Free Zone , the vision of the late Sheikh Rashid bin Saeed Al Maktoum, the station’s founder, became clear. It was entrusted with comprehensive security duties in this vital…":
    "تأسس مركز شرطة جبل علي في 14 مايو 1971، وبدأ عمله من مجموعة من الخيام. ومع تطور المنطقة الحرة بجبل علي تجلّت رؤية المغفور له الشيخ راشد بن سعيد آل مكتوم مؤسس المركز، وأُسندت إليه مهام أمنية شاملة في هذه المنطقة الحيوية…",
  "On 20 October 1979, the late Sheikh Rashid bin Saeed Al Maktoum, may God rest his soul, inaugurated Bur Dubai Police Station, a landmark addition to Dubai's security network. Situated on Sheikh Zayed Road, near the Trade Centre Roundabout, the station delivers a comprehensive range of criminal and traffic services,…":
    "في 20 أكتوبر 1979 افتتح المغفور له الشيخ راشد بن سعيد آل مكتوم، طيب الله ثراه، مركز شرطة بر دبي، ليكون إضافة بارزة إلى المنظومة الأمنية في دبي. ويقع المركز على شارع الشيخ زايد بالقرب من دوار المركز التجاري، ويقدم مجموعة شاملة من الخدمات الجنائية والمرورية،…",
  "The center is an integrated, interactive, self-service police station that operates without human intervention , making it the first of its kind in the Middle East . It follows Hatta Police Station and allows community members to access Dubai Police services that are usually provided in traditional police stations.":
    "المركز مركز شرطة تفاعلي متكامل ذاتي الخدمة يعمل دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. ويتبع مركز شرطة حتا، ويتيح لأفراد المجتمع الوصول إلى خدمات شرطة دبي التي تُقدَّم عادةً في مراكز الشرطة التقليدية.",
  "The center operates under Al Khawaneej Police Station and offers a comprehensive range of smart services designed to meet the needs of the public efficiently and conveniently. These services include Complaints Services Package, Traffic Services Package, Certificates and Permits Services Package, and Community Services…":
    "يتبع المركز مركز شرطة الخوانيج، ويقدم مجموعة شاملة من الخدمات الذكية المصممة لتلبية احتياجات الجمهور بكفاءة ويسر، وتشمل باقة خدمات الشكاوى، وباقة خدمات المرور، وباقة خدمات الشهادات والتصاريح، وباقة الخدمات المجتمعية…",
  "The center’s development began in 2011 and was completed in 2013, becoming fully operational in June 2014 . It covers an area of approximately 44 square kilometers in the Emirate of Dubai . &nbsp; Located on Al Khail Street – Al Barsha South , the center provides a wide range of services, including certificates,…":
    "بدأ تطوير المركز عام 2011 واكتمل عام 2013، ودخل الخدمة بالكامل في يونيو 2014. ويغطي مساحة تبلغ نحو 44 كيلومترًا مربعًا في إمارة دبي. ويقع على شارع الخيل – البرشاء جنوب، ويقدم مجموعة واسعة من الخدمات تشمل الشهادات،…",
  "The Lahbab Police Station was inaugurated on 06/07/1978 AD and was converted into a police center on 09/02/2023 AD. The center is located on the Dubai - Hatta Road and offers a range of services including certificates, permits, criminal and traffic operations. It is considered a globally self-service smart police…":
    "افتُتح مركز شرطة لهباب في 06/07/1978 وتم تحويله إلى مركز شرطة في 09/02/2023. ويقع المركز على طريق دبي - حتا، ويقدم مجموعة من الخدمات تشمل الشهادات والتصاريح والعمليات الجنائية والمرورية، ويُعد مركز شرطة ذكيًا ذاتي الخدمة على مستوى عالمي…",
  "The Ports Police Station was established in 1968 AD. The Ports Police Station is located on Jumeirah Road - Al Mina - Port and provides a range of certificates, permits and criminal operations services.":
    "تأسس مركز شرطة المنافذ عام 1968. ويقع على شارع جميرا - الميناء، ويقدم مجموعة من خدمات الشهادات والتصاريح والعمليات الجنائية.",
  'The Smart Police Station at Dubai Police Headquarters is a fully interactive, self-service police centre that operates without human intervention — the first of its kind in the Middle East. Offering four smart service packages: "Reports, Traffic, Certificates and Permits, and Community Services", the centre provides…':
    "مركز الشرطة الذكي في القيادة العامة لشرطة دبي مركز شرطي تفاعلي متكامل ذاتي الخدمة يعمل دون تدخل بشري، وهو الأول من نوعه في الشرق الأوسط. ويقدم أربع باقات خدمات ذكية: «البلاغات، والمرور، والشهادات والتصاريح، والخدمات المجتمعية»، ويوفر…",

  // --- contact us ----------------------------------------------------------
  "Reach Dubai Police Anytime, Anywhere":
    "تواصل مع شرطة دبي في أي وقت ومن أي مكان",
  "Reach Dubai Police 24/7": "تواصل مع شرطة دبي على مدار الساعة",
  "Connect instantly with Dubai Police for emergency or non-emergency support through our dedicated channels — available 24 hours a day.":
    "تواصل فورًا مع شرطة دبي للحصول على الدعم في الحالات الطارئة وغير الطارئة عبر قنواتنا المخصصة، المتاحة على مدار 24 ساعة.",
  Emergency: "الطوارئ",
  "Non-Emergency": "غير الطوارئ",
  "For immediate police assistance in any emergency.":
    "للمساعدة الشرطية الفورية في أي حالة طارئة.",
  "For non-urgent inquiries, general information, or community support.":
    "للاستفسارات غير العاجلة والمعلومات العامة والدعم المجتمعي.",
  Contact: "التواصل",
  "Sign Language": "لغة الإشارة",
  "A dedicated service for people who are Deaf, hard of hearing, or have speech difficulties.":
    "خدمة مخصصة للصم وضعاف السمع وذوي صعوبات النطق.",
  "Connect with Dubai Police through the Sign Language Service for accessible communication assistance.":
    "تواصل مع شرطة دبي عبر خدمة لغة الإشارة للحصول على مساعدة تواصل ميسّرة.",
  "Dubai Police Leadership": "قيادة شرطة دبي",
  "This is a digital service that promotes communication between the senior leadership at Dubai Police and the public. Eliminating all administrative barriers and obstacles to ensure that the leaders respond to queries and remarks accordingly.":
    "خدمة رقمية تعزز التواصل بين القيادة العليا في شرطة دبي والجمهور، وتزيل كل الحواجز والعوائق الإدارية لضمان استجابة القادة للاستفسارات والملاحظات.",
  "Our IT support team is ready to help you resolve issues quickly and ensure your digital experience with Dubai Police runs smoothly.":
    "فريق الدعم الفني لدينا جاهز لمساعدتك في حل المشكلات بسرعة وضمان سلاسة تجربتك الرقمية مع شرطة دبي.",
  "Feedback And Complaints": "الملاحظات والشكاوى",
  "We value every opinion, suggestion, and concern shared by our community — each helps us serve you better.":
    "نقدّر كل رأي واقتراح وملاحظة يشاركنا بها مجتمعنا — فكل منها يساعدنا على خدمتك بشكل أفضل.",
  Suggestion: "اقتراح",
  Remark: "ملاحظة",
  Complaint: "شكوى",
  "Your suggestion contributes to the ongoing improvement of our services.":
    "يسهم اقتراحك في التحسين المستمر لخدماتنا.",
  "Share your appreciation for a Dubai Police Officer or team member who made a positive difference. Your words motivate us to do even better.":
    "شاركنا تقديرك لأحد منتسبي شرطة دبي أو فريق عمل أحدث فرقًا إيجابيًا. كلماتك تحفزنا على تقديم الأفضل.",
  "Please note: under the UAE Federal Penal Code of Law No. 3 of 1987, Article 266, knowingly submitting a false complaint is an offence.":
    "يُرجى العلم: بموجب قانون العقوبات الاتحادي رقم 3 لسنة 1987، المادة 266، يُعد تقديم بلاغ كاذب مع العلم بذلك جريمة.",

  // --- leaders at your service --------------------------------------------
  "DP Leaders At Your Service": "قادة شرطة دبي في خدمتكم",
  "This service aims to enhance direct communication between Dubai Police senior leadership and the public, allowing leaders to respond to inquiries and feedback within their functional and administrative responsibilities":
    "تهدف هذه الخدمة إلى تعزيز التواصل المباشر بين القيادة العليا لشرطة دبي والجمهور، بما يتيح للقادة الرد على الاستفسارات والملاحظات في نطاق مسؤولياتهم الوظيفية والإدارية",
  "5 Working Days": "5 أيام عمل",
  Individuals: "الأفراد",
  "Business Sector": "قطاع الأعمال",
  "Documents relevant to the inquiry or remark":
    "المستندات المتعلقة بالاستفسار أو الملاحظة",

  // --- service packages ----------------------------------------------------
  "Report Criminal Complaint": "الإبلاغ عن شكوى جنائية",
  "Request a Certificate": "طلب شهادة",
  "Request a Permit": "طلب تصريح",
  "Traffic Services": "الخدمات المرورية",
  "Pay Traffic Fines": "سداد المخالفات المرورية",
  "Report a Vehicle or Driver": "الإبلاغ عن مركبة أو سائق",
  "Support and Emergency Response": "الدعم والاستجابة للطوارئ",
  "Request to Contact The Police": "طلب التواصل مع الشرطة",
  "On-Site Police Support": "الدعم الشرطي في الموقع",
  "Business and Corporates": "الأعمال والشركات",
  "Bounce Cheque Report for Banks": "بلاغ الشيكات المرتجعة للبنوك",
  "Registration of law firms": "تسجيل مكاتب المحاماة",
  "Diplomatic Affairs Services": "خدمات الشؤون الدبلوماسية",
  "Suppliers Services": "خدمات الموردين",
  "Sport Facilities Booking": "حجز المرافق الرياضية",
  "Request a Lecture or Training Course": "طلب محاضرة أو دورة تدريبية",
  "DP Personnel Welfare and Support": "رعاية ودعم منتسبي شرطة دبي",
  "Apply for a Job": "التقديم على وظيفة",

  // --- privacy (payment section, lives with the footer content) -----------
  "Dubai Police Website encompasses a range of services and transactions that allow you to pay transaction fees electronically by entering credit card data in Dubai Police Payment Screen where credit card data are not stored in our databases, to ensure that the credit card is not used, by anyone else.":
    "يضم موقع شرطة دبي مجموعة من الخدمات والمعاملات التي تتيح لك سداد رسوم المعاملات إلكترونيًا بإدخال بيانات بطاقة الائتمان في شاشة الدفع الخاصة بشرطة دبي، حيث لا تُخزَّن بيانات البطاقة في قواعد بياناتنا ضمانًا لعدم استخدامها من قِبل أي شخص آخر.",
  // --- laws & legislation (kept when the media dictionaries went) --------
  "Using Security Cameras": "استخدام كاميرات المراقبة",
  "Regulation No(2) for year 2019 regarding executive secretariat of governmental initiatives": "اللائحة رقم (2) لسنة 2019 بشأن الأمانة التنفيذية للمبادرات الحكومية",
  "System No. 5 of Leaders&rsquo; Qualifying, within Dubai Police General HQ": "النظام رقم 5 بشأن تأهيل القيادات في القيادة العامة لشرطة دبي",
  "System No. 1/2015 regarding the Assigning of Cars to Personnel of Dubai Police General HQ": "النظام رقم 1/2015 بشأن تخصيص المركبات لمنتسبي القيادة العامة لشرطة دبي",
  "System No. 1/2012 regarding the Assigning of Cars to Civil Personnel of Dubai Police General HQ": "النظام رقم 1/2012 بشأن تخصيص المركبات للموظفين المدنيين في القيادة العامة لشرطة دبي",
  "System No. 1/2013 regarding Partial Scholarship Leave, by means of own expense": "النظام رقم 1/2013 بشأن إجازة التفرغ الدراسي الجزئي على النفقة الخاصة",
  "The Ranking System for local military personnel working for the Government of Dubai": "نظام الرتب للعسكريين المحليين العاملين لدى حكومة دبي",
  "Ordinance No(4) for year 2015 for amendment of Ordinance No (21) for year 2008 regarding pensions and social securities for local military persons works in Dubai Emirate": "المرسوم رقم (4) لسنة 2015 بتعديل المرسوم رقم (21) لسنة 2008 بشأن المعاشات والتأمينات الاجتماعية للعسكريين المحليين العاملين في إمارة دبي",
  "Ordinance No. (21) of 2008 Regarding Pensions and Social Securities for Local Military Personnel Working in the Emirate of Dubai": "المرسوم رقم (21) لسنة 2008 بشأن المعاشات والتأمينات الاجتماعية للعسكريين المحليين العاملين في إمارة دبي",
  "Page last updated: {date}": "آخر تحديث للصفحة: {date}",

  // --- customer centres ---------------------------------------------------
  "Police Station": "مركز شرطة",

  // --- laws and legislation table ------------------------------------------
  "Laws and legislation": "القوانين والتشريعات",
  "Legislation": "التشريع",
  "Issue date": "تاريخ الإصدار",
  "File size": "حجم الملف",

  // --- street speed limits table --------------------------------------------
  "Street speed limits": "حدود السرعة على الطرق",
  "Road": "الطريق",
  "Limit km/h": "الحد كم/س",
  "Radar km/h": "الرادار كم/س",

  // --- black points table ----------------------------------------------------
  "Traffic violations, fines and black points": "المخالفات المرورية والغرامات والنقاط السوداء",
  "Violation": "المخالفة",
  "Fine (AED)": "الغرامة (درهم)",
  "Black points": "النقاط السوداء",
  "Confiscation": "الحجز",

  // --- black point categories -------------------------------------------------
  "Speed Violation": "مخالفة السرعة",
  "Horn Violations": "مخالفات التنبيه",
  "Load Violations": "مخالفات الحمولة",
  "Plates Violations": "مخالفات اللوحات",
  "Environment Violations": "المخالفات البيئية",
  "Violations Inside the Vehicle": "المخالفات داخل المركبة",
  "Violations in the Vehicle Installations": "مخالفات تجهيزات المركبة",
  "Transport Vehicles Violations": "مخالفات مركبات النقل",
  "Training Vehicles Violations": "مخالفات مركبات التدريب",
  "Trucks and Heavy Vehicles Violations": "مخالفات الشاحنات والمركبات الثقيلة",
  "Buses Violations and the STOP Sign": "مخالفات الحافلات وإشارة قف",
  "Wrong Parking and Overtaking": "الوقوف الخاطئ والتجاوز",
  "Violations Related to Driving License": "المخالفات المتعلقة برخصة القيادة",
  "Violations Related to Pedestrians and Priority": "المخالفات المتعلقة بالمشاة وأولوية المرور",
  "Violations Related to Non-Compliance with Traffic Policeman Instructions": "المخالفات المتعلقة بعدم الالتزام بتعليمات رجل المرور",
  "Violations for Jeopardizing Road Users": "مخالفات تعريض مستخدمي الطريق للخطر",
  "Vehicles Registration and Traffic Permits Violations": "مخالفات تسجيل المركبات وتصاريح المرور",
};
