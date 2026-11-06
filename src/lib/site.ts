export type Priority = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: PriorityIcon;
  initiatives: string[];
};

export type PriorityIcon =
  | "globe"
  | "landmark"
  | "leaf"
  | "palette"
  | "women"
  | "wheat"
  | "shield"
  | "book"
  | "heart";

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateISO: string;
  readTime: string;
  body: string[];
  coverImageUrl?: string | null;
  videoUrl?: string | null;
};

export type ChiefMinister = {
  name: string;
  party: string;
  from: string;
  to: string;
  note?: string;
};

export const grm = {
  portalUrl: "https://grmbalochistan.com",
  registerUrl: "https://grmbalochistan.com/complain",
  trackUrl: "https://grmbalochistan.com/track",
  chatUrl: "https://grmbalochistan.com/chat",
  hotline: "081-9202424",
  phone: "081-9202424",
  hours: "24/7 Citizen Redressal Helpline",
  title: "AWAAZ آواز — CM Grievance Redressal Cell",
  description: "Official Government of Balochistan citizen grievance and field monitoring system.",
};

export const site = {
  name: "Office of the Chief Minister",
  province: "Balochistan",
  fullName: "Office of the Chief Minister of Balochistan",
  shortName: "CM Balochistan",
  tagline: "A stronger, fairer and more prosperous Balochistan.",
  description:
    "The official website of the Office of the Chief Minister of Balochistan — priorities, news, public services and ways to connect with the provincial government.",
  url: "https://cm.balochistan.gob.pk",
  address: "Chief Minister House, Zarghoon Road, Quetta, Balochistan",
  phone: "+92 81 920 1234",
  email: "info@cm.balochistan.gob.pk",
  officeHours: "Monday – Friday, 9:00 am – 5:00 pm",
  grm,
  social: [
    { label: "Facebook", href: "https://www.facebook.com/share/1B5MiXBgu8/", icon: "facebook" as const, handle: "CMOBalochistan" },
    { label: "X (Twitter)", href: "https://x.com/CMOBalochistan", icon: "x" as const, handle: "@CMOBalochistan" },
    { label: "Instagram", href: "https://www.instagram.com/cmobalochistan?rpxt=ZXNwMXg4bnF0ODFv", icon: "instagram" as const, handle: "@cmobalochistan" },
    { label: "TikTok", href: "https://www.tiktok.com/@cmo.balochistan?_r=1&_t=ZS-9AxIDGwftNk", icon: "tiktok" as const, handle: "@cmo.balochistan" },
  ],
};

export const cm = {
  name: "Mir Sarfraz Bugti",
  title: "Chief Minister of Balochistan",
  since: "2 March 2024",
  party: "Pakistan Peoples Party",
  welcomeMessage:
    "Welcome to the official website of the Chief Minister’s Office. Our government is committed to serving the people through transparent governance, effective public service delivery, institutional reforms, and sustainable development. We aim to strengthen public institutions, improve essential services, and create opportunities for progress and prosperity. Through people-centered policies and responsible leadership, we strive to build a better future for every citizen.",
  quote:
    "Balochistan's greatest resource is its people. Our task is to turn distance into opportunity — and promise into progress.",
  bio: [
    "Mir Sarfraz Bugti assumed office as the Chief Minister of Balochistan on 2 March 2024, following his election by the Provincial Assembly. He has devoted his public career to the province's development, security and social uplift.",
    "His agenda places people at the centre of government: expanding access to health and education, creating dignified work for young people, strengthening local institutions, and unlocking the potential of Balochistan's land, coast, minerals and culture.",
    "The Chief Minister has emphasised transparent, accountable governance and a service-delivery model that reaches every district — from the coastal belt of Gwadar and Makran to the highlands of Quetta, Zhob and Kalat.",
  ],
  facts: [
    { label: "In office since", value: "2 March 2024" },
    { label: "Assembly", value: "Provincial Assembly of Balochistan" },
    { label: "Residence", value: "Chief Minister House, Quetta" },
    { label: "Term length", value: "Five years" },
  ],
};

export const visionMission = {
  vision:
    "To build a prosperous, peaceful, inclusive, and developed province where every citizen has access to opportunities, quality public services, and an improved standard of living.",
  mission:
    "To promote transparent governance, strengthen public institutions, improve service delivery, encourage sustainable development, and ensure that citizens’ concerns are addressed effectively.",
};

export const firstDayPriorities = [
  {
    id: "good-governance",
    title: "Good Governance",
    fullTitle: "Good Governance & Administrative Reforms",
    description: "Streamlining government machinery, merit-based public appointments, e-office civil secretariat, and eliminating procedural bottlenecks across all departments.",
    directiveMessage: "Under the Balochistan Good Governance Plan (D.O. PS-CM/1-3/189), all administrative secretaries are directed to strictly execute functions under Rules of Business within 30 days, delegate powers to District & Division levels under BEEDA, and empower CMIT for merit-based public service.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #1, 6, 49, 52)",
    assignedDept: "All Secretaries, Chief Secretary & S&GAD",
    reformTasks: [
      "Strict execution of departmental functions under Rules of Business (30 Days)",
      "Delegation of executive & disciplinary powers to District & Division levels",
      "Full empowerment and activation of Chief Minister's Inspection Team (CMIT)",
    ],
    icon: "landmark",
    iconImage: "/images/priorities/good-governance.png",
    bgImage: "/images/priorities/good-governance-bg.jpg",
    status: "Active Implementation",
  },
  {
    id: "law-order",
    title: "Law & Order",
    fullTitle: "Law and Order & Public Safety",
    description: "Strengthening community safety, modernizing police resources, rapid emergency response, and ensuring rule of law across every division and district.",
    directiveMessage: "Urgent mandate issued to ACS Home to modernize and equip police and levies forces on advanced lines within 30 days, deploy Balochistan Constabulary to fill district shortages, revive Executive Magistracy, and establish functional prosecution offices across all districts.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #23, 24, 25, 41)",
    assignedDept: "ACS Home & Secretary Prosecution",
    reformTasks: [
      "Streamlining & equipment of Levies and Police forces on modern lines (30 Days)",
      "Filling shortage of policemen at district level utilizing Balochistan Constabulary",
      "Revival of Executive Magistracy & district prosecution offices",
    ],
    icon: "shield",
    iconImage: "/images/priorities/law-order.png",
    bgImage: "/images/priorities/law-order-bg.jpg",
    status: "Priority Focus",
  },
  {
    id: "health-education",
    title: "Health & Education",
    fullTitle: "Healthcare and Quality Education",
    description: "Emergency care facilities at district hospitals, teacher attendance monitoring, free health insurance cards, and quality free schooling for every child.",
    directiveMessage: "Health Department is directed within 30 days to ensure 100% posting of surgeons and gynecologists at all DHQ hospitals, guarantee free medicine transparency, and transition BMC, Civil Hospital, and Sheikh Zaid Hospital to semi-autonomous governance. Schools Department is tasked with overhauling education and PPP outsourcing of non-functional schools.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #7, 20, 21, 22, 48)",
    assignedDept: "Secretary Health, Schools & Colleges",
    reformTasks: [
      "Ensure posting of Surgeons & Gynecologists at all DHQ hospitals (30 Days)",
      "Autonomy for Bolan Medical Complex, Civil Hospital & Sheikh Zaid Hospital",
      "Overhauling education system & PPP outsourcing of non-functional schools",
    ],
    icon: "heart",
    iconImage: "/images/priorities/health-education.png",
    bgImage: "/images/priorities/health-education-bg.jpg",
    status: "Directly Monitored",
  },
  {
    id: "service-delivery",
    title: "Public Service Delivery",
    fullTitle: "Public Service Delivery & Civic Amenities",
    description: "Bringing vital public utilities, clean drinking water, sanitation facilities, solar tube wells, and municipal facilitation to citizens' doorsteps.",
    directiveMessage: "Public Health Engineering is ordered within 30 days to provide treated safe drinking water, urgently complete and inaugurate Mangi Dam, and expedite Burj Aziz Khan Dam feasibility. Civic bodies are mandated to launch divisional housing schemes and enforce Balochistan Food Authority regulations.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #8, 17, 42, 43, 44)",
    assignedDept: "Secretary PHE, Food, C&W & LG",
    reformTasks: [
      "Urgent completion & inauguration of Mangi Dam for Quetta water (30 Days)",
      "Safe drinking water via water treatment & Burj Aziz Khan Dam feasibility",
      "Launch of divisional housing schemes & active Food Authority enforcement",
    ],
    icon: "globe",
    iconImage: "/images/priorities/service-delivery.png",
    bgImage: "/images/priorities/service-delivery-bg.jpg",
    status: "Rapid Rollout",
  },
  {
    id: "infrastructure",
    title: "Development & Infrastructure",
    fullTitle: "Development and Infrastructure Connectivity",
    description: "Upgrading inter-district highway connectivity, rural farm-to-market roads, Gwadar port expressways, solar power, and transit logistics.",
    directiveMessage: "Planning & Development and Energy departments are mandated to enforce mandatory GIS mapping of all development schemes to eliminate duplication, complete rapid solarization of agricultural tubewells within 30 days, enforce quality compliance, and assert provincial supervision over Saindak and Reko Diq projects.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #13, 28, 34, 36, 37)",
    assignedDept: "ACS P&D, Energy, Irrigation & Mines",
    reformTasks: [
      "Solarization of agricultural tubewells & subsidy rationalization (30 Days)",
      "Mandatory GIS mapping of all schemes to eliminate duplication of public funds",
      "Provincial oversight of Reko Diq & Saindak Metal Limited takeover",
    ],
    icon: "compass",
    iconImage: "/images/priorities/infrastructure.png",
    bgImage: "/images/priorities/infrastructure-bg.jpg",
    status: "High Priority",
  },
  {
    id: "employment",
    title: "Employment & Economic Opportunities",
    fullTitle: "Employment & Economic Opportunities",
    description: "Youth skills development, training 20,000 digital freelancers, enterprise grants, and sustainable job creation in minerals and coastal fisheries.",
    directiveMessage: "To unlock dignified livelihood opportunities, all technical and vocational institutes are unified under TEVTA for rapid job creation. Science & IT is mandated to expand the Digibiz freelancing scheme to all districts within 45 days, while Fisheries provides modern boats and colonies to coastal fishermen.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #16, 29, 30, 46, 63)",
    assignedDept: "Secretary S&IT, TEVTA, Fisheries & Sports",
    reformTasks: [
      "Unified TEVTA authority for market-oriented skill training & job creation (30 Days)",
      "Expand Digibiz freelancing and digital entrepreneurship to all districts (45 Days)",
      "Provision of boats, markets, and colonies for coastal fishermen",
    ],
    icon: "trending",
    iconImage: "/images/priorities/employment.png",
    bgImage: "/images/priorities/employment-bg.jpg",
    status: "Active Program",
  },
  {
    id: "grm-priority",
    title: "Public Grievance Redressal",
    fullTitle: "Public Grievance Redressal (AWAAZ)",
    description: "Direct citizen complaint redressal mechanism operating with time-bound departmental accountability and statutory resolution tracking.",
    directiveMessage: "In strict compliance with constitutional guarantees under Article 139(3), all departments must resolve citizen complaints through time-bound statutory redressal. ACS P&D and Local Government are directed to release functional development grants and activate grassroots District Development Working Parties (DDWP) within 30 days.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #32, 33, 38 & Preamble)",
    assignedDept: "ACS P&D, Secretary LG & All Departments",
    reformTasks: [
      "Direct time-bound compliance on public grievances via AWAAZ GRM portal",
      "Activation of DDWP for identification and approval of schemes at grassroots level (30 Days)",
      "Grant of functional development and operational budgets for Local Councils",
    ],
    icon: "message",
    iconImage: "/images/priorities/grm-priority.png",
    bgImage: "/images/priorities/grm-priority-bg.jpg",
    status: "Operational",
  },
  {
    id: "accountability",
    title: "Accountability & Transparency",
    fullTitle: "Accountability and Transparency Directives",
    description: "Open procurement tenders, digitized provincial expenditure, audit oversight, and zero tolerance for institutional corruption.",
    directiveMessage: "Directives require the immediate empowerment and activation of the Anti-Corruption Establishment, mandatory monthly biometric verification and written DDO certification before salary disbursement, abolition or downsizing of redundant authorities within 45 days, and complete digitization of district land records.",
    officialRef: "D.O. PS-CM/1-3/189 (Task #4, 5, 14, 54, 55)",
    assignedDept: "Chief Secretary, Finance, SMBR & Anti-Corruption",
    reformTasks: [
      "Empowerment & active enforcement by Anti-Corruption Establishment (30 Days)",
      "Biometric verification & DDO certification before monthly salary payments",
      "Downsizing of redundant government offices & digitization of land records",
    ],
    icon: "shield",
    iconImage: "/images/priorities/accountability.png",
    bgImage: "/images/priorities/accountability-bg.jpg",
    status: "Enforced",
  },
];

export const coreInitiatives = [
  {
    id: "green-bus",
    title: "Green Bus Service Quetta",
    category: "Public Transportation",
    description: "Promoting affordable, accessible, and environmentally friendly public transportation to improve daily mobility and urban connectivity.",
    impact: "95% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/green-bus.png",
  },
  {
    id: "pink-bus",
    title: "Pink Bus Women Transit Initiative",
    category: "Public Transportation",
    description: "Dedicated safe, subsidized public transport reserved exclusively for women students, teachers, and working professionals in Quetta.",
    impact: "85% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/pink-bus.jpg",
  },
  {
    id: "healthcare-improvement",
    title: "Healthcare Improvement & Sehat Card",
    category: "Public Health",
    description: "Strengthening public healthcare facilities, mobile health units in remote union councils, and 24/7 emergency response at district hospitals.",
    impact: "80% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/sehat-card.png",
  },
  {
    id: "education-youth",
    title: "Youth Digital Freelancing Programme",
    category: "Education & Youth",
    description: "Expanding educational access, tech freelancing training for 20,000 young people, and modern facilities in rural girls' schools.",
    impact: "70% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/youth-skills.png",
  },
  {
    id: "digital-governance",
    title: "Digital Balochistan & E-Office Secretariat",
    category: "Digital Governance",
    description: "Promoting digital public services, citizen grievance portals, streamlined administrative processes, and open access to government data.",
    impact: "65% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/digital-balochistan.png",
  },
  {
    id: "infrastructure-welfare",
    title: "Solar Irrigation & Clean Water Desalination",
    category: "Civic Infrastructure",
    description: "Priority development projects in solar agricultural tube wells, clean drinking water filtration plants, and community welfare funds.",
    impact: "75% Target Progress",
    status: "Active",
    bgImage: "/images/initiatives/solar-water.png",
  },
];

export const newsCategories = [
  "All Updates",
  "Official Meetings",
  "Press Releases",
  "Policy Announcements",
  "Development Projects",
  "Public Welfare Initiatives",
  "Speeches and Statements",
  "Visits and Events",
] as const;

export const heroStats = [
  { value: "347,190", suffix: " km²", label: "Land area — 44% of Pakistan" },
  { value: "36", suffix: "", label: "Districts across the province" },
  { value: "15.4", suffix: "M", label: "People, 2023 census estimate" },
  { value: "1,000", suffix: "+ km", label: "Coastline along the Arabian Sea" },
];

export const nav: {
  label: string;
  href?: string;
  children?: { label: string; href: string; external?: boolean; description?: string }[];
}[] = [
  { label: "Home", href: "/" },
  {
    label: "Chief Minister",
    children: [
      { label: "About Chief Minister", href: "/chief-minister", description: "Profile, vision and official message" },
      { label: "Former Chief Ministers & Cabinet", href: "/chief-ministers", description: "Historical record of provincial leaders and executive cabinet" },
    ],
  },
  { label: "Priorities", href: "/priorities" },
  {
    label: "Complaint Cell (GRM)",
    children: [
      {
        label: "Register a Complaint",
        href: "https://grmbalochistan.com/complain",
        external: true,
        description: "Official GRM portal — file an official grievance",
      },
      {
        label: "Track Complaint Status",
        href: "https://grmbalochistan.com/track",
        external: true,
        description: "Real-time grievance tracking via reference code",
      },
    ],
  },
  { label: "News & Updates", href: "/news" },
  { label: "Media Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/connect" },
];

export const quickAccess = [
  {
    title: "Know Your CM",
    caption: "Profile & vision",
    href: "/chief-minister",
    icon: "users" as const,
  },
  {
    title: "News Updates",
    caption: "Latest from the office",
    href: "/news",
    icon: "news" as const,
  },
  {
    title: "Priorities",
    caption: "Our development agenda",
    href: "/priorities",
    icon: "target" as const,
  },
  {
    title: "Complaint Cell",
    caption: "Official GRM Portal",
    href: "https://grmbalochistan.com/complain",
    icon: "message" as const,
  },
  {
    title: "Social Media",
    caption: "Follow the office",
    href: "/connect#social",
    icon: "share" as const,
  },
  {
    title: "About Balochistan",
    caption: "People, land & culture",
    href: "/about-balochistan",
    icon: "mountain" as const,
  },
];

export const priorities: Priority[] = [
  {
    slug: "youth-global-connectivity",
    title: "Youth & Global Connectivity",
    short: "Skills, digital access and international opportunity for young people.",
    description:
      "Balochistan is a young province. We are connecting young people to skills, digital platforms and international markets — so that talent in Turbat or Zhob can compete with talent anywhere in the world.",
    icon: "globe",
    initiatives: [
      "Digital skills and freelancing programmes for 20,000 young people",
      "Provincial youth internship and mentorship scheme",
      "Broadband and public Wi-Fi in district headquarters",
      "Scholarships for study at leading national and international institutions",
    ],
  },
  {
    slug: "local-government",
    title: "Local Government",
    short: "Strong local institutions that bring services closer to citizens.",
    description:
      "A progressive Balochistan needs vibrant local government. We are devolving power, building municipal capacity and making local councils accountable to the communities they serve.",
    icon: "landmark",
    initiatives: [
      "Capacity building for elected local councils",
      "Participatory budgeting in every district",
      "Digital service desks in municipal offices",
      "Clean drinking water and sanitation partnerships",
    ],
  },
  {
    slug: "environment",
    title: "Environment & Climate Resilience",
    short: "Protecting fragile ecosystems and preparing communities for change.",
    description:
      "From the juniper forests of Ziarat to the wetlands of Makran, Balochistan's ecosystems are precious and fragile. Climate adaptation, water stewardship and clean energy are central to our future.",
    icon: "leaf",
    initiatives: [
      "Provincial climate adaptation and water security plan",
      "Solar irrigation and clean energy incentives",
      "Watershed restoration and rangeland management",
      "Plastic-free public offices and markets",
    ],
  },
  {
    slug: "culture",
    title: "Culture & Heritage",
    short: "Preserving Balochistan's languages, crafts, music and historic sites.",
    description:
      "Balochistan is home to some of the oldest civilisations and richest living traditions in the region. We are investing in heritage conservation, cultural tourism and the artists who keep these traditions alive.",
    icon: "palette",
    initiatives: [
      "Restoration of archaeological and heritage sites",
      "Support fund for artisans, musicians and craftspeople",
      "Provincial cultural festivals and museum upgrades",
      "Heritage tourism trails across the province",
    ],
  },
  {
    slug: "women",
    title: "Women's Empowerment",
    short: "Equal opportunity, safety and participation for every woman.",
    description:
      "No province can prosper while half its people are held back. We are expanding women's access to education, healthcare, employment and public life — and acting firmly against violence and discrimination.",
    icon: "women",
    initiatives: [
      "Women's skill and enterprise centres in each division",
      "Safe transport and hostel facilities for students",
      "Legal aid and protection services for survivors",
      "Targeted recruitment in provincial public service",
    ],
  },
  {
    slug: "agriculture-water",
    title: "Agriculture & Water",
    short: "Modern farming, efficient irrigation and food security.",
    description:
      "Agriculture and livestock sustain a large share of our families. We are modernising irrigation, improving market access and helping farmers adapt to water scarcity with better seed, storage and finance.",
    icon: "wheat",
    initiatives: [
      "Solar-powered tube wells and drip irrigation",
      "Cold-chain and storage facilities for fruit and vegetables",
      "Livestock health and breed improvement programme",
      "Direct farmer-to-market platforms and fair price support",
    ],
  },
  {
    slug: "law-order",
    title: "Law & Order",
    short: "Safety, justice and a secure environment for every community.",
    description:
      "Peace is the foundation of development. We are strengthening policing, modernising justice services and investing in community-based approaches that make every district safer.",
    icon: "shield",
    initiatives: [
      "Modern equipment and training for provincial police",
      "Community policing and dispute resolution committees",
      "Upgraded courts, prosecution and legal aid services",
      "Traffic management and road safety in urban centres",
    ],
  },
  {
    slug: "education",
    title: "Education",
    short: "Accessible, quality schooling and skills for the future.",
    description:
      "Education is the surest route out of poverty. We are building and repairing schools, training teachers, and making sure that every child — especially every girl — has a place to learn.",
    icon: "book",
    initiatives: [
      "Out-of-school children enrolment campaign",
      "Teacher recruitment, training and performance support",
      "Upgrading science labs and school libraries",
      "Technical and vocational education in every division",
    ],
  },
  {
    slug: "health",
    title: "Health",
    short: "Better facilities, more health workers and care that reaches everyone.",
    description:
      "Healthcare should not depend on how far you live from a city. We are expanding primary care, upgrading district hospitals and taking specialist services to remote communities.",
    icon: "heart",
    initiatives: [
      "24/7 emergency services at district headquarters hospitals",
      "Expanded Sehat Card coverage for families",
      "Mobile health units for remote union councils",
      "Recruitment and retention of doctors, nurses and paramedics",
    ],
  },
];

export const news: NewsItem[] = [
  {
    slug: "gwadar-development-review",
    title: "Chief Minister reviews progress on Gwadar development projects",
    excerpt:
      "A high-level review examined timelines for water supply, fisheries infrastructure and the new vocational institute in Gwadar.",
    category: "Development",
    date: "12 October 2026",
    dateISO: "2026-10-12",
    readTime: "3 min read",
    body: [
      "QUETTA — The Chief Minister chaired a high-level meeting to review the implementation of development projects in Gwadar, with a focus on water supply, fisheries infrastructure and skills training for local residents.",
      "Officials briefed the meeting on the completion of the first phase of the Gwadar water augmentation scheme, which will add a significant volume of safe drinking water to the city's supply. The Chief Minister directed that remaining distribution work be completed on schedule and that outages be communicated transparently to residents.",
      "The meeting also reviewed progress on the modern fisheries harbour and cold-chain facilities, designed to reduce post-harvest losses and increase the value of the catch retained in Balochistan.",
      "A new vocational institute in Gwadar will begin short courses in welding, electrical work, hospitality and maritime trades this winter, with priority admission for residents of Gwadar district.",
      "The Chief Minister instructed departments to publish quarterly progress updates and to hold regular open sessions with local traders, fishermen and community representatives.",
    ],
  },
  {
    slug: "sehat-card-expansion",
    title: "Provincial cabinet approves expansion of Sehat Card coverage",
    excerpt:
      "More families will be able to access free inpatient treatment at empanelled public and private hospitals across the province.",
    category: "Health",
    date: "28 September 2026",
    dateISO: "2026-09-28",
    readTime: "2 min read",
    body: [
      "QUETTA — The provincial cabinet has approved an expansion of the Sehat Card programme, widening eligibility and increasing the annual coverage available to enrolled families.",
      "The scheme allows eligible residents to receive free inpatient treatment at a network of empanelled public and private hospitals, including specialist care that is not available in their home district.",
      "The cabinet directed the health department to simplify enrolment, open facilitation desks in every district hospital, and ensure timely reimbursement to empanelled facilities.",
      "A public awareness campaign will run through local radio, mosques and community organisations to reach families in remote areas, especially in Makran, Kalat and the Nasirabad division.",
    ],
  },
  {
    slug: "digital-skills-programme",
    title: "Balochistan launches digital skills programme for 10,000 youth",
    excerpt:
      "The programme will offer free training in freelancing, web development, data entry and digital marketing across all divisions.",
    category: "Youth",
    date: "15 September 2026",
    dateISO: "2026-09-15",
    readTime: "3 min read",
    body: [
      "QUETTA — A new provincial digital skills programme will train 10,000 young people in freelancing, web development, data entry and digital marketing over the coming year.",
      "Courses will be delivered through government colleges and partner training centres in each division, with a mix of in-person and online instruction. Participants will receive certification and support to find their first clients.",
      "The initiative includes dedicated quotas for women, persons with disabilities and young people from the province's most remote districts.",
      "The Chief Minister said the programme was part of a wider effort to build a digital economy in Balochistan and keep talent in the province. 'Young people here do not need to leave home to build a future,' he said.",
    ],
  },
  {
    slug: "new-girls-schools-zhob-khuzdar",
    title: "New girls' schools open in Zhob and Khuzdar",
    excerpt:
      "Two newly constructed schools will provide safe, modern learning spaces for more than 1,200 students.",
    category: "Education",
    date: "2 September 2026",
    dateISO: "2026-09-02",
    readTime: "2 min read",
    body: [
      "ZHOB — Two newly constructed girls' schools have opened in Zhob and Khuzdar districts, providing modern classrooms, science laboratories, libraries and safe transport for more than 1,200 students.",
      "The schools are part of a provincial programme to reduce overcrowding and improve the learning environment in underserved areas. Each campus includes accessible facilities, clean water and solar power.",
      "The education department has also recruited and trained additional teachers for both schools, with a focus on science and mathematics.",
      "Parents and community elders welcomed the new facilities, noting that distance and safety had previously kept many girls out of school.",
    ],
  },
  {
    slug: "solar-irrigation-naseerabad",
    title: "Solar irrigation initiative reaches 500 farms in Naseerabad",
    excerpt:
      "Farmers report lower fuel costs and more reliable water as solar-powered pumps replace diesel generators.",
    category: "Agriculture",
    date: "18 August 2026",
    dateISO: "2026-08-18",
    readTime: "3 min read",
    body: [
      "NASEERABAD — A provincial initiative to convert agricultural tube wells to solar power has now reached 500 farms in the Naseerabad division, with farmers reporting significantly lower operating costs.",
      "The programme provides subsidised solar pumping systems, technical training and maintenance support. It is expected to reduce diesel consumption and help farmers cope with rising energy prices.",
      "Agriculture officials said the next phase will focus on drip irrigation, which can cut water use while improving yields for orchards and vegetables.",
      "The Chief Minister directed that the programme be expanded to other water-stressed districts and that transparent beneficiary lists be published.",
    ],
  },
  {
    slug: "quetta-heritage-corridor",
    title: "Quetta's Liaquat Bazaar heritage corridor restored",
    excerpt:
      "A restored market corridor combines heritage facades, improved pedestrian access and space for local artisans.",
    category: "Culture",
    date: "30 July 2026",
    dateISO: "2026-07-30",
    readTime: "2 min read",
    body: [
      "QUETTA — The restored heritage corridor at Liaquat Bazaar was opened to the public this week, combining conserved facades with wider pedestrian walkways, lighting and dedicated space for local artisans.",
      "The project was designed with input from traders, historians and residents, and aims to protect the character of one of Quetta's oldest commercial areas while improving safety and accessibility.",
      "A small cultural programme will run through the autumn, featuring local music, craft demonstrations and food stalls.",
      "The provincial government said further heritage and public-space projects are planned in Quetta, Kalat and Lasbela.",
    ],
  },
];

export const chiefMinisters: ChiefMinister[] = [
  { name: "Ataullah Mengal", party: "National Awami Party", from: "1 May 1972", to: "13 Feb 1973" },
  { name: "Jam Ghulam Qadir Khan", party: "Pakistan Peoples Party", from: "27 Apr 1973", to: "31 Dec 1975" },
  { name: "Mohammad Khan Barozai", party: "Pakistan Peoples Party", from: "7 Dec 1976", to: "5 Jul 1977" },
  { name: "Jam Ghulam Qadir Khan", party: "Independent", from: "6 Apr 1985", to: "29 May 1988" },
  { name: "Zafarullah Khan Jamali", party: "Islami Jamhoori Ittehad", from: "24 Jun 1988", to: "24 Dec 1988" },
  { name: "Nawab Akbar Khan Bugti", party: "Jamhoori Watan Party", from: "5 Feb 1989", to: "7 Aug 1990" },
  { name: "Taj Muhammad Jamali", party: "Islami Jamhoori Ittehad", from: "17 Nov 1990", to: "22 May 1993" },
  { name: "Zulfikar Ali Magsi", party: "Pakistan Peoples Party", from: "20 Oct 1993", to: "9 Nov 1996" },
  { name: "Akhtar Mengal", party: "Balochistan National Party (M)", from: "22 Feb 1997", to: "29 Jul 1998" },
  { name: "Mir Jan Mohammad Jamali", party: "Pakistan Muslim League (N)", from: "13 Aug 1998", to: "12 Oct 1999" },
  { name: "Jam Mohammad Yousaf", party: "Pakistan Muslim League (Q)", from: "1 Dec 2002", to: "19 Nov 2007" },
  { name: "Nawab Aslam Raisani", party: "Pakistan Peoples Party", from: "9 Apr 2008", to: "13 Jan 2013" },
  { name: "Abdul Malik Baloch", party: "National Party", from: "7 Jun 2013", to: "23 Dec 2015" },
  { name: "Sanaullah Khan Zehri", party: "Pakistan Muslim League (N)", from: "24 Dec 2015", to: "9 Jan 2018" },
  { name: "Abdul Quddus Bizenjo", party: "Pakistan Muslim League (Q)", from: "13 Jan 2018", to: "7 Jun 2018" },
  { name: "Jam Kamal Khan", party: "Balochistan Awami Party", from: "19 Aug 2018", to: "24 Oct 2021" },
  { name: "Abdul Quddus Bizenjo", party: "Balochistan Awami Party", from: "29 Oct 2021", to: "18 Aug 2023" },
  { name: "Mir Sarfraz Bugti", party: "Pakistan Peoples Party", from: "2 Mar 2024", to: "Incumbent", note: "Current Chief Minister" },
];

export interface CabinetMember {
  name: string;
  designation: string;
  portfolio: string;
  ministry: string;
  departmentUrl?: string;
  isLeader?: boolean;
}

export const initialCabinet: CabinetMember[] = [
  {
    name: "Mir Sarfraz Bugti",
    designation: "Chief Minister",
    portfolio: "Law & Order, S&GAD, Planning & Development",
    ministry: "Chief Minister's Secretariat",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: true,
  },
  {
    name: "Mir Zahoor Ahmed Buledi",
    designation: "Provincial Minister",
    portfolio: "Planning and Development",
    ministry: "Planning & Development Department",
    departmentUrl: "https://pnd.balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Mir Shoaib Nosherwani",
    designation: "Provincial Minister",
    portfolio: "Finance",
    ministry: "Finance Department",
    departmentUrl: "https://finance.balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Mir Ziaullah Langau",
    designation: "Provincial Minister",
    portfolio: "Home & Tribal Affairs",
    ministry: "Home and Tribal Affairs Department",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Noor Mohammad Dummar",
    designation: "Provincial Minister",
    portfolio: "Public Health Engineering",
    ministry: "PHE Department",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Sardar Abdul Rehman Khetran",
    designation: "Provincial Minister",
    portfolio: "Communication, Works & Physical Planning",
    ministry: "C&W Department",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Saleem Ahmed Khosa",
    designation: "Provincial Minister",
    portfolio: "Agriculture and Cooperative",
    ministry: "Agriculture Department",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Ali Madad Jattak",
    designation: "Provincial Minister",
    portfolio: "Agriculture & Water Resources",
    ministry: "Provincial Ministry",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
  {
    name: "Bakht Muhammad Kakar",
    designation: "Provincial Minister",
    portfolio: "Livestock & Dairy Development",
    ministry: "Livestock Department",
    departmentUrl: "https://balochistan.gov.pk",
    isLeader: false,
  },
];

export const aboutTiles = [
  { id: "quick-stats", title: "Quick Stats", icon: "chart" as const },
  { id: "history", title: "History", icon: "book" as const },
  { id: "geography", title: "Geography", icon: "mountain" as const },
  { id: "economy", title: "Economy", icon: "trending" as const },
  { id: "people", title: "People & Culture", icon: "users" as const },
  { id: "tourism", title: "Tourism", icon: "compass" as const },
];

export const timeline = [
  { year: "1970", title: "A province is born", body: "The One Unit scheme is dissolved and Balochistan becomes a separate federating unit with its own legislature." },
  { year: "1972", title: "First assembly convenes", body: "The first Provincial Assembly session elects Ataullah Mengal as the province's first Chief Minister." },
  { year: "1973", title: "A turbulent beginning", body: "The Mengal government is dismissed, followed by years of political instability and governor's rule." },
  { year: "1985", title: "Civilian government returns", body: "Partyless elections restore civilian rule under Jam Ghulam Qadir Khan." },
  { year: "1990s", title: "Coalitions and change", body: "Short-lived coalitions and frequent changes mark a volatile decade in provincial politics." },
  { year: "2002", title: "A full term", body: "Jam Mohammad Yousaf serves nearly five years, the longest continuous term in the office's history." },
  { year: "2018", title: "A new party era", body: "The Balochistan Awami Party forms government, with Jam Kamal Khan and later Abdul Quddus Bizenjo as Chief Minister." },
  { year: "2024", title: "A new mandate", body: "Mir Sarfraz Bugti is elected Chief Minister and begins a reform agenda focused on service delivery and opportunity." },
];

export const aboutBalochistan = {
  intro:
    "Balochistan is Pakistan's largest province by land and its most sparsely populated. From the Arabian Sea coast to the highlands of the Sulaiman and Toba Kakar ranges, it is a land of extraordinary landscapes, ancient civilisations and resilient communities.",
  sections: [
    {
      id: "quick-stats",
      title: "Quick Stats",
      body: "Balochistan covers 347,190 square kilometres — about 44 per cent of Pakistan — and is home to more than 15 million people across 36 districts. Its 1,000-kilometre coastline anchors the province's fisheries and port economy.",
      facts: [
        { label: "Capital", value: "Quetta" },
        { label: "Area", value: "347,190 km²" },
        { label: "Districts", value: "36" },
        { label: "Population", value: "15.4 million (est.)" },
        { label: "Divisions", value: "7" },
        { label: "Coastline", value: "1,000+ km" },
      ],
    },
    {
      id: "history",
      title: "History",
      body: "The region's history stretches back millennia, through the Indus Valley settlements of Mehrgarh and the maritime trade of the Makran coast. Balochistan was administered as part of British India and later West Pakistan before becoming a separate province in 1970, with its first provincial assembly convening in 1972.",
      facts: [
        { label: "Mehrgarh", value: "Neolithic settlement, c. 7000 BCE" },
        { label: "Province created", value: "1970" },
        { label: "First assembly", value: "1972" },
        { label: "First Chief Minister", value: "Ataullah Mengal" },
      ],
    },
    {
      id: "geography",
      title: "Geography",
      body: "Balochistan's terrain runs from arid plains and rugged mountain ranges to the Makran coastal belt. The province borders Iran to the west, Afghanistan to the north and Arabian Sea to the south, giving it a distinctive strategic and ecological position.",
      facts: [
        { label: "Highest peak", value: "Sikaram (approx. 2,700 m)" },
        { label: "Major ranges", value: "Toba Kakar, Sulaiman, Chagai, Makran" },
        { label: "Deserts", value: "Kharan, Chagai, Dasht-e-Margo" },
        { label: "Coastline", value: "Gwadar, Ormara, Pasni, Sonmiani" },
      ],
    },
    {
      id: "economy",
      title: "Economy",
      body: "Balochistan's economy rests on agriculture, livestock, fisheries, minerals and port trade. The province holds substantial reserves of natural gas, copper, gold and coal, and Gwadar is emerging as a major gateway for regional commerce.",
      facts: [
        { label: "Key sectors", value: "Agriculture, minerals, fisheries, ports" },
        { label: "Major crops", value: "Wheat, rice, dates, apples" },
        { label: "Minerals", value: "Copper, gold, coal, chromite, marble" },
        { label: "Coastal economy", value: "Fisheries and Gwadar port" },
      ],
    },
    {
      id: "people",
      title: "People & Culture",
      body: "Balochistan is a mosaic of communities — Baloch, Brahui, Pashtun, Hazara, Sindhi and others — speaking Balochi, Brahui, Pashto, Urdu, Hazaragi and Sindhi. Hospitality, poetry, music, embroidery and shared festivals are central to its cultural life.",
      facts: [
        { label: "Languages", value: "Balochi, Brahui, Pashto, Urdu, Sindhi" },
        { label: "Crafts", value: "Balochi embroidery, mirror work, pottery" },
        { label: "Music", value: "Balochi folk and classical traditions" },
        { label: "Festivals", value: "Eid, Sibi Mela, cultural festivals" },
      ],
    },
    {
      id: "tourism",
      title: "Tourism",
      body: "From the juniper forests of Ziarat and the mud volcanoes of Hingol to the beaches of Kund Malir and the colonial-era architecture of Quetta, Balochistan offers some of Pakistan's most distinctive travel experiences.",
      facts: [
        { label: "Ziarat", value: "Juniper forest and Quaid's Residency" },
        { label: "Hingol", value: "National park and mud volcanoes" },
        { label: "Coast", value: "Kund Malir, Ormara, Gwadar" },
        { label: "Heritage", value: "Mehrgarh, Bolan Pass, Quetta bazaars" },
      ],
    },
  ],
};

export const searchIndex = [
  { title: "Home", href: "/", description: "Office of the Chief Minister of Balochistan", type: "Page" },
  { title: "Know Your CM", href: "/chief-minister", description: "Profile and vision of the Chief Minister", type: "Page" },
  { title: "Former Chief Ministers & Cabinet", href: "/chief-ministers", description: "Leaders who have held the office since 1972 and executive cabinet ministers", type: "Page" },
  { title: "Priorities", href: "/priorities", description: "The provincial development agenda", type: "Page" },
  { title: "Development Initiatives", href: "/initiatives", description: "Flagship public development programs and projects in Balochistan", type: "Page" },
  { title: "News Updates", href: "/news", description: "Press releases and stories from the office", type: "Page" },
  { title: "About Balochistan", href: "/about-balochistan", description: "People, land, history and culture", type: "Page" },
  { title: "Connect with Us", href: "/connect", description: "Contact the office or register a complaint", type: "Page" },
  { title: "Complaint Cell & GRM", href: "/complaint-cell", description: "Official Citizen Grievance Redressal Mechanism, tracking & escalation", type: "Page" },
  { title: "Media & Video Gallery", href: "/gallery", description: "Official photo and video visual archives, event photos and high-def videos", type: "Page" },
  { title: "Register Complaint (Official GRM)", href: "https://grmbalochistan.com/complain", description: "Official Balochistan Grievance Redressal Mechanism — register an official complaint", type: "Page" },
  { title: "Track Complaint Status", href: "https://grmbalochistan.com/track", description: "Official Balochistan Grievance Tracker — track your grievance by reference code", type: "Page" },
  ...priorities.map((p) => ({
    title: p.title,
    href: `/priorities/${p.slug}`,
    description: p.short,
    type: "Priority",
  })),
  ...news.map((n) => ({
    title: n.title,
    href: `/news/${n.slug}`,
    description: n.excerpt,
    type: "News",
  })),
];
