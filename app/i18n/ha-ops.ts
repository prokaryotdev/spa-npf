/**
 * The operations console.
 *
 * Control-room vocabulary is kept short on purpose: these are column heads
 * and chips read at a glance across a shift, not prose. Callsigns, officer
 * names and grades (P1–P4) are identifiers and stay as they are.
 */
export const haOps: Record<string, string> = {
  // --- shell ---------------------------------------------------------------
  Command: "Umarni",
  "& Control": "da Kula",
  "Command board": "Allon umarni",
  "Operations Console | Nigeria Police Force":
    "Allon Ayyuka | Rundunar 'Yan Sandan Najeriya",
  "Operations | Nigeria Police Force":
    "Ayyuka | Rundunar 'Yan Sandan Najeriya",
  "Incidents | Nigeria Police Force":
    "Lamurra | Rundunar 'Yan Sandan Najeriya",
  "Units | Nigeria Police Force": "Rundunoni | Rundunar 'Yan Sandan Najeriya",
  "Service requests | Nigeria Police Force":
    "Buƙatun hidima | Rundunar 'Yan Sandan Najeriya",
  "Incident queue, deployment and service requests.":
    "Layin lamurra, tura jami'ai da buƙatun hidima.",
  "WAT · Shift {shift}": "WAT · Aikin {shift}",
  "End shift": "Kammala aiki",
  "Public site": "Shafin jama'a",
  "Checking credentials…": "Ana duba shaida…",
  "Force credentials required": "Ana buƙatar shaidar Rundunar",
  "You are signed in as {name}, a public account. The operations console is for Nigeria Police Force personnel.":
    "Ka shiga a matsayin {name}, asusun jama'a. Allon ayyuka na ma'aikatan Rundunar 'Yan Sandan Najeriya ne.",
  "Go to my account": "Je zuwa asusuna",
  "Sign in as an officer": "Shiga a matsayin jami'i",
  "Reset the demo": "Sake saita gwajin",
  "Illustrative data — a rebuild of the Nigeria Police Force website, connected to no operational system.":
    "Bayanan misali — sake gina shafin Rundunar 'Yan Sandan Najeriya, ba a haɗa shi da wani tsarin aiki na gaske ba.",

  // --- board ---------------------------------------------------------------
  "Status board": "Allon matsayi",
  "Live picture for Wuse control. Grades run P1 immediate to P4 scheduled.":
    "Hoto kai tsaye na ɗakin kula na Wuse. Matakai suna tafiya daga P1 na gaggawa zuwa P4 na jadawali.",
  "Show the numbers": "Nuna lambobin",
  "In the queue": "A cikin layi",
  "{n} waiting": "{n} suna jira",
  "queue clear": "layi a sarari",
  "unassigned calls": "kiran da ba a ba wa kowa ba",
  "dispatch now": "tura yanzu",
  "dispatch within {n}m": "tura cikin mintuna {n}",
  "Past target": "Wuce manufa",
  "all within target": "duka cikin manufa",
  "over {span}": "sama da {span}",
  "On the air": "Kan aiki",
  "on the air": "kan aiki",
  "Off the air": "Ba kan aiki",
  "Back on the air": "An dawo kan aiki",
  "units on the air": "rundunonin da ke kan aiki",
  "{n} free": "{n} a sake",
  "{n} committed": "{n} kan aiki",
  "units committed": "rundunonin da ke kan aiki",
  Committed: "Kan aiki",
  "No unit is currently committed to a call.":
    "Babu rundunar da ke kan wani kira a yanzu.",
  "Every unit is committed. New calls will hold in the queue.":
    "Duk rundunonin suna kan aiki. Sabbin kira za su jira a layi.",
  "Queue clear. Every call has a unit on it.":
    "Layi a sarari. Kowane kira yana da rundunar da ke kansa.",
  "Queue clear. Nothing is waiting on a decision.":
    "Layi a sarari. Babu abin da ke jiran hukunci.",
  "{n} calls closed": "An rufe kira {n}",
  "Response time": "Lokacin amsawa",
  "Median dispatch": "Matsakaicin turawa",
  "Call to arrival, last 12 hours. Target {n} minutes.":
    "Daga kira zuwa isowa, awanni 12 na ƙarshe. Manufa mintuna {n}.",
  "Median response time over the last 12 hours, in minutes":
    "Matsakaicin lokacin amsawa a awanni 12 na ƙarshe, da mintuna",
  "Median response time in minutes, by hour, over the last 12 hours":
    "Matsakaicin lokacin amsawa da mintuna, bisa awa, a awanni 12 na ƙarshe",
  "{hour}:00 — {minutes} minutes": "{hour}:00 — mintuna {minutes}",
  Hour: "Awa",
  Minutes: "Mintuna",
  "{n} divisions": "Sassa {n}",
  "Every division": "Kowane sashe",
  "Units on duty by division, with how many are available":
    "Rundunonin da ke kan aiki bisa sashe, da yawan waɗanda ke a sake",

  // --- calls ---------------------------------------------------------------
  Calls: "Kira",
  "All calls": "Duk kira",
  "Open only": "Buɗaɗɗu kaɗai",
  "Take a call": "Karɓi kira",
  "Call detail": "Bayanin kira",
  "Close call detail": "Rufe bayanin kira",
  "Filter calls": "Tace kira",
  "Any grade": "Kowane mataki",
  "Any status": "Kowane matsayi",
  "Call type": "Nau'in kira",
  "Type / area": "Nau'i / yanki",
  "Reference, type, area, officer or callsign":
    "Lambar tuntuɓa, nau'i, yanki, jami'i ko lambar rediyo",
  "No call matches those filters.": "Babu kiran da ya dace da waɗannan taceƙa.",
  "{shown} of {total} calls": "{shown} daga kira {total}",
  "Every call of the shift, newest first. Pick a row to dispatch it, move it on, or write the log.":
    "Kowane kira na aikin, sabo na farko. Ka zaɓi layi don ka tura shi, ka ci gaba da shi, ko ka rubuta bayanin.",
  "Calls, with grade, type, area, status, assigned unit and elapsed time":
    "Kira, tare da mataki, nau'i, yanki, matsayi, rundunar da aka ba da kuma lokacin da ya wuce",
  "Pick a row to dispatch it, move it on, or read the log.":
    "Ka zaɓi layi don ka tura shi, ka ci gaba da shi, ko ka karanta bayanin.",
  "What was reported": "Abin da aka ba da rahoto",
  "What the caller described, in their words where you can.":
    "Abin da mai kiran ya bayyana, cikin kalamansa inda za ka iya.",
  "Received via": "An karɓa ta",
  "Put it in the queue": "Sanya shi a layi",
  "Dispatch {ref} to a unit": "Tura {ref} zuwa runduna",
  "Dispatch — {n} free": "Tura — {n} a sake",
  "No unit free": "Babu rundunar da ke a sake",
  "No unit": "Babu runduna",
  "Not dispatched": "Ba a tura ba",
  "Clear call": "Rufe kira",
  "Reopen call": "Sake buɗe kira",
  "Move to": "Matsa zuwa",
  Log: "Bayani",
  "Add to the log": "Ƙara a bayanin",
  "Add a line to the log for {ref}": "Ƙara layi a bayanin {ref}",
  Add: "Ƙara",
  Ref: "Lamba",
  Grade: "Mataki",
  Area: "Yanki",
  Location: "Wuri",
  Elapsed: "Lokacin da ya wuce",
  "of {n}m": "daga mintuna {n}",
  "since call": "tun kira",
  Arrived: "Ya iso",
  Urgent: "Gaggawa",
  Immediate: "Nan take",
  Routine: "Na yau da kullum",
  Scheduled: "Na jadawali",
  "— held over 45 minutes": "— an riƙe sama da mintuna 45",

  // --- call types and sources ---------------------------------------------
  "Road traffic collision": "Karon mota a hanya",
  Assault: "Cin zarafi",
  Theft: "Sata",
  "Suspicious vehicle": "Motar da ake tuhuma",
  "Missing person": "Ɓatacce",
  "Noise disturbance": "Hayaniya",
  "Fraud report": "Rahoton zamba",
  "Cybercrime report": "Rahoton laifin yanar gizo",
  "Marine assistance": "Taimako a kan ruwa",
  "Lost child": "Yaron da ya ɓata",
  Shoplifting: "Satar kaya a shago",
  "112 call": "Kiran 112",
  "Rescue Me": "Ku Cece Ni",
  "Walk-in": "Zuwa da kai",
  "Website report": "Rahoto ta shafi",
  Cybercrime: "Laifin yanar gizo",

  // --- units ---------------------------------------------------------------
  Units: "Rundunoni",
  Unit: "Runduna",
  Division: "Sashe",
  Callsign: "Lambar rediyo",
  Officer: "Jami'i",
  Status: "Matsayi",
  "On duty": "Kan aiki",
  "On call": "A shirye",
  "on a call": "kan kira",
  Available: "A sake",
  Waiting: "Yana jira",
  Running: "Yana tafiya",
  Pending: "Yana jira",
  "Filter units": "Tace rundunoni",
  "Callsign, officer or area": "Lambar rediyo, jami'i ko yanki",
  "No unit matches that filter.": "Babu rundunar da ta dace da wannan taceƙa.",
  "{shown} of {total} units": "{shown} daga rundunoni {total}",
  "Units on duty, with status, elapsed time in that status, and the call they are assigned to":
    "Rundunonin da ke kan aiki, tare da matsayi, lokacin da aka ɗauka a wannan matsayi, da kiran da aka ba su",
  "Everyone on this shift and what they are on. The clock counts from the last status change.":
    "Duk wanda ke kan wannan aikin da abin da yake yi. Agogo yana ƙidaya tun canjin matsayi na ƙarshe.",
  "refuelling, training": "cika mai, horo",

  // --- callsigns and officers (identifiers, left as they read) ------------
  "Patrol 04": "Patrol 04",
  "Patrol 09": "Patrol 09",
  "Patrol 12": "Patrol 12",
  "Patrol 17": "Patrol 17",
  "Patrol 21": "Patrol 21",
  "Patrol 26": "Patrol 26",
  "Traffic 07": "Traffic 07",
  "Traffic 11": "Traffic 11",
  "Marine 02": "Marine 02",
  "Air Wing 01": "Air Wing 01",
  "K9 03": "K9 03",
  "Cybercrime 01": "Cybercrime 01",
  "Cpl. H. Suleiman": "Kfl. H. Suleiman",
  "Cpl. F. Adeyemi": "Kfl. F. Adeyemi",
  "Cpl. K. Ogundipe": "Kfl. K. Ogundipe",
  "Cpl. M. Eze": "Kfl. M. Eze",
  "Cpl. T. Yakubu": "Kfl. T. Yakubu",
  "Sgt. R. Okafor": "Saj. R. Okafor",
  "Sgt. M. Danladi": "Saj. M. Danladi",
  "Sgt. A. Garba": "Saj. A. Garba",
  "Sgt. Y. Musa": "Saj. Y. Musa",
  "Insp. S. Bello": "Sufa. S. Bello",
  "Insp. N. Aliyu": "Sufa. N. Aliyu",
  "ASP O. Nwosu": "ASP O. Nwosu",

  // --- service requests ----------------------------------------------------
  "Service requests": "Buƙatun hidima",
  "Applications waiting on a decision. Anything you do here appears on the applicant’s own screen within the second.":
    "Buƙatun da ke jiran hukunci. Duk abin da ka yi nan yana bayyana a allon mai neman cikin daƙiƙa ɗaya.",
  "Filter requests": "Tace buƙatu",
  "Reference or service": "Lambar tuntuɓa ko aiki",
  "No request matches that search.":
    "Babu buƙatar da ta dace da wannan binciken.",
  "{shown} of {total} requests": "{shown} daga buƙatu {total}",
  "{ref} · submitted {date} · {fee} · via {channel}":
    "{ref} · an gabatar {date} · {fee} · ta {channel}",
  "Start review": "Fara bita",
  "Ask for more": "Nemi ƙari",
  "What does the applicant need to do?":
    "Me mai neman yake buƙatar ya yi?",
  "Upload a clearer copy of the passport photo page.":
    "Ka ɗora kwafi mai haske na shafin hoton fasfo.",
  "Send to applicant": "Aika wa mai neman",
  "With the applicant": "Yana hannun mai neman",
  "we asked for more": "mun nemi ƙari",
  "awaiting a decision": "yana jiran hukunci",
  "conditions not met": "ba a cika sharuɗɗa ba",
  Approve: "Amince",
  Reject: "Ƙi",
  Rejected: "An ƙi",
  Cancel: "Soke",
};
