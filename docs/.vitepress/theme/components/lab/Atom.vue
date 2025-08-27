<template>
  <v-circle
    :config="atom"
    @click="$emit('atomClick', atom.id)"
    @dblclick="$emit('atomDblClick', atom.id)"
    @dragmove="$emit('atomDragMove', atom.id)"
    @dragend="$emit('atomDragEnd', atom.id)"
  />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
