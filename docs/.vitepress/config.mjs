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
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "Pesquisar",
              },
              modal: {
                displayDetails: "mostrar detalhes",
                resetButtonTitle: "redefinir busca",
                backButtonTitle: "fechar busca",
                noResultsText: "sem resultados para",
                footer: {
                  selectText: "selecionar",
                  navigateText: "navegar",
                  closeText: "sair",
                },
              },
            },
          },
        },
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Conteúdos", link: "/conteudos/historia-da-quimica-organica" },
      { text: "Laboratório", link: "/lab.md" },
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
          { text: "História", link: "/conteudos/historia-da-quimica-organica" },
          {
            text: "Conceito de Química Orgânica",
            link: "/conteudos/conceito-de-quimica-organica",
          },
          {
            text: "Características do Carbono",
            link: "/conteudos/caracteristicas-do-carbono",
          },
          {
            text: "Hibridização do Carbono",
            link: "/conteudos/hibridizacao-do-carbono",
          },
          {
            text: "Representação das Moléculas Orgânicas",
            link: "/conteudos/representacao-das-moleculas-organicas",
          },
          {
            text: "Classificação do Carbono em uma Cadeia",
            link: "/conteudos/classificacao-do-carbono-em-uma-cadeia",
          },
          {
            text: "Cadeias Carbônicas",
            link: "/conteudos/cadeias-carbonicas",
          },
          {
            text: "Hidrocarbonetos",
            link: "/conteudos/hidrocarbonetos",
          },
          {
            text: "Nomenclatura de Compostos Orgânicos",
            link: "/conteudos/nomenclatura-compostos",
          },
          {
            text: "Nomenclatura de Ramificações",
            link: "/conteudos/nomenclatura-ramificacoes",
          },
        ],
      },
    ],
  },
});
