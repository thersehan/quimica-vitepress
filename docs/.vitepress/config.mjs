import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Apostila",
  description: "Projeto de Iniciação Científica",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Conteúdos", link: "/markdown-examples" },
      { text: "Laboratório", link: "/api-examples" },
    ],

    sidebar: [
      {
        text: "Conteúdos",
        items: [
          { text: "Carbono", link: "/markdown-examples" },
          { text: "Moléculas", link: "/api-examples" },
        ],
      },
    ],
  },
});
