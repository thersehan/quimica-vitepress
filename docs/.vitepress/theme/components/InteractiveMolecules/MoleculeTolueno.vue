<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="450"
      height="450"
      viewBox="0 0 450 450"
      role="img"
      aria-label="Estrutura simplificada do tolueno"
    >
      <!-- Fundo branco -->
      <rect width="100%" height="100%" fill="white" />

      <!-- Ligações simples e duplas do anel -->
      <g v-for="(bond, i) in ringBonds" :key="i">
        <line
          :x1="bond.x1" :y1="bond.y1"
          :x2="bond.x2" :y2="bond.y2"
          class="bond"
        />
        <line
          v-if="bond.double"
          :x1="bond.x1p" :y1="bond.y1p"
          :x2="bond.x2p" :y2="bond.y2p"
          class="bond"
        />
      </g>

      <!-- Ligação do grupo metil -->
      <line
        :x1="atoms[0].x" :y1="atoms[0].y"
        :x2="methyl.x" :y2="methyl.y"
        class="bond"
      />

      <!-- Hidrogênios -->
      <g v-for="(h, index) in hydrogens" :key="'H' + index">
        <line :x1="h.parent.x" :y1="h.parent.y" :x2="h.x" :y2="h.y" class="bond-h" />
        <text :x="h.x" :y="h.y + 4" text-anchor="middle" class="hydrogen-label">H</text>
      </g>

      <!-- Destaque verde claro -->
<circle
  v-if="tooltip.visible && tooltip.atom && tooltip.atom.id !== 'C7'"
  :cx="tooltip.atom.x"
  :cy="tooltip.atom.y"
  r="24"
  fill="rgba(0,200,0,0.15)"
/>
<circle
  v-if="tooltip.visible && tooltip.atom && tooltip.atom.id === 'C7'"
  :cx="tooltip.atom.x"
  :cy="tooltip.atom.y"
  r="24"
  fill="rgba(0,0,200,0.15)"
/>


      <!-- Átomos do anel -->
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

      <!-- Átomo da metila -->
      <g>
        <circle
          :cx="methyl.x" :cy="methyl.y" :r="12"
          class="atom C"
          @mouseenter="onEnter(methyl)"
        />
        <text class="atom-symbol" :x="methyl.x" :y="methyl.y + 4" text-anchor="middle">C</text>
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
        <!-- <div v-if="tooltip.atom.info.nota" class="muted">{{ tooltip.atom.info.nota }}</div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Molécula: Tolueno
const molecule = {
  name: 'Tolueno',
  formula: 'C7H8'
}

// Átomos do anel (hexágono)
const atoms = [
  { id: 'C1', element: 'C', x: 225, y: 100, info: { classificacao: 'Carbono terciário', hibridacao: 'sp2' } },
  { id: 'C2', element: 'C', x: 305, y: 150, info: { classificacao: 'Carbono secundário', hibridacao: 'sp2' } },
  { id: 'C3', element: 'C', x: 305, y: 250, info: { classificacao: 'Carbono secundário', hibridacao: 'sp2' } },
  { id: 'C4', element: 'C', x: 225, y: 300, info: { classificacao: 'Carbono secundário', hibridacao: 'sp2' } },
  { id: 'C5', element: 'C', x: 145, y: 250, info: { classificacao: 'Carbono secundário', hibridacao: 'sp2' } },
  { id: 'C6', element: 'C', x: 145, y: 150, info: { classificacao: 'Carbono secundário', hibridacao: 'sp2' } }
]

// Grupo metil (-CH3) ligado ao C1
const methyl = {
  id: 'C7', element: 'C', x: 225, y: 40,
  info: { classificacao: 'Carbono primário', hibridacao: 'sp3', nota: 'Parte do grupo metil' }
}

// Ligações do anel com duplas alternadas
const ringBonds = [
  makeBond(atoms[0], atoms[1], true),
  makeBond(atoms[1], atoms[2], false),
  makeBond(atoms[2], atoms[3], true),
  makeBond(atoms[3], atoms[4], false),
  makeBond(atoms[4], atoms[5], true),
  makeBond(atoms[5], atoms[0], false)
]

function makeBond(a, b, isDouble) {
  const base = { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
  if (!isDouble) return base
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.sqrt(dx*dx + dy*dy)
  const offset = 4
  const ox = -(dy / len) * offset
  const oy = (dx / len) * offset
  return { ...base, double: true, x1p: a.x + ox, y1p: a.y + oy, x2p: b.x + ox, y2p: b.y + oy }
}

// Hidrogênios (1 para cada carbono do anel, exceto C1 que tem o metil)
const hydrogens = [
  { parent: atoms[1], x: 355, y: 150 },
  { parent: atoms[2], x: 355, y: 250 },
  { parent: atoms[3], x: 225, y: 350 },
  { parent: atoms[4], x: 95, y: 250 },
  { parent: atoms[5], x: 95, y: 150 },
  // Hidrogênios do grupo metil (C7)
  { parent: methyl, x: 205, y: 10 },
  { parent: methyl, x: 245, y: 10 },
  { parent: methyl, x: 265, y: 50 }
]

const wrap = ref(null)
const tooltip = reactive({ visible: false, x: 0, y: 0, atom: null })

function onEnter(atom) { tooltip.visible = true; tooltip.atom = atom }
function onLeaveAll() { tooltip.visible = false; tooltip.atom = null }
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
.atom-symbol { font-size: 12px; font-weight: 700; fill: #222; }
.mol-tooltip { position: absolute; min-width: 240px; max-width: 280px; background: var(--vp-c-bg);; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,.12); padding: 10px 12px; pointer-events: none; font-size: 14px; line-height: 1.35; }
.mol-tooltip-title { font-weight: 700; margin-bottom: 6px; }
.mol-tooltip-body .muted { color: #666; margin-top: 4px; font-size: 13px; }
</style>
