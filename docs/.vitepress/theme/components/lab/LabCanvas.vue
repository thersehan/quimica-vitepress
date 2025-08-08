<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <Atom />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Atom from "./Atom.vue";

const stageSize = ref({ width: 0, height: 0 });

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});
</script>
