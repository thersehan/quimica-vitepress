// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import LabCanvas from "./components/lab/LabCanvas.vue";
import MoleculeEtanol from "./components/InteractiveMolecules/MoleculeEtanol.vue";
import MoleculePropano from "./components/InteractiveMolecules/MoleculePropano.vue";
import MoleculeCiclopentano from "./components/InteractiveMolecules/MoleculeCiclopentano.vue";
import MoleculeCiclohexano from "./components/InteractiveMolecules/MoleculeCiclohexano.vue";
import MoleculeHexano from "./components/InteractiveMolecules/MoleculeHexano.vue";
import MoleculeBenzeno from "./components/InteractiveMolecules/MoleculeBenzeno.vue";
import MoleculeEtilMetilAmina from "./components/InteractiveMolecules/MoleculeEtilMetilAmina.vue";
import MoleculeTolueno from "./components/InteractiveMolecules/MoleculeTolueno.vue";
import MoleculePentano from "./components/InteractiveMolecules/MoleculePentano.vue";
import Molecule2metilbutano from "./components/InteractiveMolecules/Molecule2metilbutano.vue";
import MoleculePropeno from "./components/InteractiveMolecules/MoleculePropeno.vue";
import Molecule from "./components/InteractiveMolecules/Molecule.vue";
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
    app.component("MoleculePentano", MoleculePentano);
    app.component("Molecule2metilbutano", Molecule2metilbutano);
    app.component("MoleculePropeno", MoleculePropeno);
    app.component("Molecule",Molecule)
    app.use(VueKonva);
  },
};
