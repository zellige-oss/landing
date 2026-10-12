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
    repository: "Repositorio en GitHub",
  },
  hero: {
    why: {
      title: "¿Por qué «Zellige»?",
      from: "Del árabe",
      meaning: "«azulejo».",
      history: "Como las teselas de un mosaico, las partes de Zellige encajan entre sí.",
    },
    title: { lead: "Chat, desarrollo con agentes y agente personal,", turn: "en tu servidor y de código abierto." },
    bring: { lead: "Conecta tu", items: ["harness", "suscripción", "clave de API"] },
    version: "Versión",
    releases: "Ver las versiones de Zellige en GitHub",
    status: "En construcción",
    next: "Ir a la siguiente sección",
  },
  zel: {
    alt: "Zel, la mascota de Zellige",
  },
  layers: {
    points: { use: "Chat" },
    cobalt: { use: "Gestor de harness" },
    crown: { use: "Agente personal" },
  },
  story: {
    hint: "Desliza para ver cada parte. Tócalas, a ver qué dicen.",
    // What the personal agent's note says, beside it in the story.
    // The errands the personal agent sees to in the story: each as it waits, and as it is left done.
    tasks: [["Dentista", "Cita reservada"], ["Correo", "Correo enviado"], ["Compra", "Compra hecha"]],
    progress: "Pasos",
    goTo: "Ir al paso",
    title: "¿Qué es Zellige?",
    intro: {
      lead: "Zellige es un entorno de agentización personal.",
      body: "Este es Zel, nuestra mascota: se divide en tres partes, una por cada forma de usar Zellige.",
    },
    workings: {
      title: "¿Cómo funciona?",
      body: "Desde el escritorio, el móvil o la web, tus apps llegan a tu servidor por la red privada de Tailscale. Allí conviven tus harness y una memoria compartida. Puedes ejecutar modelos abiertos en tu máquina o conectar proveedores externos con tus suscripciones o claves de API.",
      devices: { title: "Tus dispositivos", body: "Las tres herramientas, en cualquier dispositivo", items: ["Escritorio", "Móvil", "Web"] },
      tunnel: { title: "Tailscale", body: "Red privada" },
      server: { title: "Tu servidor", body: "Tus herramientas y datos, bajo tu control", memory: "Memoria compartida", harness: "El harness que elijas" },
      local: { title: "Modelos locales", body: "Versiones abiertas que ejecutas en tu máquina.", examples: "Ejemplos de familias de modelos abiertos" },
      credentials: { title: "Tus credenciales", body: "Conecta con proveedores externos desde aquí.", methods: "Claves de API · OAuth" },
      calls: { title: "Inferencia", body: "Petición y respuesta" },
      providers: { title: "Proveedores externos", body: "Modelos abiertos o propietarios" },
    },
    steps: {
      points: {
        title: "Chat",
        voices: ["«¿De qué hablamos hoy?»", "«Cuéntame, te escucho.»", "«Pregunta lo que quieras.»", "«¿Seguimos donde lo dejamos?»"],
        body: "Habla con el modelo que quieras a través del harness que elijas, como en cualquier chat de IA, pero sin que tus conversaciones queden encerradas en una app.",
      },
      cobalt: {
        title: "Gestor de harness",
        voices: ["«Déjame, que lo monto yo.»", "«Dame un segundo…»", "«Compila. Siguiente.»", "«¿Con qué harness vamos hoy?»"],
        body: "Añade el harness que quieras y orquesta modelos, herramientas y agentes de programación en un mismo flujo para desarrollar software.",
      },
      crown: {
        title: "Agente personal",
        voices: ["«Tranquilo, yo me acuerdo.»", "«Eso ya está hecho.»", "«Te aviso a las nueve.»", "«¿Algún recado más?»"],
        body: "Recuerda, te avisa y hace recados por ti. Viene con un harness por defecto y puedes cambiarlo cuando quieras.",
      },
    },
  },
  features: {
    title: "Modelos y herramientas",
    harness: {
      body: "El harness conecta los modelos con las herramientas de tus agentes.",
    },
    harnesses: "Ejemplos de harness",
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
    repository: "Zellige on GitHub",
  },
  hero: {
    why: {
      title: "Why “Zellige”?",
      from: "From the Arabic",
      meaning: "“tile.”",
      history: "Like the tiles of a mosaic, the parts of Zellige fit together.",
    },
    title: { lead: "AI chat, coding agents and your own personal agent,", turn: "self-hosted and open source." },
    bring: { lead: "Connect your", items: ["harness", "subscription", "API key"] },
    version: "Version",
    releases: "View Zellige releases on GitHub",
    status: "Work in progress",
    next: "Jump to the next section",
  },
  zel: {
    alt: "Zel, the Zellige mascot",
  },
  layers: {
    points: { use: "Chat" },
    cobalt: { use: "Harness manager" },
    crown: { use: "Personal agent" },
  },
  story: {
    hint: "Scroll to see each part. Poke them and see what they say.",
    tasks: [["Dentist", "Appointment booked"], ["Email", "Email sent"], ["Groceries", "Groceries ordered"]],
    progress: "Steps",
    goTo: "Go to step",
    title: "What is Zellige?",
    intro: {
      lead: "Zellige is a personal workspace for AI agents.",
      body: "Meet Zel, our mascot: it splits into three parts, one for each way of using Zellige.",
    },
    workings: {
      title: "How it works",
      body: "From desktop, mobile or the web, your apps reach your server over Tailscale’s private network. Your harnesses and shared memory live there. Run open models on your own machine or connect to external providers with your subscriptions or API keys.",
      devices: { title: "Your devices", body: "All three tools, on any device", items: ["Desktop", "Mobile", "Web"] },
      tunnel: { title: "Tailscale", body: "Private network" },
      server: { title: "Your server", body: "Your tools and data, under your control", memory: "Shared memory", harness: "Your choice of harness" },
      local: { title: "Local models", body: "Open versions running on your machine.", examples: "Example open model families" },
      credentials: { title: "Your credentials", body: "Connect to external providers from here.", methods: "API keys · OAuth" },
      calls: { title: "Inference", body: "Request and response" },
      providers: { title: "External providers", body: "Open or proprietary models" },
    },
    steps: {
      points: {
        title: "Chat",
        voices: ["“What shall we talk about today?”", "“Go on, I’m listening.”", "“Ask me anything.”", "“Shall we pick up where we left off?”"],
        body: "Talk to any model you like through the harness you bring. It works like any AI chat, except your conversations aren’t locked into one app.",
      },
      cobalt: {
        title: "Harness manager",
        voices: ["“Leave it to me, I’ll build it.”", "“Give me a second…”", "“It builds. Next.”", "“Which harness today?”"],
        body: "Plug in whichever harnesses you like and orchestrate models, tools and coding agents in a single workflow to ship software.",
      },
      crown: {
        title: "Personal agent",
        voices: ["“Relax, I’ll remember.”", "“That’s already done.”", "“I’ll remind you at nine.”", "“Any other errands?”"],
        body: "It works for you out in the world: it remembers things, reminds you and runs errands. It comes with a default harness, and you can switch whenever you like.",
      },
    },
  },
  features: {
    title: "Models and tools",
    harness: {
      body: "The harness connects models to the tools your agents use.",
    },
    harnesses: "Example harnesses",
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
