<template>
  <v-circle
    :config="atom"
    @click="$emit('atomClick', atom.id)"
    @dblclick="$emit('atomDblClick', atom.id)"
    @dragend="$emit('atomMovement', atom.id)"
  />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
