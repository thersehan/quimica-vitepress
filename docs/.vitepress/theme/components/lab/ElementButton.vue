<template>
  <Atom :config="elementConfig" @click="$emit('buttonClick')" />
</template>

<script setup>
import Atom from "./Atom.vue";

const elementConfig = {
  x: 75,
  y: 75,
  radius: 20,
  fill: "red",
  stroke: "black",
  strokeWidth: 2,
  draggable: false,
};
</script>
