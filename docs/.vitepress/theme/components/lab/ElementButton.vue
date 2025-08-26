<template>
  <v-rect
    :config="element.config"
    @click="$emit('elementBtnClick', element.id)"
  />
</template>

<script setup>
const { element } = defineProps(["element"]);
</script>
