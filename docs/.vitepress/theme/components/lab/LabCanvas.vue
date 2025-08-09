<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="button-layer">
      <ElementButton
        v-for="element in elements"
        @button-click="addAtom"
        :element
        :key="element.id"
      />
    </v-layer>
    <v-layer ref="atoms-layer">
      <Atom v-for="atom in atoms" :atom />
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

function addAtom(id) {
  const newAtom = elements[id].config;
  newAtom.x = 200;
  newAtom.y = 100;
  newAtom.draggable = true;
  atoms.value.push(newAtom);
  // console.log(atoms.value.length);
  // console.log(elements[id].config);
}

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
