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
    links: { idea: "La idea", features: "Funciones", contact: "Contacto" },
    theme: "Cambiar entre modo claro y oscuro",
    themeTitle: "Modo claro / oscuro",
    menu: "Menú",
    repository: "Repositorio en GitHub",
  },
  hero: {
    origin: {
      from: "Del árabe",
      meaning: "«pequeña piedra pulida»",
      body: "Un mosaico de piezas de cerámica cortadas a mano que, por separado, no dicen nada; juntas forman un dibujo.",
    },
    title: { lead: "Chat, desarrollo con agentes y agente personal,", turn: "en un solo sitio abierto." },
    next: "Ir a la siguiente sección",
  },
  zel: {
    alt: "Zel, la mascota de Zellige",
    hello: "¡Hola! Soy Zel.",
    helloLine: "Junto las piezas de tu IA en un solo sitio.",
  },
  layers: {
    crown: { name: "Corona", use: "Chat" },
    cobalt: { name: "Azul", use: "Meta-harness" },
    points: { name: "Verde", use: "Agente personal" },
  },
  story: {
    hint: "Desliza para ver cada capa",
    progress: "Pasos de la historia",
    goTo: "Ir al paso",
    headline: { lead: "Zel en el centro,", turn: "y una capa para cada\u00a0uso." },
    steps: {
      crown: {
        title: "La corona",
        body: "Zel y la corona de marfil: el chat. Hablas con Zel usando el modelo que elijas, como en cualquier chat de IA.",
      },
      cobalt: {
        title: "El azul",
        body: "Zel y las piezas de cobalto: el meta-harness para desarrollar software con agentes. Zel orquesta modelos, herramientas y agentes de código en un mismo flujo.",
      },
      points: {
        title: "El verde",
        body: "Zel y las puntas verdes: tu agente personal. Sale, recuerda, avisa y hace recados por ti.",
      },
      tile: {
        title: "Todo el azulejo, en tu servidor",
        body: "Configura tu servidor personal y tendrás las tres capas. A través de Tailscale entras desde las apps de escritorio y de móvil, para todas las plataformas, y desde la web.",
      },
    },
  },
  features: {
    headline: { lead: "Tres maneras de usar la IA,", turn: "un solo sitio." },
    // [icon, layer of the tile it belongs to, use, title, body]
    pillars: [
      ["chat", "crown", "Chat", "El chat de siempre", "Piensa en voz alta con el modelo que elijas, como en cualquier chat de IA, pero sin que la conversación se quede encerrada en una app."],
      ["harness", "cobalt", "Meta-harness", "Desarrollo de software con agentes", "Orquesta modelos, herramientas y agentes de código en un mismo flujo para construir software."],
      ["agent", "points", "Agente personal", "Tu agente personal", "Sale, recuerda, avisa y hace recados por ti."],
    ] as [FeatureIcon, "crown" | "cobalt" | "points", string, string, string][],
    together: {
      title: "Y las tres, juntas",
      items: [
        ["Una sola historia", "El chat, el meta-harness y tu agente parten de la misma historia, en lugar de empezar cada uno desde cero."],
        ["En tu servidor", "Un proyecto abierto y autoalojado: tu historia se guarda en tu propio servidor, no en el de un proveedor."],
        ["Cambia de modelo, no de historia", "Los modelos y las herramientas pueden cambiar sin llevarse por delante lo que has construido."],
      ] as [string, string][],
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
    links: { idea: "The idea", features: "Features", contact: "Contact" },
    theme: "Switch between light and dark mode",
    themeTitle: "Light / dark mode",
    menu: "Menu",
    repository: "Repository on GitHub",
  },
  hero: {
    origin: {
      from: "From Arabic",
      meaning: "“small polished stone”",
      body: "A mosaic of hand-cut ceramic pieces that say nothing on their own; together they make a pattern.",
    },
    title: { lead: "Chat, software development with agents and a personal agent,", turn: "in one open place." },
    next: "Go to the next section",
  },
  zel: {
    alt: "Zel, Zellige's mascot",
    hello: "Hi! I'm Zel.",
    helloLine: "I put the pieces of your AI in one place.",
  },
  layers: {
    crown: { name: "Crown", use: "Chat" },
    cobalt: { name: "Blue", use: "Meta-harness" },
    points: { name: "Green", use: "Personal agent" },
  },
  story: {
    hint: "Scroll to see each layer",
    progress: "Story steps",
    goTo: "Go to step",
    headline: { lead: "Zel in the centre,", turn: "and a layer for each\u00a0use." },
    steps: {
      crown: {
        title: "The crown",
        body: "Zel and the ivory crown: chat. You talk to Zel with the model you choose, like in any AI chat.",
      },
      cobalt: {
        title: "The blue",
        body: "Zel and the cobalt pieces: the meta-harness for building software with agents. Zel orchestrates models, tools and coding agents in one flow.",
      },
      points: {
        title: "The green",
        body: "Zel and the green points: your personal agent. It goes out, remembers, reminds and runs errands for you.",
      },
      tile: {
        title: "The whole tile, on your server",
        body: "Set up your personal server and you get all three layers. Through Tailscale you reach them from the desktop and mobile apps, on every platform, and from the web.",
      },
    },
  },
  features: {
    headline: { lead: "Three ways to use AI,", turn: "one place." },
    pillars: [
      ["chat", "crown", "Chat", "The chat you know", "Think out loud with the model you choose, like any AI chat, but without the conversation being locked inside one app."],
      ["harness", "cobalt", "Meta-harness", "Software development with agents", "Orchestrate models, tools and coding agents in one flow to build software."],
      ["agent", "points", "Personal agent", "Your personal agent", "It goes out, remembers, reminds and runs errands for you."],
    ] as [FeatureIcon, "crown" | "cobalt" | "points", string, string, string][],
    together: {
      title: "And all three, together",
      items: [
        ["One story", "The chat, the meta-harness and your agent start from the same story, instead of each starting from scratch."],
        ["On your server", "An open, self-hosted project: your story is kept on your own server, not a provider's."],
        ["Change models, not your story", "Models and tools can change without taking what you've built with them."],
      ] as [string, string][],
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
