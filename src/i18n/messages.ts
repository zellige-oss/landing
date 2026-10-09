// Landing copy, one dictionary per locale. Spanish is the source; English mirrors
// its shape exactly (the `satisfies` check fails the build if a key is missing).
// Headlines are { lead, turn }: the plain line, then the serif-italic turn.


const es = {
  meta: {
    title: "Zellige — Chat, harness y agente personal en tu servidor",
    description:
      "Zellige es un proyecto de código abierto y autoalojado que reúne tu chat de IA, tus agentes de programación y tu agente personal en tu propio servidor.",
  },
  skip: "Ir al contenido",
  header: {
    home: "Zellige, inicio",
    nav: "Principal",
    links: { home: "Inicio", idea: "¿Qué es Zellige?", features: "¿Cómo funciona?", contact: "¿Quieres colaborar?" },
    theme: "Cambiar entre modo claro y oscuro",
    themeTitle: "Modo claro / oscuro",
    menu: "Menú",
    repository: "Repositorio en GitHub",
    code: "Código en GitHub",
  },
  hero: {
    why: {
      title: "¿Por qué «Zellige»?",
      from: "Del árabe",
      meaning: "«azulejo».",
      history: "De la misma raíz viene el español azulejo. En el Magreb, «zellige» nombra el mosaico de teselas de barro esmaltado, talladas a mano y encajadas en patrones geométricos.",
    },
    title: { lead: "Chat, desarrollo con agentes y agente personal,", turn: "en tu servidor y de código abierto." },
    bring: { lead: "Conecta tu", items: ["harness", "suscripción", "clave de API"] },
    next: "Ir a la siguiente sección",
    releases: "Ver las versiones de Zellige en GitHub",
  },
  zel: {
    alt: "Zel, la mascota de Zellige",
  },
  layers: {
    crown: { use: "Chat" },
    cobalt: { use: "Gestor de harness" },
    points: { use: "Agente personal" },
  },
  story: {
    hint: "Desliza para ver cada capa",
    progress: "Pasos",
    goTo: "Ir al paso",
    title: "¿Qué es Zellige?",
    intro: {
      lead: "Zellige es un entorno de agentización personal.",
      body: "Como en un mosaico, cada forma de usar la IA es una pieza, y Zel, en el centro, las mantiene unidas.",
    },
    workings: {
      title: "¿Cómo funciona?",
      status: {
        title: "En desarrollo",
        body: "Esta página presenta las funciones previstas para Zellige. Todavía no están implementadas.",
      },
      body: "Usas el chat, el gestor de harness y tu agente desde las apps de escritorio y móvil, en cualquier plataforma, o desde la web. Llegan a tu propio servidor por Tailscale, que lo mantiene privado. Tu servidor guarda tus claves de API y tus suscripciones, y con ellas llama a los proveedores de inferencia que prefieras.",
      devices: { title: "Tus dispositivos", body: "Las tres herramientas, en cualquier dispositivo", items: ["Escritorio", "Móvil", "Web"] },
      tunnel: { title: "Tailscale", body: "Red privada" },
      server: { title: "Tu servidor", body: "En tu máquina", memory: "Memoria compartida", api: ["API", "Tus claves de API"], oauth: ["OAuth", "Tus suscripciones"] },
      calls: { title: "Inferencia", body: "Petición y respuesta" },
      providers: { title: "Proveedores de inferencia", body: "Autoalojados o externos" },
    },
    steps: {
      crown: {
        title: "Chat",
        body: "Habla con el modelo que quieras a través del harness que elijas, como en cualquier chat de IA, pero sin que tus conversaciones queden encerradas en una app.",
      },
      cobalt: {
        title: "Gestor de harness",
        body: "Añade el harness que quieras y orquesta modelos, herramientas y agentes de programación en un mismo flujo para desarrollar software.",
      },
      points: {
        title: "Agente personal",
        body: "Recuerda, te avisa y hace recados por ti. Viene con un harness por defecto y puedes cambiarlo cuando quieras.",
      },
      tile: {
        title: "Zellige es todo esto",
        body: "Chat, gestor de harness y agente personal, integrados y con una memoria compartida.",
      },
    },
  },
  features: {
    title: "Modelos y herramientas",
    access: {
      tag: "Acceso a modelos",
      title: "Tu suscripción… o tu clave de API",
      body: "Conecta tu suscripción mediante OAuth o una clave de API. También puedes pagar por consumo.",
    },
    harness: {
      tag: "Harness",
      title: "Tu harness de código abierto… o el de tu suscripción",
      body: "El chat, el gestor de harness y tu agente funcionan con el harness de código abierto que elijas, o con el que incluye tu suscripción, como Claude Code o Codex CLI.",
      more: "Y en el futuro otros harness de código abierto…",
    },
    providers: "Servicios de acceso a modelos",
    harnesses: "Harness de código abierto",
    trademarks: "Las marcas pertenecen a sus respectivos propietarios.",
  },
  contact: {
    headline: { lead: "¿Quieres", turn: "colaborar?" },
    body: "Zellige es un proyecto abierto. Sigue el proyecto en GitHub, abre un issue con tus ideas o escríbenos.",
    repo: "Código en GitHub",
    email: "Escríbenos",
    tile: { place: "Colocar la pieza del mosaico", remove: "Retirar la pieza del mosaico" },
  },
  footer: {
    tagline: "Chat, harness y agente personal, en tu servidor.",
    top: "Volver arriba",
    home: "Zellige, volver al inicio",
    nav: "Enlaces del proyecto",
  },
};

export type Messages = typeof es;

const en = {
  meta: {
    title: "Zellige — Your AI chat, coding agents and personal agent, self-hosted",
    description:
      "Zellige is an open-source home for your AI chat, your coding agents and your personal agent, all running on your own server.",
  },
  skip: "Skip to content",
  header: {
    home: "Zellige home",
    nav: "Main navigation",
    links: { home: "Home", idea: "What is Zellige?", features: "How it works", contact: "Contribute" },
    theme: "Toggle light and dark mode",
    themeTitle: "Light / dark mode",
    menu: "Menu",
    repository: "Zellige on GitHub",
    code: "View on GitHub",
  },
  hero: {
    why: {
      title: "Why “Zellige”?",
      from: "From the Arabic",
      meaning: "“tile.”",
      history: "The same root gave Spanish its azulejo. Across the Maghreb, “zellige” names the mosaic of hand-cut glazed clay tiles set in geometric patterns.",
    },
    title: { lead: "AI chat, coding agents and your own personal agent,", turn: "self-hosted and open source." },
    bring: { lead: "Connect your", items: ["harness", "subscription", "API key"] },
    next: "Jump to the next section",
    releases: "View Zellige releases on GitHub",
  },
  zel: {
    alt: "Zel, the Zellige mascot",
  },
  layers: {
    crown: { use: "Chat" },
    cobalt: { use: "Harness manager" },
    points: { use: "Personal agent" },
  },
  story: {
    hint: "Scroll to see each layer",
    progress: "Steps",
    goTo: "Go to step",
    title: "What is Zellige?",
    intro: {
      lead: "Zellige is a personal workspace for AI agents.",
      body: "Like a mosaic, each way of using AI is one piece, and Zel, at the centre, holds them together.",
    },
    workings: {
      title: "How it works",
      status: {
        title: "Under development",
        body: "This page presents the features planned for Zellige. They have not been implemented yet.",
      },
      body: "You use the chat, the harness manager and your agent from the desktop and mobile apps, on any platform, or from the web. They reach your own server over Tailscale, which keeps it private. Your server holds your API keys and subscriptions, and calls the inference providers you prefer with them.",
      devices: { title: "Your devices", body: "All three tools, on any device", items: ["Desktop", "Mobile", "Web"] },
      tunnel: { title: "Tailscale", body: "Private network" },
      server: { title: "Your server", body: "On your machine", memory: "Shared memory", api: ["API", "Your API keys"], oauth: ["OAuth", "Your subscriptions"] },
      calls: { title: "Inference", body: "Request and response" },
      providers: { title: "Inference providers", body: "Self-hosted or external" },
    },
    steps: {
      crown: {
        title: "Chat",
        body: "Talk to any model you like through the harness you bring. It works like any AI chat, except your conversations aren’t locked into one app.",
      },
      cobalt: {
        title: "Harness manager",
        body: "Plug in whichever harnesses you like and orchestrate models, tools and coding agents in a single workflow to ship software.",
      },
      points: {
        title: "Personal agent",
        body: "It works for you out in the world: it remembers things, reminds you and runs errands. It comes with a default harness, and you can switch whenever you like.",
      },
      tile: {
        title: "That’s Zellige",
        body: "Chat, harness manager and personal agent, all built around Zel and all sharing the same memory.",
      },
    },
  },
  features: {
    title: "Bring your own",
    access: {
      tag: "Model access",
      title: "Your subscription… or your API key",
      body: "Connect your subscription with OAuth or an API key. You can also pay as you go.",
    },
    harness: {
      tag: "Harness",
      title: "Your open-source harness… or the one in your subscription",
      body: "Chat, the harness manager and your agent all run on the open-source harness of your choice, or on the one bundled with your subscription, like Claude Code or Codex CLI.",
      more: "And in the future, more open-source harnesses…",
    },
    providers: "Model access services",
    harnesses: "Open-source harnesses",
    trademarks: "All trademarks are the property of their respective owners.",
  },
  contact: {
    headline: { lead: "Help us", turn: "lay the next tile." },
    body: "Zellige is an open project. Follow along on GitHub, open an issue with your ideas, or drop us a line.",
    repo: "View the code on GitHub",
    email: "Email us",
    tile: { place: "Place the mosaic tile", remove: "Remove the mosaic tile" },
  },
  footer: {
    tagline: "AI chat, coding agents and a personal agent, on your own server.",
    top: "Back to top",
    home: "Zellige, back to top",
    nav: "Project links",
  },
} satisfies Messages;

export const locales = { es, en } as const;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = "es";
/** Each locale's page. The root "/" picks one from the browser's languages (public/locale.js). */
export const localePath: Record<Locale, string> = { es: "/es/", en: "/en/" };
