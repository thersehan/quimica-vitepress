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

<script>
export default {
  data() {
    return {
      stageSize: {
        width: 0,
        height: 0,
      },
      isDragging: false,
    };
  },
  beforeMount() {
    this.stageSize.width = window.innerWidth;
    this.stageSize.height = window.innerHeight;
  },
  methods: {
    handleDragStart() {
      this.isDragging = true;
    },
    handleDragEnd() {
      this.isDragging = false;
    },
  },
};
</script>
