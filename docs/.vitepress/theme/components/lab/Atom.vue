<template>
  <v-circle :config="atom" />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
