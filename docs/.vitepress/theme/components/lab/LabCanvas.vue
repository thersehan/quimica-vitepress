<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer>
      <v-rect :config="background" @dblclick="addAtom" @click="unselect" />
    </v-layer>
    <v-layer ref="text-layer">
      <v-text :config="guideText" />
      <v-text :config="moleculeText" />
    </v-layer>
    <v-layer>
      <v-group v-for="atom in atoms" :key="atom.id">
        <v-line
          v-for="(bond, index) in bonds"
          :key="index"
          :config="bond.config"
        />
      </v-group>
    </v-layer>
    <v-layer ref="atoms-layer">
      <Atom
        v-for="atom in atoms"
        :key="atom.id"
        :atom
        @atomClick="selectAtom"
        @atomDblClick="deleteAtom"
        @atomDragMove="handleAtomDragMove"
      />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Atom from "./Atom.vue";
import { numberToSubtext } from "../../../../lib/unicodeSubtext";

const stageSize = ref({ width: 0, height: 0 });
const stage = ref(null);

const bondLineConfig = {
  stroke: "gray",
  strokeWidth: 3,
};

const background = {
  width: 1000,
  height: 1000,
};

const guideText = {
  x: 30,
  y: 30,
  text: "Clique duas vezes na tela para adicionar um carbono\n\nClique uma vez em um carbono para selecioná-lo\n\nClique duas vezes em um carbono para excluí-lo",
  fontFamily: "lekton",
  fontSize: 16,
  fill: "gray",
};

const moleculeText = ref({
  x: 30,
  y: 130,
  text: "...",
  fontFamily: "lekton",
  fontSize: 32,
  fontStyle: "bold",
  fill: "gray",
});

const atoms = ref([]);
const atomIdCounter = ref(0);

const selectedAtom = ref(null);

const bonds = ref([]);

function addAtom() {
  const mousePos = stage.value.getNode().getPointerPosition();
  atoms.value.push({
    id: atomIdCounter.value.toString(),
    x: mousePos.x,
    y: mousePos.y,
    fill: "black",
    stroke: "white",
    strokeWidth: 1,
    radius: 12,
    draggable: true,
    bonds: [],
  });
  atomIdCounter.value++;
  updateMoleculeLabel();
}

function deleteAtom(id) {
  const index = atoms.value.map((atom) => atom.id).indexOf(id);
  atoms.value.splice(index, 1);
  updateMoleculeLabel();
  return false;
}

function handleAtomDragMove(id) {
  const mousePos = stage.value.getNode().getPointerPosition();
  const atom = atoms.value.find((atom) => atom.id === id);
  atom.x = mousePos.x;
  atom.y = mousePos.y;
  updateBonds();
}

function selectAtom(id) {
  if (!selectedAtom.value) {
    selectedAtom.value = atoms.value.find((atom) => atom.id === id);
    selectedAtom.value.strokeWidth = 3;
  } else {
    const newlySelectedAtom = atoms.value.find((atom) => atom.id === id);
    selectedAtom.value.bonds.push(id);
    newlySelectedAtom.bonds.push(selectedAtom.value.id);
    bonds.value.push({
      initialAtomId: selectedAtom.value.id,
      nextAtomId: newlySelectedAtom.id,
    });
    updateBonds();
    updateMoleculeLabel();
    selectedAtom.value.strokeWidth = 1;
    selectedAtom.value = null;
  }
}

function unselect() {
  if (selectedAtom.value) {
    selectedAtom.value.strokeWidth = 1;
  }
  selectedAtom.value = null;
}

function updateBonds() {
  for (let i = 0; i < bonds.value.length; i++) {
    const bond = bonds.value[i];
    const initialAtom = atoms.value.find(
      (atom) => atom.id === bond.initialAtomId
    );
    const nextAtom = atoms.value.find((atom) => atom.id === bond.nextAtomId);
    const points = [initialAtom.x, initialAtom.y, nextAtom.x, nextAtom.y];
    bond.config = { ...bondLineConfig, points: points };
  }
}

function updateMoleculeLabel() {
  if (atoms.value.length) {
    moleculeText.value.text =
      "C" +
      numberToSubtext(atoms.value.length) +
      "H" +
      numberToSubtext(
        4 * atoms.value.length -
          atoms.value.reduce(
            (bondCounter, atom) => bondCounter + atom.bonds.length,
            0
          )
      ).toString();
  } else {
    moleculeText.value.text = "...";
  }
}

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
