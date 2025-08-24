<template>
  <v-circle :config="atom" @dblclick="$emit('dblclick', id)" />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
