// Landing copy, one dictionary per locale. Spanish is the source; English mirrors
// its shape exactly (the `satisfies` check fails the build if a key is missing).
// Headlines are { lead, turn }: the plain line, then the serif-italic turn.


const es = {
  meta: {
    title: "Zellige — Chat, harness y agente personal en tu servidor",
    description:
      "Zellige. Un proyecto abierto y autoalojado que junta el chat, el desarrollo con agentes y tu agente personal en tu propio servidor.",
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
    progress: "Pasos",
    goTo: "Ir al paso",
    title: "Cómo funciona",
    hover: "Pasa el ratón por el azulejo para ver cada capa.",
    workings: {
      title: "Por dentro",
      nodes: [
        ["Tus dispositivos", "Las apps de escritorio y de móvil, para todas las plataformas, y la web."],
        ["Tailscale", "Una red privada entre tus dispositivos y tu servidor, estés donde estés."],
        ["Tu servidor", "Zellige: el chat, el gestor de harness y tu agente personal, compartiendo la misma memoria."],
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
    title: "Trae lo tuyo",
    key: {
      tag: "BYOK",
      title: "Tu clave de API",
      body: "Precio por token, a la vista. Una suscripción es un cristal opaco: no ves sus límites y cambian sin avisar.",
    },
    sub: {
      tag: "BYOS",
      title: "Tu suscripción… o no",
      body: "Si ya pagas una, inicia sesión con OAuth.",
      google: "con Google",
    },
    harness: {
      tag: "BYOH",
      title: "Tu harness",
      body: "Chat, gestor y agente, con el harness que elijas.",
      open: "Open source",
      more: "y otros",
    },
    points: ["En tu servidor", "Una sola memoria", "Cambia de modelo sin perder nada"],
    providers: "Herramientas con inicio de sesión OAuth",
    trademarks: "Las marcas pertenecen a sus respectivos propietarios.",
  },
  contact: {
    headline: { lead: "¿Quieres poner", turn: "tu pieza?" },
    body: "Zellige es un proyecto abierto. Sigue cómo avanza en GitHub, abre un issue con tus ideas o escríbenos.",
    repo: "Código en GitHub",
    email: "Escríbenos",
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
    title: "Zellige — Chat, harness and personal agent on your server",
    description:
      "Zellige. An open, self-hosted project that brings chat, software development with agents and your personal agent together on your own server.",
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
    progress: "Steps",
    goTo: "Go to step",
    title: "How it works",
    hover: "Point at the tile to see each layer.",
    workings: {
      title: "Under the hood",
      nodes: [
        ["Your devices", "The desktop and mobile apps, on every platform, and the web."],
        ["Tailscale", "A private network between your devices and your server, wherever you are."],
        ["Your server", "Zellige: the chat, the harness manager and your personal agent, sharing one memory."],
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
    title: "Bring your own",
    key: {
      tag: "BYOK",
      title: "Your API key",
      body: "Price per token, in the open. A subscription is frosted glass: you can't see its limits, and they change without notice.",
    },
    sub: {
      tag: "BYOS",
      title: "Your sub… or don't",
      body: "Already paying for one? Sign in with OAuth.",
      google: "with Google",
    },
    harness: {
      tag: "BYOH",
      title: "Your harness",
      body: "Chat, manager and agent, on the harness you choose.",
      open: "Open source",
      more: "and more",
    },
    points: ["On your server", "One memory", "Change models without losing anything"],
    providers: "Tools with OAuth sign-in",
    trademarks: "Trademarks belong to their respective owners.",
  },
  contact: {
    headline: { lead: "Want to add", turn: "your piece?" },
    body: "Zellige is an open project. Follow how it's going on GitHub, open an issue with your ideas, or write to us.",
    repo: "Code on GitHub",
    email: "Write to us",
  },
  footer: {
    tagline: "Chat, harness and personal agent, on your server.",
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
