<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="button-layer">
      <ElementButton
        v-for="element in elements"
        :key="element.id"
        @leftClick="addAtom"
        :element
      />
    </v-layer>
    <v-layer ref="atoms-layer">
      <v-group>
        <Atom
          v-for="atom in atoms"
          :key="atom.id"
          :atom
          @rightClick="deleteAtom"
      /></v-group>
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Atom from "./Atom.vue";
import ElementButton from "./ElementButton.vue";

const stageSize = ref({ width: 0, height: 0 });

const elements = [
  {
    id: 0,
    name: "Carbono",
    config: {
      x: 100,
      y: 100,
      fill: "black",
      stroke: "white",
      radius: 10,
      strokeWidth: 1,
    },
  },
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
];

const atoms = ref([]);
const atomIdCounter = ref(0);

function addAtom(id) {
  const newAtom = { ...elements[id].config };
  newAtom.id = atomIdCounter.value.toString();
  atomIdCounter.value++;
  newAtom.x = 200;
  newAtom.y = 100;
  newAtom.draggable = true;
  atoms.value.push(newAtom);
}

function deleteAtom(id) {
  const index = atoms.value.map((atom) => atom.id).indexOf(id);
  atoms.value.splice(index, 1);
  return false;
}

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
