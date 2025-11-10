<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="500"
      height="220"
      viewBox="0 0 500 220"
      role="img"
      aria-label="Estrutura simplificada do propano com ângulo e hidrogênios"
    >
      <!-- Fundo branco -->
      <rect width="100%" height="100%" fill="white" />

      <!-- Ligações com ângulo -->
      <line :x1="atomById.C1.x + 12" :y1="atomById.C1.y"
            :x2="atomById.C2.x - 12" :y2="atomById.C2.y" class="bond" />
      <line :x1="atomById.C2.x + 12" :y1="atomById.C2.y"
            :x2="atomById.C3.x - 12" :y2="atomById.C3.y" class="bond" />

      <!-- Hidrogênios (camada de trás) -->
      <g v-for="(h, index) in hydrogens" :key="'H' + index">
        <line :x1="h.parent.x" :y1="h.parent.y" :x2="h.x" :y2="h.y" class="bond-h" />
        <text :x="h.x" :y="h.y + 4" text-anchor="middle" class="hydrogen-label">H</text>
      </g>

      <!-- Destaque verde claro quando átomo ativo -->
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
        <!-- Label do átomo --> 
        <text class="atom-symbol" :x="atom.x" :y="atom.y + 4" text-anchor="middle">
          {{ atom.element }}
        </text>
        <title>{{ atom.tooltipTitle }}</title>
      </g>
    </svg>

    <!-- Tooltip HTML -->
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
        <div v-if="tooltip.atom.info.nota" class="muted">{{ tooltip.atom.info.nota }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Molécula: propano
const molecule = {
  name: 'Propano',
  formula: 'C3H8'
}

// Átomos com ângulo (C2 deslocado para cima)
const atoms = [
  {
    id: 'C1', element: 'C', x: 100, y: 140,
    tooltipTitle: 'C1 (Carbono primário) — Propano',
    info: { classificacao: 'Carbono primário', hibridacao: 'sp3 (~109,5°)', nota: 'Ligado a apenas 1 carbono.' }
  },
  {
    id: 'C2', element: 'C', x: 200, y: 82,
    tooltipTitle: 'C2 (Carbono secundário) — Propano',
    info: { classificacao: 'Carbono secundário', hibridacao: 'sp3 (~109,5°)', nota: 'Ligado a 2 carbonos (centro da molécula).' }
  },
  {
    id: 'C3', element: 'C', x: 300, y: 140,
    tooltipTitle: 'C3 (Carbono primário) — Propano',
    info: { classificacao: 'Carbono primário', hibridacao: 'sp3 (~109,5°)', nota: 'Extremidade oposta ao C1.' }
  }
]

// Hidrogênios (cinza, camada atrás dos carbonos)
const hydrogens = [
  // C1: 3 hidrogênios
  { parent: atoms[0], x: 60, y: 120 },
  { parent: atoms[0], x: 80, y: 180 },
  { parent: atoms[0], x: 120, y: 180 },

  // C2: 2 hidrogênios
  { parent: atoms[1], x: 180, y: 40 },
  { parent: atoms[1], x: 220, y: 40 },

  // C3: 3 hidrogênios
  { parent: atoms[2], x: 280, y: 180 },
  { parent: atoms[2], x: 320, y: 180 },
  { parent: atoms[2], x: 340, y: 120 }
]

const atomById = Object.fromEntries(atoms.map(a => [a.id, a]))

const wrap = ref(null)
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  atom: null
})

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

.mol-svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Ligações carbono-carbono */
.bond {
  stroke: #222;
  stroke-width: 2;
  stroke-linecap: round;
}

/* Ligações carbono-hidrogênio */
.bond-h {
  stroke: #888; /* cinza */
  stroke-width: 1.5;
}

/* Hidrogênios */
.hydrogen-label {
  font-size: 12px;
  fill: #555;
}

/* Átomos */
.atom {
  fill: #fff;
  stroke: #222;
  stroke-width: 2;
  cursor: default;
  transition: stroke 120ms ease, fill 120ms ease;
}

/* Texto */
.atom-label {
  font-size: 12px;
  fill: #555;
}
.atom-symbol {
  font-size: 12px;
  font-weight: 700;
  fill: #222;
}

/* Tooltip HTML */
.mol-tooltip {
  position: absolute;
  min-width: 240px;
  max-width: 280px;
  background: var(--vp-c-bg);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);
  padding: 10px 12px;
  pointer-events: none;
  font-size: 14px;
  line-height: 1.35;
}

.mol-tooltip-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.mol-tooltip-body .muted {
  color: #666;
  margin-top: 4px;
  font-size: 13px;
}
</style>
