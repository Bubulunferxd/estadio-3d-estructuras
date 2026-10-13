import { Pila, type StackItem } from '@/lib/structures';
import { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, RotateCcw, Armchair, LogOut, Sofa } from 'lucide-react';

interface AsientosPanelProps {
  pila: Pila<StackItem>;
  onChange: () => void;
}

const PERSON_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1', '#f368e0', '#ff9f43', '#54a0ff'];
const NAMES = ['Ana', 'Beto', 'Carla', 'David', 'Eva', 'Frank', 'Gina', 'Hugo'];

let seatCounter = 0;

export default function AsientosPanel({ pila, onChange }: AsientosPanelProps) {
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 7));
  }

  function sentarse() {
    const color = PERSON_COLORS[seatCounter % PERSON_COLORS.length];
    const name = NAMES[seatCounter % NAMES.length];
    seatCounter++;
    const item: StackItem = {
      id: Date.now() + seatCounter,
      label: name,
      color,
      icon: 'person',
    };
    pila.push(item);
    addLog(`${name} se sentó (PUSH) — quedó en el tope de la pila`);
    onChange();
  }

  function levantar() {
    const item = pila.pop();
    if (item) {
      addLog(`${item.label} se levantó (POP) — era el último en sentarse, primero en irse`);
    } else {
      addLog('Pila vacía — nadie sentado');
    }
    onChange();
  }

  function clear() {
    pila.clear();
    seatCounter = 0;
    addLog('Pila vaciada');
    onChange();
  }

  const items = [...pila.items].reverse();

  return (
    <div className="space-y-4">
      <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">Estructura: Pila (LIFO)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          En los asientos del estadio, las personas se sientan una sobre otra en una fila estrecha.
          El <strong>primero en sentarse</strong> queda hasta el fondo, y para retirarse debe esperar
          a que se levanten todos los que llegaron después. <strong>Último en entrar, primero en salir.</strong>
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={sentarse}
          className="bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <Armchair className="w-4 h-4" /> Sentarse (Push)
        </button>
        <button
          onClick={levantar}
          className="bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Levantarse (Pop)
        </button>
        <button
          onClick={clear}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg px-3 py-2 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Visualization */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col-reverse items-center justify-end min-h-[200px]">
          <div className="text-xs text-slate-500 mb-2">↑ Fondo (primer en sentarse, último en salir)</div>
          <div className="w-52 border-2 border-dashed border-slate-600 rounded-t-lg pt-1 flex flex-col-reverse gap-1 min-h-[80px]">
            {items.length === 0 ? (
              <div className="text-center text-slate-600 text-sm py-6">Sin personas sentadas</div>
            ) : (
              items.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-md px-3 py-2.5 text-center text-sm font-medium text-white transition-all ${
                    i === 0 ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900 scale-105' : ''
                  }`}
                  style={{ backgroundColor: p.color }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Sofa className="w-3 h-3" />
                    {p.label}
                  </div>
                  {i === 0 && <div className="text-[10px] opacity-80 mt-0.5">Tope — se levanta primero</div>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-44 flex flex-col">
          <div className="text-xs text-slate-500 mb-2 font-semibold">Operaciones:</div>
          <div className="space-y-1.5 overflow-y-auto max-h-[180px]">
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
        <span>Personas sentadas: <span className="text-cyan-400 font-bold">{pila.size}</span></span>
        <span>Push/Pop: O(1)</span>
      </div>
    </div>
  );
}
