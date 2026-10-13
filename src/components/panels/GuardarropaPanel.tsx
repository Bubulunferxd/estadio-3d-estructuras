import { Pila, type StackItem } from '@/lib/structures';
import { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, RotateCcw, Shirt, Package } from 'lucide-react';

interface GuardarropaPanelProps {
  pila: Pila<StackItem>;
  onChange: () => void;
}

const GARMENTS = [
  { label: 'Chamarra de cuero', color: '#8b5cf6' },
  { label: 'Abrigo negro', color: '#475569' },
  { label: 'Chompa roja', color: '#ef4444' },
  { label: 'Bufanda verde', color: '#22c55e' },
  { label: 'Gorra azul', color: '#3b82f6' },
  { label: 'Campera deportiva', color: '#f59e0b' },
  { label: 'Suéter gris', color: '#94a3b8' },
  { label: 'Panamá', color: '#10b981' },
];

let garmentCounter = 0;

export default function GuardarropaPanel({ pila, onChange }: GuardarropaPanelProps) {
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 7));
  }

  function depositar() {
    const g = GARMENTS[garmentCounter % GARMENTS.length];
    garmentCounter++;
    const item: StackItem = {
      id: Date.now() + garmentCounter,
      label: g.label,
      color: g.color,
      icon: 'shirt',
    };
    pila.push(item);
    addLog(`Se depositó: ${g.label} (PUSH) — se colocó encima de la pila`);
    onChange();
  }

  function retirar() {
    const item = pila.pop();
    if (item) {
      addLog(`Se retiró: ${item.label} (POP) — último en depositarse, primero en retirarse`);
    } else {
      addLog('Guardarropa vacío — nada que retirar');
    }
    onChange();
  }

  function clear() {
    pila.clear();
    garmentCounter = 0;
    addLog('Guardarropa vaciado');
    onChange();
  }

  const items = [...pila.items].reverse();

  return (
    <div className="space-y-4">
      <div className="bg-violet-400/10 border border-violet-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-violet-400">Estructura: Pila (LIFO)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          En el guardarropa, las personas <strong>depositan</strong> sus abrigos uno sobre otro en un mostrador.
          El primer abrigo queda hasta el fondo. Para retirar el tuyo, los que están encima deben retirarse primero.
          <strong> Último en entrar, primero en salir.</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={depositar}
          className="bg-violet-400 hover:bg-violet-300 text-violet-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <Shirt className="w-4 h-4" /> Depositar (Push)
        </button>
        <button
          onClick={retirar}
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <ArrowDown className="w-4 h-4" /> Retirar (Pop)
        </button>
        <button
          onClick={clear}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg px-3 py-2 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Wardrobe shelf visualization */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col-reverse items-center justify-end min-h-[220px]">
          <div className="text-xs text-slate-500 mb-2">↑ Fondo del mostrador (primer abrigo depositado)</div>
          <div className="w-56 bg-slate-800/50 border-2 border-violet-500/40 rounded-t-lg pt-1 flex flex-col-reverse gap-1 min-h-[80px]">
            {items.length === 0 ? (
              <div className="text-center text-slate-600 text-sm py-8">Guardarropa vacío</div>
            ) : (
              items.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-lg px-3 py-2 text-center text-sm font-medium text-white transition-all ${
                    i === 0 ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-slate-900 scale-105' : ''
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    {p.label}
                  </div>
                  {i === 0 && <div className="text-[10px] opacity-80 mt-0.5">Tope — se retira primero</div>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-44 flex flex-col">
          <div className="text-xs text-slate-500 mb-2 font-semibold">Operaciones:</div>
          <div className="space-y-1.5 overflow-y-auto max-h-[200px]">
            {log.length === 0 ? (
              <div className="text-xs text-slate-600">Sin operaciones</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="text-xs text-slate-300 bg-slate-800 rounded-lg px-2 py-1.5">
                  {entry}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
        <span>Abrigos: <span className="text-violet-400 font-bold">{pila.size}</span></span>
        <span>Push/Pop: O(1)</span>
      </div>
    </div>
  );
}
