<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="button-layer">
      <ElementButton @button-click="addAtom" />
    </v-layer>
    <v-layer ref="atoms-layer">
      <Atom v-for="atom of atoms" />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Atom from "./Atom.vue";
import ElementButton from "./ElementButton.vue";

const stageSize = ref({ width: 0, height: 0 });

// const elements = ref({});

const atoms = ref(0);

function addAtom() {
  atoms.value++;
}

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
