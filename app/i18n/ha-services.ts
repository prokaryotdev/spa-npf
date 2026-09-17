/**
 * The service catalogue and every service detail page.
 *
 * This is the largest part of the dictionary because it is the largest part
 * of the site: ninety-odd services, each with fees, documents, channels,
 * hours and terms. The register is the one a reader meets on a service card
 * at a counter — plain, instructional Hausa — not marketing copy.
 *
 * Fee lines, working-day counts and the names of other agencies (FRSC, NYSC,
 * NDLEA, NINAuth) keep their Latin forms, because that is how they are
 * written on the forms people are holding.
 */
export const haServices: Record<string, string> = {
  // --- catalogue chrome ----------------------------------------------------
  "Services | Nigeria Police Force": "Ayyuka | Rundunar 'Yan Sandan Najeriya",
  "{name} | Nigeria Police Force": "{name} | Rundunar 'Yan Sandan Najeriya",
  "Search | Nigeria Police Force": "Nema | Rundunar 'Yan Sandan Najeriya",
  "Service not found | Nigeria Police Force":
    "Ba a sami aikin ba | Rundunar 'Yan Sandan Najeriya",
  "Every Nigeria Police Force service, with its fee, turnaround and who it is for.":
    "Kowane aikin Rundunar 'Yan Sandan Najeriya, tare da kuɗinsa, lokacinsa da wanda aka yi shi domin sa.",
  "All {n} Nigeria Police Force services, with the fee, the turnaround and who each one is for.":
    "Duk ayyukan Rundunar 'Yan Sandan Najeriya {n}, tare da kuɗi, lokaci da wanda aka yi kowanne domin sa.",
  "Search services": "Nemi ayyuka",
  "Search for a service": "Nemi aiki",
  "Search for a service, news or page": "Nemi aiki, labari ko shafi",
  "Search Nigeria Police Force services": "Nemi ayyukan Rundunar 'Yan Sandan Najeriya",
  "Search Nigeria Police Force services, news, events and information.":
    "Nemi ayyuka, labarai, abubuwan da suka faru da bayanan Rundunar 'Yan Sandan Najeriya.",
  "Find a service, a news story, an event or a page.":
    "Nemo aiki, labari, wani abu da zai faru ko shafi.",
  "Certificate, fine, permit…": "Takardar shaida, tara, izini…",
  "Searching…": "Ana nema…",
  "All packages": "Duk ƙunshiyoyi",
  "More services": "Ƙarin ayyuka",
  "browse all services": "duba duk ayyuka",
  "Clear filters": "Share tacewa",
  Clear: "Share",
  "Most used": "Wanda aka fi amfani da shi",
  Package: "Ƙunshi",
  "{n} result for": "Sakamako {n} na",
  "{n} results for": "Sakamako {n} na",
  "{n} suggestion for {q}": "Shawara {n} na {q}",
  "{n} suggestions for {q}": "Shawarwari {n} na {q}",
  "See all results for": "Duba duk sakamako na",
  Suggestions: "Shawarwari",
  "Showing {shown} of {total} services": "Ana nuna {shown} daga ayyuka {total}",
  "No service matches those filters. Try clearing one of them, or":
    "Babu aikin da ya dace da waɗannan taceƙa. Ka gwada share ɗaya daga cikinsu, ko",
  "Nothing matched. Try a shorter term, or browse the":
    "Babu abin da ya dace. Ka gwada kalma gajera, ko ka duba",
  ". Try a shorter word, or": ". Ka gwada kalma gajera, ko",
  "Related services": "Ayyuka masu alaƙa",
  "Need help": "Kana buƙatar taimako",
  "contact us": "tuntuɓe mu",

  // --- packages ------------------------------------------------------------
  "Inquiries and Follow-up": "Tambayoyi da Bibiya",
  "Criminal Reports and Complaints": "Rahotannin Laifuka da Ƙorafe-ƙorafe",
  "Permits and Certificates": "Izini da Takardun Shaida",
  "Traffic Services": "Ayyukan Zirga-zirga",
  "Business and Corporate": "Kasuwanci da Kamfanoni",
  "Community Engagement": "Haɗin Kai da Al'umma",
  "Emergency and Response": "Gaggawa da Amsawa",
  "Support and Emergency Response": "Taimako da Amsa Gaggawa",
  "Suppliers Services": "Ayyukan Masu Kawo Kaya",
  "Diplomatic Services": "Ayyukan Jakadanci",
  "Retirees Support": "Tallafin Masu Ritaya",
  "Tourists Support": "Tallafin Masu Yawon Buɗe Ido",
  "Women Protection": "Kare Mata",
  "Child Protection": "Kare Yara",
  "Persons with Disabilities Support": "Tallafin Masu Naƙasa",
  "Nigeria Police Force Pensioners": "Masu Ritaya na Rundunar 'Yan Sandan Najeriya",

  // --- service card labels -------------------------------------------------
  "Start Service": "Fara Aiki",
  Apply: "Nema",
  Inquire: "Tambaya",
  View: "Duba",
  Report: "Bayar da Rahoto",
  Proceed: "Ci gaba",
  "Track it": "Bi diddiginsa",
  "Sign in to {action}": "Ka shiga domin {action}",
  "NINAuth sign-in required": "Ana buƙatar shiga da NINAuth",
  "Open request {ref}": "Buƙatar da ke buɗe {ref}",
  "You already have this open — status: {status}":
    "Kana da wannan a buɗe — matsayi: {status}",
  "Request opened": "An buɗe buƙata",
  "What you need": "Abin da kake buƙata",
  "Who it is for": "Wanda aka yi shi domin sa",
  "Where to use it": "Inda za a yi amfani da shi",
  "How you receive it": "Yadda za ka same shi",
  "Working hours": "Lokutan aiki",
  "Terms and conditions": "Sharuɗɗa da ƙa'idoji",
  "Service Fees": "Kuɗin Hidima",
  Fees: "Kuɗi",
  Duration: "Tsawon lokaci",
  Payable: "Abin biya",
  "Processed in {turnaround}": "Ana gudanar da shi cikin {turnaround}",
  "Takes about {turnaround} once submitted":
    "Yana ɗaukar kimanin {turnaround} bayan an gabatar",
  "{fee} payable on approval": "{fee} abin biya idan an amince",
  "No fee": "Babu kuɗi",
  "No Documents Required": "Ba a Buƙatar Takardu",
  Instant: "Nan take",
  "1 Working Day": "Ranar Aiki 1",
  "2 Working Days": "Ranakun Aiki 2",
  "3 Working Days": "Ranakun Aiki 3",
  "4 Working Days": "Ranakun Aiki 4",
  "5 Working Days": "Ranakun Aiki 5",
  "30 Working Days": "Ranakun Aiki 30",
  "1 Month": "Wata 1",
  "Digital Channels": "Hanyoyin Dijital",
  "Police Stations": "Ofisoshin 'Yan Sanda",
  "Divisional Police Stations": "Ofisoshin 'Yan Sanda na Sassa",
  "Live Chat": "Tattaunawa Kai Tsaye",
  "Call Centre": "Cibiyar Kira",
  "P.O. Box": "Akwatin Gidan Waya",
  Email: "Imel",
  "Email Address": "Adireshin Imel",
  "Phone Number": "Lambar Waya",
  Name: "Suna",
  Remarks: "Kalamai",
  "Quote reference": "Lambar tuntuɓa",
  "I am": "Ni ne",
  Anyone: "Kowa",
  Individuals: "Mutane",
  Citizen: "Ɗan ƙasa",
  Resident: "Mazauni",
  Visitors: "Masu ziyara",
  Students: "Ɗalibai",
  "School Students": "Ɗaliban Makaranta",
  "General Public": "Jama'a Baki Ɗaya",
  "Job Seekers": "Masu Neman Aiki",
  "Police Officers": "Jami'an 'Yan Sanda",
  "Customs Personnel": "Ma'aikatan Kwastam",
  "NDLEA Personnel": "Ma'aikatan NDLEA",
  "Personnel Of Armed Forces And Border Crossings":
    "Ma'aikatan Rundunonin Tsaro da Mashigar Kan Iyaka",
  "Law Firms": "Kamfanonin Lauyoyi",
  "Gold Shops": "Shagunan Zinariya",
  "Banking Sector": "Ɓangaren Banki",
  "Business Sector": "Ɓangaren Kasuwanci",
  "Business sector": "Ɓangaren kasuwanci",
  Business: "Kasuwanci",
  "Governmental Entities": "Hukumomin Gwamnati",
  "Diplomatic Organizations": "Ƙungiyoyin Jakadanci",
  "Inspection Equipment Specialists": "Ƙwararrun Kayan Bincike",
  Other: "Sauran",
  Recent: "Kwanan nan",

  // --- payment -------------------------------------------------------------
  Cash: "Tsabar kuɗi",
  "Credit Card": "Katin Kiredit",
  "Debit Card": "Katin Debit",
  "Rescue Me app": "Manhajar Ku Cece Ni",
  "Permit Fee": "Kuɗin Izini",
  "Certificate Fees": "Kuɗin Takardar Shaida",
  "Processing Fee": "Kuɗin Sarrafawa",
  "Processing Fees": "Kuɗin Sarrafawa",
  "Processing fee": "Kuɗin sarrafawa",
  "processing fee": "kuɗin sarrafawa",
  "processing fee (per violation)": "kuɗin sarrafawa (kowane laifi)",
  "Technology Levy": "Harajin Fasaha",
  "Technology Levies": "Harajin Fasaha",
  "Technology levy": "Harajin fasaha",
  "technology levy": "harajin fasaha",
  "technology levy (per violation)": "harajin fasaha (kowane laifi)",
  "Processing and Technology Levies": "Kuɗin Sarrafawa da Harajin Fasaha",
  "Stamp Duty": "Harajin Tambari",
  "stamp duty": "harajin tambari",
  "Per Kilogram": "Kowane Kilogiram",
  "per day for each barrier": "kowace rana ga kowace shinge",
  "From ₦8,000": "Daga ₦8,000",
  "From ₦38,000": "Daga ₦38,000",
  "From ₦48,000": "Daga ₦48,000",
  "Fees paid and non-refundable": "An biya kuɗi kuma ba a mayarwa",
  "Certificate fee if requested": "Kuɗin takardar shaida idan an nema",
  "Fast Track": "Hanya Mai Sauri",
  "Additional fee if applied through service centers in person":
    "Ƙarin kuɗi idan an nema a cibiyar hidima da kai",
  "An additional fee if the application is submitted in person at a police station":
    "Ƙarin kuɗi idan an gabatar da buƙatar da kai a ofishin 'yan sanda",
  "An additional fee applies if the application is submitted in person at a police station":
    "Ana ƙara kuɗi idan an gabatar da buƙatar da kai a ofishin 'yan sanda",

  // --- documents commonly asked for ---------------------------------------
  "NIN slip": "Takardar NIN",
  "NIN (Valid)": "NIN (Mai aiki)",
  "A copy of NIN": "Kwafin NIN",
  "A Copy of NIN": "Kwafin NIN",
  "Copy of NIN slip or Passport": "Kwafin takardar NIN ko Fasfo",
  "Copy of the owner's NIN": "Kwafin NIN na mai shi",
  "Copy of the applicant's NIN": "Kwafin NIN na mai neman",
  "A copy of the NIN slip (the beneficiary of the cheque -client)":
    "Kwafin takardar NIN (mai amfana da cak — abokin ciniki)",
  "A copy of the NIN slip (the beneficiary of the cheque - client)":
    "Kwafin takardar NIN (mai amfana da cak — abokin ciniki)",
  "Passport copy": "Kwafin fasfo",
  "Passport + NIN (valid)": "Fasfo + NIN (mai aiki)",
  "Personal photo": "Hoton kai",
  "personal photo": "hoton kai",
  "Coloured Personal Photo": "Hoton Kai Mai Launi",
  "Curriculum Vitae": "Takardar Bayanan Aiki",
  "Birth Certificate": "Takardar Shaidar Haihuwa",
  "birth certificate": "takardar shaidar haihuwa",
  "Driver's license": "Lasisin tuƙi",
  "Driver's License (if available)": "Lasisin Tuƙi (idan akwai)",
  "driving license (if available)": "lasisin tuƙi (idan akwai)",
  "Trade License": "Lasisin Kasuwanci",
  "Trade license": "Lasisin kasuwanci",
  "Trading License": "Lasisin Kasuwanci",
  "Professional License": "Lasisin Sana'a",
  "Security License": "Lasisin Tsaro",
  "Private Guard Company licence": "Lasisin Kamfanin Tsaro Mai Zaman Kansa",
  "Power of Attorney": "Wakilcin Shari'a",
  "Power of Attorney (POA)": "Wakilcin Shari'a (POA)",
  "Power of Attorney (if applicable)": "Wakilcin Shari'a (idan ya dace)",
  "Approved signature": "Sa hannun da aka amince da shi",
  "POA e-Signature": "Sa Hannun Lantarki na POA",
  "POA Association": "Haɗa Wakilcin Shari'a",
  "Trust receipt": "Rasit ɗin amana",
  "Court's ruling": "Hukuncin kotu",
  "Family declaration": "Sanarwar iyali",
  "Family declaration (family information)": "Sanarwar iyali (bayanan iyali)",
  " Family declaration (family information)": " Sanarwar iyali (bayanan iyali)",
  "family declaration": "sanarwar iyali",
  "Copy of previous residence visa": "Kwafin bizar zama ta baya",
  "Area Council letter": "Wasiƙar Ƙaramar Hukuma",
  "FRSC permit": "Izinin FRSC",
  "FRSC letter": "Wasiƙar FRSC",
  "FRSC permit (if filming is on the road)":
    "Izinin FRSC (idan ana ɗaukar hoto a kan hanya)",
  "FRSC permit (if the event will take place on a road)":
    "Izinin FRSC (idan taron zai gudana a kan hanya)",
  "FCT Sports Council's permit": "Izinin Hukumar Wasanni ta FCT",
  "FCT Administration's permit": "Izinin Hukumar FCT",
  "FCT Department of Tourism's permit":
    "Izinin Sashen Yawon Buɗe Ido na FCT",
  "Nigeria Security and Civil Defence Corps permit":
    "Izinin Hukumar Tsaron Farar Hula ta Najeriya",
  "National Film and Video Censors Board permit":
    "Izinin Hukumar Tantance Fina-finai ta Ƙasa",
  "Establishment's Permit/ Shopping Mall permit":
    "Izinin Kafa/Izinin Cibiyar Sayayya",
  "NYSC certificate or exemption": "Takardar NYSC ko ta keɓewa",
  "academic qualification": "takardar ilimi",
  "experience certificates (if available)": "takardun gogewa (idan akwai)",
  "Experience Certificates (if applicable)": "Takardun Gogewa (idan ya dace)",
  "required English language certificates":
    "takardun harshen Ingilishi da ake buƙata",
  "Certificates of educational qualification certified by official authorities":
    "Takardun shaidar ilimi da hukumomin gwamnati suka tabbatar",
  "Attaching Documents": "Haɗa Takardu",
  "Document Verification": "Tabbatar da Takarda",
  "Uploaded documents must be relevant to the application.":
    "Takardun da aka ɗora dole su shafi buƙatar.",

  // --- service names -------------------------------------------------------
  "Application Status": "Matsayin Buƙata",
  "Apply for a Job": "Nemi Aiki",
  "Submit an Inquiry": "Gabatar da Tambaya",
  "Request a Certificate": "Nemi Takardar Shaida",
  "Request a Permit": "Nemi Izini",
  "Clearance Certificate": "Takardar Shaidar Tsabta",
  "Police Clearance Certificate": "Takardar Shaidar Tsabtar Rikodi",
  "police clearance certificate": "takardar shaidar tsabtar rikodi",
  "Traffic Clearance Certificate": "Takardar Shaidar Tsabtar Zirga-zirga",
  "TWIMC Certificate": "Takardar Shaida ga Duk Wanda Abin Ya Shafa",
  "TWIMC Inmate Certificate":
    "Takardar Shaidar Ɗan Kurkuku ga Duk Wanda Abin Ya Shafa",
  "Fines Inquiry and Payment": "Tambaya da Biyan Tara",
  "Pay Traffic Fines": "Biya Tarar Zirga-zirga",
  "Report Criminal Complaint": "Bayar da Rahoton Ƙorafin Laifi",
  "File Criminal Complaint": "Shigar da Ƙorafin Laifi",
  "Reporting E-Crime": "Bayar da Rahoton Laifin Yanar Gizo",
  "Report Found Item": "Bayar da Rahoton Abin da Aka Samu",
  "Digital Experience for Lost & Found":
    "Hidimar Dijital ta Ɓatattu da Waɗanda Aka Samu",
  "Bounce Cheque Report": "Rahoton Cak ɗin da Ya Faskara",
  "Bounce Cheque Report for Banks": "Rahoton Cak ɗin da Ya Faskara ga Bankuna",
  "Minor Traffic Accident Report": "Rahoton Ƙaramin Haɗarin Zirga-zirga",
  "Traffic Accident Reports": "Rahotannin Haɗarin Zirga-zirga",
  "Unknown Accident Report": "Rahoton Haɗari Marar Sani",
  "Report a Vehicle or Driver": "Bayar da Rahoton Mota ko Direba",
  "Report Traffic Offences or Irresponsible Driver":
    "Bayar da Rahoton Laifukan Zirga-zirga ko Direba Mara Kula",
  "Reporting Vehicle Obstruction": "Bayar da Rahoton Motar da Ta Toshe Hanya",
  "Change Vehicle Color Permit": "Izinin Canza Launin Mota",
  "Night Work Permit": "Izinin Aikin Dare",
  "Road Closure Permit": "Izinin Rufe Hanya",
  "Corpse Entry Permit": "Izinin Shigar da Gawa",
  "Police Museum Visit Permit": "Izinin Ziyartar Gidan Tarihi na 'Yan Sanda",
  "Visit a Detainee or Inmate Permit":
    "Izinin Ziyartar Wanda Ake Tsare ko Ɗan Kurkuku",
  "Sailing Permit": "Izinin Tafiya a Ruwa",
  "Events Security": "Tsaron Taro",
  "Security Barriers Rental": "Hayar Shingayen Tsaro",
  "Destroy Explosive Materials": "Halaka Kayan Fashewa",
  "Gold Trade Security Audit": "Binciken Tsaron Cinikin Zinariya",
  "Sport Facilities Booking": "Yin Ajiyar Wuraren Wasanni",
  "Public Tenders": "Kwangilar Gwamnati",
  "Supplier Application": "Neman Zama Mai Kawo Kaya",
  "Registration of law firms": "Rajistar kamfanonin lauyoyi",
  "Criminal Circulars Suspension": "Dakatar da Sanarwar Laifi",
  "Circulars and travel bans": "Sanarwa da haramcin tafiya",
  "Diplomatic Affairs Services": "Ayyukan Harkokin Jakadanci",
  "Diplomatic Information Exchange": "Musayar Bayanan Jakadanci",
  "Medical Treatment Extension": "Ƙara Lokacin Jinya",
  "Critical Care Response": "Amsa Kulawa ta Gaggawa",
  "Emergency Case Request (SOS)": "Buƙatar Gaggawa (SOS)",
  "On-Site Police Support": "Taimakon 'Yan Sanda a Wurin",
  "Request to Contact The Police": "Buƙatar Tuntuɓar 'Yan Sanda",
  "Share Information": "Raba Bayani",
  "Smart Home Security": "Tsaron Gida na Zamani",
  "Neighbourhood Police": "'Yan Sandan Unguwa",
  "Community Activities Participation": "Shiga Ayyukan Al'umma",
  "Community Volunteering": "Aikin Sa Kai na Al'umma",
  "Volunteer Platform": "Dandalin Aikin Sa Kai",
  "Drug Awareness Lecture": "Laccar Wayar da Kai kan Ƙwayoyi",
  "Public Lecture": "Laccar Jama'a",
  "Request a Lecture or Training Course": "Nemi Lacca ko Horo",
  "Traffic Training Courses": "Kwasa-kwasan Horon Zirga-zirga",
  "Student Awareness": "Wayar da Kan Ɗalibai",
  "Provide Care for Human Trafficking Victims":
    "Bayar da Kulawa ga Waɗanda Aka Yi wa Fataucin Mutane",
  "Contact Police Research Council": "Tuntuɓi Majalisar Binciken 'Yan Sanda",
  "NPF Leaders At Your Service": "Shugabannin NPF a Hidimarka",
  "NPF Personnel Welfare and Support": "Jin Daɗi da Tallafin Ma'aikatan NPF",
  "NPF leadership": "shugabancin NPF",
  "Request Nigeria Police Force Activities":
    "Nemi Ayyukan Rundunar 'Yan Sandan Najeriya",
  "Summit Statistics": "Ƙididdigar Taro",
  "Worker’s Voice": "Muryar Ma'aikaci",
  "Gallantry Award": "Kyautar Jarumta",
  "On-The-Go": "A Kan Tafiya",

  // --- short field labels --------------------------------------------------
  Fraud: "Zamba",
  Forgery: "Jabu",
  "Breach of Trust": "Karya Amana",
  "Defamation and Insult": "Ɓata Suna da Zagi",
  Meals: "Abinci",
  "Course name": "Sunan kwas",
  "Course's name": "Sunan kwas",
  "Course Language": "Harshen Kwas",
  "Course's location": "Wurin kwas",
  "Course details (Individuals)": "Bayanan kwas (Mutane)",
  "Course details (Business sector)": "Bayanan kwas (Ɓangaren kasuwanci)",
  "Coordinator's information (Business sector)":
    "Bayanan mai daidaitawa (Ɓangaren kasuwanci)",
  "Proposed course time": "Lokacin kwas da aka gabatar",
  "Proposed time for the course": "Lokacin da aka gabatar don kwas",
  "Proposed start date of the course": "Ranar fara kwas da aka gabatar",
  "Proposed end date of the course": "Ranar ƙarshen kwas da aka gabatar",
  "Company's name": "Sunan kamfani",
  "Vehicle's number": "Lambar mota",
  "Vehicle driver's details (NIN)": "Bayanan direban mota (NIN)",
  "The vessel's details (plate number + plate code)":
    "Bayanan jirgin ruwa (lambar faranti + lambar yanki)",
  "Crew's details (NINs)": "Bayanan ma'aikatan jirgi (NIN)",
  "Passengers' details (NINs)": "Bayanan fasinjoji (NIN)",
  "Outside volunteers' NINs": "NIN na masu sa kai daga waje",
  "A list of workers' names": "Jerin sunayen ma'aikata",
  "The user's email address": "Adireshin imel na mai amfani",
  "The event's time": "Lokacin taron",
  "The event's program": "Shirin taron",
  "The event's geolocation": "Wurin taron",
  "Schedule of events": "Jadawalin abubuwan da za su faru",
  "Expected number of attendees": "Adadin masu halarta da ake tsammani",
  "Expected VIP attendees": "Manyan baƙi da ake tsammani",
  "Accused information": "Bayanan wanda ake tuhuma",
  "Defendant's information": "Bayanan wanda ake ƙara",
  "Method used in the fraud": "Hanyar da aka bi wajen zamba",
  "Fraudulent transaction details": "Bayanan mu'amalar zamba",
  "Transferred amount and destination": "Adadin da aka tura da inda aka tura",
  "Identifying the destination": "Gano inda ake nufi",
  "Identifying the port of arrival": "Gano tashar isowa",
  "Identifying the port of departure": "Gano tashar tashi",
  "Identifying the date and time of departure": "Gano kwanan wata da lokacin tashi",
  "Identifying the trip's date and time of completion":
    "Gano kwanan wata da lokacin kammala tafiya",
  "A copy of the bounced cheque": "Kwafin cak ɗin da ya faskara",
  "A copy of the legal attorney": "Kwafin wakilcin shari'a",
  "The bank's notice for bounced cheque":
    "Sanarwar banki kan cak ɗin da ya faskara",
  "Copy of the Bill of Lading": "Kwafin takardar kaya",
  "Proof of possession/customs paper": "Shaidar mallaka/takardar kwastam",
  "Deceased ID copy or Passport copy": "Kwafin shaidar marigayi ko kwafin fasfo",
  "A document proving the Cybercrime": "Takardar da ke tabbatar da laifin yanar gizo",
  "Letter from the requesting party": "Wasiƙa daga mai neman",
  "An official letter from the requesting party": "Wasiƙar hukuma daga mai neman",
  "Certified legal auditor's report": "Rahoton mai duba shari'a da aka tabbatar",
  "Documents relevant to the inquiry or remark":
    "Takardun da suka shafi tambaya ko kalami",
  "Traffic Code": "Lambar Zirga-zirga",
  "Traffic code": "Lambar zirga-zirga",
  "Testing data": "Bayanan gwaji",
  "9:00am-12:00pm": "9:00 na safe – 12:00 na rana",
  "7:30 am-10:00 pm": "7:30 na safe – 10:00 na dare",
  "Monday - Thursday 9:00AM - 14:00PM Friday 9:00AM - 11:00AM":
    "Litinin – Alhamis 9:00 na safe – 14:00 na rana, Juma'a 9:00 na safe – 11:00 na safe",
  "General Department of Human Rights 7:30 - 15:30":
    "Babban Sashen Haƙƙin Ɗan Adam 7:30 – 15:30",
  "General Department of Organization Protective Security and Emergency 7:30 -15:30":
    "Babban Sashen Tsaron Kariya na Ƙungiyoyi da Gaggawa 7:30 – 15:30",
  "Traffic Institute Department in General Traffic Department - Wuse : 7:30am - 3:30pm":
    "Sashen Cibiyar Zirga-zirga a Babban Sashen Zirga-zirga — Wuse: 7:30 na safe – 3:30 na yamma",
  "General Traffic Department (Garki - Asokoro) from Monday to Thursday 07:30 - 15:30 and on Friday from 07:30 - 12:00":
    "Babban Sashen Zirga-zirga (Garki – Asokoro) daga Litinin zuwa Alhamis 07:30 – 15:30 kuma ranar Juma'a daga 07:30 – 12:00",
  "General Traffic Department (Garki - Asokoro) from Monday to Thursday 07:30 - 15:30 and on Friday from 07:30 - 12:00…":
    "Babban Sashen Zirga-zirga (Garki – Asokoro) daga Litinin zuwa Alhamis 07:30 – 15:30 kuma ranar Juma'a daga 07:30 – 12:00…",
  "Dei-Dei Police Station 7:30 - 22:00 Wuse Police Station 7:30 - 22:00 Airport Police Station 7:30 - 22:00 Karu…":
    "Ofishin 'Yan Sandan Dei-Dei 7:30 – 22:00, Ofishin 'Yan Sandan Wuse 7:30 – 22:00, Ofishin 'Yan Sandan Filin Jirgi 7:30 – 22:00, Karu…",

  // --- who and where -------------------------------------------------------
  "from Outside Nigeria": "daga Wajen Najeriya",
  "From outside Nigeria": "Daga wajen Najeriya",
  "Business and Corporates": "Kasuwanci da Kamfanoni",
  "Complaint Response Unit": "Sashen Amsa Ƙorafe-ƙorafe",
  "Abroad Health Authorities": "Hukumomin Lafiya na Ƙasashen Waje",
  "General Department of Criminal Investigation (CID)'s permit":
    "Izinin Babban Sashen Binciken Laifuka (CID)",
  "{name} from Nigeria Police Force.": "{name} daga Rundunar 'Yan Sandan Najeriya.",

  // --- short service summaries --------------------------------------------
  "Cybercrime supports digital well-being":
    "Sashen Laifukan Yanar Gizo yana tallafa wa lafiyar rayuwa a yanar gizo",
  "A proactive approach to ensures public safety":
    "Hanya ta shirin gaba domin tabbatar da tsaron jama'a",
  "Manage and pay traffic violations on your vehicle or license":
    "Ka kula ka kuma biya laifukan zirga-zirga a kan motarka ko lasisinka",
  "A Service to request immediate support from specialized teams":
    "Hidima ta neman taimako nan take daga tawagogi na musamman",
  "A service to file various crime reports and related complaints":
    "Hidima ta shigar da rahotannin laifuka daban-daban da ƙorafe-ƙorafen da suka danganta",
  "Share information with police to support public and community safety":
    "Ka raba bayani da 'yan sanda domin tallafa wa tsaron jama'a da al'umma",
  "Comprehensive service for applications status, Reports, and inquiries":
    "Cikakkiyar hidima ta matsayin buƙatu, rahotanni da tambayoyi",
  "Connect with NPF leadership or relevant specialists in related fields":
    "Ka haɗu da shugabancin NPF ko ƙwararrun da suka dace a fannonin da abin ya shafa",
  "A medical and social care service for Nigeria Police Force's employees":
    "Hidimar kula da lafiya da zamantakewa ga ma'aikatan Rundunar 'Yan Sandan Najeriya",
  "Serving various events and requests that require on-site police support":
    "Yin hidima ga taruka da buƙatu daban-daban da ke buƙatar taimakon 'yan sanda a wurin",
  "To arrange lectures, courses, and specialised workshops in various fields":
    "Domin shirya laccoci, kwasa-kwasai da bita na musamman a fannoni daban-daban",
  "A service for business suppliers, allows registration for police's tenders":
    "Hidima ga masu kawo kaya, tana ba da damar yin rajista don kwangilar 'yan sanda",
  "To obtain official report on a traffic accident for various legal purposes":
    "Domin samun rahoton hukuma kan haɗarin zirga-zirga don dalilai daban-daban na shari'a",
  "A service enables job seekers to apply to vacancies at Nigeria Police Force":
    "Hidima da ke ba masu neman aiki damar nema a guraben aiki a Rundunar 'Yan Sandan Najeriya",
  "A Service to obtain various official permits issued by Nigeria Police Force":
    "Hidima ta samun izini daban-daban na hukuma da Rundunar 'Yan Sandan Najeriya ke bayarwa",
  "A Service to obtain various official certificates issued by Nigeria Police Force":
    "Hidima ta samun takardun shaida daban-daban na hukuma da Rundunar 'Yan Sandan Najeriya ke bayarwa",
  "A service that provides security support and facilities to diplomatic entities":
    "Hidima da ke bayar da taimakon tsaro da kayan aiki ga hukumomin jakadanci",
  "Service to join volunteering initiatives or other Nigeria Police Force's initiatives":
    "Hidima ta shiga shirye-shiryen aikin sa kai ko wasu shirye-shiryen Rundunar 'Yan Sandan Najeriya",
  "Report dangerous driving, improper lane changes, or aggressive behavior on the road.":
    "Ka bayar da rahoton tuƙi mai haɗari, canza layi ba daidai ba, ko hali na tashin hankali a kan hanya.",
  "Report obstructing vehicles and misuse of traffic rules":
    "Ka bayar da rahoton motocin da suka toshe hanya da karya dokokin zirga-zirga",
  "Issuing a Fine for the Liable Party": "Bayar da Tara ga Wanda Laifin Ya Rataya a Wuyansa",

  // --- terms and conditions ------------------------------------------------
  "The applicant must be at least 18 years old.":
    "Dole mai neman ya kai shekara 18 aƙalla.",
  "The applicant must not be under 18 years old and not above 28 years old":
    "Dole mai neman kada ya gaza shekara 18 kuma kada ya wuce shekara 28",
  "The service is only available to children under 18 years old only.":
    "Ana bayar da wannan hidima ga yara ƙasa da shekara 18 kaɗai.",
  "The applicant must have a driver's license": "Dole mai neman ya kasance da lasisin tuƙi",
  "Must possess a valid driving license.": "Dole ya kasance da lasisin tuƙi mai aiki.",
  "Driving license must be issued from Abuja": "Dole a bayar da lasisin tuƙi daga Abuja",
  "Vehicle must be registered in Abuja": "Dole a yi wa motar rajista a Abuja",
  "The applicant must have a clear criminal record":
    "Dole mai neman ya kasance da rikodin laifi mai tsafta",
  "The criminal record must be clear of any offenses or violations.":
    "Dole rikodin laifi ya kasance babu wani laifi ko karya doka.",
  "Must hold a high school diploma or higher, officially accredited.":
    "Dole ya kasance da takardar sakandare ko sama da haka, wadda hukuma ta amince da ita.",
  "Must have successfully completed NYSC or hold an official exemption.":
    "Dole ya kammala NYSC cikin nasara ko ya kasance da takardar keɓewa ta hukuma.",
  "The applicant must have completed NYSC or hold an official exemption":
    "Dole mai neman ya kammala NYSC ko ya kasance da takardar keɓewa ta hukuma",
  "NYSC discharge certificate or certificate of exemption (To Whom It May Concern) for males":
    "Takardar kammala NYSC ko takardar keɓewa (Ga Duk Wanda Abin Ya Shafa) ga maza",
  "The applicant's height must not be less than 165cm for males and not less than 155 for females":
    "Tsayin mai neman kada ya gaza cm 165 ga maza kuma kada ya gaza cm 155 ga mata",
  "The applicant must hold a high school certificate or higher certified by the official authorities":
    "Dole mai neman ya kasance da takardar sakandare ko sama da haka wadda hukumomin gwamnati suka tabbatar",
  "You can apply through a valid or expired NIN":
    "Za ka iya nema da NIN mai aiki ko wanda ya ƙare",
  "Register for the service or log in through NINAuth":
    "Ka yi rajistar hidimar ko ka shiga ta NINAuth",
  "Requests must be submitted by tourists or visitors":
    "Dole masu yawon buɗe ido ko baƙi su gabatar da buƙatu",
  "The service is limited to tourist-related matters only":
    "Wannan hidima ta taƙaita ne ga al'amuran yawon buɗe ido kaɗai",
  "This service is to be used for emergency cases only":
    "Ana amfani da wannan hidima don lamurran gaggawa kaɗai",
  "This service may not be used for experimentation":
    "Ba a yarda a yi amfani da wannan hidima don gwaji ba",
  "This permit may not be used for commercial activities":
    "Ba a yarda a yi amfani da wannan izini don harkokin kasuwanci ba",
  "This permit is valid for one month.": "Wannan izini yana aiki har wata ɗaya.",
  "The permit is valid for 1 month from the date of issuance":
    "Izinin yana aiki har wata ɗaya daga ranar bayar da shi",
  "The permit is valid for a maximum of fourteen days from the start date specified in the application.":
    "Izinin yana aiki har ƙarshe kwanaki goma sha huɗu daga ranar farawa da aka bayyana a buƙatar.",
  "The certificate is valid for one month from issuance date":
    "Takardar shaidar tana aiki har wata ɗaya daga ranar bayar da ita",
  "The certificate is valid for 1 month from the date of issuance":
    "Takardar shaidar tana aiki har wata ɗaya daga ranar bayar da ita",
  "The certificate is valid for 3 months from the date of issuance":
    "Takardar shaidar tana aiki har watanni uku daga ranar bayar da ita",
  "The certificate is valid for three months from the date of issuance":
    "Takardar shaidar tana aiki har watanni uku daga ranar bayar da ita",
  "The certificate is valid for three months from the date of issuance.":
    "Takardar shaidar tana aiki har watanni uku daga ranar bayar da ita.",
  "The report is valid for 3 months from the date of issuance":
    "Rahoton yana aiki har watanni uku daga ranar bayar da shi",
  "Incident must occur within the Federal Capital Territory.":
    "Dole lamarin ya faru a cikin Babban Birnin Tarayya.",
  "Incident must occur in the geographical boundaries of Abuja":
    "Dole lamarin ya faru a cikin iyakokin ƙasa na Abuja",
  "Incident must occur in the geographical boundaries of Abuja.":
    "Dole lamarin ya faru a cikin iyakokin ƙasa na Abuja.",
  "The incident reported must have occurred in the Federal Capital Territory":
    "Dole lamarin da aka bayar da rahotonsa ya faru a Babban Birnin Tarayya",
  "The incident must occur within the geographical boundaries of the Federal Capital Territory.":
    "Dole lamarin ya faru a cikin iyakokin ƙasa na Babban Birnin Tarayya.",
  "The incident must have occurred within the geographical boundaries of the Federal Capital Territory":
    "Dole lamarin ya faru a cikin iyakokin ƙasa na Babban Birnin Tarayya",
  "The accident must have occurred within the geographical limits of the Federal Capital Territory.":
    "Dole haɗarin ya faru a cikin iyakokin ƙasa na Babban Birnin Tarayya.",
  "Request can only be made for accidents that occurred within the geographical limits of the":
    "Ana iya yin buƙata ne kawai don haɗuran da suka faru a cikin iyakokin ƙasa na",
  "The lost items must be within the geographical boundaries of the Federal Capital Territory":
    "Dole abubuwan da suka ɓace su kasance a cikin iyakokin ƙasa na Babban Birnin Tarayya",
  "The cheque must be received in the Federal Capital Territory":
    "Dole a karɓi cak ɗin a Babban Birnin Tarayya",
  "Shops must be located within the geographical scope of Abuja.":
    "Dole shaguna su kasance a cikin iyakokin ƙasa na Abuja.",
  "Incident time and jurisdiction area (Abuja)":
    "Lokacin lamarin da yankin hukuncin (Abuja)",
  "There must be an open report at the police station.":
    "Dole a sami rahoton da ke buɗe a ofishin 'yan sanda.",
  "There must be no existing court rulings on the same case":
    "Kada a sami hukuncin kotu da ya rigaya kan shari'a ɗaya",
  "There must be no existing court rulings on the same case.":
    "Kada a sami hukuncin kotu da ya rigaya kan shari'a ɗaya.",
  "There must be no dispute about the case with the relevant authorities.":
    "Kada a sami rikici kan shari'ar da hukumomin da abin ya shafa.",
  "The complaint must be irrelevant to the custody, financial support or visitations.":
    "Dole ƙorafin kada ya shafi kula da yaro, tallafin kuɗi ko ziyara.",
  "There is no pending labor dispute before the Labour Court.":
    "Babu rikicin ma'aikata da ke jiran hukunci a Kotun Ma'aikata.",
  "There are no criminal or absconding reports filed against the Labour by the sponsor.":
    "Babu rahotannin laifi ko gudu da mai ɗaukar aiki ya shigar kan ma'aikacin.",
  "The worker's residency permit is issued by the Federal Capital Territory.":
    "Babban Birnin Tarayya ne ke bayar da izinin zaman ma'aikacin.",
  "Applications that fail to follow terms and conditions will not be accepted.":
    "Ba za a karɓi buƙatun da ba su bi sharuɗɗa da ƙa'idoji ba.",
  "The applicant is responsible for ensuring the accuracy of the information submitted":
    "Mai neman ne ke da alhakin tabbatar da daidaiton bayanan da ya gabatar",
  "The applicant is fully responsible for any unlawful use or misuse of the provided service.":
    "Mai neman ne ke da cikakken alhakin duk wani amfani da ya saɓa doka ko cin zarafin hidimar da aka bayar.",
  "Important Notice: misuse of this service may result in legal actions taken against you.":
    "Sanarwa Muhimmi: cin zarafin wannan hidima na iya jawo ɗaukar matakin shari'a a kanka.",
  "The misuse of this certificate will lead to legal action taken against you":
    "Cin zarafin wannan takardar shaida zai jawo ɗaukar matakin shari'a a kanka",
  "The following must be confirmed and duly accepted as responsibilities":
    "Dole a tabbatar da abubuwan da ke ƙasa a kuma karɓe su a matsayin nauyi",
  "Confidentiality (bank data may only be disclosed for investigation purposes)":
    "Sirri (ana iya bayyana bayanan banki don dalilin bincike kaɗai)",
  "Visitor needs proof of kinship with the detainee if its a drug related case":
    "Mai ziyara yana buƙatar shaidar dangantaka da wanda ake tsare idan shari'ar ta shafi ƙwayoyi",
  "If the visitor is from outside Nigeria, he or she must present evidence of kinship with the inmate":
    "Idan mai ziyara daga wajen Najeriya ne, dole ya gabatar da shaidar dangantaka da ɗan kurkukun",
  "If the certificate is requested from outside Nigeria, the applicant must have previously entered Nigeria":
    "Idan an nemi takardar shaidar daga wajen Najeriya, dole mai neman ya taɓa shiga Najeriya a baya",
  "If the applicant is outside Nigeria and does not have a ten-print fingerprint they must send a ten-print fingerprint copy certified by the Nigerian Embassy":
    "Idan mai neman yana wajen Najeriya kuma ba shi da zanan yatsu goma, dole ya aika kwafin zanan yatsu goma da Ofishin Jakadancin Najeriya ya tabbatar",
  "Online payments are accepted from within Nigeria and ECOWAS countries only using local proxies":
    "Ana karɓar biyan kuɗi ta kan layi daga cikin Najeriya da ƙasashen ECOWAS kaɗai ta amfani da hanyoyin cikin gida",
  "Credit and Debit Cards issued from outside Nigeria and ECOWAS countries are not accepted for online payments":
    "Ba a karɓar katin kiredit da debit da aka bayar daga wajen Najeriya da ƙasashen ECOWAS don biyan kuɗi ta kan layi",

  // --- boat safety checklist ----------------------------------------------
  "1. Availability of a First Aid kit": "1. Samuwar kayan agajin gaggawa",
  "2. Availability of life jackets": "2. Samuwar rigunan ceton rai",
  "3. Availability of fire extinguisher": "3. Samuwar na'urar kashe gobara",
  "4. Availability of a life ring": "4. Samuwar zoben ceton rai",
  "5. The presence and proper operation of the maritime tracking system":
    "5. Kasancewa da aiki yadda ya kamata na tsarin bin diddigin jirgin ruwa",
  "6. The functionality of the navigational light": "6. Aikin fitilar tuƙin ruwa",
  "7. Adherence to the marked limits of the waterway":
    "7. Bin iyakokin da aka sanya wa hanyar ruwa",

  // --- more documents ------------------------------------------------------
  "Account statement in case of bank transfer":
    "Bayanin asusu idan an yi turawa ta banki",
  "Proof of transfer if the transfer is non-banking (such as an electronic record or a receipt voucher)":
    "Shaidar turawa idan ba ta banki ba ce (kamar rikodin lantarki ko rasit)",
  "Transfer instrument (IBAN – Credit Card – Transaction ID [Crypto])":
    "Hanyar turawa (IBAN – Katin Kiredit – Lambar Mu'amala [Crypto])",
  "Official letter from the Nigerian consulate":
    "Wasiƙar hukuma daga ofishin jakadancin Najeriya",
  "Death Certificate certified by the competent authorities outside Nigeria":
    "Takardar shaidar mutuwa da hukumomin da abin ya shafa a wajen Najeriya suka tabbatar",
  "Additional requirements for the legal attorney":
    "Ƙarin abubuwan da ake buƙata ga wakilin shari'a",
  "Attach a copy of the approved attorney/guarantee":
    "Ka haɗa kwafin wakilcin da aka amince da shi/lamuni",
  "Proof of agreement or fraud in chats or documents":
    "Shaidar yarjejeniya ko zamba a cikin tattaunawa ko takardu",
  "attachments that reflect the subject of the complaint":
    "abubuwan da aka haɗa da ke nuna maudu'in ƙorafin",
  "Document subject of the complaint (for examination purposes)":
    "Takardar da ƙorafin ya shafa (don dalilin bincike)",
  "Legal translation of documents in Hausa (if available)":
    "Fassarar shari'a ta takardu cikin Hausa (idan akwai)",
  "Legal translation of documents into Hausa (if available)":
    "Fassarar shari'a ta takardu zuwa Hausa (idan akwai)",
  "Screenshot of conversations containing insults or defamation translated to Hausa":
    "Hoton allon tattaunawar da ke ɗauke da zagi ko ɓata suna, a fassara zuwa Hausa",
  "Proof of possession/customs paper for non-registered vehicles":
    "Shaidar mallaka/takardar kwastam ga motocin da ba a yi musu rajista ba",
  "Photos of the vehicle from all 4 sides including the damages.":
    "Hotunan motar daga gefe huɗu duka tare da lalacewar.",
  "Vehicle photos from four sides, including the plate number (to verify data included in the report)":
    "Hotunan mota daga gefe huɗu, tare da lambar faranti (domin tabbatar da bayanan da ke cikin rahoton)",
  "It is not possible to attach or upload photos from the photo album, as photos of the damage must be taken directly":
    "Ba za a iya haɗa ko ɗora hotuna daga ajiyar hotuna ba, saboda dole a ɗauki hotunan lalacewar kai tsaye",
  "A copy of the treatment approval issued by Nigeria Police Force":
    "Kwafin amincewar jinya da Rundunar 'Yan Sandan Najeriya ta bayar",
  "A recent and detailed case report illustrating the treatment plan and total cost":
    "Rahoton shari'a na kwanan nan mai cikakken bayani da ke nuna tsarin jinya da jimillar kuɗi",
  "Any evidence or documentation related to the lost item (if available)":
    "Duk wata shaida ko takarda da ta shafi abin da ya ɓace (idan akwai)",
  "Attach the road closure permit issued by the FCTA Transport Secretariat":
    "Ka haɗa izinin rufe hanya da Sakatariyar Sufuri ta FCTA ta bayar",
  " Official letter from the company in Hausa requesting to file a bounced cheque complaint":
    " Wasiƙar hukuma daga kamfanin cikin Hausa na neman shigar da ƙorafin cak ɗin da ya faskara",
  "An official letter from the event organizer, addressed to the Head of the Events Security Committee, containing the following:":
    "Wasiƙar hukuma daga mai shirya taron, zuwa ga Shugaban Kwamitin Tsaron Taro, mai ɗauke da waɗannan:",
  "Name a coordinator from the event organizers":
    "Ka ambaci mai daidaitawa daga masu shirya taron",
  "WAEC or NECO English at credit level, or TOEFL with a grade of at least 400, or IELTS with a grade of at least 4 (for officers)":
    "Ingilishi na WAEC ko NECO a matakin kiredit, ko TOEFL da maki aƙalla 400, ko IELTS da maki aƙalla 4 (ga jami'ai)",
  " WAEC or NECO English at credit level, or TOEFL with a grade of at least 500, or IELTS with a grade of at least 5 (for inspectors)":
    " Ingilishi na WAEC ko NECO a matakin kiredit, ko TOEFL da maki aƙalla 500, ko IELTS da maki aƙalla 5 (ga sufetoci)",

  // --- how to apply, and where --------------------------------------------
  "To request police presence for a sports event:":
    "Domin neman kasancewar 'yan sanda a wasan motsa jiki:",
  "To request police presence for a community event:":
    "Domin neman kasancewar 'yan sanda a taron al'umma:",
  "To request police presence for film and advertisement production:":
    "Domin neman kasancewar 'yan sanda wajen shirya fim da talla:",
  "Visit the nearest competent police station to where the cheque was received":
    "Ka ziyarci ofishin 'yan sanda mafi kusa da inda aka karɓi cak ɗin",
  "Visit/select the relevant police station based on the location of the incident":
    "Ka ziyarta/ka zaɓi ofishin 'yan sandan da ya dace bisa wurin da lamarin ya faru",
  "If the drivers of the vehicles involved in the accident disagree, contact the relevant police station.":
    "Idan direbobin motocin da suka yi haɗarin ba su yarda ba, ka tuntuɓi ofishin 'yan sandan da ya dace.",
  "A family member or their legal representative must be present in person if applying at the Police statoin.":
    "Dole wani daga cikin iyali ko wakilinsa na shari'a ya halarta da kansa idan ana nema a ofishin 'yan sanda.",
  "Vehicle must be brought to General Department of Criminal Investigations (CID) - Cars Tracking Section if needed":
    "Dole a kawo motar zuwa Babban Sashen Binciken Laifuka (CID) — Sashen Bin Diddigin Motoci idan an buƙata",
  "Organizations (Government Entities and Businesses) : A detailed report of the found items must be provided":
    "Ƙungiyoyi (Hukumomin Gwamnati da Kamfanoni): Dole a bayar da cikakken rahoton abubuwan da aka samu",
  "Matters that irrelevant to Nigeria Police Force Jurisdiction might be forwarded to the relevant authorities":
    "Ana iya tura al'amuran da ba su shafi ikon Rundunar 'Yan Sandan Najeriya ba zuwa hukumomin da abin ya shafa",
  "In case of pitching a tent or closing a road, an official approval from the Area Council or the FCTA Transport Secretariat is mandatory.":
    "Idan za a kafa laima ko a rufe hanya, wajibi ne a samu amincewar hukuma daga Ƙaramar Hukuma ko Sakatariyar Sufuri ta FCTA.",
  "Lawyers can visit inmates on Thursday’s mornings of each week, through (virtual meeting) based on prior request and approval":
    "Lauyoyi na iya ziyartar 'yan kurkuku safiyar kowace Alhamis, ta (taron kan layi) bisa buƙata da amincewa da aka yi tun da farko",
  "The report must be filed by the director of the company named on the business license or their legal representative.":
    "Dole daraktan kamfanin da sunansa ke kan lasisin kasuwanci ko wakilinsa na shari'a ya shigar da rahoton.",
  "The company/organization must be registered in the Nigeria Police Force Suppliers Registry.":
    "Dole a yi wa kamfanin/ƙungiyar rajista a Rijistar Masu Kawo Kaya ta Rundunar 'Yan Sandan Najeriya.",
  "The labor worker must have no prior engagement in an unlawful employment with the current employer (working with a visitor/tourist visa)":
    "Dole ma'aikacin kada ya taɓa yin aiki ba bisa doka ba da mai ɗaukar aikin yanzu (yana aiki da bizar baƙo/yawon buɗe ido)",
  "The Labour has not previously filed a complaint with the Federal Ministry of Labour and Employment.":
    "Ma'aikacin bai taɓa shigar da ƙorafi a Ma'aikatar Kwadago da Aikin Yi ta Tarayya ba.",
  "The applicant must not be wanted by any authority or have a criminal record, which would prevent  them from obtaining the certificate":
    "Dole kada wata hukuma ta nemi mai neman ko ya kasance da rikodin laifi, wanda hakan zai hana shi samun takardar shaidar",
  "The certificate is given to the person who has the power of attorney, the guarantor or as per the inmate's request and consent.":
    "Ana ba da takardar shaidar ga wanda ke da wakilcin shari'a, mai lamuni ko bisa buƙata da yardar ɗan kurkukun.",
  "Remark: In case the certificate could not be issued due to failing to meet the requirements, the fees paid may not be refunded":
    "Lura: Idan ba a iya bayar da takardar shaidar ba saboda rashin cika sharuɗɗa, ana iya rashin mayar da kuɗin da aka biya",
  "The terms and conditions stipulated in the Lost and Found Regulations issued by the FCT Administration in 2015 apply.":
    "Sharuɗɗa da ƙa'idojin da aka bayyana a Ƙa'idojin Ɓatattu da Waɗanda Aka Samu da Hukumar FCT ta fitar a 2015 suna aiki.",
  "The permit is intended for carrying out maintenance work, inventory, or installing billboards or cinematography":
    "Ana nufin izinin don gudanar da aikin gyara, ƙidayar kaya, ko sanya allunan talla ko ɗaukar fim",
  "Barriers must be requested at least 48 hours in advance to confirm the reservation.":
    "Dole a nemi shingayen aƙalla awanni 48 kafin lokaci domin tabbatar da ajiyar.",
  "Submit a refundable deposit or guarantee cheque, to be returned upon proper return of the barriers.":
    "Ka biya ajiya mai dawowa ko cak ɗin lamuni, wanda za a mayar idan an dawo da shingayen yadda ya kamata.",
  "Sign a commitment letter to cover the cost of any lost or damaged barrier.":
    "Ka sa hannu kan wasiƙar alƙawari na biyan kuɗin duk shingen da ya ɓace ko ya lalace.",
  "Provide the necessary labor to receive the barriers and return them after use.":
    "Ka samar da ma'aikatan da ake buƙata domin karɓar shingayen da mayar da su bayan amfani.",

  // --- service descriptions -----------------------------------------------
  "This service allows users to track the status of their application using the reference number.":
    "Wannan hidima tana ba masu amfani damar bin matsayin buƙatarsu ta amfani da lambar tuntuɓa.",
  "A service through which job seekers can learn about vacancies in Nigeria Police Force and apply accordingly.":
    "Hidima da masu neman aiki za su iya sanin guraben aiki a Rundunar 'Yan Sandan Najeriya su kuma nema.",
  "This service enables lawyers to securely obtain formal, digitally-signed powers of attorney from their clients.":
    "Wannan hidima tana ba lauyoyi damar samun wakilcin shari'a na hukuma da aka sa wa hannu ta dijital daga abokan cinikinsu cikin aminci.",
  "This service enables users wishing to visit the FCT Police Command Headquarters building to obtain a time-limited entry permit.":
    "Wannan hidima tana ba masu son ziyartar ginin Hedkwatar Rundunar 'Yan Sandan FCT damar samun izinin shiga na ɗan lokaci.",
  "This service enables users to submit their inquiries about the services, procedures and requirements approved by Nigeria Police Force.":
    "Wannan hidima tana ba masu amfani damar gabatar da tambayoyinsu game da ayyuka, hanyoyin aiki da abubuwan da Rundunar 'Yan Sandan Najeriya ta amince da su.",
  "This service enables customers to obtain a permit to visit the Nigeria Police Force Museum and view its collections and security history.":
    "Wannan hidima tana ba abokan hulɗa damar samun izinin ziyartar Gidan Tarihi na Rundunar 'Yan Sandan Najeriya da kallon abubuwan da ke ciki da tarihin tsaronsa.",
  "This service aims to enable individuals to obtain a certificate proving that they have no criminal record within the Federal Republic of Nigeria.":
    "Wannan hidima tana nufin ba mutane damar samun takardar shaida da ke tabbatar da cewa ba su da rikodin laifi a cikin Jamhuriyar Tarayyar Najeriya.",
  "This service aims to enable users to register in the Nigeria Police Force's approved suppliers directory and conduct transactions electronically.":
    "Wannan hidima tana nufin ba masu amfani damar yin rajista a jerin masu kawo kaya da Rundunar 'Yan Sandan Najeriya ta amince da su da gudanar da mu'amala ta lantarki.",
  "This service allows users to submit a request to hire a lecturer or request to give a lecture with the help of a lecturer from Nigeria Police Force.":
    "Wannan hidima tana ba masu amfani damar gabatar da buƙatar ɗaukar malamin lacca ko neman a yi lacca da taimakon malami daga Rundunar 'Yan Sandan Najeriya.",
  "This service enables customers wishing to change the color of their vehicles registered in the Federal Capital Territory to obtain a permit to do so.":
    "Wannan hidima tana ba abokan hulɗa da ke son canza launin motocinsu da aka yi wa rajista a Babban Birnin Tarayya damar samun izinin yin hakan.",
  "• **Email**: The digital version of the permit will be sent to your registered email address as soon as it is issued.":
    "• **Imel**: Za a aika sigar dijital na izinin zuwa adireshin imel ɗinka da ka yi rajista da zarar an bayar da shi.",
  "• **Email**: The digital version of the certificate will be sent to your registered email address as soon as it is issued.":
    "• **Imel**: Za a aika sigar dijital na takardar shaidar zuwa adireshin imel ɗinka da ka yi rajista da zarar an bayar da ita.",

  // --- the long service descriptions --------------------------------------
  "This service enables users to report bounced checks, settle the dispute amicably if possible, or refer the case directly to the competent authorities.":
    "Wannan hidima tana ba masu amfani damar bayar da rahoton cak ɗin da ya faskara, warware rikicin cikin sulhu idan zai yiwu, ko tura shari'ar kai tsaye ga hukumomin da abin ya shafa.",
  "This service enables lawyers to associate Powers of Attorney with registered reports to formally establish their capacity to act on behalf of clients.":
    "Wannan hidima tana ba lauyoyi damar haɗa wakilcin shari'a da rahotannin da aka yi wa rajista domin tabbatar da ikonsu na aiki a madadin abokan ciniki.",
  "The labor worker must be engaged in an activity that is deemed legitimate in the country and does not constitute an offense or a violation of the law.":
    "Dole ma'aikacin ya kasance yana yin aikin da doka ta amince da shi a ƙasar kuma bai zama laifi ko karya doka ba.",
  "In cases where official documents are found by government entities or businesses, they must be handed over to the nearest police station within 48 hours.":
    "Idan hukumomin gwamnati ko kamfanoni suka sami takardun hukuma, dole a miƙa su ga ofishin 'yan sanda mafi kusa cikin awanni 48.",
  "This service enables users to inquire about circulars related to financial cases and travel bans issued against them by the competent security authorities.":
    "Wannan hidima tana ba masu amfani damar tambaya game da sanarwar da ta shafi shari'ar kuɗi da haramcin tafiya da hukumomin tsaro suka fitar a kansu.",
  "Ensure that the bounced cheque is not among the cheques decriminalised by law and that it does not have existing and payable funds available for disbursement":
    "Ka tabbatar cak ɗin da ya faskara ba ya cikin cak ɗin da doka ta cire wa laifi kuma babu kuɗin da ake iya biya a asusun",
  "This service allows customers and members of the community to communicate with the police to request help when they or others or their properties are at risk.":
    "Wannan hidima tana ba abokan hulɗa da al'umma damar sadarwa da 'yan sanda domin neman taimako idan su ko wasu ko dukiyoyinsu suna cikin haɗari.",
  "This service enables users to verify the authenticity and validity of electronic documents issued by Nigeria Police Force that do not require an official stamp.":
    "Wannan hidima tana ba masu amfani damar tabbatar da gaskiya da ingancin takardun lantarki da Rundunar 'Yan Sandan Najeriya ta bayar waɗanda ba sa buƙatar tambarin hukuma.",
  "A centralised digital platform enabling rapid, coordinated response between public and private sectors to minimise financial fraud losses and protect customer funds.":
    "Dandalin dijital guda ɗaya da ke ba da damar amsawa cikin sauri da haɗin kai tsakanin ɓangaren gwamnati da masu zaman kansu domin rage asarar zamba da kare kuɗin abokan hulɗa.",
  "This service enables law firms to register with Nigeria Police Force, granting authorized access to the Lawyers’ Dashboard and its suite of specialized legal services":
    "Wannan hidima tana ba kamfanonin lauyoyi damar yin rajista da Rundunar 'Yan Sandan Najeriya, tana ba su izinin shiga Allon Lauyoyi da ayyukan shari'a na musamman da ke cikinsa",
  "This service enables diplomatic corps to get information related to their citizens, through the General Department of Criminal Investigation of the Nigeria Police Force.":
    "Wannan hidima tana ba ma'aikatan jakadanci damar samun bayanan da suka shafi 'yan ƙasarsu, ta Babban Sashen Binciken Laifuka na Rundunar 'Yan Sandan Najeriya.",
  "This service enables vehicle owners or drivers, whose vehicles are damaged by an unknown party, to obtain an accident report allowing them to repair their damaged vehicle.":
    "Wannan hidima tana ba masu mota ko direbobi, waɗanda wani da ba a san shi ba ya lalata musu mota, damar samun rahoton haɗari da zai ba su damar gyara motarsu.",
  "The applicant must have no court rulings against them for crimes against honor or faithfulness and must not have been previously dismissed from the armed forces for any reason":
    "Dole kada mai neman ya kasance da hukuncin kotu a kansa kan laifukan da suka shafi mutunci ko amana kuma kada a taɓa kore shi daga rundunonin tsaro saboda kowane dalili",
  "This service enables customers to report vehicles obstructing their movement, with the vehicle owner automatically notified via a warning SMS to move the vehicle immediately.":
    "Wannan hidima tana ba abokan hulɗa damar bayar da rahoton motocin da suka toshe musu hanya, kuma ana sanar da mai motar ta atomatik da saƙon gargaɗi don ya kawar da motar nan take.",
  "The applicant declares to complying with all laws, regulations, and instructions related to the handling and transportation of explosives within the Federal Capital Territory.":
    "Mai neman ya yi alƙawarin bin duk dokoki, ƙa'idoji da umarnin da suka shafi riƙewa da jigilar kayan fashewa a cikin Babban Birnin Tarayya.",
  "This service aims to enable organizations involved in drug control to meet their needs by conducting training courses or organizing specialized field workshops on drug control.":
    "Wannan hidima tana nufin ba ƙungiyoyin da ke yaƙi da ƙwayoyi damar biyan buƙatunsu ta hanyar gudanar da kwasa-kwasan horo ko shirya bita na musamman a fagen yaƙi da ƙwayoyi.",
  "The Labour has a valid employment contract or official permit issued by the Federal Ministry of Labour and Employment or by authorized entities such as the free zones in Abuja.":
    "Ma'aikacin yana da kwantiragin aiki mai aiki ko izinin hukuma da Ma'aikatar Kwadago da Aikin Yi ta Tarayya ko wasu hukumomin da aka ba izini kamar yankunan 'yanci a Abuja suka bayar.",
  "This service allows Nigerian citizens and residents to obtain a permit for the entry of a deceased person into the country, subject to prior approval from the relevant authorities":
    "Wannan hidima tana ba 'yan ƙasar Najeriya da mazauna damar samun izinin shigar da gawar mamaci cikin ƙasar, bisa amincewar hukumomin da abin ya shafa tun da farko",
  "This service enables users to provide security or sensitive information and report any activities or incidents suspected of posing a threat to public safety and community security":
    "Wannan hidima tana ba masu amfani damar bayar da bayanan tsaro ko masu muhimmanci da bayar da rahoton duk wani aiki ko lamarin da ake tuhumar zai iya yin barazana ga tsaron jama'a da al'umma",
  "Nigeria Police Force reserves the right to take all necessary actions to protect its rights, and in line with applicable laws and regulations, without prior consent from the customer":
    "Rundunar 'Yan Sandan Najeriya tana da haƙƙin ɗaukar duk matakan da suka dace domin kare haƙƙoƙinta, bisa dokoki da ƙa'idojin da suke aiki, ba tare da yardar abokin hulɗa tun da farko ba",
  "The certificate is issued to the inmate who has been sentenced to a court order and has served the sentence, or continues to do so in the penal and correctional institutions of Abuja.":
    "Ana bayar da takardar shaidar ga ɗan kurkukun da kotu ta yanke wa hukunci kuma ya kammala hukuncin, ko yana ci gaba da yin sa a gidajen gyaran hali na Abuja.",
  "This service allows customers to book and use sports facilities at the Nigeria Police Force Officers Club, such as (Artificial Turf Football Field - Turf Football field - Track - Field.)":
    "Wannan hidima tana ba abokan hulɗa damar yin ajiya da amfani da wuraren wasanni a Kulob ɗin Jami'an Rundunar 'Yan Sandan Najeriya, kamar (Filin Ƙwallon Ƙafa na Ciyawar Roba — Filin Ƙwallon Ƙafa na Ciyawa — Hanyar Gudu — Filin Wasa.)",
  "In line with Nigeria’s National Development Plan 2021–2025 and the Federal Ministry of Interior’s 2023 –2026 digital security goals, report cybercrime and help create a safer digital space.":
    "Bisa Tsarin Ci Gaban Ƙasa na Najeriya 2021–2025 da manufofin tsaron dijital na Ma'aikatar Cikin Gida ta Tarayya na 2023–2026, ka bayar da rahoton laifin yanar gizo ka taimaka wajen samar da sararin dijital mai aminci.",
  "This service enables educational institutions to request awareness programs for students, delivered by specialists from Nigeria Police Force, to enhance their security and social awareness.":
    "Wannan hidima tana ba cibiyoyin ilimi damar neman shirye-shiryen wayar da kai ga ɗalibai, waɗanda ƙwararru daga Rundunar 'Yan Sandan Najeriya ke gabatarwa, domin ƙarfafa wayewarsu ta tsaro da zamantakewa.",
  "This service enables gold traders to submit security verification requests for gold purchase transactions, to ensure that the gold being sold is not linked to any criminal cases or offenses.":
    "Wannan hidima tana ba 'yan kasuwar zinariya damar gabatar da buƙatun tabbatar da tsaro kan sayen zinariya, domin tabbatar da cewa zinariyar da ake sayarwa ba ta da alaƙa da wata shari'ar laifi.",
  "This service provides the necessary permit for virtual meetings with detainees or inmates held within the Federal Capital Territory, in accordance with applicable procedures and regulations.":
    "Wannan hidima tana bayar da izinin da ake buƙata don taron kan layi da waɗanda ake tsare ko 'yan kurkuku a cikin Babban Birnin Tarayya, bisa hanyoyin aiki da ƙa'idojin da suke aiki.",
  "This service enables users to obtain a certificate detailing the vehicle’s traffic record, including fines, penalty points, and registered accidents, along with the driver’s involvement in each.":
    "Wannan hidima tana ba masu amfani damar samun takardar shaida mai cikakken bayanin rikodin zirga-zirgar mota, ciki har da tara, makin hukunci, da haɗuran da aka rubuta, tare da hannun direban a kowanne.",
  "This service enables users to attach the required documents to support their applications or electronic transactions with Nigeria Police Force . It allows relevant files to be uploaded directly .":
    "Wannan hidima tana ba masu amfani damar haɗa takardun da ake buƙata domin tallafa wa buƙatunsu ko mu'amalarsu ta lantarki da Rundunar 'Yan Sandan Najeriya. Tana ba da damar ɗora fayilolin da suka dace kai tsaye.",
  "The applicant declares that all data and information entered in the application are true and complete, and bears full legal responsibility in the event of any incorrect or misleading information.":
    "Mai neman ya tabbatar da cewa duk bayanan da ya shigar a buƙatar gaskiya ne kuma cikakku, kuma yana ɗaukar cikakken alhakin shari'a idan aka sami bayanin ƙarya ko mai ɓatarwa.",
  "This service enables users to obtain a temporary permit for night time work to perform specific tasks within shops or banks, whether in enclosed shopping centers or outside of regular working hours.":
    "Wannan hidima tana ba masu amfani damar samun izinin ɗan lokaci na aikin dare domin gudanar da takamaiman ayyuka a cikin shaguna ko bankuna, ko a cikin cibiyoyin sayayya ko bayan lokutan aiki na yau da kullum.",
  "This service enables individuals, institutions, and government entities to rent security barriers from Nigeria Police Force, in accordance with the fees and conditions specified in the rental agreement.":
    "Wannan hidima tana ba mutane, cibiyoyi da hukumomin gwamnati damar yin hayar shingayen tsaro daga Rundunar 'Yan Sandan Najeriya, bisa kuɗi da sharuɗɗan da aka bayyana a yarjejeniyar haya.",
  "This service aims to enable the business sector to submit an official request to Nigeria Police Force for the safe disposal of expired explosives, ammunition, and fireworks, in accordance with approved procedures.":
    "Wannan hidima tana nufin ba ɓangaren kasuwanci damar gabatar da buƙatar hukuma ga Rundunar 'Yan Sandan Najeriya don halaka kayan fashewa, harsasai da wasan wuta da suka ƙare cikin aminci, bisa hanyoyin da aka amince da su.",
  "This service allows individuals impacted by various types of criminal offenses to file complaints to the competent authorities who then refer the cases to the judicial authorities to ensure their rights are upheld":
    "Wannan hidima tana ba mutanen da laifuka daban-daban suka shafa damar shigar da ƙorafi ga hukumomin da abin ya shafa, waɗanda za su tura shari'ar ga hukumomin shari'a domin tabbatar da haƙƙoƙinsu",
  "This service allows individuals impacted by various types of criminal offenses to file complaints to the competent authorities who then refer the cases to the judicial authorities to ensure their rights are upheld.":
    "Wannan hidima tana ba mutanen da laifuka daban-daban suka shafa damar shigar da ƙorafi ga hukumomin da abin ya shafa, waɗanda za su tura shari'ar ga hukumomin shari'a domin tabbatar da haƙƙoƙinsu.",
  "This service aims to enhance home security in Abuja through a smart monitoring system that operates 24/7, connected with the strategic partner “9mobile” to provide instant alerts supported by a unified cellular network.":
    "Wannan hidima tana nufin ƙarfafa tsaron gida a Abuja ta tsarin sa ido na zamani da ke aiki sa'o'i 24, wanda aka haɗa da abokin huldar dabaru “9mobile” domin bayar da faɗakarwa nan take ta hanyar sadarwar salula guda ɗaya.",
  "This service enables users to submit criminal complaints of all kinds and to coordinate with the competent authorities to refer the complaint file to the judicial authorities after verifying the validity of the complaint.":
    "Wannan hidima tana ba masu amfani damar shigar da ƙorafe-ƙorafen laifuka iri-iri da haɗa kai da hukumomin da abin ya shafa domin tura fayil ɗin ƙorafin ga hukumomin shari'a bayan tabbatar da ingancin ƙorafin.",
  "This service aims to enhance direct communication between Nigeria Police Force senior leadership and the public, allowing leaders to respond to inquiries and feedback within their functional and administrative responsibilities":
    "Wannan hidima tana nufin ƙarfafa sadarwa kai tsaye tsakanin manyan shugabannin Rundunar 'Yan Sandan Najeriya da jama'a, tana ba shugabanni damar amsa tambayoyi da ra'ayoyi cikin nauyin aikinsu da na gudanarwa",
  "Applicants who do not have an NIN must visit a service center during official working hours in person to have their fingerprints taken (Karu Police Station, Airport Police Station, Lugbe Police Station, Dei-Dei Police Station)":
    "Masu nema waɗanda ba su da NIN dole su ziyarci cibiyar hidima a lokacin aiki na hukuma da kansu domin a ɗauki zanan yatsunsu (Ofishin 'Yan Sandan Karu, Ofishin 'Yan Sandan Filin Jirgi, Ofishin 'Yan Sandan Lugbe, Ofishin 'Yan Sandan Dei-Dei)",
  "This service enables members of the community, whether Nigeria Police Force employees or the public, to volunteer with Nigeria Police Force by registering for available opportunities on the Nigeria Police Force Volunteer Platform.":
    "Wannan hidima tana ba mutanen al'umma, ko ma'aikatan Rundunar 'Yan Sandan Najeriya ne ko jama'a, damar yin aikin sa kai da Rundunar ta hanyar yin rajista a guraben da ake da su a Dandalin Aikin Sa Kai na Rundunar.",
  "This service discusses the most critical issues, challenges and developments in drug control. It examines the topic from multiple perspectives with a team of specialists, aiming to develop solutions and recommendations for these concerns.":
    "Wannan hidima tana tattauna muhimman batutuwa, ƙalubale da ci gaba a fagen yaƙi da ƙwayoyi. Tana duba maudu'in daga fuskoki daban-daban tare da tawagar ƙwararru, da nufin samar da mafita da shawarwari kan waɗannan damuwa.",
  "This service aims to enable heart patients and those with critical medical conditions in the Federal Capital Territory to register for priority ambulance dispatch and receive prompt and appropriate medical attention in case of an emergency.":
    "Wannan hidima tana nufin ba marasa lafiyar zuciya da masu manyan cututtuka a Babban Birnin Tarayya damar yin rajista domin fifikon turo motar asibiti da samun kulawar likita cikin gaggawa idan aka sami gaggawa.",
  "The applicant acknowledges that the weight entered in the application is an estimated weight, and the actual weight will be accurately determined by the Nigeria Police Force upon approving the request and deliver the shipment to the police.":
    "Mai neman ya amince cewa nauyin da ya shigar a buƙatar kimanin nauyi ne, kuma Rundunar 'Yan Sandan Najeriya za ta auna ainihin nauyin daidai idan ta amince da buƙatar aka kuma kai kayan ga 'yan sanda.",
  "The service is for companies wishing to register as one of the suppliers in the Nigeria Police Force Supplier Registry, which will allow them to access tenders, receive tender award notices, and deal with Nigeria Police Force electronically":
    "Hidimar ta kamfanonin da ke son yin rajista a matsayin masu kawo kaya a Rijistar Masu Kawo Kaya ta Rundunar 'Yan Sandan Najeriya, wanda zai ba su damar shiga kwangiloli, karɓar sanarwar bayar da kwangila, da mu'amala da Rundunar ta lantarki",
  "This service aims to provide protection and support for women who are at risk or under threat of any form of psychological or physical violence, neglect, or violation of rights, ensuring the preservation of their legal, social, and human rights.":
    "Wannan hidima tana nufin bayar da kariya da tallafi ga matan da ke cikin haɗari ko barazanar kowace irin cutarwa ta hankali ko ta jiki, sakaci, ko keta haƙƙi, tana tabbatar da kiyaye haƙƙoƙinsu na shari'a, zamantakewa da na ɗan adam.",
  "This service allows government authorities or the businesses to request police presence at their events to ensure effectiveness by providing all security procedures and facilitating traffic, preventive measures and security and safety procedures.":
    "Wannan hidima tana ba hukumomin gwamnati ko kamfanoni damar neman kasancewar 'yan sanda a tarukansu domin tabbatar da nasara ta hanyar samar da duk matakan tsaro da sauƙaƙa zirga-zirga, matakan kariya da na tsaro da aminci.",
  "Nigeria Police Force pledges to act swiftly on government directives by eliminating unnecessary procedures, cutting timelines by no less than 50%, and removing redundant requirements, ensuring a more streamlined and efficient experience for society.":
    "Rundunar 'Yan Sandan Najeriya ta yi alƙawarin aiwatar da umarnin gwamnati cikin sauri ta hanyar kawar da hanyoyin aiki marasa amfani, rage lokaci da bai gaza kashi 50 ba, da cire abubuwan da ake buƙata da ba lallai ba, tana tabbatar da gogewa mai sauƙi kuma mai inganci ga al'umma.",
  "This service aims to enable workers in the business sector to submit individual or collective complaints against the companies or institutions they work for, related to wages, working conditions, labor accommodation, or health and safety requirement.":
    "Wannan hidima tana nufin ba ma'aikatan ɓangaren kasuwanci damar shigar da ƙorafi ɗaya-ɗaya ko na haɗin gwiwa kan kamfanonin da suke aiki da su, game da albashi, yanayin aiki, masaukin ma'aikata, ko buƙatun lafiya da aminci.",
  "Embracing the National Digital Economy Policy and the paperless government drive, the Lost & Found service ensures a fully digital experience that eliminates bureaucracy and promotes sustainability, reinforced by the Blockchain's security and transparency":
    "Da rungumar Manufar Tattalin Arzikin Dijital ta Ƙasa da yunƙurin gwamnati marar takarda, hidimar Ɓatattu da Waɗanda Aka Samu tana tabbatar da gogewa ta dijital cikakke wadda ke kawar da jan aiki tana kuma inganta dorewa, wanda tsaro da gaskiyar Blockchain ke ƙarfafawa",
  "This service aims to enable drivers holding driving licenses issued from Abuja, and who have accumulated traffic points on their licenses to enroll in specialized traffic safety training courses to benefit from a reduction in the points recorded against them.":
    "Wannan hidima tana nufin ba direbobin da ke da lasisin tuƙi da aka bayar daga Abuja, waɗanda suka tara makin zirga-zirga a lasisinsu, damar shiga kwasa-kwasan horo na musamman kan tsaron hanya domin amfana da ragin makin da aka rubuta a kansu.",
  "This service enables users to report lost property or hand over found items to Nigeria Police Force for restoration to their rightful owners following verification. It also allows them to track their application status and obtain an official ‘Loss Certificate’":
    "Wannan hidima tana ba masu amfani damar bayar da rahoton dukiyar da ta ɓace ko miƙa abubuwan da aka samu ga Rundunar 'Yan Sandan Najeriya domin mayar da su ga masu su bayan tabbatarwa. Tana kuma ba su damar bin matsayin buƙatarsu da samun 'Takardar Shaidar Ɓatawa' ta hukuma",
  "This service allows individuals to report the loss of their belongings or personal items and ensures communication with the owner if the item is found. With the option to request Lost certificate (subject to a fees), which can be used with other official entities.":
    "Wannan hidima tana ba mutane damar bayar da rahoton ɓatar da kayansu ko kayan kansu kuma tana tabbatar da tuntuɓar mai shi idan an sami abin. Tare da damar neman Takardar Shaidar Ɓatawa (bisa kuɗi), wadda za a iya amfani da ita a wasu hukumomin gwamnati.",
  "This service enables users to obtain a clearance certificate confirming that the vehicle owner has settled all traffic violations and that there are no recorded accidents, traffic points, or active restrictions in Abuja against the vehicle or the driver’s license.":
    "Wannan hidima tana ba masu amfani damar samun takardar shaidar tsabta da ke tabbatar da cewa mai motar ya biya duk laifukan zirga-zirga kuma babu haɗurran da aka rubuta, makin zirga-zirga, ko takunkumi mai aiki a Abuja kan motar ko lasisin direban.",
  "This service enables users to book an appointment in advance before visiting service centers to complete their transactions in person. It also allows them to modify or cancel their appointment, ensuring a more flexible experience that saves time and eliminates waiting":
    "Wannan hidima tana ba masu amfani damar yin ajiyar lokaci tun da farko kafin ziyartar cibiyoyin hidima domin kammala mu'amalarsu da kansu. Tana kuma ba su damar canza ko soke lokacin, tana tabbatar da gogewa mai sauƙi wadda ke ceton lokaci tana kawar da jira",
  "This service enables health authorities and medical centers to submit requests for extending the treatment period of Nigeria Police Force patients receiving medical care abroad, ensuring the continuity of care in accordance with approved medical reports and recommendations.":
    "Wannan hidima tana ba hukumomin lafiya da cibiyoyin likita damar gabatar da buƙatar ƙara lokacin jinyar marasa lafiya na Rundunar 'Yan Sandan Najeriya da ke samun kulawa a ƙasashen waje, tana tabbatar da ci gaba da kulawa bisa rahotannin likita da shawarwarin da aka amince da su.",
  "This service aims to enable Persons with Disabilities with physical, hearing, or visual disabilities across all Nigeria to register and subscribe, ensuring they granted priority in ambulance dispatch and provided with a fast and appropriate response in emergency situations.":
    "Wannan hidima tana nufin ba masu naƙasa ta jiki, ta ji, ko ta gani a faɗin Najeriya damar yin rajista da biyan kuɗi, tana tabbatar da an ba su fifiko wajen turo motar asibiti kuma an ba su amsa mai sauri da ta dace a lokacin gaggawa.",
  "This service enables users who have obtained a street closure permit from the FCTA Transport Secretariat to notify Nigeria Police Force of closure periods, enabling the Command and Control Center to know about closed roads while directing patrols to accident sites and reports.":
    "Wannan hidima tana ba masu amfani da suka samu izinin rufe titi daga Sakatariyar Sufuri ta FCTA damar sanar da Rundunar 'Yan Sandan Najeriya lokutan rufewa, tana ba Cibiyar Umarni da Kula damar sanin hanyoyin da aka rufe yayin tura sintiri zuwa wuraren haɗari da rahotanni.",
  "Through this service, Lawyers can apply for Restriction release Certificate from Nigeria Police Force Head Quarter, to follow up on procedures for lifting circulars and security restrictions on individuals or license plates, after settling the client's legal and financial status.":
    "Ta wannan hidima, lauyoyi za su iya neman Takardar Shaidar Ɗage Takunkumi daga Hedkwatar Rundunar 'Yan Sandan Najeriya, domin bibiyar hanyoyin ɗage sanarwa da takunkuman tsaro kan mutane ko lambobin mota, bayan warware matsayin shari'a da na kuɗi na abokin ciniki.",
  "This service enables police officers and financial institutions to handle banking information through the Economic Crimes Operations Center, which serves as a vital link between the victim and the banking sector, with the aim of halting fraudulent transactions and identifying the perpetrators.":
    "Wannan hidima tana ba jami'an 'yan sanda da cibiyoyin kuɗi damar sarrafa bayanan banki ta Cibiyar Ayyukan Laifukan Tattalin Arziki, wadda ke zama muhimmiyar haɗi tsakanin wanda aka yi wa laifi da ɓangaren banki, da nufin dakatar da mu'amalar zamba da gano waɗanda suka aikata.",
  "This service enables individuals, entities, and organizations to request the participation of Nigeria Police Force specialized units, such as the Mounted Police, Music Band, K9 Unit, and Highway Patrols in official events, festivals, and public parades held across the Federal Capital Territory.":
    "Wannan hidima tana ba mutane, hukumomi da ƙungiyoyi damar neman shigar rundunonin Rundunar 'Yan Sandan Najeriya na musamman, kamar 'Yan Sandan Dawakai, Ƙungiyar Kiɗa, Rundunar Karnuka (K9), da Sintirin Babbar Hanya a tarukan hukuma, bukukuwa da faretin jama'a a faɗin Babban Birnin Tarayya.",
  "This service aims to provide an immediate and comprehensive response to cases involving children exposed to any form of physical or psychological abuse or neglect, by offering the necessary protection and support to ensure their safety and safeguard their rights in accordance with applicable laws.":
    "Wannan hidima tana nufin bayar da amsa nan take kuma cikakkiya ga lamurran da suka shafi yaran da aka yi wa kowace irin cutarwa ta jiki ko ta hankali ko sakaci, ta hanyar bayar da kariya da tallafin da ake buƙata domin tabbatar da amincinsu da kare haƙƙoƙinsu bisa dokokin da suke aiki.",
  "This service enables individuals and organizations within the Federal Capital Territory to hand over found items to police stations or designated partners participating in the Lost and Found Program. The objective is to facilitate the process of locating and returning lost items to their rightful owners":
    "Wannan hidima tana ba mutane da ƙungiyoyi a cikin Babban Birnin Tarayya damar miƙa abubuwan da suka samu ga ofisoshin 'yan sanda ko abokan huldar da ke cikin Shirin Ɓatattu da Waɗanda Aka Samu. Manufar ita ce sauƙaƙa gano da mayar da abubuwan da suka ɓace ga masu su",
  "This service enables individuals to report suspected cases or practices related to human trafficking such as labor exploitation, sexual exploitation, or organ trafficking. It also aims to protect the privacy of individuals and ensure that information reaches the competent authorities in a secure and safe manner.":
    "Wannan hidima tana ba mutane damar bayar da rahoton lamurra ko ayyukan da ake tuhuma da alaƙa da fataucin mutane kamar cin zarafin ma'aikata, cin zarafin jima'i, ko fataucin gaɓoɓin jiki. Tana kuma nufin kare sirrin mutane da tabbatar da bayanin ya isa ga hukumomin da abin ya shafa cikin aminci.",
  "This service aims to strengthen community policing by enabling residents to communicate directly with police officers through an interactive neighborhood platform, report concerns and suggestions, and collaborate in addressing local issues, thereby enhancing security, safety, and quality of life within the community.":
    "Wannan hidima tana nufin ƙarfafa aikin 'yan sanda na al'umma ta hanyar ba mazauna damar sadarwa kai tsaye da jami'an 'yan sanda ta dandalin unguwa, bayar da rahoton damuwa da shawarwari, da haɗa kai wajen magance matsalolin cikin gida, ta haka ana ƙarfafa tsaro, aminci da ingancin rayuwa a cikin al'umma.",
  "This service provides dedicated support to tourists visiting Federal Capital Territory by receiving and addressing tourism-related inquiries, reports, and complaints. As it ensures guidance, coordination, and assistance through official Nigeria Police Force channels to help maintain a safe and positive tourism experience.":
    "Wannan hidima tana bayar da tallafi na musamman ga masu yawon buɗe ido da ke ziyartar Babban Birnin Tarayya ta karɓa da magance tambayoyi, rahotanni da ƙorafe-ƙorafen da suka shafi yawon buɗe ido. Tana tabbatar da jagora, haɗin kai da taimako ta hanyoyin hukuma na Rundunar 'Yan Sandan Najeriya domin kiyaye gogewar yawon buɗe ido mai aminci.",
  "This service enables drivers of vehicles involved in minor or moderate traffic accidents without injuries, whether at fault or affected, to obtain an official report that allows them to proceed with insurance claims and complete the necessary procedures, provided the accident is not linked to a criminal case or that the driver was under the influence of alcohol.":
    "Wannan hidima tana ba direbobin motocin da suka yi ƙananan haɗura ko matsakaita ba tare da rauni ba, ko su ne suka yi laifi ko abin ya shafe su, damar samun rahoton hukuma da zai ba su damar ci gaba da neman inshora da kammala hanyoyin da ake buƙata, muddin haɗarin ba shi da alaƙa da shari'ar laifi ko direban bai sha giya ba.",
  "By integrating the latest technologies to counter evolving crime patterns, the Rescue Me initiative ensures a proactive approach to public safety. It encourages residents to report suspicious observations promptly, reinforcing a culture of vigilance and cooperation. This initiative underpins the vision of the Territory and the Federal Ministry of Interior’s pursuit of leadership in security.":
    "Ta haɗa sabbin fasahohi domin yaƙar salon laifuka masu sauyawa, shirin Ku Cece Ni yana tabbatar da hanyar shirin gaba ga tsaron jama'a. Yana ƙarfafa mazauna su bayar da rahoton abin da suke tuhuma da wuri, yana ƙarfafa al'adar sa ido da haɗin kai. Wannan shiri yana ƙarfafa hangen nesa na Babban Birnin Tarayya da ƙoƙarin Ma'aikatar Cikin Gida ta Tarayya na jagoranci a fagen tsaro.",
  "This service enables users to obtain an official certificate that outlines the facts and circumstances recorded in reports of damage, natural disasters, or traffic accidents. The certificate specifies the status of the parties involved and the resulting damages, enabling users to complete the necessary legal procedures with relevant entities such as judicial authorities and insurance companies.":
    "Wannan hidima tana ba masu amfani damar samun takardar shaida ta hukuma da ke bayyana gaskiya da yanayin da aka rubuta a rahotannin lalacewa, bala'o'i, ko haɗurran zirga-zirga. Takardar tana bayyana matsayin ɓangarorin da abin ya shafa da lalacewar da ta biyo baya, tana ba masu amfani damar kammala hanyoyin shari'a da ake buƙata da hukumomin da abin ya shafa kamar hukumomin shari'a da kamfanonin inshora.",
  "This service enables users to register their marine trips and expected locations, and to request assistance in emergency situations. The system automatically sends alerts for delayed trips. The service also offers various features such as trip tracking, dive site identification, location sharing, specifying the type and severity of distress, and smart integration with other government applications.":
    "Wannan hidima tana ba masu amfani damar yin rajistar tafiye-tafiyensu a kan ruwa da wuraren da suke nufi, da neman taimako a lokacin gaggawa. Tsarin yana aika faɗakarwa ta atomatik don tafiye-tafiyen da suka yi jinkiri. Hidimar kuma tana bayar da abubuwa daban-daban kamar bin diddigin tafiya, gano wurin nutsewa, raba wuri, bayyana nau'i da tsananin matsala, da haɗi mai hankali da sauran manhajojin gwamnati.",
  "This service aims to enable the inmate, their sponsor, or a family member (upon the inmate’s approval) to obtain an official “To Whom It May Concern” certificate confirming the completion or ongoing execution of the judicial sentence in Abuja’s correctional and penal institutions. The certificate is valid for a period of time, facilitating the completion of official, financial, and social transactions in accordance with applicable regulations.":
    "Wannan hidima tana nufin ba ɗan kurkuku, mai ɗaukar nauyinsa, ko wani daga iyalinsa (bisa amincewar ɗan kurkukun) damar samun takardar shaidar hukuma ta “Ga Duk Wanda Abin Ya Shafa” da ke tabbatar da kammalawa ko ci gaba da zartar da hukuncin kotu a gidajen gyaran hali na Abuja. Takardar tana aiki na wani ɗan lokaci, tana sauƙaƙa kammala mu'amalar hukuma, ta kuɗi da ta zamantakewa bisa ƙa'idojin da suke aiki.",
  "This service enables Nigeria Police Force retirees to access a comprehensive package of dedicated services designed to strengthen communication and facilitate their access to various benefits. The services include the issuance and renewal of military and civil identification cards, issuance and renewal of the “POSSAP” card, military health insurance, medical treatment and equipment requests, issuance of different types of service certificates, and home visit arrangements for senior citizens and individuals unable to attend in person.":
    "Wannan hidima tana ba masu ritaya na Rundunar 'Yan Sandan Najeriya damar samun cikakken ƙunshin ayyuka na musamman da aka tsara domin ƙarfafa sadarwa da sauƙaƙa musu samun amfanoni daban-daban. Ayyukan sun haɗa da bayarwa da sabunta katunan shaida na soja da na farar hula, bayarwa da sabunta katin “POSSAP”, inshorar lafiya ta soja, buƙatun jinya da kayan aiki, bayar da takardun shaidar aiki iri-iri, da shirya ziyarar gida ga tsofaffi da waɗanda ba za su iya zuwa da kansu ba.",
  "A service to inquire about traffic violations, including the following: • Traffic Fines Payment: A service that enables the settlement of traffic violations registered against a vehicle plate, driving licence, or traffic code. • Traffic Fines Instalments: A service that allows for the payment of traffic violations in monthly instalments via direct debit or credit card, subject to applicable terms and conditions. • Pay Against Impound: A service that allows for the payment of a daily fee to waive a vehicle’s impoundment period, provided no legal restrictions apply. • Smart…":
    "Hidima ta tambaya game da laifukan zirga-zirga, ciki har da waɗannan: • Biyan Tarar Zirga-zirga: hidima da ke ba da damar biyan laifukan zirga-zirga da aka rubuta kan lambar mota, lasisin tuƙi, ko lambar zirga-zirga. • Biyan Tara a Kashi-kashi: hidima da ke ba da damar biyan laifukan zirga-zirga a kashi-kashi na wata-wata ta cire kuɗi kai tsaye ko katin kiredit, bisa sharuɗɗan da suke aiki. • Biya Maimakon Kwacewa: hidima da ke ba da damar biyan kuɗi na yau da kullum domin ɗage lokacin kwace mota, muddin babu takunkumin shari'a. • Zamani…",
  "**Email**: The digital version of the permit will be sent to your registered email address as soon as it is issued. **Personal Dashboard**: Log in to your Nigeria Police Force account, navigate to \"My Requests\" section in your personal dashboard, search for your request, and then download the permit directly. **Direct Inquiry**: You can download the permit through \"Application Status\" service using only your reference number.":
    "**Imel**: Za a aika sigar dijital na izinin zuwa adireshin imel ɗinka da ka yi rajista da zarar an bayar da shi. **Allon Kai**: Ka shiga asusunka na Rundunar 'Yan Sandan Najeriya, ka je sashen \"Buƙatuna\" a allonka, ka nemi buƙatarka, sannan ka sauke izinin kai tsaye. **Tambaya Kai Tsaye**: Za ka iya sauke izinin ta hidimar \"Matsayin Buƙata\" ta amfani da lambar tuntuɓarka kaɗai.",
  "• **Email**: The digital version of the permit will be sent to your registered email address as soon as it is issued. • **Personal Dashboard**: Log in to your Nigeria Police Force account, navigate to \"My Requests\" section in your personal dashboard, search for your request, and then download the permit directly. • **Direct Inquiry**: You can download the permit through \"Application Status\" service using only your reference number.":
    "• **Imel**: Za a aika sigar dijital na izinin zuwa adireshin imel ɗinka da ka yi rajista da zarar an bayar da shi. • **Allon Kai**: Ka shiga asusunka na Rundunar 'Yan Sandan Najeriya, ka je sashen \"Buƙatuna\" a allonka, ka nemi buƙatarka, sannan ka sauke izinin kai tsaye. • **Tambaya Kai Tsaye**: Za ka iya sauke izinin ta hidimar \"Matsayin Buƙata\" ta amfani da lambar tuntuɓarka kaɗai.",
  "• **Email**: The digital version of the certificate will be sent to your registered email address as soon as it is issued. • **Personal Dashboard**: Log in to your Nigeria Police Force account, navigate to \"My Requests\" section in your personal dashboard, search for your request, and then download the certificate directly. • **Direct Inquiry**: You can download the certificate through \"Application Status\" service using only your reference number.":
    "• **Imel**: Za a aika sigar dijital na takardar shaidar zuwa adireshin imel ɗinka da ka yi rajista da zarar an bayar da ita. • **Allon Kai**: Ka shiga asusunka na Rundunar 'Yan Sandan Najeriya, ka je sashen \"Buƙatuna\" a allonka, ka nemi buƙatarka, sannan ka sauke takardar shaidar kai tsaye. • **Tambaya Kai Tsaye**: Za ka iya sauke takardar shaidar ta hidimar \"Matsayin Buƙata\" ta amfani da lambar tuntuɓarka kaɗai.",
};
