<template>
  <v-circle :config="atom" @dblclick="$emit('atomDblClick', atom.id)" />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
