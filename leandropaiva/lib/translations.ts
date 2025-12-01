// Simple translations without complex setup
export const translations = {
  pt: {
    hero: {
      badge: "DESENVOLVEDOR FRONT-END",
      title: "Criando experiências web premium",
      description: "Especializado em Next.js, TypeScript e desenvolvimento web moderno. Construindo aplicações escaláveis com atenção aos detalhes e performance.",
      viewWork: "Ver Trabalhos",
      getInTouch: "Entrar em Contato",
      scroll: "ROLAR"
    },
    nav: {
      services: "Serviços",
      products: "Produtos",
      about: "Sobre",
      contact: "Contato",
      webDev: "Desenvolvimento Web",
      mobileDev: "Desenvolvimento Mobile",
      uiDesign: "Design UI/UX",
      consulting: "Consultoria",
      webProjects: "Projetos Web",
      mobileApps: "Apps Mobile",
      ecommerce: "E-commerce",
      portfolios: "Portfólios",
      landingPages: "Landing Pages",
      iosApps: "iOS Apps",
      androidApps: "Android Apps",
      hybridApps: "Apps Híbridos",
      ourStory: "Nossa História",
      team: "Equipe",
      careers: "Carreiras",
      contactUs: "Fale Conosco",
      support: "Suporte",
      partnerships: "Parcerias"
    }
  },
  en: {
    hero: {
      badge: "FRONT-END DEVELOPER",
      title: "Crafting premium web experiences",
      description: "Specialized in Next.js, TypeScript, and modern web development. Building scalable applications with attention to detail and performance.",
      viewWork: "View Work",
      getInTouch: "Get in Touch",
      scroll: "SCROLL"
    },
    nav: {
      services: "Services",
      products: "Products",
      about: "About",
      contact: "Contact",
      webDev: "Web Development",
      mobileDev: "Mobile Development",
      uiDesign: "UI/UX Design",
      consulting: "Consulting",
      webProjects: "Web Projects",
      mobileApps: "Mobile Apps",
      ecommerce: "E-commerce",
      portfolios: "Portfolios",
      landingPages: "Landing Pages",
      iosApps: "iOS Apps",
      androidApps: "Android Apps",
      hybridApps: "Hybrid Apps",
      ourStory: "Our Story",
      team: "Team",
      careers: "Careers",
      contactUs: "Contact Us",
      support: "Support",
      partnerships: "Partnerships"
    }
  },
  es: {
    hero: {
      badge: "DESARROLLADOR FRONT-END",
      title: "Creando experiencias web premium",
      description: "Especializado en Next.js, TypeScript y desarrollo web moderno. Construyendo aplicaciones escalables con atención al detalle y rendimiento.",
      viewWork: "Ver Trabajo",
      getInTouch: "Ponerse en Contacto",
      scroll: "DESPLAZAR"
    },
    nav: {
      services: "Servicios",
      products: "Productos",
      about: "Acerca de",
      contact: "Contacto",
      webDev: "Desarrollo Web",
      mobileDev: "Desarrollo Móvil",
      uiDesign: "Diseño UI/UX",
      consulting: "Consultoría",
      webProjects: "Proyectos Web",
      mobileApps: "Apps Móviles",
      ecommerce: "E-commerce",
      portfolios: "Portafolios",
      landingPages: "Landing Pages",
      iosApps: "iOS Apps",
      androidApps: "Android Apps",
      hybridApps: "Apps Híbridas",
      ourStory: "Nuestra Historia",
      team: "Equipo",
      careers: "Carreras",
      contactUs: "Contáctanos",
      support: "Soporte",
      partnerships: "Alianzas"
    }
  }
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.pt;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.pt;
}