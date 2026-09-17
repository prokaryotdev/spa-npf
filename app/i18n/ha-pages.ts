/**
 * The Information pages: the statute list, the traffic offence schedule and
 * the speed limits, plus the sitemap.
 *
 * Statute titles, road names and district names carry no entry here. They
 * are names, not copy, and live in scripts/proper-nouns.mjs so the coverage
 * test knows they are unchanged on purpose.
 *
 * Offence wording follows the National Road Traffic Regulations, so it reads
 * as a citable charge rather than as a warning notice.
 */
export const haPages: Record<string, string> = {
  // --- the hub -------------------------------------------------------------
  Information: "Bayani",
  "Information | Nigeria Police Force":
    "Bayani | Rundunar 'Yan Sandan Najeriya",
  "Know more": "Ƙara sani",
  "Page last updated: {date}": "An sabunta shafin karshe: {date}",
  "Laws and legislation, traffic penalty points, street speed limits, and sustainable development practices.":
    "Dokoki da ƙa'idoji, makin hukuncin zirga-zirga, iyakokin gudu a hanya, da ayyukan cigaba mai dorewa.",

  // --- sitemap -------------------------------------------------------------
  "Sitemap | Nigeria Police Force":
    "Taswirar Shafi | Rundunar 'Yan Sandan Najeriya",
  "Every page on the Nigeria Police Force website, in one list.":
    "Kowane shafi a shafin Rundunar 'Yan Sandan Najeriya, a jeri ɗaya.",
  "Main navigation": "Babban jagora",
  "All services": "Duk ayyuka",
  Account: "Asusu",
  "Sign In": "Shiga",
  Search: "Nema",
  Legal: "Shari'a",
  Documents: "Takardu",

  // --- laws ----------------------------------------------------------------
  "Laws & Legislation": "Dokoki da Ƙa'idoji",
  "Laws & Legislation | Nigeria Police Force":
    "Dokoki da Ƙa'idoji | Rundunar 'Yan Sandan Najeriya",
  "Laws and legislation": "Dokoki da ƙa'idoji",
  "Our Laws and Legal Frameworks": "Dokokinmu da Tsarin Shari'armu",
  "The statutes the Nigeria Police Force works under":
    "Dokokin da Rundunar 'Yan Sandan Najeriya ke aiki a ƙarƙashinsu",
  Legislation: "Doka",
  "Issue date": "Kwanan bayarwa",
  "File size": "Girman fayil",

  // --- traffic offences ----------------------------------------------------
  "Traffic Offences and Penalties": "Laifukan Zirga-zirga da Hukunce-hukuncensu",
  "Traffic Offences and Penalties | Nigeria Police Force":
    "Laifukan Zirga-zirga da Hukunce-hukuncensu | Rundunar 'Yan Sandan Najeriya",
  "Traffic offences, fines and penalty points":
    "Laifukan zirga-zirga, tara da makin hukunci",
  "Learn how penalty points and fines impact your traffic record":
    "Ka san yadda makin hukunci da tara ke shafar rikodin zirga-zirgarka",
  "Learn how penalty points and fines impact your traffic record.":
    "Ka san yadda makin hukunci da tara ke shafar rikodin zirga-zirgarka.",
  "Fines, penalty points and vehicle confiscation periods for traffic violations in Abuja.":
    "Tara, makin hukunci da lokutan kwace mota saboda laifukan zirga-zirga a Abuja.",
  Offence: "Laifi",
  "Fine (₦)": "Tara (₦)",
  "Penalty points": "Makin hukunci",
  Confiscation: "Kwace",
  "Decided by court": "Kotu ce ke yanke hukunci",
  "60 days": "Kwanaki 60",
  "30 days": "Kwanaki 30",

  // categories
  "Offences against road users": "Laifuka kan masu amfani da hanya",
  "Driver conduct": "Halin direba",
  "Vehicle condition": "Yanayin mota",
  "Loads and passengers": "Kaya da fasinjoji",

  // the offences themselves
  "Dangerous driving — driving in a way that endangers the life or safety of other road users":
    "Tuƙi mai haɗari — tuƙi ta hanyar da ke jefa rayuwa ko amincin sauran masu amfani da hanya cikin haɗari",
  "Driving under the influence of alcohol, narcotic or psychotropic substances":
    "Tuƙi bayan shan giya, ƙwayoyi masu sa maye ko makamantansu",
  "Assault on a police officer or road marshal on duty":
    "Cin zarafin jami'in 'yan sanda ko jami'in hanya kan aiki",
  "Route violation — driving against oncoming traffic on a one-way road":
    "Karya hanya — tuƙi gaba da zirga-zirga a hanyar shiga ɗaya",
  "Wrongful overtaking": "Wucewa ba bisa ƙa'ida ba",
  "Exceeding the posted speed limit": "Wuce iyakar gudun da aka sanya",
  "Failure to give way to an ambulance, fire engine or police vehicle under warning":
    "Rashin ba da hanya ga motar asibiti, motar kashe gobara ko motar 'yan sanda mai kaho",
  "Disregarding a traffic light, sign or marking":
    "Ƙin bin fitilar zirga-zirga, alama ko layin hanya",
  "Failure to obey a construction or caution sign at road works":
    "Rashin bin alamar gini ko ta gargaɗi a wurin aikin hanya",
  "Obstructing a carriageway, junction or pedestrian crossing":
    "Toshe hanya, mahaɗa ko mashigar masu tafiya da ƙafa",
  "Leaving the scene of a road traffic crash, or failing to report it":
    "Barin wurin haɗarin hanya, ko rashin bayar da rahotonsa",
  "Using a mobile phone while driving": "Amfani da wayar hannu yayin tuƙi",
  "Driver or front passenger not wearing a seat belt":
    "Direba ko fasinjan gaba bai ɗaura bel ɗin kujera ba",
  "Carrying a child under twelve in the front seat":
    "Ɗaukar yaro ƙasa da shekara goma sha biyu a kujerar gaba",
  "Riding a motorcycle without a crash helmet":
    "Hawan babur ba tare da hular kariya ba",
  "Carrying more than one passenger on a motorcycle":
    "Ɗaukar fasinja fiye da ɗaya a kan babur",
  "Smoking while driving a commercial vehicle":
    "Shan taba yayin tuƙin motar kasuwanci",
  "Driving without a valid driver's licence":
    "Tuƙi ba tare da lasisin tuƙi mai aiki ba",
  "Driving a vehicle with no valid vehicle licence":
    "Tuƙin motar da ba ta da lasisin mota mai aiki",
  "No valid third-party insurance certificate":
    "Babu takardar inshorar ɓangare na uku mai aiki",
  "No valid roadworthiness certificate":
    "Babu takardar shaidar dacewar mota da hanya mai aiki",
  "Number plate missing, obscured, damaged or not of the approved pattern":
    "Lambar mota ta ɓace, an rufe ta, ta lalace ko ba ta salon da aka amince da shi ba",
  "Tinted glass without a permit issued by the Nigeria Police Force":
    "Gilashin mota mai duhu ba tare da izinin Rundunar 'Yan Sandan Najeriya ba",
  "Vehicle not registered with the Central Motor Registry":
    "Ba a yi wa motar rajista a Babbar Rijistar Motoci ba",
  "Mechanically deficient vehicle": "Mota mai lahani na inji",
  "Worn-out or expired tyres": "Tayoyi da suka lalace ko suka ƙare",
  "No spare tyre, jack or wheel spanner":
    "Babu ƙarin taya, jaki ko sifana",
  "No fire extinguisher in a commercial vehicle":
    "Babu na'urar kashe gobara a motar kasuwanci",
  "No caution sign or C-caution triangle carried":
    "Ba a ɗauke da alamar gargaɗi ko alamar C mai kusurwa uku ba",
  "Defective or missing lights, indicators or reflectors":
    "Fitilu, alamun juyawa ko masu haskakawa sun lalace ko sun ɓace",
  "No speed limiting device fitted to a commercial vehicle":
    "Ba a sanya na'urar hana wuce gudu a motar kasuwanci ba",
  "Carrying passengers in excess of the approved capacity":
    "Ɗaukar fasinjoji fiye da adadin da aka amince da shi",
  "Dangerous or unsecured load": "Kaya mai haɗari ko wanda ba a ɗaure ba",
  "Carrying passengers on a goods vehicle or tanker":
    "Ɗaukar fasinjoji a motar kaya ko tanka",
  "Carrying a container without a twist lock on a flatbed vehicle":
    "Ɗaukar kwantena ba tare da kullin juyi ba a motar da ba ta da gefe",

  // --- speed limits --------------------------------------------------------
  "Road Speed Limits": "Iyakokin Gudu a Hanya",
  "Road speed limits": "Iyakokin gudu a hanya",
  "Road Speed Limits | Nigeria Police Force":
    "Iyakokin Gudu a Hanya | Rundunar 'Yan Sandan Najeriya",
  "Speed limits and enforcement thresholds on the roads of the Federal Capital Territory.":
    "Iyakokin gudu da matakan aiwatarwa a kan hanyoyin Babban Birnin Tarayya.",
  "Speed limits on the roads of the Federal Capital Territory, set by the National Road Traffic Regulations and posted on the road itself. The limit depends on the kind of road and on where it runs.":
    "Iyakokin gudu a kan hanyoyin Babban Birnin Tarayya, waɗanda Ƙa'idojin Zirga-zirga na Ƙasa suka tsara kuma aka sanya su a kan hanyar kanta. Iyakar ta dogara ne da irin hanyar da kuma inda take wucewa.",
  "Abuja applies specific speed limits across its roads to ensure safety and smooth traffic flow. These limits vary depending on the type of road and location":
    "Abuja tana sanya iyakokin gudu na musamman a kan hanyoyinta domin tabbatar da aminci da gudanar zirga-zirga cikin sauƙi. Waɗannan iyakoki sun bambanta bisa irin hanyar da wurin",
  "Abuja applies specific speed limits across its roads to ensure safety and smooth traffic flow. These limits vary depending on the type of road and location.":
    "Abuja tana sanya iyakokin gudu na musamman a kan hanyoyinta domin tabbatar da aminci da gudanar zirga-zirga cikin sauƙi. Waɗannan iyakoki sun bambanta bisa irin hanyar da wurin.",
  Road: "Hanya",
  "Limit km/h": "Iyaka km/h",
  "Enforced at km/h": "Ana aiwatarwa a km/h",
};
