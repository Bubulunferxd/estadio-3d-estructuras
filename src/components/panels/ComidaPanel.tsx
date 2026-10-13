import { Pila, type StackItem } from '@/lib/structures';
import { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, RotateCcw, Coffee, Shirt, IceCream } from 'lucide-react';

interface ComidaPanelProps {
  pila: Pila<StackItem>;
  onChange: () => void;
}

const ITEMS = [
  { label: 'Vaso de cerveza', color: '#feca57', icon: 'beer' },
  { label: 'Plato de pizza', color: '#ff6b6b', icon: 'pizza' },
  { label: 'Gorra', color: '#48dbfb', icon: 'cap' },
  { label: 'Remera', color: '#ff9ff3', icon: 'shirt' },
  { label: 'Vaso de soda', color: '#1dd1a1', icon: 'soda' },
  { label: 'Hot dog', color: '#ff9f43', icon: 'hotdog' },
  { label: 'Bandera', color: '#54a0ff', icon: 'flag' },
  { label: 'Gorro', color: '#f368e0', icon: 'beanie' },
];

let foodCounter = 0;

export default function ComidaPanel({ pila, onChange }: ComidaPanelProps) {
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 7));
  }

  function apilar() {
    const item = ITEMS[foodCounter % ITEMS.length];
    foodCounter++;
    const stackItem: StackItem = {
      id: Date.now() + foodCounter,
      label: item.label,
      color: item.color,
      icon: item.icon,
    };
    pila.push(stackItem);
    addLog(`Se apiló: ${item.label} (PUSH) — quedó en el tope`);
    onChange();
  }

  function desapilar() {
    const item = pila.pop();
    if (item) {
      addLog(`Se vendió: ${item.label} (POP) — último en apilarse, primero en venderse`);
    } else {
      addLog('Pila vacía — nada que vender');
    }
    onChange();
  }

  function clear() {
    pila.clear();
    foodCounter = 0;
    addLog('Pila vaciada');
    onChange();
  }

  const items = [...pila.items].reverse();

  function getIcon(iconName: string) {
    if (iconName === 'beer' || iconName === 'soda') return <Coffee className="w-3.5 h-3.5" />;
    if (iconName === 'shirt') return <Shirt className="w-3.5 h-3.5" />;
    return <IceCream className="w-3.5 h-3.5" />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-rose-400/10 border border-rose-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-semibold text-rose-400">Estructura: Pila (LIFO)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          En los puestos de comida, ropa y bebidas, los productos se <strong>apilan</strong> uno sobre otro.
          Los vasos, platos, gorras y remeras se acomodan del primero al último.
          Cuando se vende uno, se toma el de arriba: <strong>el último en apilarse es el primero en venderse.</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={apilar}
          className="bg-rose-400 hover:bg-rose-300 text-rose-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <ArrowUp className="w-4 h-4" /> Apilar producto (Push)
        </button>
        <button
          onClick={desapilar}
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <ArrowDown className="w-4 h-4" /> Vender (Pop)
        </button>
        <button
          onClick={clear}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg px-3 py-2 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Stack visualization as a shelf/counter */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col-reverse items-center justify-end min-h-[220px]">
          <div className="text-xs text-slate-500 mb-2">↑ Base del mostrador (primer producto apilado)</div>
          <div className="w-56 border-2 border-dashed border-slate-600 rounded-t-lg pt-1 flex flex-col-reverse gap-1 min-h-[80px]">
            {items.length === 0 ? (
              <div className="text-center text-slate-600 text-sm py-8">Mostrador vacío</div>
            ) : (
              items.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-lg px-3 py-2 text-center text-sm font-medium text-white transition-all ${
                    i === 0 ? 'ring-2 ring-rose-400 ring-offset-1 ring-offset-slate-900 scale-105' : ''
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {getIcon(p.icon)}
                    {p.label}
                  </div>
                  {i === 0 && <div className="text-[10px] opacity-80 mt-0.5">Tope — se vende primero</div>}
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
        <span>Productos en pila: <span className="text-rose-400 font-bold">{pila.size}</span></span>
        <span>Push/Pop: O(1)</span>
      </div>
    </div>
  );
}
