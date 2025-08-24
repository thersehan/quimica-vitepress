<template>
  <Atom :config="element.config" @click="$emit('leftClick', element.id)" />
</template>

<script setup>
import Atom from "./Atom.vue";
const { element } = defineProps(["element"]);
</script>
