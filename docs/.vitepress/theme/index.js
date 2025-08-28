// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import LabCanvas from "./components/lab/LabCanvas.vue";
import MoleculeEtanol from './components/MoleculeEtanol.vue'
import MoleculePropano from "./components/MoleculePropano.vue"; 
import MoleculeCiclopentano from "./components/MoleculeCiclopentano.vue";
import MoleculeCiclohexano from "./components/MoleculeCiclohexano.vue";
import MoleculeHexano from "./components/MoleculeHexano.vue";
import MoleculeBenzeno from "./components/MoleculeBenzeno.vue";
import MoleculeEtilMetilAmina from "./components/MoleculeEtilMetilAmina.vue"; 
import MoleculeTolueno from "./components/MoleculeTolueno.vue";
import "./style.css";

import VueKonva from "vue-konva";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("LabCanvas", LabCanvas);
    app.component("MoleculeEtanol", MoleculeEtanol);
    app.component("MoleculePropano", MoleculePropano);
    app.component("MoleculeCiclopentano", MoleculeCiclopentano);
    app.component("MoleculeCiclohexano", MoleculeCiclohexano);
    app.component("MoleculeHexano", MoleculeHexano);
    app.component("MoleculeBenzeno", MoleculeBenzeno);
    app.component("MoleculeEtilMetilAmina", MoleculeEtilMetilAmina);
    app.component("MoleculeTolueno", MoleculeTolueno);
    app.use(VueKonva);
  },
};
