// Sample case study data for development/demo purposes
// This simulates the GraphQL response structure for publicPortfolioSlice

export const sampleCaseStudies = [
  {
    id: "1",
    slug: "techstart-rebrand",
    name: "TechStart Rebrand",
    title: "TechStart Rebrand",
    clientType: "FinTech Startup",
    industry: "Financial Technology",
    intro: "TechStart, a Ghana-based fintech startup, needed a complete brand overhaul to attract Series A funding. Their existing identity felt generic and didn't communicate their innovative approach to digital banking for underserved communities.",
    logo: "/client-techstart.svg",
    heroImage: "/hero2.png",
    designTools: ["figma", "illustrator", "photoshop"],
    isDesignProject: true,
    deliverables: [
      { title: "Brand Strategy Document", description: "Comprehensive positioning, messaging, and audience analysis" },
      { title: "Logo & Visual Identity", description: "Primary logo, variations, color palette, typography system" },
      { title: "Brand Guidelines", description: "50-page brand manual with usage rules and applications" },
      { title: "Pitch Deck Template", description: "Investor-ready presentation template" },
      { title: "Marketing Collateral", description: "Social media templates, email headers, one-pagers" }
    ],
    designSystem: {
      colors: [
        { name: "Primary Blue", hex: "#0015AA", usage: "Primary actions, headers" },
        { name: "Accent Gold", hex: "#FBB03B", usage: "CTAs, highlights" },
        { name: "Dark Navy", hex: "#000826", usage: "Text, backgrounds" },
        { name: "Light Gray", hex: "#F5F5F5", usage: "Secondary backgrounds" },
        { name: "Success Green", hex: "#10B981", usage: "Positive states" },
        { name: "Error Red", hex: "#EF4444", usage: "Error states" }
      ],
      typography: {
        heading: { fontFamily: "Montserrat", weight: "700", size: "clamp(2rem, 5vw, 4rem)" },
        subheading: { fontFamily: "Montserrat", weight: "600", size: "clamp(1.25rem, 3vw, 2rem)" },
        body: { fontFamily: "Poppins", weight: "400", size: "1rem" },
        caption: { fontFamily: "Poppins", weight: "500", size: "0.875rem" }
      }
    },
    caseStudy: {
      startingPoint: "TechStart launched in 2022 with a DIY logo and inconsistent visual language. As they prepared for Series A fundraising, investors questioned their brand maturity. Their mobile app had 50k+ users but the brand didn't reflect the trust and innovation their product delivered.",
      theTransformation: "We conducted a 3-week brand strategy sprint: stakeholder interviews, competitive audit, and user research across Accra, Kumasi, and Tamale. The new identity centers on 'Banking Without Barriers' - a visual system that feels premium yet accessible. The logo mark combines a shield (trust) with an upward arrow (growth), rendered in a modern geometric style.",
      journeyEnd: "Series A closed at $3.2M (2x target). Brand recognition increased 340% in post-launch surveys. App store rating improved from 3.8 to 4.6. Featured in TechCrunch Africa and Disrupt Africa.",
      visuals: {
        hero: "/hero2.png",
        logoVariations: "/hero3.jpeg",
        brandGuidelines: "/hero2.png",
        appScreens: "/hero3.jpeg",
        marketingMaterials: "/hero2.png"
      },
      process: {
        researchMethods: {
          discoveryPhase: [
            "Stakeholder interviews with 8 team members",
            "Competitive audit of 12 African fintech brands",
            "User surveys (200+ respondents across 3 cities)",
            "App store review sentiment analysis"
          ],
          designIterations: [
            "3 strategic directions presented",
            "5 logo refinements based on feedback",
            "2 rounds of color palette testing",
            "Typography pairing validation with users"
          ]
        },
        technicalImplementation: {
          frontendStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
          developmentTools: ["Figma", "Storybook", "Chromatic", "GitHub Actions"]
        },
        testingValidation: [
          { title: "Accessibility", description: "WCAG 2.1 AA compliant across all brand touchpoints", bgColor: "bg-green-50", iconColor: "text-green-600" },
          { title: "Cross-platform", description: "Tested on iOS, Android, Web, and print materials", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
          { title: "User Testing", description: "94% preference for new identity in A/B testing", bgColor: "bg-purple-50", iconColor: "text-purple-600" }
        ],
        lessonsLearned: [
          { quote: "In emerging markets, trust signals (shield, established typography) outweigh trendy aesthetics.", borderColor: "border-[#FBB03B]" },
          { quote: "A brand system must work in low-bandwidth environments - SVG icons and system font fallbacks are essential.", borderColor: "border-[#0015AA]" }
        ]
      }
    },
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "2",
    slug: "agritech-platform",
    name: "AgriTech Platform",
    title: "AgriTech Platform",
    clientType: "AgriTech Scale-up",
    industry: "Agricultural Technology",
    intro: "AgriTech connects smallholder farmers in Nigeria to urban markets via a mobile platform. They needed a brand that resonates with both rural farmers (low digital literacy) and urban buyers (tech-savvy).",
    logo: "/client-agritech.svg",
    heroImage: "/hero3.jpeg",
    designTools: ["figma", "xd", "illustrator"],
    isDesignProject: true,
    deliverables: [
      { title: "Dual-Audience Brand Strategy", description: "Separate but connected visual languages for farmers vs buyers" },
      { title: "Illustration System", description: "50+ custom illustrations for onboarding and education" },
      { title: "Mobile App Redesign", description: "Complete UI overhaul for farmer and buyer apps" },
      { title: "Field Marketing Kit", description: "Print materials for offline community engagement" }
    ],
    designSystem: {
      colors: [
        { name: "Earth Green", hex: "#2D7D32", usage: "Farmer-facing primary" },
        { name: "Sky Blue", hex: "#1565C0", usage: "Buyer-facing primary" },
        { name: "Harvest Gold", hex: "#FBB03B", usage: "Shared accent" },
        { name: "Soil Brown", hex: "#5D4037", usage: "Text, icons" },
        { name: "Leaf Light", hex: "#E8F5E9", usage: "Farmer app backgrounds" },
        { name: "Sky Light", hex: "#E3F2FD", usage: "Buyer app backgrounds" }
      ],
      typography: {
        heading: { fontFamily: "Montserrat", weight: "700", size: "clamp(1.75rem, 4vw, 3.5rem)" },
        body: { fontFamily: "Poppins", weight: "400", size: "1rem" },
        caption: { fontFamily: "Poppins", weight: "500", size: "0.875rem" }
      }
    },
    caseStudy: {
      startingPoint: "AgriTech had two disconnected apps with inconsistent branding. Farmers struggled with complex interfaces, while buyers saw an unprofessional platform. Churn was 40% monthly. The brand used generic stock photos that didn't represent Nigerian agriculture.",
      theTransformation: "We created a 'One Platform, Two Experiences' brand architecture. A shared master brand (AgriTech) with two sub-identities: 'AgriFarmer' (warm, illustrated, voice-guided) and 'AgriMarket' (clean, data-rich, professional). Custom illustrations depict Nigerian crops, markets, and farming practices. Voice-guided onboarding in Hausa, Yoruba, and Igbo.",
      journeyEnd: "Monthly churn dropped to 12%. Farmer onboarding completion rose from 23% to 78%. GMV increased 3.2x in 6 months. Won 'Best AgriTech Brand' at Africa Tech Awards 2024.",
      visuals: {
        hero: "/hero3.jpeg",
        farmerApp: "/hero2.png",
        buyerApp: "/hero3.jpeg",
        illustrations: "/hero2.png",
        fieldKit: "/hero3.jpeg"
      },
      process: {
        researchMethods: {
          discoveryPhase: [
            "Field visits to 5 farming communities in Oyo, Kaduna, Kano",
            "Buyer interviews at 3 major Lagos markets",
            "Usability testing with 40 farmers (varying literacy levels)",
            "Language and cultural consultation with local partners"
          ],
          designIterations: [
            "4 illustration style directions tested",
            "Voice-guided flow prototypes in 3 languages",
            "Icon recognition testing with 60 farmers",
            "Color contrast validation for outdoor visibility"
          ]
        },
        technicalImplementation: {
          frontendStack: ["React Native", "Expo", "TypeScript", "Lottie"],
          developmentTools: ["Figma", "Principle", "Expo EAS", "Fastlane"]
        },
        testingValidation: [
          { title: "Literacy Accessibility", description: "Voice-first design validated with non-literate users", bgColor: "bg-green-50", iconColor: "text-green-600" },
          { title: "Offline Capability", description: "Core flows work without internet connection", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
          { title: "Cultural Relevance", description: "Illustrations validated by local agricultural experts", bgColor: "bg-orange-50", iconColor: "text-orange-600" }
        ],
        lessonsLearned: [
          { quote: "Designing for low literacy requires rethinking every UI pattern - icons, flows, and feedback must work without text.", borderColor: "border-[#FBB03B]" },
          { quote: "Dual-audience brands need clear visual boundaries while maintaining unified trust.", borderColor: "border-[#0015AA]" }
        ]
      }
    },
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2024-06-20T10:00:00Z"
  },
  {
    id: "3",
    slug: "finserve-digital",
    name: "FinServe Digital Banking",
    title: "FinServe Digital Banking",
    clientType: "Digital Bank",
    industry: "Financial Services",
    intro: "FinServe, Kenya's fastest-growing digital bank, needed a brand refresh to support their expansion into SME lending and wealth management. Their startup-era brand felt too casual for corporate clients.",
    logo: "/client-finserve.svg",
    heroImage: "/hero2.png",
    designTools: ["figma", "photoshop", "illustrator", "after-effects"],
    isDesignProject: true,
    deliverables: [
      { title: "Brand Architecture", description: "Master brand + 3 product sub-brands (Retail, SME, Wealth)" },
      { title: "Motion Design System", description: "Micro-interactions, loading states, transition patterns" },
      { title: "Website & Dashboard Redesign", description: "Marketing site + customer portal + admin dashboard" },
      { title: "Campaign Toolkit", description: "Social, OOH, digital ads for 3 product launches" }
    ],
    designSystem: {
      colors: [
        { name: "Deep Teal", hex: "#006D77", usage: "Master brand primary" },
        { name: "Coral", hex: "#FF6B6B", usage: "Retail sub-brand" },
        { name: "Emerald", hex: "#00C9A7", usage: "SME sub-brand" },
        { name: "Violet", hex: "#7C3AED", usage: "Wealth sub-brand" },
        { name: "Neutral Dark", hex: "#0F172A", usage: "Text, UI chrome" },
        { name: "Neutral Light", hex: "#F8FAFC", usage: "Backgrounds" }
      ],
      typography: {
        heading: { fontFamily: "Montserrat", weight: "700", size: "clamp(2rem, 4vw, 4rem)" },
        body: { fontFamily: "Inter", weight: "400", size: "1rem" },
        mono: { fontFamily: "JetBrains Mono", weight: "500", size: "0.875rem" }
      }
    },
    caseStudy: {
      startingPoint: "FinServe's brand was built for a consumer app launch in 2021. As they added SME banking and wealth products, the playful identity undermined credibility with business clients. Three product teams created inconsistent visuals. No motion language existed for their React Native apps.",
      theTransformation: "We evolved the master brand to 'Professional Innovation' - keeping the recognizable teal but adding sophistication through a structured brand architecture. Each sub-brand gets a distinct accent color and personality while sharing core components. A comprehensive motion design system (easing curves, durations, choreography) brings consistency to app interactions.",
      journeyEnd: "SME client acquisition cost reduced 45%. Wealth management AUM grew 280% in Q1. Brand trust score (survey) increased from 6.2 to 8.7/10. Motion system reduced design handoff time by 60%.",
      visuals: {
        hero: "/hero2.png",
        subBrands: "/hero3.jpeg",
        dashboard: "/hero2.png",
        motionShowcase: "/hero3.jpeg",
        campaignAssets: "/hero2.png"
      },
      process: {
        researchMethods: {
          discoveryPhase: [
            "Brand audit across 47 touchpoints",
            "Stakeholder workshops with 12 leaders",
            "Customer interviews (retail, SME, HNWI segments)",
            "Competitive analysis of 15 African digital banks"
          ],
          designIterations: [
            "6 brand architecture models evaluated",
            "Motion principle workshops with eng team",
            "Sub-brand personality workshops",
            "Accessibility audit of color combinations"
          ]
        },
        technicalImplementation: {
          frontendStack: ["Next.js", "React Native", "TypeScript", "Framer Motion"],
          developmentTools: ["Figma", "Lottie", "Storybook", "Chromatic", "Vercel"]
        },
        testingValidation: [
          { title: "Brand Recognition", description: "92% aided recall for master brand", bgColor: "bg-green-50", iconColor: "text-green-600" },
          { title: "Motion Performance", description: "60fps animations on 5-year-old devices", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
          { title: "Conversion Impact", description: "SME landing page CVR +34% with new design", bgColor: "bg-emerald-50", iconColor: "text-emerald-600" }
        ],
        lessonsLearned: [
          { quote: "Brand architecture decisions must involve engineering early - motion tokens need developer buy-in.", borderColor: "border-[#FBB03B]" },
          { quote: "Sub-brands need distinct but not disconnected identities - shared components prevent fragmentation.", borderColor: "border-[#0015AA]" }
        ]
      }
    },
    createdAt: "2024-09-10T10:00:00Z",
    updatedAt: "2024-09-10T10:00:00Z"
  }
];

export const getCaseStudyBySlug = (slug) => {
  return sampleCaseStudies.find(cs => cs.slug === slug) || null;
};

export const getAllCaseStudies = () => {
  return sampleCaseStudies;
};