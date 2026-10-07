// Landing copy, one dictionary per locale. Spanish is the source; English mirrors
// its shape exactly (the `satisfies` check fails the build if a key is missing).
// Headlines are { lead, turn }: the plain line, then the serif-italic turn.

export type FeatureIcon = "chat" | "harness" | "agent";

const es = {
  meta: {
    title: "Zellige — Cada idea encuentra su lugar",
    description:
      "Zellige. Un proyecto abierto para reunir conversaciones, herramientas y agentes en un espacio propio. Distintas piezas, una misma historia.",
  },
  skip: "Ir al contenido",
  header: {
    home: "Zellige, inicio",
    nav: "Principal",
    links: { idea: "Cómo funciona", features: "Funciones", contact: "Contacto" },
    theme: "Cambiar entre modo claro y oscuro",
    themeTitle: "Modo claro / oscuro",
    menu: "Menú",
    repository: "Repositorio en GitHub",
  },
  hero: {
    why: {
      title: "¿Por qué Zellige?",
      from: "Del árabe",
      meaning: "«pequeña piedra pulida»",
      body: "Un mosaico de piezas de cerámica cortadas a mano que, por separado, no dicen nada; juntas forman un dibujo.",
    },
    title: { lead: "Chat, desarrollo con agentes y agente personal,", turn: "en un solo sitio abierto." },
    bring: ["Trae tu harness", "Trae tu suscripción", "Trae tu clave de API"],
    next: "Ir a la siguiente sección",
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
    progress: "Pasos de la historia",
    goTo: "Ir al paso",
    title: "Cómo funciona",
    hover: "Pasa el ratón por el azulejo para ver cada capa.",
    workings: {
      title: "Por dentro",
      nodes: [
        ["Tus dispositivos", "Las apps de escritorio y de móvil, para todas las plataformas, y la web."],
        ["Tailscale", "Una red privada entre tus dispositivos y tu servidor, estés donde estés."],
        ["Tu servidor", "Zellige: el chat, el gestor de harness y tu agente personal, con una sola historia que es tuya."],
        ["Los modelos", "Por API, con tus propias claves; o con tu suscripción, iniciando sesión con OAuth."],
      ] as [string, string][],
    },
    steps: {
      crown: {
        title: "Chat",
        body: "Habla con el modelo que elijas desde el harness que traigas, como en cualquier chat de IA, sin que la conversación se quede encerrada en una app.",
      },
      cobalt: {
        title: "Gestor de harness",
        body: "Añade el harness que quieras y orquesta modelos, herramientas y agentes de código en un mismo flujo para desarrollar software.",
      },
      points: {
        title: "Agente personal",
        body: "Sale, recuerda, avisa y hace recados por ti. Usa un harness por defecto o elige otro sobre la marcha, mientras lo usas.",
      },
      tile: {
        title: "Zellige es todo esto",
        body: "Configura tu servidor personal, conecta tus modelos por API y lo tendrás todo. A través de Tailscale entras desde las apps de escritorio y de móvil, para todas las plataformas, y desde la web.",
      },
    },
  },
  features: {
    headline: { lead: "Tres maneras de usar la IA,", turn: "un solo sitio." },
    // [icon, layer of the tile it belongs to, use, title, body]
    pillars: [
      ["chat", "crown", "Chat", "El chat de siempre", "Piensa en voz alta con el modelo que elijas desde el harness que traigas, como en cualquier chat de IA, pero sin que la conversación se quede encerrada en una app."],
      ["harness", "cobalt", "Gestor de harness", "Desarrollo de software con agentes", "Orquesta modelos, herramientas y agentes de código en un mismo flujo para construir software. Añade el harness que quieras: Claude Code, Codex, OpenCode u otro."],
      ["agent", "points", "Agente personal", "Tu agente personal", "Sale, recuerda, avisa y hace recados por ti. Usa un harness por defecto o elige otro sobre la marcha."],
    ] as [FeatureIcon, "crown" | "cobalt" | "points", string, string, string][],
    together: {
      title: "Y las tres, juntas",
      items: [
        ["Una sola historia", "El chat, el gestor de harness y tu agente parten de la misma historia, en lugar de empezar cada uno desde cero."],
        ["En tu servidor", "Un proyecto abierto y autoalojado: tu historia se guarda en tu propio servidor, no en el de un proveedor."],
        ["Cambia de modelo, no de historia", "Los modelos y las herramientas pueden cambiar sin llevarse por delante lo que has construido."],
      ] as [string, string][],
    },
    api: {
      title: "Por qué API y no suscripción",
      paragraphs: [
        "Una suscripción es un cristal opaco: ves el servicio, pero no lo que hay detrás. No sabes cuánto puedes usar de verdad, los límites no se publican con claridad y pueden cambiar de un día para otro sin que te des cuenta.",
        "Una API, en cambio, publica su precio: tanto por cada token de entrada y tanto por cada token de salida. Sabes qué pagas y por qué. En Zellige creemos que el futuro va por ahí, así que conectas tus modelos con tus propias claves de API.",
      ],
      sub: {
        title: "Usa tu suscripción… o no",
        body: "Si ya pagas una, Zellige la aprovecha: inicias sesión igual que en cada herramienta, con OAuth.",
        google: "Inicio de sesión con Google",
      },
      providers: "Herramientas con inicio de sesión OAuth",
      trademarks: "Las marcas pertenecen a sus respectivos propietarios.",
    },
  },
  contact: {
    headline: { lead: "¿Quieres poner", turn: "tu pieza?" },
    body: "Zellige es un proyecto abierto. Sigue cómo avanza en GitHub, abre un issue con tus ideas o escríbenos.",
    repo: "Código en GitHub",
    email: "Escríbenos",
  },
  footer: {
    tagline: "Distintas piezas. Una misma historia.",
    top: "Volver arriba",
    home: "Zellige, volver al inicio",
    nav: "Enlaces del proyecto",
  },
};

export type Messages = typeof es;

const en = {
  meta: {
    title: "Zellige — Every idea finds its place",
    description:
      "Zellige. An open project that brings conversations, tools and agents together in a space of your own. Different pieces, one story.",
  },
  skip: "Skip to content",
  header: {
    home: "Zellige, home",
    nav: "Main",
    links: { idea: "How it works", features: "Features", contact: "Contact" },
    theme: "Switch between light and dark mode",
    themeTitle: "Light / dark mode",
    menu: "Menu",
    repository: "Repository on GitHub",
  },
  hero: {
    why: {
      title: "Why Zellige?",
      from: "From Arabic",
      meaning: "“small polished stone”",
      body: "A mosaic of hand-cut ceramic pieces that say nothing on their own; together they make a pattern.",
    },
    title: { lead: "Chat, software development with agents and a personal agent,", turn: "in one open place." },
    bring: ["Bring your own harness", "Bring your own sub", "Bring your own API key"],
    next: "Go to the next section",
  },
  zel: {
    alt: "Zel, Zellige's mascot",
  },
  layers: {
    crown: { use: "Chat" },
    cobalt: { use: "Harness manager" },
    points: { use: "Personal agent" },
  },
  story: {
    hint: "Scroll to see each layer",
    progress: "Story steps",
    goTo: "Go to step",
    title: "How it works",
    hover: "Point at the tile to see each layer.",
    workings: {
      title: "Under the hood",
      nodes: [
        ["Your devices", "The desktop and mobile apps, on every platform, and the web."],
        ["Tailscale", "A private network between your devices and your server, wherever you are."],
        ["Your server", "Zellige: the chat, the harness manager and your personal agent, with one story that is yours."],
        ["The models", "Through their APIs, with your own keys; or with your subscription, signing in with OAuth."],
      ] as [string, string][],
    },
    steps: {
      crown: {
        title: "Chat",
        body: "Talk to the model you choose through the harness you bring, like in any AI chat, without the conversation being locked inside one app.",
      },
      cobalt: {
        title: "Harness manager",
        body: "Add any harness you like and orchestrate models, tools and coding agents in one flow to build software.",
      },
      points: {
        title: "Personal agent",
        body: "It goes out, remembers, reminds and runs errands for you. It uses a default harness, or pick another as you go.",
      },
      tile: {
        title: "Zellige is all of this",
        body: "Set up your personal server, connect your models through their APIs and you have it all. Through Tailscale you reach it from the desktop and mobile apps, on every platform, and from the web.",
      },
    },
  },
  features: {
    headline: { lead: "Three ways to use AI,", turn: "one place." },
    pillars: [
      ["chat", "crown", "Chat", "The chat you know", "Think out loud with the model you choose through the harness you bring, like any AI chat, but without the conversation being locked inside one app."],
      ["harness", "cobalt", "Harness manager", "Software development with agents", "Orchestrate models, tools and coding agents in one flow to build software. Add any harness you like: Claude Code, Codex, OpenCode or another."],
      ["agent", "points", "Personal agent", "Your personal agent", "It goes out, remembers, reminds and runs errands for you. It uses a default harness, or pick another as you go."],
    ] as [FeatureIcon, "crown" | "cobalt" | "points", string, string, string][],
    together: {
      title: "And all three, together",
      items: [
        ["One story", "The chat, the harness manager and your agent start from the same story, instead of each starting from scratch."],
        ["On your server", "An open, self-hosted project: your story is kept on your own server, not a provider's."],
        ["Change models, not your story", "Models and tools can change without taking what you've built with them."],
      ] as [string, string][],
    },
    api: {
      title: "Why APIs, not subscriptions",
      paragraphs: [
        "A subscription is frosted glass: you see the service, but not what's behind it. You don't really know how much you can use, the limits aren't clearly published, and they can change from one day to the next without you noticing.",
        "An API, on the other hand, publishes its price: so much per input token and so much per output token. You know what you pay and why. At Zellige we believe that is where things are heading, so you connect your models with your own API keys.",
      ],
      sub: {
        title: "Bring your own sub… or don't",
        body: "If you already pay for one, Zellige puts it to use: you sign in just as you do in each tool, with OAuth.",
        google: "Google sign-in",
      },
      providers: "Tools with OAuth sign-in",
      trademarks: "Trademarks belong to their respective owners.",
    },
  },
  contact: {
    headline: { lead: "Want to add", turn: "your piece?" },
    body: "Zellige is an open project. Follow how it's going on GitHub, open an issue with your ideas, or write to us.",
    repo: "Code on GitHub",
    email: "Write to us",
  },
  footer: {
    tagline: "Different pieces. One story.",
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
