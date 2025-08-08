<template>
  <v-circle :config="circleConfig" />
</template>

<script setup>
const stageSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const circleConfig = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4,
  draggable: true,
};
</script>

<style></style>
