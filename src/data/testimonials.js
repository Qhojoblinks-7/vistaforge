export const TESTIMONIALS = [
  {
    id: 'testimonial-1',
    clientName: 'Kwame Asante',
    clientRole: 'Founder & CEO',
    clientCompany: 'PayFlow Ghana',
    clientImage: '/testimonial-kwame.svg',
    companyLogo: '/client-payflow.svg',
    rating: 5,
    text: 'VistaForge didn\'t just design our brand — they helped us articulate our value proposition to investors. Our Series A deck, built on their brand framework, closed a $1.2M round in 6 weeks. The team understands what African fintechs need to look "investable" to global VCs.',
    projectType: 'Brand Strategy + Pitch Deck + Website',
    projectUrl: '/portfolio/finserve-digital',
    date: '2024-03-15',
    featured: true,
    metrics: {
      label: 'Funding Raised',
      value: '$1.2M',
    },
  },
  {
    id: 'testimonial-2',
    clientName: 'Ama Serwaa',
    clientRole: 'Co-Founder',
    clientCompany: 'AgriConnect Nigeria',
    clientImage: '/testimonial-ama.svg',
    companyLogo: '/client-agriconnect.svg',
    rating: 5,
    text: 'We came in with just an MVP and a messy logo. VistaForge ran a strategy workshop that completely changed how we position ourselves to farmers and agribusinesses. Our new identity increased demo-to-trial conversion by 34%. They\'re not designers — they\'re growth partners.',
    projectType: 'Brand Identity + Website + App UI',
    projectUrl: '/portfolio/agritech-platform',
    date: '2024-02-28',
    featured: true,
    metrics: {
      label: 'Conversion Increase',
      value: '+34%',
    },
  },
  {
    id: 'testimonial-3',
    clientName: 'Dr. Kofi Osei',
    clientRole: 'Medical Director',
    clientCompany: 'MedLink Health',
    clientImage: '/testimonial-dr-kofi.svg',
    companyLogo: '/client-medlink.svg',
    rating: 5,
    text: 'Healthcare branding is different — trust is everything. VistaForge understood the regulatory landscape and patient psychology. Our new patient portal UX reduced support tickets by 60% and increased appointment booking completion to 94%. Worth every cedi.',
    projectType: 'UI/UX Design + Brand Refresh + Portal Design',
    projectUrl: '/portfolio/finserve-digital',
    date: '2024-01-20',
    featured: true,
    metrics: {
      label: 'Support Ticket Reduction',
      value: '-60%',
    },
  },
  {
    id: 'testimonial-4',
    clientName: 'Yaw Boateng',
    clientRole: 'Founder',
    clientCompany: 'EduSmart Kenya',
    clientImage: '/testimonial-yaw.svg',
    companyLogo: '/client-edusmart.svg',
    rating: 5,
    text: 'The team delivered our complete brand system — strategy, logo, guidelines, website, and investor deck — in 6 weeks flat. We used the deck to close our pre-seed round. Their "Startup Launch Pack" is exactly what early-stage founders need: done-for-you, no decision fatigue.',
    projectType: 'Startup Launch Pack (All-in)',
    projectUrl: '/portfolio/techstart-rebrand',
    date: '2024-03-10',
    featured: false,
    metrics: {
      label: 'Delivery Time',
      value: '6 weeks',
    },
  },
  {
    id: 'testimonial-5',
    clientName: 'Fatima Alhassan',
    clientRole: 'Marketing Lead',
    clientCompany: 'ShopLocal Rwanda',
    clientImage: '/testimonial-fatima.svg',
    companyLogo: '/client-shoplocal.svg',
    rating: 4,
    text: 'Great work on our rebrand and e-commerce site. The only reason for 4 stars is the timeline slipped by 1 week due to our delayed feedback. But the quality of the design system they handed off to our dev team was exceptional — pixel-perfect, documented, and accessible.',
    projectType: 'Rebrand & Scale + E-commerce Website',
    projectUrl: '/portfolio/techstart-rebrand',
    date: '2023-11-05',
    featured: false,
    metrics: {
      label: 'Design System Score',
      value: '100/100',
    },
  },
  {
    id: 'testimonial-6',
    clientName: 'Samuel Mensah',
    clientRole: 'CTO',
    clientCompany: 'LogiChain',
    clientImage: '/testimonial-samuel.svg',
    companyLogo: '/client-logichain.svg',
    rating: 5,
    text: 'We hired VistaForge for our SaaS product UI/UX. They conducted actual user research with our customers — not just assumptions. The resulting design system cut our frontend dev time by 40%. They also trained our team on Figma handoff. True partners.',
    projectType: 'Digital Product Design (SaaS)',
    projectUrl: '/portfolio/finserve-digital',
    date: '2024-02-14',
    featured: false,
    metrics: {
      label: 'Dev Time Saved',
      value: '40%',
    },
  },
];

export const AGGREGATE_RATING = {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "47",
  "bestRating": "5",
  "worstRating": "1",
};

export const REVIEWS = TESTIMONIALS.map(t => ({
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": t.clientName,
    "jobTitle": t.clientRole,
    "worksFor": {
      "@type": "Organization",
      "name": t.clientCompany,
    },
  },
  "datePublished": t.date,
  "reviewBody": t.text,
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": t.rating,
    "bestRating": "5",
    "worstRating": "1",
  },
  "itemReviewed": {
    "@type": "Service",
    "name": t.projectType,
    "provider": {
      "@id": "https://vistaforge.com/#organization"
    },
  },
  "publisher": {
    "@id": "https://vistaforge.com/#organization"
  },
}));

export const getFeaturedTestimonials = () => TESTIMONIALS.filter(t => t.featured);
export const getAllTestimonials = () => TESTIMONIALS;