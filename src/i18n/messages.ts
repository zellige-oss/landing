// Landing copy, one dictionary per locale. Spanish is the source; English mirrors
// its shape exactly (the `satisfies` check fails the build if a key is missing).
// Headlines are { lead, turn }: the plain line, then the serif-italic turn.


const es = {
  meta: {
    title: "Zellige — Chat, harness y agente personal en tu servidor",
    description:
      "Zellige es un proyecto open source y autoalojado que reúne tu chat de IA, tus agentes de código y tu agente personal en tu propio servidor.",
  },
  skip: "Ir al contenido",
  header: {
    home: "Zellige, inicio",
    nav: "Principal",
    links: { idea: "¿Qué es Zellige?", features: "Bring your own", contact: "Contacto" },
    theme: "Cambiar entre modo claro y oscuro",
    themeTitle: "Modo claro / oscuro",
    menu: "Menú",
    repository: "Repositorio en GitHub",
    code: "Código en GitHub",
  },
  hero: {
    why: {
      title: "¿Por qué Zellige?",
      from: "Del árabe",
      meaning: "«azulejo».",
      history: "Barro esmaltado, cortado a mano pieza a pieza, que viste Fez y la Alhambra desde hace siglos.",
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
    title: "¿Qué es Zellige?",
    hover: "Pasa el ratón por el azulejo o por cada parte para verla.",
    workings: {
      title: "¿Cómo funciona?",
      body: "Monta tu propio servidor y conecta tus modelos por API o con la suscripción que ya tienes. Tailscale lo mantiene privado, y entras desde las apps de escritorio y móvil, en cualquier plataforma, o desde la web.",
      devices: { title: "Tus dispositivos", items: ["Escritorio", "Móvil", "Web"] },
      tunnel: { title: "Tailscale", body: "Red privada" },
      server: { title: "Tu servidor", memory: "Memoria compartida" },
      models: { title: "Tus modelos", api: ["API", "Tus API keys"], oauth: ["OAuth", "Tu suscripción"] },
    },
    steps: {
      crown: {
        title: "Chat",
        body: "Habla con el modelo que quieras a través del harness que traigas, como en cualquier chat de IA, pero sin que tus conversaciones queden encerradas en una app.",
      },
      cobalt: {
        title: "Gestor de harness",
        body: "Añade el harness que quieras y orquesta modelos, herramientas y agentes de código en un mismo flujo para desarrollar software.",
      },
      points: {
        title: "Agente personal",
        body: "Recuerda, te avisa y hace recados por ti. Viene con un harness por defecto y puedes cambiarlo cuando quieras.",
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
      body: "Con una API pagas por token y el precio está a la vista. Una suscripción es una caja negra: no ves sus límites y cambian sin avisar. Aun así, si ya pagas una, inicia sesión con OAuth.",
      google: "con Google",
    },
    harness: {
      tag: "BYOH",
      title: "Tu harness open source… o el de tu suscripción",
      body: "El chat, el gestor de harness y tu agente funcionan con el harness open source que elijas, o con el que incluye tu suscripción, como Claude Code o Codex CLI.",
      more: "Y otros harness open source.",
    },
    points: ["En tu servidor", "Una sola memoria", "Cambia de modelo sin perder nada"],
    providers: "Herramientas con inicio de sesión OAuth",
    harnesses: "Harness open source",
    trademarks: "Las marcas pertenecen a sus respectivos propietarios.",
  },
  contact: {
    headline: { lead: "¿Quieres aportar", turn: "tu parte?" },
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
    title: "Zellige — Your AI chat, coding agents and personal agent, self-hosted",
    description:
      "Zellige is an open-source home for your AI chat, your coding agents and your personal agent, all running on your own server.",
  },
  skip: "Skip to content",
  header: {
    home: "Zellige home",
    nav: "Main navigation",
    links: { idea: "What is Zellige?", features: "Bring your own", contact: "Contact" },
    theme: "Toggle light and dark mode",
    themeTitle: "Light / dark mode",
    menu: "Menu",
    repository: "Zellige on GitHub",
    code: "View on GitHub",
  },
  hero: {
    why: {
      title: "Why Zellige?",
      from: "From the Arabic",
      meaning: "“tile.”",
      history: "Glazed clay, cut by hand piece by piece, that has covered Fez and the Alhambra for centuries.",
    },
    title: { lead: "AI chat, coding agents and your own personal agent,", turn: "self\u2011hosted and open source." },
    bring: { lead: "Bring your own", items: ["harness", "sub", "API key"] },
    next: "Jump to the next section",
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
    hover: "Hover over the tile or any part to explore it.",
    workings: {
      title: "How does it work?",
      body: "Spin up your own server and connect your models through their APIs or the subscription you already have. Tailscale keeps it private, and you can reach it from the desktop and mobile apps on any platform, or from the web.",
      devices: { title: "Your devices", items: ["Desktop", "Mobile", "Web"] },
      tunnel: { title: "Tailscale", body: "Private network" },
      server: { title: "Your server", memory: "Shared memory" },
      models: { title: "Your models", api: ["API", "Your API keys"], oauth: ["OAuth", "Your subscription"] },
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
      tag: "BYOK · BYOS",
      title: "Your API key… or your subscription",
      body: "With an API, you pay per token and the pricing is out in the open. A subscription is a black box: you can’t see its limits, and they change without warning. Still, if you’re already paying for one, just sign in with OAuth.",
      google: "with Google",
    },
    harness: {
      tag: "BYOH",
      title: "Your open-source harness… or the one in your subscription",
      body: "Chat, the harness manager and your agent all run on the open-source harness of your choice, or on the one bundled with your subscription, like Claude Code or Codex CLI.",
      more: "Plus other open-source harnesses.",
    },
    points: ["Runs on your server", "One shared memory", "Switch models without losing a thing"],
    providers: "Tools with OAuth sign-in",
    harnesses: "Open-source harnesses",
    trademarks: "All trademarks are the property of their respective owners.",
  },
  contact: {
    headline: { lead: "Help us", turn: "lay the next tile." },
    body: "Zellige is an open project. Follow along on GitHub, open an issue with your ideas, or drop us a line.",
    repo: "View the code on GitHub",
    email: "Email us",
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
