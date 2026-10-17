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
  "No account yet?":
    "Ba ka da asusu tukuna?",
  "No account needed":
    "Ba a buƙatar asusu",
  "These work without signing in.":
    "Waɗannan suna aiki ba tare da ka shiga ba.",
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
  "Sample account. Everything here is illustrative and lives only in this browser.":
    "Asusun samfuri. Duk abin da ke nan misali ne kawai, kuma yana nan a wannan burauza kaɗai.",
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
  "{ref} · submitted {date}": "{ref} · an gabatar {date}",
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
  "One request needs something from you":
    "Buƙata ɗaya tana buƙatar wani abu daga gare ka",
  "{n} requests need something from you":
    "Buƙatu {n} suna buƙatar wani abu daga gare ka",
  "With the Criminal Records department.":
    "Yana hannun sashen Bayanan Laifuka.",
  "Received by Nigeria Police Force.":
    "Rundunar 'Yan Sandan Najeriya ta karɓa.",
  "The date you chose falls on a public holiday. Open the request to pick another one.":
    "Ranar da ka zaɓa ta faɗo a ranar hutun jama'a. Ka buɗe buƙatar ka zaɓi wata.",

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
  "Fine TF-88214 was issued on Lagos–Ibadan Expressway. Paying within 30 days gets a 25% discount.":
    "An bayar da tarar TF-88214 a Babbar Hanyar Lagos–Ibadan. Biya cikin kwanaki 30 yana samun ragi 25%.",

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
  // --- page redesign ---------------------------------------------------------
  Identity: "Shaida",
  "Contact details": "Bayanan tuntuɓa",
  "All statuses": "Duk matsayi",
  // --- reporting a crime, applying, tracking, commands ---------------------
  "Report a Crime | Nigeria Police Force":
    "Kai Rahoton Laifi | Rundunar 'Yan Sandan Najeriya",
  "Report a crime to the State Command where it happened. Free, open all day, and you can report anonymously.":
    "Kai rahoton laifi ga Rundunar Jihar da abin ya faru. Kyauta ne, a buɗe yake dukan yini, kuma za ka iya yin rahoto ba tare da sunanka ba.",
  "Apply online. It takes about five minutes.":
    "Nemi ta intanet. Yana ɗaukar kusan minti biyar.",
  "Apply: {name} | Nigeria Police Force":
    "Nema: {name} | Rundunar 'Yan Sandan Najeriya",
  "Follow a crime report or an application with its reference number. No account needed.":
    "Bi diddigin rahoton laifi ko neman takarda da lambar shaidarsa. Ba a buƙatar asusu.",
  "Track a Reference | Nigeria Police Force":
    "Bi Diddigin Lambar Shaida | Rundunar 'Yan Sandan Najeriya",
  "{n} documents":
    "Takardu {n}",
  "{service} usually takes {turnaround}. We will tell you in your account and by email at each step.":
    "{service} yakan ɗauki {turnaround}. Za mu sanar da kai a asusunka da ta imel a kowane mataki.",
  "Address":
    "Adireshi",
  "Anything else we should know":
    "Wani abu da ya kamata mu sani",
  "Anything else":
    "Wani abu kuma",
  "Application sent":
    "An aika da nema",
  "Applications are made from a public account. Officers decide them on the console.":
    "Ana yin nema ne daga asusun jama'a. Jami'ai suna yanke hukunci a kan na'urar sarrafa ayyuka.",
  "Applying as {name}":
    "Ana nema a matsayin {name}",
  "Attach this document.":
    "Haɗa wannan takarda.",
  "Check and send":
    "Duba ka aika",
  "Choose the Local Government Area.":
    "Zaɓi Ƙaramar Hukuma.",
  "Choose the state and area you live in. Your request goes to that State Command, and any visit you need to make is to the division that covers your area.":
    "Zaɓi jihar da yankin da kake zaune. Bukatarka za ta tafi ga waccan Rundunar Jihar, kuma duk wata ziyara da za ka yi za ta kasance ga sashen da ke kula da yankinka.",
  "Choose the state.":
    "Zaɓi jihar.",
  "Choose which applies to you.":
    "Zaɓi wanda ya shafe ka.",
  "Clear photos or scans are fine. Officers may ask to see the originals.":
    "Hotuna ko hotunan na'ura masu kyau sun isa. Jami'ai na iya neman ganin na asali.",
  "Confirm the declaration to send it.":
    "Tabbatar da sanarwar don aika ta.",
  "Enter a Nigerian mobile number, like 0803 123 4567.":
    "Shigar da lambar wayar Najeriya, kamar 0803 123 4567.",
  "Enter an email address, like name@example.com.":
    "Shigar da adireshin imel, kamar name@example.com.",
  "Enter your address.":
    "Shigar da adireshinka.",
  "Fee: {fee}. You pay once the command has accepted the application; you will get a payment notice in your account.":
    "Kuɗi: {fee}. Za ka biya da zarar rundunar ta karɓi nemanka; za ka sami sanarwar biya a asusunka.",
  "For example: a visa application, a new job, or a lost document.":
    "Misali: neman biza, sabon aiki, ko takardar da ta ɓace.",
  "Goes to":
    "Zai tafi ga",
  "House number, street and town.":
    "Lambar gida, titi da gari.",
  "Needed when applying: {case}":
    "Ana buƙata yayin nema: {case}",
  "None needed":
    "Ba a buƙata",
  "Phone":
    "Waya",
  "Purpose":
    "Dalili",
  "Reference {ref}, status: {status}.":
    "Lambar shaida {ref}, matsayi: {status}.",
  "Say what you need this for, in a sentence.":
    "Faɗi abin da kake buƙatarsa, a jimla ɗaya.",
  "Send application":
    "Aika nema",
  "State you live in":
    "Jihar da kake zaune",
  "The information and documents I have given are true and my own. I understand that false statements or forged documents are an offence and will end the application.":
    "Bayanai da takardun da na bayar gaskiya ne kuma nawa ne. Na fahimci cewa bayanan ƙarya ko takardun jabu laifi ne kuma za su kawo ƙarshen nemana.",
  "This service is free.":
    "Wannan sabis kyauta ne.",
  "This service needs no documents. Continue to check and send.":
    "Wannan sabis ba ya buƙatar takardu. Ci gaba don duba ka aika.",
  "Up to 3 files, 10 MB each. Photo or PDF.":
    "Har zuwa fayiloli 3, MB 10 kowanne. Hoto ko PDF.",
  "What do you need it for?":
    "Me kake buƙatarsa?",
  "Where the decision and any certificate are sent.":
    "Inda za a aika hukunci da kowace takardar shaida.",
  "Where":
    "Ina",
  "Which applies to you?":
    "Wanne ya shafe ka?",
  "Which command handles your request?":
    "Wace runduna ce za ta kula da bukatarka?",
  "You already have this request open":
    "Kana da wannan buƙatar a buɗe tuni",
  "Your address":
    "Adireshinka",
  "Your reference number":
    "Lambar shaidarka",
  "{unit} will be stood down: units only attend calls in their own command.":
    "Za a janye {unit}: ƙungiyoyi suna halartar kira ne kawai a rundunarsu.",
  "Allen Avenue, by the filling station":
    "Allen Avenue, kusa da gidan mai",
  "Anonymous":
    "Ba suna",
  "Choose a state first":
    "Zaɓi jiha tukuna",
  "Choose a state":
    "Zaɓi jiha",
  "Choose one of {n} areas":
    "Zaɓi ɗaya daga cikin yankuna {n}",
  "Do not call — not safe":
    "Kada a kira — ba lafiya",
  "Evidence":
    "Shaida",
  "Happened":
    "Ya faru",
  "Injuries":
    "Raunuka",
  "Local Government Area":
    "Ƙaramar Hukuma",
  "Reference, type, area, LGA, officer or callsign":
    "Lambar shaida, nau'i, yanki, ƙaramar hukuma, jami'i ko alamar kira",
  "Reporter":
    "Mai rahoto",
  "State":
    "Jiha",
  "Street or landmark":
    "Titi ko alama",
  "Transfer the call":
    "Mayar da kiran",
  "Transfer":
    "Mayar",
  "Wrong command or division? Transfer the call":
    "Runduna ko sashe ba daidai ba? Mayar da kiran",
  "Units on duty by section, with how many are available":
    "Ƙungiyoyin da ke bakin aiki bisa sashe, da yawan waɗanda ke samuwa",
  "No command set: route it before deciding.":
    "Ba a saita runduna ba: tura ta kafin yanke hukunci.",
  "Open the call on the board":
    "Buɗe kiran a kan allo",
  "Refuse":
    "Ƙi",
  "The applicant is not resident in this command.":
    "Mai nema ba ya zaune a cikin wannan rundunar.",
  "Why is it refused? The applicant reads this.":
    "Me yasa aka ƙi? Mai nema zai karanta wannan.",
  "All commands":
    "Duk rundunoni",
  "Command in view":
    "Rundunar da ake gani",
  "Clear the search box or pick every section to see the whole shift again.":
    "Share akwatin bincike ko zaɓi kowane sashe don sake ganin dukan aikin.",
  "Every section":
    "Kowane sashe",
  "Section":
    "Sashe",
  "{n} of 4,000 characters":
    "{n} cikin haruffa 4,000",
  "About what time?":
    "Kusan wane lokaci?",
  "About you":
    "Game da kai",
  "An officer contacts you if they need more, and you can follow every step.":
    "Jami'i zai tuntuɓe ka idan yana buƙatar ƙari, kuma za ka iya bin kowane mataki.",
  "Attached":
    "An haɗa",
  "Call 112 now. It is free from any phone.":
    "Kira 112 yanzu. Kyauta ne daga kowace waya.",
  "Choose how you want to report.":
    "Zaɓi yadda kake son yin rahoto.",
  "Choose the state it happened in.":
    "Zaɓi jihar da abin ya faru.",
  "Choose what happened.":
    "Zaɓi abin da ya faru.",
  "Come back to this report once you are safe.":
    "Dawo kan wannan rahoto da zarar kana cikin aminci.",
  "Confirm the report is true to send it.":
    "Tabbatar cewa rahoton gaskiya ne don aika shi.",
  "Date and time":
    "Kwanan wata da lokaci",
  "Details":
    "Cikakkun bayanai",
  "Enter the date it happened.":
    "Shigar da ranar da abin ya faru.",
  "Enter your name.":
    "Shigar da sunanka.",
  "Federal Capital Territory":
    "Babban Birnin Tarayya",
  "Follow it with your reference number. Nobody will contact you.":
    "Bi diddiginsa da lambar shaidarka. Babu wanda zai tuntuɓe ka.",
  "Follow this report":
    "Bi diddigin wannan rahoto",
  "Give a street, landmark or village so officers can find it.":
    "Ba da titi, alama ko ƙauye don jami'ai su same shi.",
  "Give my name and number":
    "Ba da sunana da lambata",
  "Have an account?":
    "Kana da asusu?",
  "How do you want to report?":
    "Ta yaya kake son yin rahoto?",
  "I am safe, continue the report":
    "Ina cikin aminci, ci gaba da rahoton",
  "I want to report something that has happened":
    "Ina son kai rahoton wani abu da ya faru",
  "If someone is hurt, a crime is still going on, or you are not safe, call first. A form is not the fastest way to reach officers.":
    "Idan wani ya ji rauni, laifi yana ci gaba, ko kuma ba ka cikin aminci, ka fara kira. Fom ba hanya mafi sauri ba ce ta isa ga jami'ai.",
  "In your own words: what you saw, what was taken or damaged, and anything said.":
    "Da kalmominka: abin da ka gani, abin da aka ɗauka ko aka lalata, da duk abin da aka faɗa.",
  "Is anyone hurt?":
    "Akwai wanda ya ji rauni?",
  "Is anyone in danger right now?":
    "Akwai wanda ke cikin haɗari a yanzu?",
  "It is passed to the {division} to act on.":
    "Ana mika shi ga {division} don ɗaukar mataki.",
  "It is safe to call me on this number. Untick this if someone who should not know about the report might answer.":
    "Lafiya ne a kira ni a wannan lambar. Cire alamar idan wanda bai kamata ya sani game da rahoton ba zai iya ɗauka.",
  "Keep the reference number you get at the end. It is the only way to follow an anonymous report.":
    "Ka riƙe lambar shaidar da za ka samu a ƙarshe. Ita ce kawai hanyar bin diddigin rahoto marar suna.",
  "No, everyone is safe":
    "A'a, kowa yana cikin aminci",
  "Nobody can contact you, so add all the detail you can":
    "Babu wanda zai iya tuntuɓar ka, don haka ƙara duk cikakken bayanin da za ka iya",
  "Not happy with how your report is handled? The Complaint Response Unit takes calls on {calls} and WhatsApp on {whatsapp}.":
    "Ba ka gamsu da yadda ake kula da rahotonka ba? Sashen Amsa Ƙorafi yana karɓar kira a {calls} da WhatsApp a {whatsapp}.",
  "Officers can call you back and keep you updated":
    "Jami'ai za su iya kiran ka kuma su sanar da kai halin da ake ciki",
  "Officers may need to ask you something. You can also report without giving your name.":
    "Jami'ai na iya buƙatar tambayar ka wani abu. Za ka iya kuma yin rahoto ba tare da ba da sunanka ba.",
  "Phone number to call you on":
    "Lambar wayar da za a kira ka",
  "Photos, video or documents":
    "Hotuna, bidiyo ko takardu",
  "Pick the closest one. An officer can change it later.":
    "Zaɓi wanda ya fi kusa. Jami'i zai iya canza shi daga baya.",
  "Place":
    "Wuri",
  "Print or save":
    "Buga ko ajiye",
  "Read it through once. You can change anything before you send it.":
    "Karanta shi sau ɗaya. Za ka iya canza komai kafin ka aika.",
  "Report anonymously":
    "Yi rahoto ba tare da suna ba",
  "Report received":
    "An karɓi rahoto",
  "Reporting is free. No officer may ask you for money to take a report, to investigate it, or for bail.":
    "Yin rahoto kyauta ne. Babu jami'in da zai nemi kuɗi daga gare ka don karɓar rahoto, bincike, ko beli.",
  "Send report":
    "Aika rahoto",
  "Someone is hurt, threatened, or it is happening now":
    "Wani ya ji rauni, ana yi masa barazana, ko yana faruwa yanzu",
  "Start again":
    "Fara daga farko",
  "State it happened in":
    "Jihar da abin ya faru",
  "Suspects or vehicles":
    "Waɗanda ake zargi ko motoci",
  "Suspects or vehicles:":
    "Waɗanda ake zargi ko motoci:",
  "Tell us a little more: at least a sentence or two.":
    "Ƙara gaya mana kaɗan: aƙalla jimla ɗaya ko biyu.",
  "Tell us what happened":
    "Gaya mana abin da ya faru",
  "Tell us when it happened.":
    "Gaya mana lokacin da ya faru.",
  "Tell us whether anyone is hurt.":
    "Gaya mana ko akwai wanda ya ji rauni.",
  "Tell us whether anyone is in danger.":
    "Gaya mana ko akwai wanda ke cikin haɗari.",
  "That date is in the future.":
    "Wannan ranar tana nan gaba.",
  "The {command} control room reads your report and grades it.":
    "Ɗakin kula na {command} zai karanta rahotonka kuma ya tantance muhimmancinsa.",
  "This decides which State Command and which division get your report. Choose where it happened, not where you live.":
    "Wannan ne zai tantance wace Rundunar Jiha da wane sashe za su karɓi rahotonka. Zaɓi inda abin ya faru, ba inda kake zaune ba.",
  "to follow this report from your account.":
    "don bin diddigin wannan rahoto daga asusunka.",
  "Type of crime":
    "Nau'in laifi",
  "We kept the report you started.":
    "Mun adana rahoton da ka fara.",
  "We will use your account details. Check the number we should call.":
    "Za mu yi amfani da bayanan asusunka. Duba lambar da ya kamata mu kira.",
  "What happened":
    "Abin da ya faru",
  "What happened?":
    "Me ya faru?",
  "What happens next":
    "Abin da zai biyo baya",
  "What I have written is true to the best of my knowledge. I understand that knowingly making a false report to the police is an offence.":
    "Abin da na rubuta gaskiya ne gwargwadon sanina. Na fahimci cewa yin rahoton ƙarya ga 'yan sanda da gangan laifi ne.",
  "What they looked like, what they wore, names if known, plate numbers, which way they went.":
    "Yadda suke, abin da suka sa, sunaye idan an sani, lambobin mota, ta wace hanya suka bi.",
  "When did it happen?":
    "Yaushe ya faru?",
  "When":
    "Lokaci",
  "Where did it happen?":
    "Ina ya faru?",
  "Write it down or take a screenshot. Quote it whenever you contact the police about this.":
    "Rubuta shi ko ɗauki hoton allo. Ambace shi duk lokacin da ka tuntuɓi 'yan sanda game da wannan.",
  "Yes, someone is in danger":
    "Ee, akwai wanda ke cikin haɗari",
  "Your best guess is fine.":
    "Kimantawarka ta isa.",
  "Report it now":
    "Kai rahoto yanzu",
  "Track a reference":
    "Bi diddigin lambar shaida",
  "A NIN is eleven digits, like 12345678901.":
    "NIN lambobi goma sha ɗaya ne, kamar 12345678901.",
  "Enter your NIN.":
    "Shigar da NIN ɗinka.",
  "Enter your password.":
    "Shigar da kalmar sirrinka.",
  "Passwords are at least 8 characters.":
    "Kalmomin sirri haruffa 8 ne aƙalla.",
  "Case closed":
    "An rufe shari'a",
  "Officers assigned":
    "An tura jami'ai",
  "Reopened":
    "An sake buɗewa",
  "Transferred":
    "An mayar",
  "What you told us":
    "Abin da ka gaya mana",
  "A reference looks like NPF-4418 or NPF-2026-1234.":
    "Lambar shaida tana kama da NPF-4418 ko NPF-2026-1234.",
  "Find":
    "Nemo",
  "Nothing matches {ref}. Check the number, or contact the command you reported to.":
    "Babu abin da ya dace da {ref}. Duba lambar, ko tuntuɓi rundunar da ka kai wa rahoto.",
  "Reference number":
    "Lambar shaida",
  "{lga} Division":
    "Sashen {lga}",
  "Choose the state first.":
    "Zaɓi jihar tukuna.",
  "Finding you…":
    "Ana nemo ka…",
  "Street, landmark or village":
    "Titi, alama ko ƙauye",
  "The division is set by the area you choose.":
    "Yankin da ka zaɓa ne ke tantance sashen.",
  "This goes to":
    "Wannan zai tafi ga",
  "Use my location":
    "Yi amfani da wurina",
  "We could not get your location. Choose the state instead.":
    "Ba mu iya samun wurinka ba. Zaɓi jihar a maimakon haka.",
  "We picked the state nearest to you. Check it is right.":
    "Mun zaɓi jihar da ta fi kusa da kai. Duba ko daidai ne.",
  "What an officer would need to find the place: a street and number, or the nearest landmark.":
    "Abin da jami'i zai buƙata don gano wurin: titi da lamba, ko alamar da ta fi kusa.",
  "(done)":
    "(an gama)",
  "(optional)":
    "(ba dole ba)",
  "Add another file":
    "Ƙara wani fayil",
  "Back":
    "Koma baya",
  "Change":
    "Canza",
  "Choose files":
    "Zaɓi fayiloli",
  "Continue":
    "Ci gaba",
  "Remove {file}":
    "Cire {file}",
  "Step {n} of {total}":
    "Mataki na {n} cikin {total}",
  "Steps":
    "Matakai",
  "Too large to attach: {files}":
    "Sun yi girma da yawa don haɗawa: {files}",
  "Up to {max} files, {mb} MB each. Photos, video, audio or PDF.":
    "Har zuwa fayiloli {max}, MB {mb} kowanne. Hotuna, bidiyo, sauti ko PDF.",
  "Federal Ministry of Police Affairs":
    "Ma'aikatar Harkokin 'Yan Sanda ta Tarayya",
  "Report a Crime":
    "Kai Rahoton Laifi",
  "Track a Reference":
    "Bi Diddigin Lambar Shaida",
  "Follow a report or an application with its reference number":
    "Bi diddigin rahoto ko nema da lambar shaidarsa",
  "Tell the State Command where it happened. You can stay anonymous":
    "Sanar da Rundunar Jihar da abin ya faru. Za ka iya ɓoye sunanka",
  "On your POSSAP invoice":
    "A kan takardar biyan POSSAP ɗinka",
  "Armed robbery":
    "Fashi da makami",
  "Burglary":
    "Sata ta hanyar fasa gida",
  "Domestic violence":
    "Cin zarafi a gida",
  "Drug offence":
    "Laifin ƙwayoyi",
  "Kidnapping":
    "Garkuwa da mutane",
  "Sexual assault":
    "Cin zarafin jima'i",
  "Something else":
    "Wani abu daban",
  "Suspicious activity":
    "Abin da ake zargi",
  "Threats or intimidation":
    "Barazana ko tsoratarwa",
  "Vandalism":
    "Lalata dukiya",
  "Vehicle theft":
    "Satar abin hawa",
  "Highway Patrol":
    "Sintiri na Babban Titi",
  "No":
    "A'a",
  "Not sure":
    "Ban tabbata ba",
  "Yes":
    "Ee",
  "A car, motorcycle or tricycle was stolen":
    "An sace mota, babur ko keke napep",
  "A crime that is not on this list":
    "Laifin da ba ya cikin wannan jerin",
  "A person, vehicle or package that looks wrong":
    "Mutum, abin hawa ko kunshin da ba ya da kyau",
  "Call your bank first to freeze the transfer. Keep receipts, account numbers and the messages.":
    "Ka fara kiran bankinka don a dakatar da canjin kuɗin. Ka riƙe rasidai, lambobin asusu da saƙonnin.",
  "Do not pay or negotiate alone. Keep every message and call record from the kidnappers.":
    "Kada ka biya ko ka yi ciniki kai kaɗai. Ka riƙe kowane saƙo da tarihin kira daga masu garkuwa.",
  "Drugs being sold, made or used":
    "Ana sayarwa, yi ko amfani da ƙwayoyi",
  "Every command has a Gender Desk. Say if it is not safe for us to call you at home.":
    "Kowace runduna tana da Teburin Jinsi. Ka faɗa idan ba lafiya ba ne mu kira ka a gida.",
  "Hacking, online scams, sextortion or harassment online":
    "Kutse, zamba ta intanet, cin zarafin jima'i ta intanet ko tsangwama ta intanet",
  "Have the plate number, chassis number and the vehicle papers ready.":
    "Ka shirya lambar mota, lambar chassis da takardun motar.",
  "If you can, leave things as you found them until officers arrive.":
    "Idan za ka iya, bar abubuwa yadda ka same su har jami'ai su iso.",
  "Money taken by a scam, a fake deal or a bad cheque":
    "Kuɗin da aka karɓa ta zamba, cinikin bogi ko cak marar kuɗi",
  "Phone, bag, money or goods taken without force":
    "Waya, jaka, kuɗi ko kaya da aka ɗauka ba tare da ƙarfi ba",
  "Property, a vehicle or public facilities damaged":
    "An lalata dukiya, abin hawa ko kayayyakin jama'a",
  "Rape, sexual assault or abuse, of an adult or a child":
    "Fyaɗe, cin zarafin jima'i ko cin zarafi, na babba ko yaro",
  "Someone broke into a home, shop or office":
    "Wani ya fasa gida, shago ko ofis",
  "Someone has been taken or is being held":
    "An ɗauke wani ko ana riƙe da shi",
  "Someone has not come home and cannot be reached":
    "Wani bai dawo gida ba kuma ba a iya samunsa",
  "Someone threatened to hurt you or your family":
    "Wani ya yi barazanar cutar da kai ko iyalinka",
  "Someone used or showed a weapon to take something":
    "Wani ya yi amfani da makami ko ya nuna shi don ɗaukar wani abu",
  "Someone was attacked, beaten or wounded":
    "An kai wa wani hari, an buge shi ko an raunata shi",
  "Take screenshots with the date showing, and do not delete the chats or the account.":
    "Ɗauki hotunan allo da ke nuna kwanan wata, kuma kada ka share hirarrakin ko asusun.",
  "There is no waiting period. Have a recent photograph ready and note what they were wearing.":
    "Babu lokacin jira. Ka shirya hoton kwanan nan kuma ka lura da abin da yake sanye da shi.",
  "Violence or threats from a partner or family member":
    "Tashin hankali ko barazana daga abokin zama ko ɗan uwa",
  "You can ask for a female officer. Try not to wash or change clothes before a medical examination, and keep what you were wearing.":
    "Za ka iya neman jami'a mace. Ka yi ƙoƙarin kada ka yi wanka ko canza tufafi kafin gwajin likita, kuma ka riƙe abin da kake sanye da shi.",
  "Before today":
    "Kafin yau",
  "Earlier today":
    "Da safiyar yau",
  "It is happening now":
    "Yana faruwa yanzu",
  "Application and processing fee":
    "Kuɗin nema da sarrafawa",
  "At least 72 hours":
    "Aƙalla awanni 72",
  "Most of the application is online. You then go to the command or formation you chose for your fingerprints and photograph to be taken.":
    "Yawancin neman a intanet ne. Daga nan za ka je rundunar ko sashin da ka zaɓa don a ɗauki zanen yatsunka da hotonka.",
  "NIN, BVN or international passport":
    "NIN, BVN ko fasfo na ƙasa da ƙasa",
  "Online, through the POSSAP invoice":
    "Ta intanet, ta takardar biyan POSSAP",
  "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable.":
    "Ka biya ta takardar biyan da POSSAP ta ba ka don neman kawai. Ba a mayar da kuɗin.",
  "Shown on your POSSAP invoice":
    "Ana nuna shi a takardar biyan POSSAP ɗinka",
  "State Police Commands":
    "Rundunonin 'Yan Sanda na Jihohi",
  "The Police Character Certificate states whether you have a criminal record in Nigeria. It is asked for by embassies, employers and schools, and is applied for through POSSAP, the Force's portal for paid services.":
    "Takardar Shaidar Hali ta 'Yan Sanda tana bayyana ko kana da tarihin aikata laifi a Najeriya. Ofisoshin jakadanci, masu ɗaukar aiki da makarantu ne ke nema, kuma ana nema ta POSSAP, shafin Rundunar na ayyukan da ake biya.",
  "Your personal and residence details must be accurate; a mismatch with your NIN, BVN or passport delays the certificate.":
    "Dole ne bayananka na kanka da na wurin zama su zama daidai; rashin daidaito da NIN, BVN ko fasfo ɗinka yana jinkirta takardar shaidar.",
  "Handled by":
    "Ana kula da shi a",
  "Copy":
    "Kwafi",
  "Copied":
    "An kwafa",
  "Against a person":
    "A kan mutum",
  "Home, shop or vehicle":
    "Gida, shago ko abin hawa",
  "Money and online":
    "Kuɗi da intanet",
  "Other crimes":
    "Sauran laifuka",
  // The tracker (2026-10-16). Yoruba and Igbo need native review.
  "A crime report":
    "Rahoton laifi",
  "On the receipt when you report it. Signed in, it is also kept in your account.":
    "A kan rasidin da ka samu lokacin da ka kai rahoto. Idan ka shiga, ana ajiye shi a asusunka ma.",
  "A service application":
    "Neman sabis",
  "On the screen when you apply, in your email, and in your account.":
    "A kan allo lokacin da ka nema, a imel ɗinka, da kuma a asusunka.",
  "Where to find your reference":
    "Inda za ka sami lambar shaidarka",
  "Lost it? Sign in to see everything you have sent.":
    "Ka rasa shi? Shiga don ganin duk abin da ka aika.",
  "since {time}":
    "tun {time}",
  "(current)":
    "(yanzu)",
  "History":
    "Tarihi",
  "The stages you will see":
    "Matakan da za ka gani",
  "This page updates as soon as the command moves it on.":
    "Wannan shafin yana sabuntawa da zarar rundunar ta ci gaba da shi.",
  "Stage {n} of {total}":
    "Mataki {n} cikin {total}",
  "All stages":
    "Duk matakai",
  "Next: {step}":
    "Na gaba: {step}",
  "Show": "Nuna",
  "Hide": "Ɓoye",
};
