<template>
  <v-circle :config="atom" @dblclick="$emit('atomDblClick', id)" />
</template>

<script setup>
const { atom } = defineProps(["atom"]);
</script>
