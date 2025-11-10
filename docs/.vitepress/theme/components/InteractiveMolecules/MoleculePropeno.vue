<template>
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove" @mouseleave="onLeaveAll">
    <svg
      class="mol-svg"
      width="500"
      height="220"
      viewBox="0 0 500 220"
      role="img"
      aria-label="Estrutura simplificada do Propeno com ligação dupla"
    >
      <!-- Fundo branco -->
      <rect width="100%" height="100%" fill="white" />

      <!-- Ligações simples -->
      <line :x1="atomById.C2.x + 12" :y1="atomById.C2.y"
            :x2="atomById.C3.x - 12" :y2="atomById.C3.y" class="bond" />

      <!-- Ligação dupla C1=C2 -->
      <line :x1="atomById.C1.x + 12" :y1="atomById.C1.y - 3"
            :x2="atomById.C2.x - 12" :y2="atomById.C2.y - 3" class="bond-double" />
      <line :x1="atomById.C1.x + 12" :y1="atomById.C1.y + 3"
            :x2="atomById.C2.x - 12" :y2="atomById.C2.y + 3" class="bond-double" />

      <!-- Hidrogênios ajustados -->
      <g v-for="(h, index) in hydrogens" :key="'H' + index">
        <line :x1="h.parent.x" :y1="h.parent.y" :x2="h.x" :y2="h.y" class="bond-h" />
        <text :x="h.x" :y="h.y + 4" text-anchor="middle" class="hydrogen-label">H</text>
      </g>

      <!-- Destaque verde claro ao passar o mouse -->
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
          @mouseenter="onEnter(atom, $event)"
          @mouseleave="onLeaveAtom"
        />
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
      :style="{ left: tooltip.screenX + 'px', top: tooltip.screenY + 'px' }"
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

// Molécula
const molecule = { name: 'Propeno', formula: 'C3H6' }

// Átomos
const atoms = [
  { id: 'C1', element: 'C', x: 100, y: 140, tooltipTitle: 'C1 (primário) — Propeno', info: { classificacao: 'primário', hibridacao: 'sp2' } },
  { id: 'C2', element: 'C', x: 200, y: 80, tooltipTitle: 'C2 (secundário) — Propeno', info: { classificacao: 'secundário', hibridacao: 'sp2' } },
  { id: 'C3', element: 'C', x: 300, y: 140, tooltipTitle: 'C3 (primário) — Propeno', info: { classificacao: 'primário', hibridacao: 'sp3' } }
]

// Hidrogênios ajustados (removidos os perdidos na dupla)
const hydrogens = [
  // C1: só 2 hidrogênios
  { parent: atoms[0], x: 60, y: 120 },
  { parent: atoms[0], x: 80, y: 180 },

  // C2: só 1 hidrogênio
  { parent: atoms[1], x: 200, y: 26 },

  // C3: 3 hidrogênios
  { parent: atoms[2], x: 280, y: 180 },
  { parent: atoms[2], x: 320, y: 180 },
  { parent: atoms[2], x: 340, y: 120 }
]

const atomById = Object.fromEntries(atoms.map(a => [a.id, a]))
const wrap = ref(null)
const tooltip = reactive({ visible: false, atom: null, screenX: 0, screenY: 0 })

function onEnter(atom, ev) {
  tooltip.visible = true
  tooltip.atom = atom
  const rect = wrap.value?.getBoundingClientRect?.()
  tooltip.screenX = rect ? ev.clientX - rect.left + 12 : ev.clientX
  tooltip.screenY = rect ? ev.clientY - rect.top + 12 : ev.clientY
}
function onLeaveAtom() { tooltip.visible = false; tooltip.atom = null }
function onLeaveAll() { tooltip.visible = false; tooltip.atom = null }
function onMouseMove(ev) {
  if (!tooltip.visible || !tooltip.atom) return
  const rect = wrap.value?.getBoundingClientRect?.()
  if (!rect) return
  tooltip.screenX = ev.clientX - rect.left + 12
  tooltip.screenY = ev.clientY - rect.top + 12
}
</script>

<style scoped>
.mol-wrapper { position: relative; display: inline-block; background: white; padding: 12px; border-radius: 12px; box-shadow: 0 4px 18px rgba(0,0,0,.08); }
.mol-svg { display: block; max-width: 100%; height: auto; }

.bond { stroke: #222; stroke-width: 2; stroke-linecap: round; }
.bond-double { stroke: #222; stroke-width: 1.5; stroke-linecap: round; } /* dupla mais fina */
.bond-h { stroke: #888; stroke-width: 1.5; }

.hydrogen-label { font-size: 12px; fill: #555; }
.atom { fill: #fff; stroke: #222; stroke-width: 2; cursor: pointer; transition: stroke 120ms ease, fill 120ms ease; }
.atom-symbol { font-size: 12px; font-weight: 700; fill: #222; }
.mol-tooltip { position: absolute; background: var(--vp-c-bg);; border: 1px solid #ddd; border-radius: 8px; padding: 8px 10px; box-shadow: 0 6px 18px rgba(0,0,0,.12); pointer-events: none; white-space: nowrap; }
.mol-tooltip-title { font-weight: 700; margin-bottom: 6px; }
.mol-tooltip-body .muted { color: #666; margin-top: 4px; font-size: 13px; }
</style>
