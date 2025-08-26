<template>
  <!-- Wrapper para posicionar o tooltip relativo ao SVG -->
  <div class="mol-wrapper" ref="wrap" @mousemove="onMouseMove">
    <svg
      class="mol-svg"
      width="420"
      height="180"
      viewBox="0 0 420 180"
      role="img"
      aria-label="Estrutura simplificada do etanol: C1-C2-OH"
    >
      <!-- Ligações (desenho bem simplificado, sem hidrogênios explícitos) -->
      <line :x1="atomById.C1.x + 12" :y1="atomById.C1.y"
            :x2="atomById.C2.x - 12" :y2="atomById.C2.y" class="bond" />
      <line :x1="atomById.C2.x + 12" :y1="atomById.C2.y"
            :x2="atomById.O1.x - 12" :y2="atomById.O1.y" class="bond" />

      <!-- Átomos (círculos). Só os carbonos são interativos no exemplo. -->
      <g v-for="atom in atoms" :key="atom.id">
        <circle
          :cx="atom.x" :cy="atom.y" :r="12"
          :class="['atom', atom.element, { active: isHover(atom) }]"
          @mouseenter="onEnter(atom)"
          @mouseleave="onLeave"
        />
        <!-- Rótulo do átomo (C1, C2, O) -->
        <text class="atom-label" :x="atom.x" :y="atom.y - 16" text-anchor="middle">
          {{ atom.id }}
        </text>
        <!-- Símbolo químico dentro do círculo -->
        <text class="atom-symbol" :x="atom.x" :y="atom.y + 4" text-anchor="middle">
          {{ atom.element }}
        </text>

        <!-- Dica rápida nativa do navegador (fallback instantâneo) -->
        <title>{{ atom.tooltipTitle }}</title>
      </g>

      <!-- Rótulo do grupo OH (apenas decorativo) -->
      <text class="group-label" :x="atomById.O1.x + 22" :y="atomById.O1.y + 6">H</text>
      <line :x1="atomById.O1.x + 8" :y1="atomById.O1.y"
            :x2="atomById.O1.x + 18" :y2="atomById.O1.y" class="bond" />
    </svg>

    <!-- Tooltip HTML bonitinho (aparece só ao passar o mouse em C1 ou C2) -->
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

/**
 * Por que SVG?
 * - Cada átomo é um nó independente (fácil de “escutar” eventos de hover).
 * - Escala perfeitamente (viewBox).
 * - Leve e rápido em páginas estáticas como VitePress.
 */

// Definição da molécula (aparece no tooltip)
const molecule = {
  name: 'Etanol',
  formula: 'C2H6O'
}

// Coordenadas simples em layout “em linha”: C1 — C2 — O
// Você pode reposicionar os pontos à vontade; é só mexer em x/y.
const atoms = [
  {
    id: 'C1', element: 'C', x: 80, y: 90,
    tooltipTitle: 'C1 (Carbono primário) — Etanol',
    info: {
      classificacao: 'Carbono primário (ligado a 1 C)',
      hibridacao: 'sp3 (~109,5°)',
      nota: 'Metílico (CH3) na cadeia.'
    }
  },
  {
    id: 'C2', element: 'C', x: 180, y: 90,
    tooltipTitle: 'C2 (Carbono secundário) — Etanol',
    info: {
      classificacao: 'Carbono secundário (ligado a 2 C)',
      hibridacao: 'sp3 (~109,5°)',
      nota: 'Vizinho do oxigênio: influencia polaridade e reatividade.'
    }
  },
  {
    id: 'O1', element: 'O', x: 280, y: 90,
    tooltipTitle: 'Oxigênio do grupo hidroxila (OH) — Etanol',
    info: { classificacao: 'Oxigênio', hibridacao: 'sp3', nota: 'Mostrado aqui só como referência.' }
  }
]

// Mapa de átomos por id (conveniência para desenhar ligações e rótulos)
const atomById = Object.fromEntries(atoms.map(a => [a.id, a]))

// Estado do tooltip (posições e átomo ativo)
const wrap = ref(null)
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  atom: null // {id, element, info, ...}
})

// Handlers de interação
function onEnter(atom) {
  // Só mostra tooltip “rico” para carbonos
  if (atom.element !== 'C') return
  tooltip.visible = true
  tooltip.atom = atom
}
function onLeave() {
  tooltip.visible = false
  tooltip.atom = null
}
function onMouseMove(e) {
  // Posiciona o tooltip perto do cursor dentro do wrapper
  const rect = wrap.value?.getBoundingClientRect?.()
  if (!rect) return
  tooltip.x = e.clientX - rect.left + 14
  tooltip.y = e.clientY - rect.top + 14
}
function isHover(atom) {
  return tooltip.visible && tooltip.atom && tooltip.atom.id === atom.id
}
</script>

<style scoped>
.mol-wrapper {
  position: relative;
  display: inline-block;
  /* Evita que o tooltip estoure para fora da página em exemplos estreitos */
  max-width: 100%;
}

.mol-svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Ligações: linhas simples */
.bond {
  stroke: #222;
  stroke-width: 2;
  stroke-linecap: round;
}

/* Átomos: círculos com leve contorno */
.atom {
  fill: #fff;
  stroke: #222;
  stroke-width: 2;
  cursor: default;
  transition: transform 120ms ease, stroke 120ms ease, fill 120ms ease;
}

/* Destaque no hover dos carbonos (quando tooltip ativo) */
.atom.C.active {
  transform: scale(1.12);
  fill: #f7f7f7;
  stroke: #111;
}

/* Cores semânticas simples (opcional) */
.atom.C { /* carbono */ }
.atom.O { stroke: #c62828; }  /* oxigênio com borda avermelhada */

/* Texto pequeno para rótulos */
.atom-label {
  font-size: 12px;
  fill: #555;
  user-select: none;
}
.atom-symbol {
  font-size: 12px;
  font-weight: 700;
  fill: #222;
  user-select: none;
}
.group-label {
  font-size: 14px;
  font-weight: 700;
  fill: #222;
  user-select: none;
}

/* Tooltip “rico” em HTML */
.mol-tooltip {
  position: absolute;
  min-width: 240px;
  max-width: 280px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);
  padding: 10px 12px;
  pointer-events: none; /* não roubar o hover do SVG */
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
