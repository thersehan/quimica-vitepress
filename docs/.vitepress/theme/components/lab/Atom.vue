<template>
  <v-circle :config="atom" @dblclick="$emit('rightClick', id)" />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
