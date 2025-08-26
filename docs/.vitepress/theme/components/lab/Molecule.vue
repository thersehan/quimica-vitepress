<template>
  <svg width="300" height="200" viewBox="0 0 300 200">
    <!-- Carbono 1 -->
    <circle cx="50" cy="100" r="10" fill="black"
      @mouseenter="showInfo('C1: Carbono primário')" 
      @mouseleave="hideInfo" />
    <!-- Carbono 2 -->
    <circle cx="150" cy="100" r="10" fill="black"
      @mouseenter="showInfo('C2: Carbono secundário')" 
      @mouseleave="hideInfo" />
    <!-- Ligação -->
    <line x1="60" y1="100" x2="140" y2="100" stroke="black" />
    
    <!-- Tooltip -->
    <foreignObject v-if="info" x="180" y="80" width="120" height="40">
      <div style="background:#fff;border:1px solid #ccc;padding:5px;">
        {{ info }}
      </div>
    </foreignObject>
  </svg>
</template>

<script setup>
import { ref } from 'vue'
const info = ref('')
const showInfo = (text) => info.value = text
const hideInfo = () => info.value = ''
</script>
