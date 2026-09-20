/**
 * Content for the Nigeria Police Force, Federal Capital Territory Command.
 * Card palettes are the per-card CSS custom properties each card ships.
 */

export type CardTheme = {
  /** Deep brand ink for the card's chips and button text. */
  ink: string;
  /** Pale chip background. */
  tint: string;
  /** Chip border. */
  edge: string;
  /** Shadow colour, matched to the ink. */
  shadow: string;
};

export type InitiativeCard = {
  title: string;
  body: string;
  image: string;
  /** Omitted when the initiative has no mark of its own. */
  logo?: string;
  logoIsWide?: boolean;
  tags: { label: string; icon?: string }[];
  more?: number;
  badge?: string;
  /** Spans both columns of the desktop mosaic at a 1650/750 ratio. */
  wide?: boolean;
  theme: CardTheme;
};

const theme = (ink: string, tint: string, edge: string): CardTheme => ({
  ink,
  tint,
  edge,
  shadow: `${ink}b3`,
});

export const navigation = [
  { label: "Home", href: "/app/home" },
  { label: "Services", href: "/app/services" },
  { label: "Application Status", href: "/app/services/application-status" },
  {
    label: "Information",
    href: "/app/home/information",
    children: [
      {
        label: "Laws and Legislation",
        href: "/app/home/information/laws-legislation",
      },
      {
        label: "Traffic Offences and Penalties",
        href: "/app/home/information/traffic-offences-and-penalties",
      },
      {
        label: "Road Speed Limits",
        href: "/app/home/information/road-speed-limits",
      },
    ],
  },
];

export const heroSlides = [
  {
    title: "Police Week in the Federal Capital Territory",
    subtitle: "Visit Us",
    image: "/cms/Home/hero/parade.jpg",
  },
  {
    title: "96 Years of the Nigeria Police Force",
    subtitle: "",
    image: "/cms/Home/hero/anniversary.jpg",
  },
  {
    title: "SAFE SECURE TOGETHER",
    subtitle: "Together for a safer Abuja tomorrow",
    image: "/cms/Home/hero/community.jpg",
  },
  {
    title: "Ready on Every Road",
    subtitle: "The FCT Command adds new patrol vehicles to its fleet",
    image: "/cms/Home/hero/fleet.jpg",
  },
];

export const quickServices = [
  {
    title: "Make a Report",
    body: "Report a crime or submit your complaint directly",
    href: "/app/services?package=Criminal+Reports+and+Complaints",
    icon: "/cms/homeServiceIcon/Reports_and_Complaints_Suite_2877ee8e89.svg",
  },
  {
    title: "Apply for a Certificate or Permit",
    body: "Access official documents from the Nigeria Police Force quickly and securely",
    href: "/app/services?package=Permits+and+Certificates",
    icon: "/cms/homeServiceIcon/Request_for_a_Certificate_or_Permit_f02f7b6956.svg",
  },
  {
    title: "Inquire & Pay",
    body: "Stay updated and settle your payments instantly",
    href: "/app/services?package=Inquiries+and+Follow-up",
    icon: "/cms/homeServiceIcon/Inquire_and_Pay_2177158856.svg",
  },
  {
    title: "Request Support",
    body: "Request support on-site, digitally, in seamless steps",
    href: "/app/services?package=Emergency+and+Response",
    icon: "/cms/homeServiceIcon/Request_Support_a63f371d92.svg",
  },
  {
    title: "Explore More Services",
    body: "Browse and discover more available police services",
    href: "/app/services",
    icon: "/cms/more_12a8588c06.svg",
  },
];

export const pillars = [
  {
    word: "Safe",
    line: "Your Safety; Backed by Every Officer on Duty.",
    portrait: "/cms/pillar-safe.jpg",
  },
  {
    word: "Secure",
    line: "Protecting every Home, every Family, every Day.",
    portrait: "/cms/pillar-secure.jpg",
  },
  {
    word: "Together",
    line: "Connecting Hearts, Building Trust. Stronger as One.",
    portrait: "/cms/pillar-together.jpg",
  },
];

export const smartPolicing: InitiativeCard[] = [
  {
    title: "Cybercrime Reporting",
    body: "The National Cybercrime Centre receives reports of online fraud, blackmail and identity theft, and works to keep the community safe online",
    image: "/cms/e_Crime_92e4e26ff1.jpg",
    logo: "/cms/dp-service-icons/e_Crime_Home_0a7aa4d040.svg",
    logoIsWide: true,
    tags: [
      {
        label: "Cybercrimes Act 2015",
      },
    ],
    more: 1,
    theme: theme("#0B1526", "#CCDCF2", "#93B9E8"),
  },
  {
    title: "Lost & Found",
    body: "A paperless and secure way to find what matters, the Lost & Found desk offers a simple and reliable way to report and recover property",
    image: "/cms/lost_and_found_a80bed6743.jpg",
    tags: [
      {
        label: "Federal Capital Territory Digital Services",
      },
    ],
    more: 2,
    theme: theme("#241748", "#ebe6f7", "#ab99de"),
  },
  {
    title: "Rescue Me",
    body: "We strive to build a proactive and secure community, reflecting the commitment of the Force to the safety and security of every resident",
    image: "/cms/Home/Police_Eye_s_0f82177537.jpg",
    tags: [
      {
        label: "National Security Strategy",
        icon: "/cms/dp-service-icons/shield_01_00cf6986f7.svg",
      },
    ],
    more: 1,
    wide: true,
    theme: theme("#050F22", "#C4D8F8", "#7FB4FF"),
  },
];

export const domains = [
  {
    id: "shore",
    title: "On the Water",
    lead: "Wherever you are, your safety is assured.",
    body: "The Marine Police patrol Jabi Lake, the Lower Usuma Dam and the rivers around the Territory, so work and leisure on the water stay safe.",
    background: "/img/3d-static/boat-bg.jpg",
    chips: [{ label: "Sail Safely", icon: "/cms/icon_boat_3777bd658e.svg" }],
  },
  {
    id: "ground",
    title: "On the Ground",
    lead: "",
    body: "Our patrols, officers and specialised units are always nearby, ready to assist whenever you need us.",
    background: "/img/3d-static/car-bg.jpg",
    chips: [
      {
        label: "Neighbourhood Security",
        icon: "/cms/icon_security_84e1e8baef.svg",
      },
      { label: "On The Go", icon: "/cms/icon_car_eaa24290bd.svg" },
      { label: "Tourist Police", icon: "/cms/icon_tourist_a49d88a5f4.svg" },
    ],
  },
  {
    id: "sky",
    title: "From the Sky",
    lead: "",
    body: "The Police Air Wing and our drone units watch over the Territory from above, holding the highest standards of security.",
    background: "/img/3d-static/drone-bg.jpg",
    chips: [{ label: "Air Wing" }],
  },
];

export const smartPoliceStations: InitiativeCard[] = [
  {
    title: "Command Headquarters",
    body: "The seat of the Federal Capital Territory Police Command at Garki, where the Commissioner of Police and the departments of the Command coordinate policing across the whole Territory.",
    image: "/cms/Home/sps_original_53cd588de6.jpg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#4D0D0D", "#fadfdf", "#eb8888"),
  },
  {
    title: "Area Commands",
    body: "Nine Area Commands, among them Garki, Wuse, Asokoro, Maitama, Gwagwalada, Bwari, Kubwa, Karu and Lugbe, each supervising the divisions within its reach.",
    image: "/cms/Home/sps_walkin_be3b2b3d66.jpg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#050F22", "#C4D8F8", "#7FB4FF"),
  },
  {
    title: "Divisional Headquarters",
    body: "The division is where most people meet the Force: the counter that takes a report, the charge room, the investigators, and the patrol teams that answer a call in the neighbourhood.",
    image: "/cms/Home/sps_drive_thru_39157961d7.jpg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#3C3E44", "#fcfcfc", "#C8CAD0"),
  },
  {
    title: "Police Posts",
    body: "Smaller outposts placed in the satellite towns and rural wards of the six Area Councils: Abuja Municipal, Gwagwalada, Kuje, Bwari, Kwali and Abaji. Each is held by a patrol team equipped for the roads it covers, which cuts the time it takes to reach an incident reported nearby.",
    image: "/cms/Home/sps_suburban_5da0e23641.jpg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#2D3742", "#f5f7f8", "#b9c3cf"),
  },
  {
    title: "Marine Police Base",
    body: "The Marine Police Base gives the communities along the waterways of the Territory direct access to a police response on the water, covering the dams, the lakes and the river crossings a patrol car cannot reach.",
    image: "/cms/Home/sps_floating_e877217271.jpg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#000000", "#bfbfbf", "#8c8c8c"),
  },
];

export const community: InitiativeCard[] = [
  {
    title: "Police Community Relations Committee",
    body: "Sit with the PCRC at your division, raise what worries your street, and help shape how your neighbourhood is policed.",
    image: "/cms/positive_spirit_final_s_d8fef6b5f6.jpg",
    logo: "/cms/icon_soul_01ee5459c0.png",
    tags: [{ label: "Committee Results", icon: "/cms/c1_9ba2902a1d.png" }],
    more: 1,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Safer Neighbourhood Watch",
    body: "Volunteer with the Nigeria Police Force to create real change. Support programmes that build trust, shared responsibility and a safer Territory for all. Make a difference, together!",
    image: "/cms/Volutneer_86db1585d3.jpg",
    logo: "/cms/icon_volunteer_330f59b879.svg",
    tags: [
      {
        label: "Explore Volunteer Opportunities",
        icon: "/cms/c7_322f5132d5.png",
      },
    ],
    theme: theme("#0C2340", "#DDE9FF", "#B7D9FF"),
  },
  {
    title: "Police Children Schools",
    body: "A long-standing undertaking of the Force, the Nigeria Police Children Schools make sure every child of our personnel has access to good education. The schools blend academic achievement with personal growth and skills development in a supportive environment.",
    image: "/cms/Hemaya_s_af272b586b.jpg",
    logo: "/cms/icon_hemaya_20e581d127.png",
    tags: [
      { label: "Become a Safety Ambassador", icon: "/cms/c3_d96d1eea79.png" },
    ],
    more: 2,
    theme: theme("#554937", "#ffffff", "#dcd4c9"),
  },
  {
    title: "Nigeria Police Games",
    body: "The championship of the Force, bringing officers from every Command together and carrying our message on discipline and fitness into the community",
    image: "/cms/e_Sport_75fdfaf219.jpg",
    badge: "Coming Soon",
    tags: [],
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Nigeria Police Museum",
    body: "A cultural landmark where the past illuminates the present, tracing the Force from its founding in 1930 to the national institution it is today",
    image: "/cms/p8_1ee31a74c5.jpg",
    badge: "Museum visit",
    tags: [
      { label: "Visit our virtual museum", icon: "/cms/c8_c4d2878b60.png" },
    ],
    theme: theme("#6A3D06", "#fef8f0", "#f9c990"),
  },
  {
    title: "West African Police Summit",
    body: "Police chiefs from across the region, alongside researchers, technology partners and civil society, meet in Abuja to share what works in investigation, forensics and community policing.",
    image: "/cms/World_Summit_Police_30fd9f4d13.jpg",
    badge: "More",
    tags: [
      {
        label: "Summit Awards 2026",
        icon: "/cms/announcement_01_9b8b72d1a1.svg",
      },
    ],
    more: 2,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
];

export const emergencyNumbers = [
  {
    label: "Police",
    number: "112",
    note: "For emergencies only",
    color: "#b30900",
  },
  {
    label: "Road Safety",
    number: "122",
    note: "Road crashes",
    color: "#0E2648",
  },
  { label: "Fire Service", number: "199", note: "", color: "#0E2648" },
  { label: "Child Helpline", number: "116", note: "", color: "#0E2648" },
];

export const footerColumns = [
  {
    heading: "Packages",
    links: [
      { label: "Inquiries and Follow-up", href: "/app/services" },
      { label: "Criminal Reports and Complaints", href: "/app/services" },
      { label: "Permits and Certificates", href: "/app/services" },
      { label: "Traffic and Accidents", href: "/app/services" },
      { label: "Business and Corporate", href: "/app/services" },
      { label: "Community Engagement", href: "/app/services" },
      { label: "Emergency and Response", href: "/app/services" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { label: "All Services", href: "/app/services" },
      { label: "Application Status", href: "/app/services/application-status" },
      { label: "Information", href: "/app/home/information" },
      { label: "My Account", href: "/app/portal" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact us", href: "/app/home/contactUs" },
      { label: "Customer Centers", href: "/app/home/customer-centers" },
      { label: "Site Map", href: "/app/home/sitemap" },
    ],
  },
  {
    heading: "Traffic",
    links: [
      {
        label: "Laws and Legislation",
        href: "/app/home/information/laws-legislation",
      },
      {
        label: "Traffic Offences and Penalties",
        href: "/app/home/information/traffic-offences-and-penalties",
      },
      {
        label: "Road Speed Limits",
        href: "/app/home/information/road-speed-limits",
      },
    ],
  },
  {
    heading: "Friendly Websites",
    links: [
      {
        label: "POSSAP",
        href: "https://possap.gov.ng/",
        external: true,
      },
      {
        label: "Federal Ministry of Interior",
        href: "https://interior.gov.ng/",
        external: true,
      },
      {
        label: "Federal Road Safety Corps",
        href: "https://frsc.gov.ng/",
        external: true,
      },
      {
        label: "NIMC",
        href: "https://nimc.gov.ng/",
        external: true,
      },
    ],
  },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/app/home/privacy-policy" },
  { label: "Terms & Conditions", href: "/app/home/terms-conditions" },
  {
    label: "Customer Service Agreement",
    href: "/app/home/customer-service-agreement",
  },
  { label: "Sitemap", href: "/app/home/sitemap" },
];

export const appStores = [
  {
    label: "App Store",
    icon: "/img/assets-home/static/home-apps/icon_appstore.svg",
  },
  {
    label: "Google Play",
    icon: "/img/assets-home/static/home-apps/icon_playstore.svg",
  },
  {
    label: "AppGallery",
    icon: "/img/assets-home/static/home-apps/icon_app.svg",
  },
];

export const storeBadges = [
  { label: "App Store", src: "/img/app-store.svg", width: 120 },
  { label: "Google Play", src: "/img/google-play.svg", width: 135 },
  { label: "App Gallery", src: "/img/app-gallery.svg", width: 133 },
];
