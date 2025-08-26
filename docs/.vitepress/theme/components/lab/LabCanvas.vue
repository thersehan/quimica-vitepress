<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer>
      <v-rect :config="background" @click="unselect" />
    </v-layer>
    <v-layer ref="button-layer">
      <ElementButton
        v-for="element in elements"
        :key="element.id"
        @elementBtnClick="addAtom"
        :element
      />
      <v-text :config="elementButtonText" />
    </v-layer>
    <v-layer ref="atoms-layer">
      <Atom
        v-for="atom in atoms"
        :key="atom.id"
        :atom
        @atomClick="selectAtom"
        @atomDblClick="deleteAtom"
        @atomMovement="handleAtomMovement"
      />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Atom from "./Atom.vue";
import ElementButton from "./ElementButton.vue";

const stageSize = ref({ width: 0, height: 0 });
const stage = ref(null);

const elements = [
  {
    id: 0,
    name: "Carbono",
    config: {
      x: 100,
      y: 100,
      fill: "black",
      stroke: "white",
      strokeWidth: 1,
      width: 24,
      height: 24,
    },
  },
  /*
  {
    id: 1,
    name: "Oxigênio",
    config: {
      x: 100,
      y: 200,
      fill: "red",
      stroke: "white",
      radius: 10,
      strokeWidth: 1,
    },
  },
 */
];

const background = {
  width: 1000,
  height: 1000,
};

const elementButtonText = {
  x: 130,
  y: 130,
  text: "adicionar carbono",
  fontFamily: "JetBrains Mono",
  fontSize: 16,
};

const atoms = ref([]);
const atomIdCounter = ref(0);

const selectedAtom = ref(null);

function addAtom(id) {
  const newAtom = { ...elements[id].config };
  newAtom.id = atomIdCounter.value.toString();
  atomIdCounter.value++;
  newAtom.x = stageSize.value.width / 2;
  newAtom.y = stageSize.value.height / 2;
  newAtom.radius = 12;
  newAtom.draggable = true;
  newAtom.bonds = [];
  atoms.value.push(newAtom);
}

function deleteAtom(id) {
  const index = atoms.value.map((atom) => atom.id).indexOf(id);
  atoms.value.splice(index, 1);
  return false;
}

function handleAtomMovement(id) {
  const mousePos = stage.value.getNode().getPointerPosition();
  const atom = atoms.value.find((atom) => atom.id === id);
  atom.x = mousePos.x;
  atom.y = mousePos.y;
}

function selectAtom(id) {
  if (!selectedAtom.value) {
    selectedAtom.value = atoms.value.find((atom) => atom.id === id);
  } else {
    selectedAtom.value.bonds.push(id);
  }
}

function unselect() {
  selectedAtom.value = null;
}

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
