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
    title: { lead: "Tu IA está repartida en mil apps.", turn: "Zellige la junta." },
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
    points: { name: "Puntas", use: "Agentes personales" },
  },
  story: {
    hint: "Desliza para montar el azulejo",
    progress: "Pasos de la historia",
    goTo: "Ir al paso",
    headline: { lead: "Cada capa del azulejo", turn: "es una forma de usar la\u00a0IA." },
    steps: {
      crown: {
        title: "La corona",
        body: "Lo primero que rodea a Zel: las piezas de marfil. Es el chat, donde piensas en voz alta con el modelo que elijas. La pieza más cercana.",
      },
      cobalt: {
        title: "El azul",
        body: "Las esquinas que sujetan el conjunto. Es el meta-harness para desarrollar software con agentes: orquesta modelos, herramientas y flujos para que todo encaje.",
      },
      points: {
        title: "Las puntas",
        body: "Lo que mira hacia fuera. Tus agentes personales: salen, recuerdan, avisan y hacen recados por ti.",
      },
      tile: {
        title: "El azulejo",
        body: "Corona, azul y puntas, cada capa con su papel, encajadas alrededor de Zel. Él guarda tu historia para todas. Cambia una capa sin empezar de cero.",
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
    title: { lead: "Your AI is scattered across a dozen apps.", turn: "Zellige brings it together." },
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
    points: { name: "Points", use: "Personal agents" },
  },
  story: {
    hint: "Scroll to build the tile",
    progress: "Story steps",
    goTo: "Go to step",
    headline: { lead: "Each layer of the tile", turn: "is a way to use\u00a0AI." },
    steps: {
      crown: {
        title: "The crown",
        body: "The first ring around Zel: the ivory pieces. That's chat, where you think out loud with the model you choose. The closest layer.",
      },
      cobalt: {
        title: "The blue",
        body: "The corners that hold it all together. The meta-harness for building software with agents: it orchestrates models, tools and flows so everything fits.",
      },
      points: {
        title: "The points",
        body: "What faces outward. Your personal agents: they go out, remember, remind and run errands for you.",
      },
      tile: {
        title: "The tile",
        body: "Crown, blue and points, each layer with its role, fitted around Zel, who keeps your story for all of them. Swap a layer without starting over.",
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
