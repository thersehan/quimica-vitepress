import { defineConfig } from "vitepress";
import { vShow } from "vue";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  title: "Apostila",
  description: "Projeto de Iniciação Científica",
  base: "/quimica-vitepress/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Conteúdos", link: "/historia-da-quimica-organica" },
      { text: "Laboratório", link: "#" },
    ],

    footer: {
      copyright:
        'Feito por <a href="https://github.com/thersehan"> Juliano Monteiro Gonçalves </a> e <a href="https://github.com/holzdm"> Vítor Holz de Martin </a>',
    },

    docFooter: { prev: "Anterior", next: "Próximo" },

    outline: { label: "Tópicos" },

    sidebar: [
      {
        text: "Conteúdos",
        items: [
          { text: "História", link: "/historia-da-quimica-organica" },
          {
            text: "Conceito de Química Orgânica",
            link: "/conceito-de-quimica-organica",
          },
          {
            text: "Características do Carbono",
            link: "/caracteristicas-do-carbono",
          },
          {
            text: "Hibridização do Carbono",
            link: "/hibridizacao-do-carbono",
          },
          {
            text: "Representação das Moléculas Orgânicas",
            link: "/representacao-das-moleculas-organicas",
          },
          {
            text: "Classificação do Carbono em uma Cadeia",
            link: "/classificacao-do-carbono-em-uma-cadeia",
          },
          {
            text: "Cadeias Carbônicas",
            link: "/cadeias-carbonicas",
          },
          {
            text: "Hidrocarbonetos",
            link: "/hidrocarbonetos",
          },
          {
            text: "Nomenclatura de Compostos Orgânicos",
            link: "/nomenclatura-compostos",
          },
          {
            text: "Nomenclatura de Ramificações",
            link: "/nomenclatura-ramificacoes",
          },
        ],
      },
    ],
  },
});
