export type Service = {
  slug: string;
  name: string;
  action: string;
  category: string | null;
  icon: string | null;
  description: string;
  audiences: string[];
  mostUsed: boolean;
  dashboardOrder: number | null;
  ninAuthOnly: boolean;
  fees: { label: string; value: string }[];
  feeSummary: string;
  payment: string[];
  documents: { label: string; items: string[] }[];
  beneficiaries: string[];
  channels: string[];
  delivery: string;
  hours: { label: string; value: string }[];
  contacts: string[];
  turnaround: string;
  terms: string[];
  related: { name: string; slug: string }[];
};

export const services: Service[] = [
  {
    slug: "application-status",
    name: "Application Status",
    action: "Inquire",
    category: null,
    icon: "/icons/services/application-status.svg",
    description:
      "This service allows users to track the status of their application using the reference number.",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  // Source: Police Service Commission (psc.gov.ng); TheCable 2022; 2026 exercise
  {
    category: "Community Engagement",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [],
    slug: "apply-for-a-job",
    name: "Join the Nigeria Police Force",
    action: "Apply",
    icon: "/icons/services/job-vacancies.svg",
    description: "Constables are recruited by the Police Service Commission in national recruitment exercises. Applications are made online on the Commission's portal while an exercise is open. Recruitment is free: no payment is ever required.",
    audiences: [
      "Residents",
      "Students"
    ],
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "National Identification Number (NIN)",
        items: []
      },
      {
        label: "WAEC, NECO or equivalent result",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals"
    ],
    channels: [
      "Police Service Commission portal"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Set by each recruitment exercise",
    terms: [
      "Nigerian citizen by birth, with a National Identification Number.",
      "Aged 18 to 25 (the range in the 2022 exercise).",
      "At least five credits, including English and Mathematics, in WAEC, NECO or equivalent, in no more than two sittings.",
      "Minimum height 1.67 m for men and 1.64 m for women; men need a chest of at least 86 cm.",
      "Of good character, with no criminal conviction.",
      "Requirements are set for each exercise. Check the Commission's announcement before applying."
    ]
  },
  {
    slug: "service-attachment",
    name: "Attaching Documents",
    action: "Apply",
    category: null,
    icon: "/icons/services/file-attachment-02.svg",
    description:
      "This service enables users to attach the required documents to support their applications or electronic transactions with Nigeria Police Force . It allows relevant files to be uploaded directly .",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [
      "There must be an open report at the police station.",
      "Uploaded documents must be relevant to the application.",
    ],
    related: [],
  },
  {
    slug: "report-bounce-cheques",
    name: "Bounce Cheque Report",
    action: "Report",
    category: null,
    icon: "/icons/services/bounce-cheque.svg",
    description:
      "This service enables users to report bounced checks, settle the dispute amicably if possible, or refer the case directly to the competent authorities.",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Individuals",
        items: [
          "A copy of NIN",
          "A copy of the bounced cheque",
          "The bank's notice for bounced cheque",
        ],
      },
      {
        label: "Business sector",
        items: [
          "A Copy of NIN",
          "Trading License",
          "Approved signature",
          " Official letter from the company in Hausa requesting to file a bounced cheque complaint",
        ],
      },
      {
        label: "Additional requirements for the legal attorney",
        items: [
          "A copy of the NIN slip (the beneficiary of the cheque -client)",
          "A copy of the legal attorney",
        ],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
      "Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "4 Working Days",
    terms: [
      "The cheque must be received in Nigeria",
      "Visit the nearest competent police station to where the cheque was received",
      "The report must be filed by the director of the company named on the business license or their legal representative.",
      "Ensure that the bounced cheque is not among the cheques decriminalised by law and that it does not have existing and payable funds available for disbursement",
    ],
    related: [],
  },
  {
    slug: "report-bounce-cheques-bank",
    name: "Bounce Cheque Report for Banks",
    action: "Report",
    category: "Business and Corporates",
    icon: "/icons/services/bounce-cheque.svg",
    description:
      "This service enables users to report bounced checks, settle the dispute amicably if possible, or refer the case directly to the competent authorities.",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Individuals",
        items: [
          "A copy of NIN",
          "A copy of the bounced cheque",
          "The bank's notice for bounced cheque",
        ],
      },
      {
        label: "Business sector",
        items: [
          "Copy of the owner's NIN",
          "Trading License",
          "Approved signature",
          " Official letter from the company in Hausa requesting to file a bounced cheque complaint",
        ],
      },
      {
        label: "Additional requirements for the legal attorney",
        items: [
          "A copy of the NIN slip (the beneficiary of the cheque - client)",
          "A copy of the legal attorney",
        ],
      },
    ],
    beneficiaries: ["Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force Website",
      "Divisional Police Stations",
      "Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "4 Working Days",
    terms: [
      "The cheque must be received in Nigeria",
      "Visit the nearest competent police station to where the cheque was received",
      "The report must be filed by the director of the company named on the business license or their legal representative.",
      "Ensure that the bounced cheque is not among the cheques decriminalised by law and that it does not have existing and payable funds available for disbursement",
    ],
    related: [],
  },
  {
    slug: "child-protection",
    name: "Child Protection",
    action: "Request Support",
    category: null,
    icon: "/icons/services/child-protection.svg",
    description:
      "This service aims to provide an immediate and comprehensive response to cases involving children exposed to any form of physical or psychological abuse or neglect, by offering the necessary protection and support to ensure their safety and safeguard their rights in accordance with applicable laws.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Call Centre",
      "Divisional Police Stations",
      "Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Month",
    terms: [
      "The service is only available to children under 18 years old only.",
      "Incident must occur within Nigeria.",
      "There must be no existing court rulings on the same case.",
      "There must be no dispute about the case with the relevant authorities.",
      "The complaint must be irrelevant to the custody, financial support or visitations.",
    ],
    related: [],
  },
  {
    slug: "community-activities-participation",
    name: "Community Activities Participation",
    action: "View",
    category: "Community Engagement",
    icon: "/icons/services/heart-hand.svg",
    description:
      "Service to join volunteering initiatives or other Nigeria Police Force's initiatives",
    audiences: ["Residents", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Volunteer Platform",
        slug: "volunteer-platform",
      },
      {
        name: "Request Nigeria Police Force Activities",
        slug: "activity-request",
      },
    ],
  },
  {
    slug: "critical-care-response",
    name: "Critical Care Response",
    action: "Request Support",
    category: null,
    icon: "/icons/services/cardiac-support.svg",
    description:
      "This service aims to enable heart patients and those with critical medical conditions in Nigeria to register for priority ambulance dispatch and receive prompt and appropriate medical attention in case of an emergency.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "destroy-explosives",
    name: "Destroy Explosive Materials",
    action: "Request Support",
    category: null,
    icon: "/icons/services/destroy-explosives-and-ammunition.svg",
    description:
      "This service aims to enable the business sector to submit an official request to Nigeria Police Force for the safe disposal of expired explosives, ammunition, and fireworks, in accordance with approved procedures.",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "Per Kilogram",
        value: "₦16,000",
      },
      {
        label: "Technology Levy",
        value: "₦4,000",
      },
      {
        label: "stamp duty",
        value: "₦4,000",
      },
    ],
    feeSummary: "₦24,000",
    payment: ["Debit Card", "Credit Card", "Apple Pay"],
    documents: [
      {
        label: "Private Guard Company licence",
        items: [],
      },
      {
        label: "Security License",
        items: [],
      },
      {
        label: "Trade License",
        items: [],
      },
    ],
    beneficiaries: ["Business Sector"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "5 Working Days",
    terms: [
      "The applicant is fully responsible for any unlawful use or misuse of the provided service.",
      "The applicant acknowledges that the weight entered in the application is an estimated weight, and the actual weight will be accurately determined by the Nigeria Police Force upon approving the request and deliver the shipment to the police.",
      "The applicant declares that all data and information entered in the application are true and complete, and bears full legal responsibility in the event of any incorrect or misleading information.",
      "The applicant declares to complying with all laws, regulations, and instructions related to the handling and transportation of explosives within Nigeria.",
    ],
    related: [],
  },
  {
    slug: "document-inquiry",
    name: "Document Verification",
    action: "Apply",
    category: null,
    icon: "/icons/services/document-verification.svg",
    description:
      "This service enables users to verify the authenticity and validity of electronic documents issued by Nigeria Police Force that do not require an official stamp.",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "npf-personnel-welfare-and-support",
    name: "NPF Personnel Welfare and Support",
    action: "View",
    category: "Community Engagement",
    icon: "/icons/services/annotation-question.svg",
    description:
      "A medical and social care service for Nigeria Police Force's employees",
    audiences: ["Police officers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Retirees Support",
        slug: "retirees-services",
      },
    ],
  },
  {
    slug: "drug-awareness-lecture",
    name: "Drug Awareness Lecture",
    action: "Start Service",
    category: null,
    icon: "/icons/services/drugs.svg",
    description:
      "This service aims to enable organizations involved in drug control to meet their needs by conducting training courses or organizing specialized field workshops on drug control.",
    audiences: ["Organisations", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: true,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [
      "Individuals",
      "Business Sector",
      "NDLEA Personnel",
      "Customs Personnel",
      "Personnel Of Armed Forces And Border Crossings",
      "Inspection Equipment Specialists",
    ],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [],
    related: [],
  },
  {
    slug: "ecrime",
    name: "Cybercrime",
    action: "Apply",
    category: null,
    icon: "/icons/services/e-crime-3.svg",
    description:
      "This service allows individuals impacted by various types of criminal offenses to file complaints to the competent authorities who then refer the cases to the judicial authorities to ensure their rights are upheld",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Defendant's information",
        items: [],
      },
      {
        label: "A document proving the Cybercrime",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "emergency-case-request-sos",
    name: "Emergency Case Request (SOS)",
    action: "Apply",
    category: null,
    icon: "/icons/services/sos.svg",
    description:
      "This service allows customers and members of the community to communicate with the police to request help when they or others or their properties are at risk.",
    audiences: ["Residents", "Foreigners", "Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [
      "This service is to be used for emergency cases only",
      "This service may not be used for experimentation",
      "Important Notice: misuse of this service may result in legal actions taken against you.",
    ],
    related: [],
  },
  {
    slug: "event-security",
    name: "Events Security",
    action: "Request Support",
    category: null,
    icon: "/icons/services/event-security.svg",
    description:
      "This service allows government authorities or the businesses to request police presence at their events to ensure effectiveness by providing all security procedures and facilitating traffic, preventive measures and security and safety procedures.",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "The event's geolocation",
        items: [],
      },
      {
        label: "The event's time",
        items: [],
      },
      {
        label: "The event's program",
        items: [],
      },
      {
        label: "A list of workers' names",
        items: [],
      },
      {
        label: "Expected number of attendees",
        items: [],
      },
      {
        label: "Expected VIP attendees",
        items: [],
      },
      {
        label: "Name a coordinator from the event organizers",
        items: [],
      },
      {
        label: "National Film and Video Censors Board permit",
        items: [],
      },
      {
        label: "FRSC permit (if filming is on the road)",
        items: [],
      },
      {
        label: "State tourism authority's permit",
        items: [],
      },
      {
        label: "FRSC permit",
        items: [],
      },
      {
        label: "Nigeria Security and Civil Defence Corps permit",
        items: [],
      },
      {
        label: "General Department of Criminal Investigation (CID)'s permit",
        items: [],
      },
      {
        label: "State government's permit",
        items: [],
      },
      {
        label: "State sports council's permit",
        items: [],
      },
      {
        label: "FRSC permit (if the event will take place on a road)",
        items: [],
      },
      {
        label: "Nigeria Security and Civil Defence Corps permit",
        items: [],
      },
    ],
    beneficiaries: ["Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat"],
    turnaround: "5 Working Days",
    terms: [
      "An official letter from the event organizer, addressed to the Head of the Events Security Committee, containing the following:",
      "To request police presence for film and advertisement production:",
      "To request police presence for a community event:",
      "To request police presence for a sports event:",
    ],
    related: [],
  },
  {
    slug: "open-criminal-case",
    name: "File Criminal Complaint",
    action: "Report",
    category: null,
    icon: "/icons/services/file-criminal-complaint.svg",
    description:
      "This service enables users to submit criminal complaints of all kinds and to coordinate with the competent authorities to refer the complaint file to the judicial authorities after verifying the validity of the complaint.",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: true,
    dashboardOrder: 4,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Breach of Trust",
        items: [
          "Copy of NIN slip or Passport",
          "Certified legal auditor's report",
          "Power of Attorney (if applicable)",
          "Legal translation of documents in Hausa (if available)",
          "Trust receipt",
        ],
      },
      {
        label: "Forgery",
        items: [
          "Copy of NIN slip or Passport",
          "Document subject of the complaint (for examination purposes)",
          "Power of Attorney",
        ],
      },
      {
        label: "Fraud",
        items: [
          "Copy of NIN slip or Passport",
          "Account statement in case of bank transfer",
          "Proof of transfer if the transfer is non-banking (such as an electronic record or a receipt voucher)",
          "Proof of agreement or fraud in chats or documents",
          "Power of Attorney (if applicable)",
        ],
      },
      {
        label: "Defamation and Insult",
        items: [
          "Copy of NIN slip or Passport",
          "Screenshot of conversations containing insults or defamation translated to Hausa",
          "Power of Attorney (if applicable)",
        ],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
      "Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "4 Working Days",
    terms: [
      "Legal translation of documents into Hausa (if available)",
      "Visit/select the relevant police station based on the location of the incident",
    ],
    related: [],
  },
  {
    slug: "fine-payment",
    name: "Fines Inquiry and Payment",
    action: "Inquire",
    category: null,
    icon: "/icons/services/fines-inquiry-and-payment-2.svg",
    description:
      "A service to inquire about traffic violations, including the following: • Traffic Fines Payment: A service that enables the settlement of traffic violations registered against a vehicle plate, driving licence, or traffic code. • Traffic Fines Instalments: A service that allows for the payment of traffic violations in monthly instalments via direct debit or credit card, subject to applicable terms and conditions. • Pay Against Impound: A service that allows for the payment of a daily fee to waive a vehicle’s impoundment period, provided no legal restrictions apply. • Smart…",
    audiences: ["Drivers", "Organisations"],
    mostUsed: true,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "processing fee (per violation)",
        value: "₦4,000",
      },
      {
        label: "technology levy (per violation)",
        value: "₦4,000",
      },
    ],
    feeSummary: "₦8,000",
    payment: ["Debit Card", "Credit Card", "Apple Pay", "Cash"],
    documents: [],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website", "Call Centre"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Other",
        value:
          "Traffic Section at any State Command Headquarters, Monday to Thursday 07:30 - 15:30 and Friday 07:30 - 12:00…",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [
      "Online payments are accepted from within Nigeria and ECOWAS countries only using local proxies",
      "Credit and Debit Cards issued from outside Nigeria and ECOWAS countries are not accepted for online payments",
    ],
    related: [],
  },
  {
    slug: "inquiries-and-follow-up",
    name: "Inquiries and Follow-up",
    action: "View",
    category: "Inquiries and Follow-up",
    icon: "/icons/services/manage-search.svg",
    description:
      "Comprehensive service for applications status, Reports, and inquiries",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Document Verification",
        slug: "document-inquiry",
      },
      {
        name: "Submit an Inquiry",
        slug: "submit-inquiry",
      },
      {
        name: "Attaching Documents",
        slug: "service-attachment",
      },
      {
        name: "Application Status",
        slug: "application-status",
      },
    ],
  },
  {
    slug: "lost-and-found",
    name: "Lost & Found",
    action: "View",
    category: "Criminal Reports and Complaints",
    icon: "/icons/services/lost-certificate.svg",
    description:
      "This service enables users to report lost property or hand over found items to Nigeria Police Force for restoration to their rightful owners following verification. It also allows them to track their application status and obtain an official ‘Loss Certificate’",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "minor-traffic-accident-report",
    name: "Minor Traffic Accident Report",
    action: "Report",
    category: null,
    icon: "/icons/services/simple-accident-report-1.svg",
    description:
      "This service enables drivers of vehicles involved in minor or moderate traffic accidents without injuries, whether at fault or affected, to obtain an official report that allows them to proceed with insurance claims and complete the necessary procedures, provided the accident is not linked to a criminal case or that the driver was under the influence of alcohol.",
    audiences: ["Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "Issuing a Fine for the Liable Party",
        value: "₦200,000",
      },
      {
        label: "Processing Fee",
        value: "₦4,000",
      },
      {
        label: "Technology Levy",
        value: "₦4,000",
      },
    ],
    feeSummary: "₦208,000",
    payment: ["Debit Card", "Credit Card", "Apple Pay"],
    documents: [
      {
        label:
          "Vehicle photos from four sides, including the plate number (to verify data included in the report)",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Police Stations"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [
      "Request can only be made for accidents that occurred within the geographical limits of the",
      "If the drivers of the vehicles involved in the accident disagree, contact the relevant police station.",
      "It is not possible to attach or upload photos from the photo album, as photos of the damage must be taken directly",
      "The report is valid for 3 months from the date of issuance",
    ],
    related: [],
  },
  {
    slug: "neighborhood-police",
    name: "Neighbourhood Police",
    action: "Apply",
    category: null,
    icon: "/icons/services/neighborhood.svg",
    description:
      "This service aims to strengthen community policing by enabling residents to communicate directly with police officers through an interactive neighborhood platform, report concerns and suggestions, and collaborate in addressing local issues, thereby enhancing security, safety, and quality of life within the community.",
    audiences: ["Residents"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "on-site-police-support",
    name: "On-Site Police Support",
    action: "View",
    category: "Business and Corporates",
    icon: "/icons/services/shield-01.svg",
    description:
      "Serving various events and requests that require on-site police support",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Police Escort and Guard Services",
        slug: "escort-and-guard",
      },
      {
        name: "Supernumerary Police",
        slug: "supernumerary-police",
      },
      {
        name: "Destroy Explosive Materials",
        slug: "destroy-explosives",
      },
      {
        name: "Events Security",
        slug: "event-security",
      },
    ],
  },
  {
    slug: "pay-traffic-fines",
    name: "Pay Traffic Fines",
    action: "View",
    category: "Traffic Services",
    icon: "/icons/services/fines-inquiry-and-payment.svg",
    description: "Manage and pay traffic violations on your vehicle or license",
    audiences: ["Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Fines Inquiry and Payment",
        slug: "fine-payment",
      },
    ],
  },
  {
    slug: "persons-with-disabilities",
    name: "Persons with Disabilities Support",
    action: "Request Support",
    category: null,
    icon: "/icons/services/accessibility-support.svg",
    description:
      "This service aims to enable Persons with Disabilities with physical, hearing, or visual disabilities across all Nigeria to register and subscribe, ensuring they granted priority in ambulance dispatch and provided with a fast and appropriate response in emergency situations.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "police-clearance-certificate",
    name: "Police Clearance Certificate",
    action: "Apply",
    category: "Permits and Certificates",
    icon: "/icons/services/police-clearance-certificate.svg",
    // Sourced from POSSAP (possap.gov.ng) and the Force's own launch
    // announcements. Fee amounts are set per application on the POSSAP
    // invoice, so none is printed here.
    description:
      "The Police Character Certificate states whether you have a criminal record in Nigeria. It is asked for by embassies, employers and schools, and is applied for through POSSAP, the Force's portal for paid services.",
    audiences: ["Residents", "Foreigners", "Students"],
    mostUsed: true,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice",
      },
    ],
    feeSummary: "On your POSSAP invoice",
    payment: ["Online, through the POSSAP invoice"],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: [],
      },
    ],
    beneficiaries: ["Individuals"],
    channels: ["POSSAP", "State Police Commands"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit"],
    turnaround: "At least 72 hours",
    terms: [
      "Most of the application is online. You then go to the command or formation you chose for your fingerprints and photograph to be taken.",
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable.",
      "Your personal and residence details must be accurate; a mismatch with your NIN, BVN or passport delays the certificate.",
    ],
    related: [],
  },
  {
    slug: "museum-visit",
    name: "Police Museum Visit Permit",
    action: "Apply",
    category: null,
    icon: "/icons/services/police-museum-visit-permit.svg",
    description:
      "This service enables customers to obtain a permit to visit the Nigeria Police Force Museum and view its collections and security history.",
    audiences: ["Residents", "Foreigners", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals", "Governmental Entities", "General Public"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Other",
        value: "Monday - Thursday 9:00AM - 14:00PM Friday 9:00AM - 11:00AM",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat"],
    turnaround: "5 Working Days",
    terms: [],
    related: [],
  },
  {
    slug: "human-trafficking",
    name: "Provide Care for Human Trafficking Victims",
    action: "Report",
    category: null,
    icon: "/icons/services/human-trafficking-victims.svg",
    description:
      "This service enables individuals to report suspected cases or practices related to human trafficking such as labor exploitation, sexual exploitation, or organ trafficking. It also aims to protect the privacy of individuals and ensure that information reaches the competent authorities in a secure and safe manner.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "attachments that reflect the subject of the complaint",
        items: [],
      },
    ],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Call Centre",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Other",
        value: "General Department of Human Rights 7:30 - 15:30",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "2 Working Days",
    terms: [],
    related: [],
  },
  {
    slug: "seminar-request",
    name: "Public Lecture",
    action: "Apply",
    category: null,
    icon: "/icons/services/lecturer-request-2.svg",
    description:
      "This service discusses the most critical issues, challenges and developments in drug control. It examines the topic from multiple perspectives with a team of specialists, aiming to develop solutions and recommendations for these concerns.",
    audiences: ["Organisations", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "An official letter from the requesting party",
        items: [],
      },
    ],
    beneficiaries: [
      "Business Sector",
      "School Students",
      "Customs Personnel",
      "Personnel Of Armed Forces And Border Crossings",
      "Inspection Equipment Specialists",
    ],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [],
    related: [],
  },
  {
    slug: "public-tender",
    name: "Public Tenders",
    action: "Apply",
    category: null,
    icon: "/icons/services/public-tenders.svg",
    description:
      "The service is for companies wishing to register as one of the suppliers in the Nigeria Police Force Supplier Registry, which will allow them to access tenders, receive tender award notices, and deal with Nigeria Police Force electronically",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Business Sector"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "5 Working Days",
    terms: [],
    related: [],
  },
  {
    slug: "report-a-vehicle-or-driver",
    name: "Report a Vehicle or Driver",
    action: "View",
    category: "Traffic Services",
    icon: "/icons/services/drive-mode.svg",
    description: "Report obstructing vehicles and misuse of traffic rules",
    audiences: ["Residents", "Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Report Traffic Offences or Irresponsible Driver",
        slug: "reckless-driver",
      },
      {
        name: "Reporting Vehicle Obstruction",
        slug: "vehicle-obstruction",
      },
    ],
  },
  {
    slug: "report-criminal-complaint",
    name: "Report Criminal Complaint",
    action: "View",
    category: "Criminal Reports and Complaints",
    icon: "/icons/services/file-criminal-complaint-2.svg",
    description:
      "A service to file various crime reports and related complaints",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Report a Missing Person",
        slug: "missing-person",
      },
      {
        name: "Report Sexual or Gender-Based Violence",
        slug: "gender-based-violence",
      },
      {
        name: "Complaint Against a Police Officer",
        slug: "complaint-against-officer",
      },
      {
        name: "Bounce Cheque Report",
        slug: "report-bounce-cheques",
      },
      {
        name: "Reporting E-Crime",
        slug: "ecrime",
      },
      {
        name: "File Criminal Complaint",
        slug: "open-criminal-case",
      },
    ],
  },
  {
    slug: "report-found-item",
    name: "Report Found Item",
    action: "Report",
    category: null,
    icon: "/icons/services/found-item-certificate.svg",
    description:
      "This service enables individuals and organizations within Nigeria to hand over found items to police stations or designated partners participating in the Lost and Found Program. The objective is to facilitate the process of locating and returning lost items to their rightful owners",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label:
          "Organizations (Government Entities and Businesses) : A detailed report of the found items must be provided",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Other",
        value:
          "Any Divisional Police Headquarters, 7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "2 Working Days",
    terms: [
      "In cases where official documents are found by government entities or businesses, they must be handed over to the nearest police station within 48 hours.",
      "The Force's procedures for lost and found property apply.",
    ],
    related: [],
  },
  {
    slug: "report-lost-item",
    name: "Report Lost Item",
    action: "Report",
    category: null,
    icon: "/icons/services/lost-item.svg",
    description:
      "This service allows individuals to report the loss of their belongings or personal items and ensures communication with the owner if the item is found. With the option to request Lost certificate (subject to a fees), which can be used with other official entities.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: true,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "Certificate fee if requested",
        value: "₦20,000",
      },
      {
        label: "Stamp Duty",
        value: "₦4,000",
      },
      {
        label: "Technology Levy",
        value: "₦4,000",
      },
      {
        label:
          "An additional fee applies if the application is submitted in person at a police station",
        value: "₦40,000",
      },
    ],
    feeSummary: "From ₦8,000",
    payment: ["Debit Card", "Credit Card", "Apple Pay", "Cash"],
    documents: [
      {
        label:
          "Any evidence or documentation related to the lost item (if available)",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website", "Police Stations"],
    delivery:
      '• **Email**: The digital version of the certificate will be sent to your registered email address as soon as it is issued. • **Personal Dashboard**: Log in to your Nigeria Police Force account, navigate to "My Requests" section in your personal dashboard, search for your request, and then download the certificate directly. • **Direct Inquiry**: You can download the certificate through "Application Status" service using only your reference number.',
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "3 Working Days",
    terms: [
      "The lost items must be within Nigeria",
      "The certificate is valid for one month from issuance date",
    ],
    related: [],
  },
  {
    slug: "reckless-driver",
    name: "Report Traffic Offences or Irresponsible Driver",
    action: "Report",
    category: null,
    icon: "/icons/services/report-driver.svg",
    description:
      "Report dangerous driving, improper lane changes, or aggressive behavior on the road.",
    audiences: ["Residents", "Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: ["Nigeria Police Force App"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: ["Incident must occur within Nigeria."],
    related: [],
  },
  {
    slug: "ecrime-101364",
    name: "Reporting E-Crime",
    action: "Report",
    category: null,
    icon: "/icons/services/e-crime.svg",
    description:
      "This service allows individuals impacted by various types of criminal offenses to file complaints to the competent authorities who then refer the cases to the judicial authorities to ensure their rights are upheld.",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: true,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Defendant's information",
        items: [],
      },
      {
        label: "A document proving the Cybercrime",
        items: [],
      },
      {
        label: "Accused information",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [
      "The incident must occur within Nigeria.",
    ],
    related: [],
  },
  {
    slug: "vehicle-obstruction",
    name: "Reporting Vehicle Obstruction",
    action: "Report",
    category: null,
    icon: "/icons/services/vehicle-obstruction-2.svg",
    description:
      "This service enables customers to report vehicles obstructing their movement, with the vehicle owner automatically notified via a warning SMS to move the vehicle immediately.",
    audiences: ["Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Call Centre",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "request-a-certificate",
    name: "Request a Certificate",
    action: "View",
    category: "Permits and Certificates",
    icon: "/icons/services/certificate-03.svg",
    description:
      "A Service to obtain various official certificates issued by Nigeria Police Force",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Police Extract",
        slug: "police-extract",
      },
      {
        name: "CID Clearance Certificate",
        slug: "cid-clearance",
      },
      {
        name: "Police Investigation Report",
        slug: "investigation-report",
      },
      {
        name: "Police Clearance Certificate",
        slug: "police-clearance-certificate",
      },
    ],
  },
  {
    slug: "request-a-lecture-or-training-course",
    name: "Request a Lecture or Training Course",
    action: "View",
    category: "Business and Corporates",
    icon: "/icons/services/lecturer-request.svg",
    description:
      "To arrange lectures, courses, and specialised workshops in various fields",
    audiences: ["Organisations", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Drug Awareness Lecture",
        slug: "drug-awareness-lecture",
      },
      {
        name: "Student Awareness",
        slug: "student-awareness",
      },
      {
        name: "Public Lecture",
        slug: "seminar-request",
      },
    ],
  },
  {
    slug: "request-a-permit",
    name: "Request a Permit",
    action: "View",
    category: "Permits and Certificates",
    icon: "/icons/services/check-circle.svg",
    description:
      "A Service to obtain various official permits issued by Nigeria Police Force",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Tinted Glass Permit",
        slug: "tinted-glass-permit",
      },
      {
        name: "Firearm Licence",
        slug: "firearm-licence",
      },
      {
        name: "Police Museum Visit Permit",
        slug: "museum-visit",
      },
      {
        name: "Road Closure Permit",
        slug: "close-road",
      },
      {
        name: "Visit a Detainee or Inmate Permit",
        slug: "detainee-visit",
      },
    ],
  },
  {
    slug: "activity-request",
    name: "Request Nigeria Police Force Activities",
    action: "Apply",
    category: null,
    icon: "/icons/services/military-tech.svg",
    description:
      "This service enables individuals, entities, and organizations to request the participation of Nigeria Police Force specialized units, such as the Mounted Police, Music Band, K9 Unit, and Highway Patrols in official events, festivals, and public parades held across Nigeria.",
    audiences: ["Organisations", "Students"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "5 Working Days",
    terms: [],
    related: [],
  },
  {
    slug: "request-to-contact-the-police",
    name: "Request to Contact The Police",
    action: "View",
    category: "Community Engagement",
    icon: "/icons/services/phone-call-01.svg",
    description:
      "Connect with NPF leadership or relevant specialists in related fields",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
    ],
  },
  {
    slug: "retirees-services",
    name: "Retirees Support",
    action: "Apply",
    category: null,
    icon: "/icons/services/police-retirees.svg",
    description:
      "This service enables Nigeria Police Force retirees to access a comprehensive package of dedicated services designed to strengthen communication and facilitate their access to various benefits. The services include the issuance and renewal of military and civil identification cards, issuance and renewal of the “POSSAP” card, military health insurance, medical treatment and equipment requests, issuance of different types of service certificates, and home visit arrangements for senior citizens and individuals unable to attend in person.",
    audiences: ["Police officers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Nigeria Police Force Pensioners"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [],
    related: [],
  },
  {
    slug: "close-road",
    name: "Road Closure Permit",
    action: "Apply",
    category: null,
    icon: "/icons/services/road-closure-permit.svg",
    description:
      "This service enables users who have obtained a street closure permit from the state transport authority to notify Nigeria Police Force of closure periods, enabling the Command and Control Center to know about closed roads while directing patrols to accident sites and reports.",
    audiences: ["Residents", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Attach the road closure permit issued by the state transport authority",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Call Centre",
      "Police Stations",
    ],
    delivery:
      '• **Email**: The digital version of the permit will be sent to your registered email address as soon as it is issued. • **Personal Dashboard**: Log in to your Nigeria Police Force account, navigate to "My Requests" section in your personal dashboard, search for your request, and then download the permit directly. • **Direct Inquiry**: You can download the permit through "Application Status" service using only your reference number.',
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30-22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "share-information",
    name: "Share Information",
    action: "View",
    category: "Community Engagement",
    icon: "/icons/services/annotation-info.svg",
    description:
      "Share information with police to support public and community safety",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "student-awareness",
    name: "Student Awareness",
    action: "Apply",
    category: null,
    icon: "/icons/services/explore-hemaya.svg",
    description:
      "This service enables educational institutions to request awareness programs for students, delivered by specialists from Nigeria Police Force, to enhance their security and social awareness.",
    audiences: ["Students", "Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["School Students"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "submit-inquiry",
    name: "Submit an Inquiry",
    action: "Inquire",
    category: null,
    icon: "/icons/services/search-check.svg",
    description:
      "This service enables users to submit their inquiries about the services, procedures and requirements approved by Nigeria Police Force.",
    audiences: ["Residents", "Foreigners", "Organisations"],
    mostUsed: true,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "2 Working Days",
    terms: [],
    related: [],
  },
  {
    slug: "supplier-application",
    name: "Supplier Application",
    action: "Apply",
    category: null,
    icon: "/icons/services/supplier-application.svg",
    description:
      "This service aims to enable users to register in the Nigeria Police Force's approved suppliers directory and conduct transactions electronically.",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Business Sector"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "1 Working Day",
    terms: [
      "The company/organization must be registered in the Nigeria Police Force Suppliers Registry.",
    ],
    related: [],
  },
  {
    slug: "suppliers-services",
    name: "Suppliers Services",
    action: "View",
    category: "Business and Corporates",
    icon: "/icons/services/supplier-application.svg",
    description:
      "A service for business suppliers, allows registration for police's tenders",
    audiences: ["Organisations"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Public Tenders",
        slug: "public-tender",
      },
      {
        name: "Supplier Application",
        slug: "supplier-application",
      },
    ],
  },
  {
    slug: "support-and-emergency-response",
    name: "Support and Emergency Response",
    action: "View",
    category: "Emergency and Response",
    icon: "/icons/services/clock-02.svg",
    description:
      "A Service to request immediate support from specialized teams",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [
      {
        name: "Child Protection",
        slug: "child-protection",
      },
      {
        name: "Women Protection",
        slug: "women-protection",
      },
      {
        name: "Persons with Disabilities Support",
        slug: "persons-with-disabilities",
      },
      {
        name: "Critical Care Response",
        slug: "critical-care-response",
      },
      {
        name: "Provide Care for Human Trafficking Victims",
        slug: "human-trafficking",
      },
    ],
  },
  {
    slug: "traffic-accident-reports",
    name: "Traffic Accident Reports",
    action: "View",
    category: null,
    icon: "/icons/services/simple-accident-report.svg",
    description:
      "To obtain official report on a traffic accident for various legal purposes",
    audiences: ["Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [],
    channels: [],
    delivery: "",
    hours: [],
    contacts: [],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "unknown-accident-report",
    name: "Unknown Accident Report",
    action: "Report",
    category: null,
    icon: "/icons/services/unknown-accident-report.svg",
    description:
      "This service enables vehicle owners or drivers, whose vehicles are damaged by an unknown party, to obtain an accident report allowing them to repair their damaged vehicle.",
    audiences: ["Drivers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [
      {
        label: "processing fee",
        value: "₦4,000",
      },
      {
        label: "Technology levy",
        value: "₦4,000",
      },
    ],
    feeSummary: "₦8,000",
    payment: ["Debit Card", "Credit Card", "Apple Pay", "Cash"],
    documents: [
      {
        label: "Photos of the vehicle from all 4 sides including the damages.",
        items: [],
      },
    ],
    beneficiaries: ["Individuals", "Business Sector", "Governmental Entities"],
    channels: ["Nigeria Police Force App", "Police Stations"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "7:30 - 22:00",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "3 Working Days",
    terms: [
      "The accident must have occurred within Nigeria.",
      "The report is valid for 3 months from the date of issuance",
    ],
    related: [],
  },
  {
    slug: "detainee-visit",
    name: "Visit a Detainee or Inmate Permit",
    action: "Apply",
    category: null,
    icon: "/icons/services/detainee-visit-request.svg",
    description:
      "This service provides the necessary permit for virtual meetings with detainees or inmates held within Nigeria, in accordance with applicable procedures and regulations.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: 3,
    ninAuthOnly: true,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website", "Police Stations"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Police Stations",
        value: "9:00am-12:00pm",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat"],
    turnaround: "1 Working Day",
    terms: [
      "Lawyers can visit inmates on Thursday’s mornings of each week, through (virtual meeting) based on prior request and approval",
      "If the visitor is from outside Nigeria, he or she must present evidence of kinship with the inmate",
      "Visitor needs proof of kinship with the detainee if its a drug related case",
    ],
    related: [],
  },
  {
    slug: "volunteer-platform",
    name: "Volunteer Platform",
    action: "Apply",
    category: null,
    // The CMS asset (public/icons/services/volunteer-platform.svg) is clipped
    // to a 5px strip and draws a squiggle; the generic glyph stands in until
    // the CMS sends a working one.
    icon: null,
    description:
      "This service enables members of the community, whether Nigeria Police Force employees or the public, to volunteer with Nigeria Police Force by registering for available opportunities on the Nigeria Police Force Volunteer Platform.",
    audiences: ["Residents", "Students", "Police officers"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Outside volunteers' NINs",
        items: [],
      },
    ],
    beneficiaries: ["Individuals"],
    channels: ["Nigeria Police Force App", "Nigeria Police Force Website"],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "Instant",
    terms: [],
    related: [],
  },
  {
    slug: "women-protection",
    name: "Women Protection",
    action: "Request Support",
    category: null,
    icon: "/icons/services/women-protection.svg",
    description:
      "This service aims to provide protection and support for women who are at risk or under threat of any form of psychological or physical violence, neglect, or violation of rights, ensuring the preservation of their legal, social, and human rights.",
    audiences: ["Residents", "Foreigners"],
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: ["Individuals"],
    channels: [
      "Nigeria Police Force App",
      "Nigeria Police Force Website",
      "Call Centre",
      "Divisional Police Stations",
    ],
    delivery: "",
    hours: [
      {
        label: "Digital Channels",
        value: "24/7",
      },
      {
        label: "Divisional Police Stations",
        value: "24/7",
      },
    ],
    contacts: ["Complaint Response Unit", "Email", "Live Chat", "P.O. Box"],
    turnaround: "30 Working Days",
    terms: [
      "Incident must occur within Nigeria",
      "There must be no existing court rulings on the same case",
    ],
    related: [],
  },
  // Source: POSSAP (possap.gov.ng); TheCable, POSSAP launch
  {
    category: "Permits and Certificates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "police-extract",
    name: "Police Extract",
    action: "Apply",
    icon: "/icons/services/lost-certificate.svg",
    description: "A Police Extract is the Force's written record of a report you made, such as a lost document or item. Agencies that replace lost documents commonly ask for one. It is applied for through POSSAP, the Force's portal for paid services.",
    audiences: [
      "Residents",
      "Foreigners",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      },
      {
        label: "What was lost or what happened, with the date and place",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "The extract is the record of a report, so the loss or incident is reported first.",
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: VON / BusinessDay / Federal Ministry of Information, 2025; Leadership
  {
    category: "Permits and Certificates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "tinted-glass-permit",
    name: "Tinted Glass Permit",
    action: "Apply",
    icon: "/icons/services/drive-mode.svg",
    description: "Driving a vehicle with tinted glass needs a permit under the Motor Vehicles (Prohibition of Tinted Glass) Act. A permit is issued only for good cause, such as a medical or security reason, and is applied for through POSSAP.",
    audiences: [
      "Residents",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      },
      {
        label: "Vehicle particulars: plate, chassis and engine numbers",
        items: []
      },
      {
        label: "Evidence of the reason for the permit, such as a medical report",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "At least 72 hours",
    terms: [
      "Apply only on possap.gov.ng. Ignore anyone offering permits through other channels.",
      "Most of the application is online. You then go to the command or formation you chose for your fingerprints and photograph to be taken.",
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: TheCable; Ripples Nigeria; POSSAP
  {
    category: "Business and Corporates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "escort-and-guard",
    name: "Police Escort and Guard Services",
    action: "Request Support",
    icon: "/icons/services/shield-01.svg",
    description: "Individuals and organisations can request police escort or guard services through POSSAP. The service is charged according to the Force's tariff and billed on the POSSAP invoice.",
    audiences: [
      "Residents",
      "Foreigners",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      },
      {
        label: "Who or what is to be protected, where, and for how long",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector",
      "Governmental Entities"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: TheCable; Firearms Act (commentary, streetlawyernaija.com)
  {
    category: "Permits and Certificates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "firearm-licence",
    name: "Firearm Licence",
    action: "Apply",
    icon: "/icons/services/military-tech.svg",
    description: "Owning a firearm in Nigeria needs a licence under the Firearms Act. A licence is not granted as of right: it is at the discretion of the President or the Inspector-General of Police. Applications are made through POSSAP.",
    audiences: [
      "Residents",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "A licence can be refused without a reason being given.",
      "Anyone convicted of an offence involving violence or the threat of violence in the previous five years cannot be granted a licence.",
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: POSSAP service list
  {
    category: "Permits and Certificates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "cid-clearance",
    name: "CID Clearance Certificate",
    action: "Apply",
    icon: "/icons/services/certificate-03.svg",
    description: "A clearance certificate from the Force Criminal Investigation Department, one of the paid certificates applied for through POSSAP. The requirements for your case are shown on POSSAP when you apply.",
    audiences: [
      "Residents",
      "Foreigners",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "POSSAP"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: TheCable, POSSAP service list
  {
    category: "Permits and Certificates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "investigation-report",
    name: "Police Investigation Report",
    action: "Apply",
    icon: "/icons/services/manage-search.svg",
    description: "A copy of the report of a police investigation, applied for through POSSAP among the Force's paid services.",
    audiences: [
      "Residents",
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      },
      {
        label: "The case reference and the station or command that investigated it",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "Pay only through the invoice POSSAP gives you for the application. The fee is not refundable."
    ]
  },
  // Source: TheNigeriaLawyer; npf.gov.ng
  {
    category: "Business and Corporates",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "supernumerary-police",
    name: "Supernumerary Police",
    action: "Apply",
    icon: "/icons/services/event-security.svg",
    description: "Ministries, agencies, banks and companies can apply for supernumerary police officers to guard their property. Once a request is approved, the organisation pays for the officers' training and their pay for the period they are engaged.",
    audiences: [
      "Organisations"
    ],
    fees: [
      {
        label: "Application and processing fee",
        value: "Shown on your POSSAP invoice"
      }
    ],
    feeSummary: "On your POSSAP invoice",
    payment: [
      "Online, through the POSSAP invoice"
    ],
    documents: [
      {
        label: "A description of the property and why officers are needed",
        items: []
      }
    ],
    beneficiaries: [
      "Business Sector",
      "Governmental Entities"
    ],
    channels: [
      "POSSAP",
      "State Police Commands"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "Apply to the Inspector-General of Police or to the Commissioner of Police of the state, describing the property and the circumstances.",
      "You may be asked for any other information the Inspector-General requires."
    ]
  },
  // Source: cmris.npf.gov.ng; Techpoint, TheCable 2024
  {
    category: "Traffic Services",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "central-motor-registry",
    name: "Central Motor Registry (e-CMR)",
    action: "Apply",
    icon: "/icons/services/traffic-services.svg",
    description: "Vehicle owners (cars, buses, trucks and motorcycles) register their vehicles with the Force's Central Motor Registry and receive a Motor Vehicle Information Certificate. The register helps the police confirm that a vehicle is genuine and who owns it.",
    audiences: [
      "Residents",
      "Organisations"
    ],
    fees: [
      {
        label: "Registration fee",
        value: "Shown on the CMRIS portal"
      }
    ],
    feeSummary: "On the CMRIS portal",
    payment: [
      "Online, on the CMRIS portal"
    ],
    documents: [
      {
        label: "NIN, BVN or international passport",
        items: []
      },
      {
        label: "Vehicle particulars: plate, chassis and engine numbers",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector",
      "Governmental Entities"
    ],
    channels: [
      "CMRIS portal (cmris.npf.gov.ng)"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Depends on the case",
    terms: [
      "Update the record when the owner, plate number, engine or chassis changes.",
      "In 2024 the Inspector-General suspended enforcement of the e-CMR certificate and told officers not to demand it from motorists."
    ]
  },
  // Source: LawPadi; Business Post; Guardian; CAPPA
  {
    category: "Criminal Reports and Complaints",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "complaint-against-officer",
    name: "Complaint Against a Police Officer",
    action: "Report",
    icon: "/icons/services/tourist-complain.svg",
    description: "If an officer asked you for money, mistreated you or refused to help, complain to the Force's Complaint Response Unit by phone, by WhatsApp or with this form. You can also petition the Police Service Commission, the body that disciplines police officers.",
    audiences: [
      "Residents",
      "Foreigners",
      "Organisations"
    ],
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "Photos, video or receipts (if available)",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals",
      "Business Sector"
    ],
    channels: [
      "Nigeria Police Force Website",
      "Complaint Response Unit"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Instant",
    terms: [
      "Give the date, time and place, and what happened. Name the officer, or give their number or the vehicle plate, if you can.",
      "A petition to the Police Service Commission is a letter to its Chairman setting out what happened, with any evidence attached.",
      "Reporting is free. No officer may ask you for money to take a report, to investigate it, or for bail."
    ]
  },
  // Source: Report form advice (see content-report.ts)
  {
    category: "Criminal Reports and Complaints",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "missing-person",
    name: "Report a Missing Person",
    action: "Report",
    icon: "/icons/services/search-check.svg",
    description: "Report someone who has not come home and cannot be reached. There is no waiting period: report as soon as you are worried.",
    audiences: [
      "Residents",
      "Foreigners"
    ],
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [
      {
        label: "A recent photograph (if available)",
        items: []
      }
    ],
    beneficiaries: [
      "Individuals"
    ],
    channels: [
      "Nigeria Police Force Website",
      "Divisional Police Stations"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Instant",
    terms: [
      "Note what they were wearing, where they were last seen, and who they were with."
    ]
  },
  // Source: Leadership 2025 (Bauchi Gender Unit); IGP directive 2020
  {
    category: "Criminal Reports and Complaints",
    mostUsed: false,
    dashboardOrder: null,
    ninAuthOnly: false,
    delivery: "",
    related: [],
    contacts: [
      "Complaint Response Unit"
    ],
    slug: "gender-based-violence",
    name: "Report Sexual or Gender-Based Violence",
    action: "Report",
    icon: "/icons/services/heart-hand.svg",
    description: "Report rape, sexual assault, domestic violence or abuse. State Commands have Gender Units, and in 2020 the Inspector-General sent specialised investigators to gender desks across the country.",
    audiences: [
      "Residents",
      "Foreigners"
    ],
    fees: [],
    feeSummary: "Free of Charge",
    payment: [],
    documents: [],
    beneficiaries: [
      "Individuals"
    ],
    channels: [
      "Nigeria Police Force Website",
      "Divisional Police Stations"
    ],
    hours: [
      {
        label: "Digital Channels",
        value: "24/7"
      }
    ],
    turnaround: "Instant",
    terms: [
      "You can ask for a female officer. Try not to wash or change clothes before a medical examination, and keep what you were wearing.",
      "Say if it is not safe for officers to call you at home."
    ]
  },
];

export const serviceCategoryNames = [
  "Inquiries and Follow-up",
  "Criminal Reports and Complaints",
  "Permits and Certificates",
  "Traffic Services",
  "Business and Corporates",
  "Community Engagement",
  "Emergency and Response",
];

/**
 * The order of the services page when nobody is searching (the most used
 * row sits above it). Urgent before routine, everyone before specialists:
 * danger, crime, the tasks most people come for, then follow-ups, documents,
 * and the services for lawyers, businesses and staff. Related services sit
 * together so the reader can scan a group. Every service is listed; npm test
 * fails when one is added without a place here.
 */
export const serviceImportance = [
  // Danger now: the reader may be at risk this minute.
  "emergency-case-request-sos",
  "support-and-emergency-response",
  "critical-care-response",
  "women-protection",
  "child-protection",
  "human-trafficking",
  "gender-based-violence",
  "missing-person",
  // Reporting a crime.
  "report-criminal-complaint",
  "open-criminal-case",
  "ecrime",
  "ecrime-101364",
  "complaint-against-officer",
  // The tasks most people come for.
  "police-clearance-certificate",
  "police-extract",
  "fine-payment",
  "pay-traffic-fines",
  // On the road.
  "traffic-accident-reports",
  "minor-traffic-accident-report",
  "unknown-accident-report",
  "reckless-driver",
  "report-a-vehicle-or-driver",
  "central-motor-registry",
  "vehicle-obstruction",
  // Lost and found.
  "lost-and-found",
  "report-lost-item",
  "report-found-item",
  // Following up on something already started.
  "inquiries-and-follow-up",
  "application-status",
  "submit-inquiry",
  "document-inquiry",
  "service-attachment",
  // Certificates.
  "request-a-certificate",
  "cid-clearance",
  "investigation-report",
  // Permits, most personal first.
  "request-a-permit",
  "tinted-glass-permit",
  "firearm-licence",
  "detainee-visit",
  "close-road",
  // Support for particular people, and talking to the police.
  "report-bounce-cheques",
  "persons-with-disabilities",
  "neighborhood-police",
  "share-information",
  "request-to-contact-the-police",
  // Homes and events.
  "event-security",
  "on-site-police-support",
  "escort-and-guard",
  "supernumerary-police",
  // Lawyers.
  // Businesses, banks and embassies.
  "report-bounce-cheques-bank",
  "destroy-explosives",
  "suppliers-services",
  "supplier-application",
  "public-tender",
  // Jobs, talks and training.
  "apply-for-a-job",
  "request-a-lecture-or-training-course",
  "drug-awareness-lecture",
  "student-awareness",
  "seminar-request",
  // Joining in.
  "community-activities-participation",
  "volunteer-platform",
  "activity-request",
  "museum-visit",
  // Police staff and retirees.
  "npf-personnel-welfare-and-support",
  "retirees-services",
  // Pages that describe a programme rather than do a task, or whose content is unclear.
];
