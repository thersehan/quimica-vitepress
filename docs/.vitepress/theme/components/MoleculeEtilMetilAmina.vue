<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="600"
      height="250"
      viewBox="0 0 600 250"
      role="img"
      aria-label="Estrutura simplificada da Etil-Metil-Amina"
    >
      <!-- Fundo -->
      <rect width="100%" height="100%" fill="white" />

      <!-- Ligações principais -->
      <line v-for="(bond, i) in bonds" :key="i"
            :x1="bond.x1" :y1="bond.y1"
            :x2="bond.x2" :y2="bond.y2"
            class="bond"
      />

      <!-- Hidrogênios -->
      <g v-for="(h, index) in hydrogens" :key="'H' + index">
        <line :x1="h.parent.x" :y1="h.parent.y" :x2="h.x" :y2="h.y" class="bond-h" />
        <text :x="h.x" :y="h.y + 4" text-anchor="middle" class="hydrogen-label">H</text>
      </g>

      <!-- Destaque verde -->
      <circle
        v-if="tooltip.visible && tooltip.atom"
        :cx="tooltip.atom.x"
        :cy="tooltip.atom.y"
        r="24"
        fill="rgba(0,200,0,0.15)"
      />

      <!-- Átomos -->
      <g v-for="atom in atoms" :key="atom.id">
        <circle
          :cx="atom.x" :cy="atom.y" :r="12"
          :class="['atom', atom.element]"
          @mouseenter="onEnter(atom)"
        />
        <text class="atom-symbol" :x="atom.x" :y="atom.y + 4" text-anchor="middle">
          {{ atom.element }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible && tooltip.atom"
      class="mol-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="mol-tooltip-title">
        Molécula: {{ molecule.name }} ({{ molecule.formula }})
      </div>
      <div class="mol-tooltip-body">
        <div><strong>Átomo:</strong> {{ tooltip.atom.id }} ({{ tooltip.atom.element }})</div>
        <div><strong>Classificação:</strong> {{ tooltip.atom.info.classificacao }}</div>
        <div><strong>Hibridação:</strong> {{ tooltip.atom.info.hibridacao }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Molécula: Etil-Metil-Amina
const molecule = {
  name: 'Etil-Metil-Amina',
  formula: 'C3H9N'
}

// Estrutura: CH3-CH2-NH-CH3
const atoms = [
  { id: 'C1', element: 'C', x: 80,  y: 120, info: { classificacao: 'Carbono primário', hibridacao: 'sp3' } },
  { id: 'C2', element: 'C', x: 150, y: 80,  info: { classificacao: 'Carbono primário', hibridacao: 'sp3' } },
  { id: 'N',  element: 'N', x: 220, y: 120, info: { classificacao: 'Nitrogênio: amina', hibridacao: 'sp3' } },
  { id: 'C3', element: 'C', x: 290, y: 80,  info: { classificacao: 'Carbono primário', hibridacao: 'sp3' } }
]

// Ligações principais
const bonds = [
  { x1: atoms[0].x, y1: atoms[0].y, x2: atoms[1].x, y2: atoms[1].y },
  { x1: atoms[1].x, y1: atoms[1].y, x2: atoms[2].x, y2: atoms[2].y },
  { x1: atoms[2].x, y1: atoms[2].y, x2: atoms[3].x, y2: atoms[3].y }
]

// Hidrogênios
const hydrogens = [
  // C1 (3H)
  { parent: atoms[0], x: 60, y: 90 }, { parent: atoms[0], x: 60, y: 150 }, { parent: atoms[0], x: 100, y: 150 },
  // C2 (2H)
  { parent: atoms[1], x: 140, y: 50 }, { parent: atoms[1], x: 160, y: 50 },
  // N (1H)
  { parent: atoms[2], x: 220, y: 150 },
  // C3 (3H)
  { parent: atoms[3], x: 270, y: 50 }, { parent: atoms[3], x: 290, y: 50 }, { parent: atoms[3], x: 310, y: 110 }
]

const wrap = ref(null)
const tooltip = reactive({ visible: false, x: 0, y: 0, atom: null })

function onEnter(atom) {
  tooltip.visible = true
  tooltip.atom = atom
}
function onLeaveAll() {
  tooltip.visible = false
  tooltip.atom = null
}
function onMouseMove(e) {
  const rect = wrap.value?.getBoundingClientRect?.()
  if (!rect) return
  tooltip.x = e.clientX - rect.left + 14
  tooltip.y = e.clientY - rect.top + 14
}
</script>

<style scoped>
.mol-wrapper {
  position: relative;
  display: inline-block;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0,0,0,.08);
}
.mol-svg { display: block; max-width: 100%; height: auto; }
.bond { stroke: #222; stroke-width: 2; stroke-linecap: round; }
.bond-h { stroke: #888; stroke-width: 1.5; }
.hydrogen-label { font-size: 12px; fill: #555; }
.atom { fill: #fff; stroke: #222; stroke-width: 2; cursor: default; transition: stroke 120ms ease, fill 120ms ease; }
.atom.N { stroke: #0044aa; } /* Nitrogênio com destaque azul */
.atom-symbol { font-size: 12px; font-weight: 700; fill: #222; }
.mol-tooltip { position: absolute; min-width: 240px; max-width: 280px; background: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,.12); padding: 10px 12px; pointer-events: none; font-size: 14px; line-height: 1.35; }
.mol-tooltip-title { font-weight: 700; margin-bottom: 6px; }
.mol-tooltip-body .muted { color: #666; margin-top: 4px; font-size: 13px; }
</style>
