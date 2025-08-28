<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="400"
      height="400"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Estrutura simplificada do benzeno com ligações duplas"
    >
      <!-- Fundo branco -->
      <rect width="100%" height="100%" fill="white" />

      <!-- Ligações simples e duplas -->
      <g v-for="(bond, i) in ringBonds" :key="i">
        <line
          :x1="bond.x1" :y1="bond.y1"
          :x2="bond.x2" :y2="bond.y2"
          class="bond"
        />
        <!-- Se for ligação dupla, desenha linha paralela -->
        <line
          v-if="bond.double"
          :x1="bond.x1p" :y1="bond.y1p"
          :x2="bond.x2p" :y2="bond.y2p"
          class="bond"
        />
      </g>

      <!-- Hidrogênios -->
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
        <text class="atom-symbol" :x="atom.x" :y="atom.y + 4" text-anchor="middle">
          {{ atom.element }}
        </text>
        <title>{{ atom.tooltipTitle }}</title>
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
        <div v-if="tooltip.atom.info.nota" class="muted">{{ tooltip.atom.info.nota }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Molécula: Benzeno
const molecule = {
  name: 'Benzeno',
  formula: 'C6H6'
}

// Coordenadas dos carbonos (hexágono)
const atoms = [
  { id: 'C1', element: 'C', x: 200, y: 100, tooltipTitle: 'C1 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } },
  { id: 'C2', element: 'C', x: 280, y: 150, tooltipTitle: 'C2 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } },
  { id: 'C3', element: 'C', x: 280, y: 250, tooltipTitle: 'C3 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } },
  { id: 'C4', element: 'C', x: 200, y: 300, tooltipTitle: 'C4 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } },
  { id: 'C5', element: 'C', x: 120, y: 250, tooltipTitle: 'C5 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } },
  { id: 'C6', element: 'C', x: 120, y: 150, tooltipTitle: 'C6 — Benzeno', info: { classificacao: 'Carbono secundário', hibridacao: 'sp2', nota: '' } }
]

// Ligações com duplas alternadas
const ringBonds = [
  makeBond(atoms[0], atoms[1], true),  // dupla
  makeBond(atoms[1], atoms[2], false),
  makeBond(atoms[2], atoms[3], true),  // dupla
  makeBond(atoms[3], atoms[4], false),
  makeBond(atoms[4], atoms[5], true),  // dupla
  makeBond(atoms[5], atoms[0], false)
]

// Função para gerar as ligações duplas com deslocamento
function makeBond(a, b, isDouble) {
  const base = { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
  if (!isDouble) return base
  // deslocamento perpendicular para a linha paralela
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.sqrt(dx*dx + dy*dy)
  const offset = 4 // distância entre linhas da ligação dupla
  const ox = -(dy / len) * offset
  const oy = (dx / len) * offset
  return {
    ...base,
    double: true,
    x1p: a.x + ox, y1p: a.y + oy,
    x2p: b.x + ox, y2p: b.y + oy
  }
}

// Hidrogênios (apenas 1 por carbono, voltado para fora do anel)
const hydrogens = [
  { parent: atoms[0], x: 200, y: 50 },
  { parent: atoms[1], x: 330, y: 150 },
  { parent: atoms[2], x: 330, y: 250 },
  { parent: atoms[3], x: 200, y: 350 },
  { parent: atoms[4], x: 70, y: 250 },
  { parent: atoms[5], x: 70, y: 150 }
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
.mol-tooltip { position: absolute; min-width: 240px; max-width: 280px; background: #ffffff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,.12); padding: 10px 12px; pointer-events: none; font-size: 14px; line-height: 1.35; }
.mol-tooltip-title { font-weight: 700; margin-bottom: 6px; }
.mol-tooltip-body .muted { color: #666; margin-top: 4px; font-size: 13px; }
</style>
