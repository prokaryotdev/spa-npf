/**
 * Sign-in and the citizen portal: requests, fines, documents, notices and
 * the profile form.
 */
export const haAccount: Record<string, string> = {
  // --- sign in -------------------------------------------------------------
  "Sign in": "Shiga",
  "Sign out": "Fita",
  "Signed in as": "An shiga a matsayin",
  "Sign In | Nigeria Police Force": "Shiga | Rundunar 'Yan Sandan Najeriya",
  "Sign in with NINAuth": "Shiga da NINAuth",
  "Continue with NINAuth": "Ci gaba da NINAuth",
  "NINAuth is the national digital identity, and the fastest way in — no separate Nigeria Police Force account needed.":
    "NINAuth ita ce shaidar dijital ta ƙasa, kuma hanya mafi sauri ta shiga — ba a buƙatar wani asusun Rundunar 'Yan Sandan Najeriya daban.",
  "Or use your Nigeria Police Force account":
    "Ko kuma ka yi amfani da asusunka na Rundunar 'Yan Sandan Najeriya",
  "Sign in with NINAuth or your Nigeria Police Force account to track applications and use personalised services.":
    "Ka shiga da NINAuth ko asusunka na Rundunar 'Yan Sandan Najeriya domin bin diddigin buƙatunka da amfani da ayyuka na musamman.",
  "Sign in to track your requests, settle fines and reach personalised services.":
    "Ka shiga domin bin diddigin buƙatunka, biyan tarar ka da samun ayyuka na musamman.",
  "No account yet? Every Nigeria Police Force service is listed on the":
    "Ba ka da asusu tukuna? An jera kowane aikin Rundunar 'Yan Sandan Najeriya a kan",
  "services page": "shafin ayyuka",
  ", and most can be started with NINAuth alone.":
    ", kuma ana iya fara yawancinsu da NINAuth kaɗai.",
  "Opens the sample account for {name}.":
    "Yana buɗe asusun samfurin na {name}.",
  "Officers reach the operations console with their force credentials.":
    "Jami'ai suna shiga cikin allon ayyuka da shaidarsu ta Rundunar.",
  "Open the operations console": "Buɗe allon ayyuka",
  Console: "Allon ayyuka",
  Password: "Kalmar sirri",
  "Nigeria Police Force personnel": "Ma'aikatan Rundunar 'Yan Sandan Najeriya",
  "Loading your account": "Ana ɗaukar asusunka",

  // --- overview ------------------------------------------------------------
  "Overview | My Nigeria Police Force":
    "Taƙaitawa | Rundunar 'Yan Sandan Najeriya Tawa",
  "Track your requests, settle fines, download documents and manage your details.":
    "Ka bi diddigin buƙatunka, ka biya tara, ka sauke takardu kuma ka sarrafa bayananka.",
  "Sample account. The requests, fines and documents below are illustrative and live only in this browser.":
    "Asusun samfuri. Buƙatu, tara da takardun da ke ƙasa misali ne kawai, kuma suna nan a wannan burauza kaɗai.",
  "Reset the demo data": "Sake saita bayanan gwaji",
  "Open requests": "Buƙatun da ke buɗe",
  "Unpaid fines": "Tarar da ba a biya ba",
  "Payable today": "Abin biya yau",
  "Unread notices": "Sanarwar da ba a karanta ba",
  "Recent requests": "Buƙatun kwanan nan",
  "See all": "Duba duka",
  "Nothing outstanding": "Babu abin da ya rage",
  None: "Babu",
  "Start a service": "Fara aiki",
  "Browse services": "Bincika ayyuka",
  "All {n} services": "Duk ayyuka {n}",

  // --- requests ------------------------------------------------------------
  "My Requests": "Buƙatuna",
  "My Requests | My Nigeria Police Force":
    "Buƙatuna | Rundunar 'Yan Sandan Najeriya Tawa",
  "New request": "Sabuwar buƙata",
  "Find a request": "Nemi buƙata",
  "Service name or reference": "Sunan aiki ko lambar tuntuɓa",
  "No requests yet": "Babu buƙata tukuna",
  "Anything you apply for shows up here with its reference number and status.":
    "Duk abin da ka nema zai bayyana nan da lambar tuntuɓarsa da matsayinsa.",
  "Anything you apply for shows up here with its reference number and its full history.":
    "Duk abin da ka nema zai bayyana nan da lambar tuntuɓarsa da cikakken tarihinsa.",
  "Nothing matches": "Babu abin da ya dace",
  "Try clearing the status filter or searching for the reference number instead.":
    "Ka gwada cire tacewar matsayi ko ka nemi lambar tuntuɓa maimakon haka.",
  "Showing {shown} of {total} requests":
    "Ana nuna {shown} daga buƙatu {total}",
  "{ref} · submitted {date} · {fee}":
    "{ref} · an gabatar {date} · {fee}",
  "About this service": "Game da wannan aikin",
  "Ask about it": "Yi tambaya game da shi",
  "Your reply": "Amsarka",
  "Send reply": "Aika amsa",
  "Tell us what you have done, or what you are sending.":
    "Ka gaya mana abin da ka yi, ko abin da kake aikawa.",
  Submitted: "An gabatar",
  "In Review": "Ana Bitar",
  "In review": "Ana bitar",
  Completed: "An Kammala",
  "Action Needed": "Ana Buƙatar Mataki",
  "Action needed": "Ana buƙatar mataki",
  Matched: "An Samu Daidai",
  "One request needs something from you":
    "Buƙata ɗaya tana buƙatar wani abu daga gare ka",
  "{n} requests need something from you":
    "Buƙatu {n} suna buƙatar wani abu daga gare ka",
  "With the Criminal Records department.":
    "Yana hannun sashen Bayanan Laifuka.",
  "Received by Nigeria Police Force.":
    "Rundunar 'Yan Sandan Najeriya ta karɓa.",
  "Certificate available to download.": "Ana iya sauke takardar shaida.",
  "Collected. Case closed.": "An karɓa. An rufe shari'ar.",
  "A matching item was handed in at Asokoro station.":
    "An miƙa abu mai dacewa a ofishin Asokoro.",
  "The date you chose falls on a public holiday. Open the request to pick another one.":
    "Ranar da ka zaɓa ta faɗo a ranar hutun jama'a. Ka buɗe buƙatar ka zaɓi wata.",
  "The visit date you chose is a public holiday. Pick another date.":
    "Ranar ziyarar da ka zaɓa ranar hutun jama'a ce. Ka zaɓi wata rana.",

  // --- fines ---------------------------------------------------------------
  Fines: "Tara",
  "Fines | My Nigeria Police Force":
    "Tara | Rundunar 'Yan Sandan Najeriya Tawa",
  Paid: "An biya",
  Unpaid: "Ba a biya ba",
  "Pay now": "Biya yanzu",
  "Paying…": "Ana biya…",
  "25% off": "Ragi 25%",
  "before the early-payment discount": "kafin ragin biyan kuɗi da wuri",
  "Paying within {days} days of the issue date takes 25% off.":
    "Biya cikin kwanaki {days} daga ranar bayarwa yana rage 25%.",
  "No unpaid fines are recorded against this NIN.":
    "Babu tarar da ba a biya ba da aka rubuta a kan wannan NIN.",
  "{n} penalty points": "Maki hukunci {n}",
  "Penalty points at risk": "Makin hukunci cikin haɗari",
  "Using a mobile phone while driving":
    "Amfani da wayar hannu yayin tuƙi",
  "Exceeding the speed limit by 20 km/h":
    "Wuce iyakar gudu da km 20 a cikin awa",
  "Parking in a space reserved for persons with disabilities":
    "Ajiye mota a wurin da aka keɓe wa masu naƙasa",
  "Nnamdi Azikiwe Expressway, before Junction 3":
    "Babbar Hanyar Nnamdi Azikiwe, kafin Mahaɗa ta 3",

  // --- documents -----------------------------------------------------------
  "Documents | My Nigeria Police Force":
    "Takardu | Rundunar 'Yan Sandan Najeriya Tawa",
  Download: "Sauke",
  Issued: "An bayar",
  "{ref} · issued {date}": "{ref} · an bayar {date}",
  "valid to {date}": "yana aiki har {date}",
  "No documents yet": "Babu takardu tukuna",
  "Certificates, permits and receipts appear here as soon as a request is approved.":
    "Takardun shaida, izini da rasit suna bayyana nan da zarar an amince da buƙata.",
  "Downloads are not available in this rebuild":
    "Ba a samun sauke fayiloli a wannan sigar",
  "Police Clearance Certificate": "Takardar Shaidar Tsabtar Rikodi",
  "Traffic Status Certificate": "Takardar Shaidar Matsayin Zirga-zirga",
  "HQ Entry Permit": "Izinin Shiga Hedkwata",
  "Lost Item Report — receipt": "Rahoton Abin da Ya Ɓata — rasit",
  "Report Lost Item": "Bayar da Rahoton Abin da Ya Ɓata",
  "Free of Charge": "Kyauta",
  "NIN and passport copy accepted.": "Ana karɓar NIN da kwafin fasfo.",

  // --- notices -------------------------------------------------------------
  Notices: "Sanarwa",
  "Mark all read": "Sanya duka an karanta",
  "Nothing to read": "Babu abin karantawa",
  "Updates about your requests, fines and documents land here.":
    "Sabuntawa game da buƙatunka, tararka da takardunka suna zuwa nan.",
  "New fine recorded": "An rubuta sabuwar tara",
  "Documents verified": "An tabbatar da takardu",
  "HQ Entry Permit needs a new date":
    "Izinin Shiga Hedkwata yana buƙatar sabon kwanan wata",
  "Your Police Clearance Certificate moved to review":
    "An kai Takardar Shaidar Tsabtar Rikodi zuwa bita",
  "Request NPF-2026-4417 is with the Criminal Records department. No action is needed from you.":
    "Buƙatar NPF-2026-4417 tana hannun sashen Bayanan Laifuka. Ba a buƙatar wani mataki daga gare ka.",
  "Fine TF-88214 was issued on Nnamdi Azikiwe Expressway. Paying within 30 days gets a 25% discount.":
    "An bayar da tarar TF-88214 a Babbar Hanyar Nnamdi Azikiwe. Biya cikin kwanaki 30 yana samun ragi 25%.",

  // --- profile -------------------------------------------------------------
  Profile: "Bayanan kai",
  "Profile | My Nigeria Police Force":
    "Bayanan kai | Rundunar 'Yan Sandan Najeriya Tawa",
  "Full name": "Cikakken suna",
  "Mobile number": "Lambar wayar hannu",
  "Save changes": "Ajiye canje-canje",
  "Saved. Updates about your requests go to these details.":
    "An ajiye. Sabuntawa game da buƙatunka na zuwa waɗannan bayanan.",
  "Name and NIN come from NINAuth and cannot be edited here.":
    "Suna da NIN daga NINAuth suke zuwa, kuma ba za a iya gyara su nan ba.",
  Rank: "Mukami",
  Station: "Ofishi",
  "Nigeria Police Force App": "Manhajar Rundunar 'Yan Sandan Najeriya",
  "Nigeria Police Force Website": "Shafin Rundunar 'Yan Sandan Najeriya",
  "Divisional Police Station": "Ofishin 'Yan Sanda na Sashe",
};
