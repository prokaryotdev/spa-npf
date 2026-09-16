/**
 * Content and asset paths lifted verbatim from the live Dubai Police homepage.
 * Card palettes are the per-card CSS custom properties the original ships.
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
  logo: string;
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
  {
    label: "About Us",
    href: "/app/home/aboutus",
    children: [
      {
        label: "Organisational Structure",
        href: "/app/home/aboutus/organisational-structure",
      },
    ],
  },
  {
    label: "Open Data",
    href: "/app/home/opendata",
    children: [{ label: "Data Dubai", href: "/app/home/opendata" }],
  },
  { label: "Application Status", href: "/app/services/application-status" },
  {
    label: "Media",
    href: "/app/home/media",
    children: [
      { label: "News", href: "/app/home/media/news" },
      { label: "Events", href: "/app/home/media/events" },
      { label: "Photo Gallery", href: "/app/home/media/photo-gallery" },
      { label: "Video Gallery", href: "/app/home/media/video-gallery" },
      { label: "Magazine", href: "/app/home/media/magazine" },
    ],
  },
  {
    label: "Information",
    href: "/app/home/information",
    children: [
      {
        label: "Best Practices in Sustainable Development",
        href: "/app/home/information/sustainability",
      },
      {
        label: "Laws and Legislation",
        href: "/app/home/information/laws-legislation",
      },
      {
        label: "View the Black Points of Traffic Violations",
        href: "/app/home/information/view-black-points-traffic-violations",
      },
      {
        label: "Street Speed Limits",
        href: "/app/home/information/street-speed-limits",
      },
    ],
  },
];

export const heroSlides = [
  {
    title: "Arabian Travel Market Exhibition",
    subtitle: "Visit Us",
    image: "/cms/Website_Banner_d3a5662877.jpg",
  },
  {
    title: "70th Anniversary of Dubai Police",
    subtitle: "",
    image: "/cms/70_years_of_Dubai_Police_Visual_V1_Website_V1_d1499023bc.jpeg",
  },
  {
    title: "SMART SECURE TOGETHER",
    subtitle: "Together for a safer Dubai tomorrow",
    image: "/cms/slide2_642a5cdf68.jpg",
  },
  {
    title: "Police Innovation and Leadership",
    subtitle: "Be one of the leaders shaping the future of smart and",
    image: "/cms/Home/Innovation_2d3f3540e6.jpg",
    readMore: true,
  },
  {
    title: "Luxury Meets Readiness",
    subtitle: "Dubai Police Adds Tesla Cyber-truck to Its Fleet of Sm",
    image: "/cms/Home/Tesla_fdb5e10caf.jpg",
  },
];

export const quickServices = [
  {
    title: "Make a Report",
    body: "Report and submit your complaint directly",
    href: "/app/services?package=Criminal+Reports+and+Complaints",
    icon: "/cms/homeServiceIcon/Reports_and_Complaints_Suite_2877ee8e89.svg",
  },
  {
    title: "Apply for a Certificate or Permit",
    body: "Access official Documents from Dubai Police quickly and securely",
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
    word: "Smart",
    line: "Your Safety; Powered by Smart Solutions.",
    portrait: "/cms/Together_face_5c5243f7c9.png",
  },
  {
    word: "Secure",
    line: "Protecting every Home, every Family, every Day.",
    portrait: "/cms/Secure_face_7cd83d1438.png",
  },
  {
    word: "Together",
    line: "Connecting Hearts, Building Trust. Stronger as One.",
    portrait: "/cms/Together_family_ed1eaa241d.png",
  },
];

export const smartPolicing: InitiativeCard[] = [
  {
    title: "e-Crime",
    body: "e-Crime supports digital well-being by implementing strategies that ensure a resilient and safe community",
    image: "/cms/e_Crime_92e4e26ff1.jpg",
    logo: "/cms/dp-service-icons/e_Crime_Home_0a7aa4d040.svg",
    logoIsWide: true,
    tags: [
      {
        label: "Dubai Quality of Life Strategy",
        icon: "/cms/image_75_eebd215202.svg",
      },
    ],
    more: 1,
    theme: theme("#0C2218", "#c3ead8", "#77cfa7"),
  },
  {
    title: "Lost & Found",
    body: "A paperless and a secure way to find what matters, Lost & Found service offers an eco-friendly and reliable approach",
    image: "/cms/lost_and_found_a80bed6743.jpg",
    logo: "/cms/lost_Found_Home_7442753650.svg",
    logoIsWide: true,
    tags: [
      {
        label: "Dubai Blockchain Strategy",
        icon: "/cms/image_76_199cff4ccb.svg",
      },
    ],
    more: 2,
    theme: theme("#241748", "#ebe6f7", "#ab99de"),
  },
  {
    title: "Police Eye",
    body: "We strive to build a proactive and secure community, reflecting the UAE’s vision of global leadership in safety and security",
    image: "/cms/Home/Police_Eye_s_0f82177537.jpg",
    logo: "/cms/police_Eye_Home_a6e504a570.svg",
    logoIsWide: true,
    tags: [
      {
        label: "Security and safety strategy",
        icon: "/cms/MOI_c3da982165.png",
      },
    ],
    more: 1,
    wide: true,
    theme: theme("#042418", "#b0f6dc", "#54ecb3"),
  },
];

export const domains = [
  {
    id: "shore",
    title: "Along the Shores",
    lead: "Wherever you are, your safety is assured.",
    body: "Our coastline, airspace, and land are protected by an integrated system of smart solutions, advanced technologies, and innovative services.",
    background: "/img/3d-static/boat-bg.jpg",
    subject: "/img/3d-static/boat.png",
    chips: [{ label: "Sail Safely", icon: "/cms/icon_boat_3777bd658e.svg" }],
  },
  {
    id: "ground",
    title: "On the Ground",
    lead: "",
    body: "Our patrols, officers, and specialised units are always nearby, ready to assist whenever you need us.",
    background: "/img/3d-static/car-bg.jpg",
    subject: "/img/3d-static/car.png",
    chips: [
      {
        label: "Smart Home Security",
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
    body: "Our drone units provide continuous protection from above, preserving your safety through the highest standards of security.",
    background: "/img/3d-static/drone-bg.jpg",
    subject: "/img/3d-static/drone.png",
    chips: [{ label: "Drone Box", icon: "/cms/icon_oyoon_af076eac61.svg" }],
  },
];

export const smartPoliceStations: InitiativeCard[] = [
  {
    title: "Original SPS",
    body: "An innovative, self-service station providing secure and efficient policing round the clock, prioritising privacy and convenience for all.",
    image: "/cms/Home/sps_original_53cd588de6.jpg",
    logo: "/cms/sps_7ff02ae72b.svg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#4D0D0D", "#fadfdf", "#eb8888"),
  },
  {
    title: "Walk-In SPS",
    body: "A compact, self-service police station offering comprehensive security services, ensuring convenient and secure access for every member of the community at all times.",
    image: "/cms/Home/sps_walkin_be3b2b3d66.jpg",
    logo: "/cms/sps_walkin_b7f9fd121a.svg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#042418", "#b0f6dc", "#54ecb3"),
  },
  {
    title: "Drive-Thru SPS",
    body: "A smart, self-service police station delivering innovative and rapid services from the comfort of your car, providing a safe and seamless experience at any hour.",
    image: "/cms/Home/sps_drive_thru_39157961d7.jpg",
    logo: "/cms/SPS_Drive_thru_4664b24271.svg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#3C3D3C", "#fcfcfc", "#c8c9c8"),
  },
  {
    title: "Suburban SPS",
    body: "A number of integrated interactive self-service police stations located in suburban areas across Dubai. Equipped with designated police patrol cars designed to endure those areas routes and aim at cutting response time for incidents reported nearby. The station also offers around-the-clock smart security services while maintaining total privacy.",
    image: "/cms/Home/sps_suburban_5da0e23641.jpg",
    logo: "/cms/Home/sps_suburban_3206ea7451.png",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#2D3742", "#f5f7f8", "#b9c3cf"),
  },
  {
    title: "Floating SPS",
    body: "The Floating Smart Police Station is the first of its kind in the Middle East, offering island residents and sea-goers convenient, direct access to a wide range of innovative police services designed to meet their needs efficiently.",
    image: "/cms/Home/sps_floating_e877217271.jpg",
    logo: "/cms/sps_7ff02ae72b.svg",
    tags: [{ label: "Explore more", icon: "/cms/info_circle_3bd5c42108.svg" }],
    theme: theme("#000000", "#bfbfbf", "#8c8c8c"),
  },
];

export const community: InitiativeCard[] = [
  {
    title: "Positive Spirit",
    body: "Volunteer with Dubai Police, Celebrate the Positive Spirit, and get certified!",
    image: "/cms/positive_spirit_final_s_d8fef6b5f6.jpg",
    logo: "/cms/icon_soul_01ee5459c0.png",
    tags: [{ label: "Initiative Results", icon: "/cms/c1_9ba2902a1d.png" }],
    more: 1,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Community Volunteering",
    body: "Volunteer with Dubai Police to create real change. Support programmes that foster empathy, responsibility, and a safer city for all. Make a difference, together!",
    image: "/cms/Volutneer_86db1585d3.jpg",
    logo: "/cms/icon_volunteer_330f59b879.svg",
    tags: [
      {
        label: "Explore Volunteer Opportunities",
        icon: "/cms/c7_322f5132d5.png",
      },
    ],
    theme: theme("#005245", "#d1fff8", "#6bffe8"),
  },
  {
    title: "Hemaya Schools",
    body: "A pioneering Dubai Police initiative, Hemaya Schools ensures that every child of our dedicated personnel has access to high-quality education. Our integrated institutions seamlessly blend academic achievement with personal growth and skills development in a supportive environment.",
    image: "/cms/Hemaya_s_af272b586b.jpg",
    logo: "/cms/icon_hemaya_20e581d127.png",
    tags: [
      { label: "Become a Safety Ambassador", icon: "/cms/c3_d96d1eea79.png" },
    ],
    more: 2,
    theme: theme("#554937", "#ffffff", "#dcd4c9"),
  },
  {
    title: "Dubai Police eSports",
    body: "A tournament that reflects Dubai Police's commitment to enhancing community awareness in digital and technological field",
    image: "/cms/e_Sport_75fdfaf219.jpg",
    logo: "/cms/icon_esports_ac23f1d678.png",
    badge: "Coming Soon",
    tags: [],
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
  {
    title: "Dubai Police Museum",
    body: "A cultural landmark where the past illuminates the present, tracing the Dubai Police force’s evolution from its inception to a world-class institution",
    image: "/cms/p8_1ee31a74c5.webp",
    logo: "/cms/icon_museum_a5709a350d.png",
    badge: "Museum visit",
    tags: [
      { label: "Visit our virtual museum", icon: "/cms/c8_c4d2878b60.png" },
    ],
    theme: theme("#6A3D06", "#fef8f0", "#f9c990"),
  },
  {
    title: "World Police Summit",
    body: "More than 300 globally renowned speakers, 922+ Global Leaders and 85+ Chiefs of Police and over 170 leading exhibitors in safety and security, the Summit is the ultimate hub for driving innovation and transforming the global law enforcement ecosystem.",
    image: "/cms/World_Summit_Police_30fd9f4d13.jpg",
    logo: "/cms/World_Police_Summit_logo_5fd0fb8017.svg",
    logoIsWide: true,
    badge: "More",
    tags: [
      { label: "WPS Awards 2026", icon: "/cms/announcement_01_9b8b72d1a1.svg" },
    ],
    more: 2,
    wide: true,
    theme: theme("#17232C", "#d7e2ea", "#94b1c7"),
  },
];

export const careers = [
  {
    title: "Answer the Call. Join the Force.",
    lead: "",
    bodyBefore: "Join the ",
    linkLabel: "Dubai Police Academy",
    href: "https://www.dubaipolice.ac.ae/",
    bodyAfter:
      " and master the strategic vision, skills, and expertise needed to lead in law enforcement and safeguard the community.",
    image: "/cms/Home/Innovation_2d3f3540e6.jpg",
  },
  {
    title: "Ready to join a force that inspires?",
    lead: "Bring your skills to Dubai Police and help us set new standards in community safety.",
    bodyBefore: "",
    linkLabel: "Join a team",
    href: "https://srs.dubaipolice.gov.ae/",
    bodyAfter: " dedicated to securing, connecting, and innovating.",
    image: "/cms/positive_spirit_final_s_d8fef6b5f6.jpg",
  },
];

export const emergencyNumbers = [
  {
    label: "Police",
    number: "999",
    note: "For emergencies only",
    color: "#b30900",
  },
  {
    label: "Call Center",
    number: "901",
    note: "For other inquiries",
    color: "#006c44",
  },
  { label: "Ambulance", number: "998", note: "", color: "#006c44" },
  { label: "Civil Defence", number: "997", note: "", color: "#006c44" },
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
      { label: "About us", href: "/app/home/aboutus" },
      { label: "Open Data", href: "/app/home/opendata" },
      { label: "Information", href: "/app/home/information" },
      { label: "Media Hub", href: "/app/home/media" },
      { label: "Site Map", href: "/app/home/sitemap" },
      { label: "Initiative", href: "/app/home/initiative" },
      {
        label: "Careers",
        href: "https://srs.dubaipolice.gov.ae/",
        external: true,
      },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact us", href: "/app/home/contactUs" },
      { label: "Customer Centers", href: "/app/home/customer-centers" },
      { label: "Events", href: "/app/home/media/events" },
      {
        label: "Leaders at Your Service",
        href: "/app/services/leaders-at-your-service",
      },
    ],
  },
  {
    heading: "Friendly Websites",
    links: [
      {
        label: "Esaad",
        href: "https://esaad.dubaipolice.gov.ae/",
        external: true,
      },
      { label: "UAE Government", href: "https://u.ae/", external: true },
      {
        label: "Digital Dubai",
        href: "https://www.digitaldubai.ae/",
        external: true,
      },
      {
        label: "Efaad",
        href: "https://efaad.dubaipolice.gov.ae/",
        external: true,
      },
      {
        label: "Innovation",
        href: "https://www.dubaipolice.gov.ae/",
        external: true,
      },
      {
        label: "E-Police in Your Mobile",
        href: "https://www.dubaipolice.gov.ae/",
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
