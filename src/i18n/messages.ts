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
      meaning: "que significa literalmente «azulejo»: la palabra española viene de ahí.",
      history: "Lleva siglos vistiendo Fez y la Alhambra: barro esmaltado que un maestro corta a mano, pieza a pieza, con un martillo afilado.",
      fact: { label: "Curiosidad:", body: "los paneles se montan bocabajo, así que el artesano no ve el dibujo hasta que les da la vuelta." },
    },
    title: { lead: "Chat, desarrollo con agentes y agente personal,", turn: "self\u2011hosted y open source." },
    bring: { lead: "Bring your own", items: ["harness", "sub", "API key"] },
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
    title: "¿Cómo funciona?",
    hover: "Pasa el ratón por el azulejo o por cada parte para verla.",
    workings: {
      title: "Por dentro",
      body: "Configura tu servidor personal y conecta tus modelos por API, o con tu suscripción. A través de Tailscale entras desde las apps de escritorio y de móvil, para todas las plataformas, y desde la web.",
      devices: { title: "Tus dispositivos", items: ["Escritorio", "Móvil", "Web"] },
      tunnel: { title: "Tailscale", body: "Red privada" },
      server: { title: "Tu servidor", memory: "Memoria compartida" },
      models: { title: "Los modelos", api: ["API", "Tus API keys"], oauth: ["OAuth", "Tu suscripción"] },
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
        body: "Chat, gestor de harness y agente personal, juntos alrededor de Zel y con la misma memoria.",
      },
    },
  },
  features: {
    title: "Bring your own",
    access: {
      tag: "BYOK · BYOS",
      title: "Tu API key… o tu suscripción",
      body: "Con una API pagas por token, con el precio a la vista. Una suscripción es un cristal opaco: no ves sus límites y cambian sin avisar. Aun así, si ya pagas una, inicia sesión con OAuth.",
      google: "con Google",
    },
    harness: {
      tag: "BYOH",
      title: "Tu harness open source… o el de tu suscripción",
      body: "El chat, el gestor de harness y tu agente funcionan con el harness open source que elijas, o con el que va acoplado a tu suscripción, como Claude Code o Codex CLI.",
      more: "Y otros harness open source.",
    },
    points: ["En tu servidor", "Una sola memoria", "Cambia de modelo sin perder nada"],
    providers: "Herramientas con inicio de sesión OAuth",
    harnesses: "Harness open source",
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
      meaning: "which literally means “tile”: the Spanish word azulejo comes from it.",
      history: "It has dressed Fez and the Alhambra for centuries: glazed clay that a master cuts by hand, piece by piece, with a sharp hammer.",
      fact: { label: "Fun fact:", body: "panels are laid face down, so the craftsman only sees the pattern when they turn it over." },
    },
    title: { lead: "Chat, software development with agents and a personal agent,", turn: "self\u2011hosted and open source." },
    bring: { lead: "Bring your own", items: ["harness", "sub", "API key"] },
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
    title: "How does it work?",
    hover: "Point at the tile or at each part to see it.",
    workings: {
      title: "Under the hood",
      body: "Set up your personal server and connect your models through their APIs, or with your subscription. Through Tailscale you reach it from the desktop and mobile apps, on every platform, and from the web.",
      devices: { title: "Your devices", items: ["Desktop", "Mobile", "Web"] },
      tunnel: { title: "Tailscale", body: "Private network" },
      server: { title: "Your server", memory: "Shared memory" },
      models: { title: "The models", api: ["API", "Your API keys"], oauth: ["OAuth", "Your subscription"] },
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
        body: "Chat, harness manager and personal agent, together around Zel and sharing one memory.",
      },
    },
  },
  features: {
    title: "Bring your own",
    access: {
      tag: "BYOK · BYOS",
      title: "Your API key… or your sub",
      body: "With an API you pay per token, with the price in the open. A subscription is frosted glass: you can't see its limits, and they change without notice. Still, if you already pay for one, sign in with OAuth.",
      google: "with Google",
    },
    harness: {
      tag: "BYOH",
      title: "Your open-source harness… or your subscription's",
      body: "The chat, the harness manager and your agent run on the open-source harness you choose, or on the one that comes with your subscription, like Claude Code or Codex CLI.",
      more: "And other open-source harnesses.",
    },
    points: ["On your server", "One memory", "Change models without losing anything"],
    providers: "Tools with OAuth sign-in",
    harnesses: "Open-source harnesses",
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
