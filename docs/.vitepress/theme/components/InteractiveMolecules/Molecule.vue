<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="950"
      height="450"
      viewBox="0 0 950 450"
      role="img"
      aria-label=""
    >
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

      <!-- Destaque -->
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
        Molécula: N-(1,2-dimetilpropil)-2,2-dimetilpropan-1-amina ({{ molecule.formula }})
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

const molecule = {
  name: 'N-(1,2-dimetilpropil)-2,2-dimetilpropan-1-amina',
  formula: 'C10H31N'
}

// Átomos
const atoms = [
  { id: 'C1', element: 'C', x: 80,  y: 200, info: { classificacao: 'Primário', hibridacao: 'sp3' } },
  { id: 'C2', element: 'C', x: 150, y: 160, info: { classificacao: 'Secundário', hibridacao: 'sp3' } },
  { id: 'N',  element: 'N', x: 220, y: 200, info: { classificacao: 'Nitrogênio', hibridacao: 'sp3' } },

  // Novo carbono entre N e C3
  { id: 'C10', element: 'C', x: 310, y: 200, info: { classificacao: 'Primário   ', hibridacao: 'sp3' } },

  { id: 'C3', element: 'C', x: 400, y: 160, info: { classificacao: 'Quaternário', hibridacao: 'sp3' } },

  // Etil ramificado no C2 (com maior espaçamento)
  { id: 'C4', element: 'C', x: 150, y: 100, info: { classificacao: 'Terciário', hibridacao: 'sp3' } },
  { id: 'C5', element: 'C', x: 100, y: 40,  info: { classificacao: 'Primário', hibridacao: 'sp3' } },
  { id: 'C6', element: 'C', x: 200, y: 40,  info: { classificacao: 'Primário', hibridacao: 'sp3' } },

  // Metis opostos no C3
  { id: 'C7', element: 'C', x: 460, y: 100, info: { classificacao: 'Primário', hibridacao: 'sp3' } },
  { id: 'C8', element: 'C', x: 460, y: 230, info: { classificacao: 'Primário', hibridacao: 'sp3' } },
  { id: 'C9', element: 'C', x: 350, y: 100, info: { classificacao: 'Primário', hibridacao: 'sp3'} },
]

// Ligações
const bonds = [
  // cadeia principal
  { x1: atoms[0].x, y1: atoms[0].y, x2: atoms[1].x, y2: atoms[1].y },
  { x1: atoms[1].x, y1: atoms[1].y, x2: atoms[2].x, y2: atoms[2].y },
  { x1: atoms[2].x, y1: atoms[2].y, x2: atoms[3].x, y2: atoms[3].y },
  { x1: atoms[3].x, y1: atoms[3].y, x2: atoms[4].x, y2: atoms[4].y },

  // Etil no C2 (com maior espaçamento)
  { x1: atoms[1].x, y1: atoms[1].y, x2: atoms[5].x, y2: atoms[5].y },
  { x1: atoms[5].x, y1: atoms[5].y, x2: atoms[6].x, y2: atoms[6].y },
  { x1: atoms[5].x, y1: atoms[5].y, x2: atoms[7].x, y2: atoms[7].y },

  // Metis no C3
  { x1: atoms[4].x, y1: atoms[4].y, x2: atoms[8].x, y2: atoms[8].y },
  { x1: atoms[4].x, y1: atoms[4].y, x2: atoms[9].x, y2: atoms[9].y },
  { x1: atoms[4].x, y1: atoms[4].y, x2: atoms[10].x, y2: atoms[10].y }
]

// Hidrogênios
const hydrogens = [
  // C1 (3H)
  { parent: atoms[0], x: 60, y: 170 }, { parent: atoms[0], x: 60, y: 230 }, { parent: atoms[0], x: 100, y: 230 },
  // C2 (1H)
  { parent: atoms[1], x: 170, y: 190 },
  // N (1H)
  { parent: atoms[2], x: 220, y: 230 },
  // C4 (1H)
  { parent: atoms[5], x: 150, y: 70 },

  // Novo C10 (2H)
  { parent: atoms[3], x: 310, y: 170 }, { parent: atoms[3], x: 310, y: 230 },

  // C9 (3H)
  { parent: atoms[10], x: 350, y: 60 }, { parent: atoms[10], x: 320, y: 120 }, { parent: atoms[10], x: 380, y: 120 },

  // C5 (3H)
  { parent: atoms[6], x: 80, y: 10 }, { parent: atoms[6], x: 100, y: 10 }, { parent: atoms[6], x: 90, y: 70 },
  // C6 (3H)
  { parent: atoms[7], x: 220, y: 10 }, { parent: atoms[7], x: 200, y: 10 }, { parent: atoms[7], x: 210, y: 70 },
  // C7 (3H)
  { parent: atoms[8], x: 480, y: 70 }, { parent: atoms[8], x: 460, y: 130 }, { parent: atoms[8], x: 440, y: 70 },
  // C8 (3H)
  { parent: atoms[9], x: 480, y: 260 }, { parent: atoms[9], x: 440, y: 260 }, { parent: atoms[9], x: 460, y: 290 }
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
.atom { fill: #fff; stroke: #222; stroke-width: 2; transition: stroke 120ms ease, fill 120ms ease; }
.atom.N { stroke: #0044aa; }
.atom-symbol { font-size: 12px; font-weight: 700; fill: #222; }
.mol-tooltip { position: absolute; min-width: 240px; max-width: 280px; background: var(--vp-c-bg); border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,.12); padding: 10px 12px; pointer-events: none; font-size: 14px; line-height: 1.35; }
.mol-tooltip-title { font-weight: 700; margin-bottom: 6px; }
</style>
