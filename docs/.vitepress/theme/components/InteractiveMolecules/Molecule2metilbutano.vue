    <template>
    <div class="mol-wrapper" ref="wrap" @pointermove="onPointerMove" @pointerleave="onLeaveAll">
        <svg
        class="mol-svg"
        width="560"
        height="250"
        viewBox="0 0 560 250"
        role="img"
        aria-label="Estrutura simplificada do 2-metilbutano (exemplo)"
        >
        <!-- Fundo branco (não captura eventos) -->
        <rect width="100%" height="100%" fill="white" pointer-events="none" />

        <!-- --- Círculo de destaque (por trás dos átomos) ---
            desenhado antes dos átomos e com pointer-events:none
            para nunca bloquear os eventos dos círculos -->
        <circle
        v-if="tooltip.visible && tooltip.atom"
        class="highlight"
        :cx="tooltip.atom.x"
        :cy="tooltip.atom.y"
        r="24"
        :fill="tooltip.atom.id === 'C5' ? 'rgba(0,0,200,0.15)' : 'rgba(0,200,0,0.15)'"
        />

        <!-- Ligações C–C -->
        <line
            v-for="(bond, i) in bonds"
            :key="i"
            :x1="bond.x1" :y1="bond.y1"
            :x2="bond.x2" :y2="bond.y2"
            class="bond"
        />

        <!-- Hidrogênios (camada de trás visualmente - desenhe antes se quiser) -->
        <g v-for="(h, index) in hydrogens" :key="'H' + index">
            <line :x1="h.parent.x" :y1="h.parent.y" :x2="h.x" :y2="h.y" class="bond-h" />
            <text :x="h.x" :y="h.y + 4" text-anchor="middle" class="hydrogen-label">H</text>
        </g>

        <!-- Átomos de carbono (estes recebem os eventos) -->
        <g v-for="atom in atoms" :key="atom.id">
            <circle
            class="atom"
            :cx="atom.x" :cy="atom.y" :r="12"
            @pointerenter="onEnter(atom, $event)"
            @pointerleave="onLeaveAtom"
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

    const wrap = ref(null)

    const molecule = { name: '2-metilbutano', formula: 'C5H12' }

    // Átomos (posições estilo zig-zag — ajuste se quiser)
    const atoms = [
    { id: 'C1', element: 'C', x: 80,  y: 120, tooltipTitle: 'C1', info: { classificacao: 'primário', hibridacao: 'sp3' } },
    { id: 'C2', element: 'C', x: 140, y: 80,  tooltipTitle: 'C2', info: { classificacao: 'secundário', hibridacao: 'sp3' } },
    { id: 'C3', element: 'C', x: 200, y: 120, tooltipTitle: 'C3', info: { classificacao: 'terciário', hibridacao: 'sp3' } ,}, 
    { id: 'C4', element: 'C', x: 260, y: 80,  tooltipTitle: 'C4', info: { classificacao: 'primário', hibridacao: 'sp3' } },
    { id: 'C5', element: 'C', x: 200, y: 192, tooltipTitle: 'C5 (metil)', info: { classificacao: 'primário', hibridacao: 'sp3', nota: 'Parte do grupo Metil' } }
    ]

    // Ligações (note que ligamos C3 ao C5 -> ramificação)
    const bonds = [
    { x1: atoms[0].x, y1: atoms[0].y, x2: atoms[1].x, y2: atoms[1].y }, // C1-C2
    { x1: atoms[1].x, y1: atoms[1].y, x2: atoms[2].x, y2: atoms[2].y }, // C2-C3
    { x1: atoms[2].x, y1: atoms[2].y, x2: atoms[3].x, y2: atoms[3].y }, // C3-C4
    { x1: atoms[2].x, y1: atoms[2].y, x2: atoms[4].x, y2: atoms[4].y }  // C3-C5 (ramificação)
    ]

    // Hidrogênios (exemplo posicionamento)
    const hydrogens = [
  // C1 (3 H)
  { parent: atoms[0], x: 60,  y: 100 }, 
  { parent: atoms[0], x: 60,  y: 140 }, 
  { parent: atoms[0], x: 100, y: 160 },

  // C2 (2 H) - em lados opostos
  { parent: atoms[1], x: 120, y: 60 }, 
  { parent: atoms[1], x: 160, y: 60 },

  // C3 (1 H) - abaixo
  { parent: atoms[2], x: 200, y: 80 },

  // C4 (3 H)
  { parent: atoms[3], x: 280, y: 60 }, 
  { parent: atoms[3], x: 280, y: 100 }, 
  { parent: atoms[3], x: 260, y: 50 },

  // C5 (3 H) - em cruz
  { parent: atoms[4], x: 200, y: 225 }, 
  { parent: atoms[4], x: 160, y: 195 }, 
  { parent: atoms[4], x: 240, y: 195 }
]   

    const tooltip = reactive({
    visible: false,
    atom: null,
    // screen coords para posicionar o tooltip HTML
    screenX: 0,
    screenY: 0
    })

    // Handlers
    function onEnter(atom, ev) {
    // NÃO reatribua tooltip por inteiro — altere propriedades
    tooltip.visible = true
    tooltip.atom = atom

    // posiciona o tooltip próximo ao ponteiro
    const rect = wrap.value?.getBoundingClientRect?.()
    if (rect) {
        tooltip.screenX = ev.clientX - rect.left + 12
        tooltip.screenY = ev.clientY - rect.top + 12
    } else {
        tooltip.screenX = ev.clientX
        tooltip.screenY = ev.clientY
    }
    }

    function onLeaveAtom() {
    // esconda apenas quando o ponteiro sair do átomo
    tooltip.visible = false
    tooltip.atom = null
    }

    function onLeaveAll() {
    tooltip.visible = false
    tooltip.atom = null
    }

    function onPointerMove(ev) {
    if (!tooltip.visible || !tooltip.atom) return
    const rect = wrap.value?.getBoundingClientRect?.()
    if (!rect) return
    tooltip.screenX = ev.clientX - rect.left + 12
    tooltip.screenY = ev.clientY - rect.top + 12
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

    /* SVG layout */
    .mol-svg { display: block; max-width: 100%; height: auto; }

    /* estilos das linhas */
    .bond { stroke: #222; stroke-width: 2; stroke-linecap: round; }
    .bond-h { stroke: #888; stroke-width: 1.5; }

    /* atoms: garantir que recebam eventos */
    .atom { fill: #fff; stroke: #222; stroke-width: 2; cursor: pointer; pointer-events: auto; transition: stroke 120ms ease, fill 120ms ease; }

    /* highlight (não captura eventos) */
    .highlight { pointer-events: none; }

    /* tooltip */
    .mol-tooltip {
    position: absolute;
    background: var(--vp-c-bg);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,.12);
    pointer-events: none;
    transform: translate(0,0);
    white-space: nowrap;
    }
    </style>
