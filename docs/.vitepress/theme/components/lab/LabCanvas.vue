<template>
  <v-stage ref="stage" :config="stageSize">
    <v-layer ref="layer">
      <v-text
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        :config="{
          text: 'Draggable Text',
          x: 50,
          y: 50,
          draggable: true,
          fill: isDragging ? 'green' : 'black',
        }"
      />
    </v-layer>
  </v-stage>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";

const stageSize = ref({ width: 0, height: 0 });
const isDragging = ref(false);

onBeforeMount(() => {
  stageSize.value.width = window.innerWidth;
  stageSize.value.height = window.innerHeight;
});

function handleDragStart() {
  isDragging.value = true;
}

function handleDragEnd() {
  isDragging.value = false;
}
</script>
