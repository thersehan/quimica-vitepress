<template>
  <Atom :config="element.config" @click="$emit('buttonClick', element.id)" />
</template>

<script setup>
import Atom from "./Atom.vue";
const { element } = defineProps(["element"]);
</script>
