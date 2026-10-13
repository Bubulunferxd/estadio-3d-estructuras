import { Cola, type QueueItem } from '@/lib/structures';
import { useState } from 'react';
import { Users, ArrowRight, RotateCcw, UserPlus, DoorOpen } from 'lucide-react';

interface BanosPanelProps {
  cola: Cola<QueueItem>;
  onChange: () => void;
}

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1', '#f368e0', '#ff9f43', '#54a0ff'];
const NAMES = ['Ana', 'Beto', 'Carla', 'David', 'Eva', 'Frank', 'Gina', 'Hugo', 'Iris', 'Juan'];
let banoCounter = 0;

export default function BanosPanel({ cola, onChange }: BanosPanelProps) {
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 7));
  }

  function llegar() {
    const color = COLORS[banoCounter % COLORS.length];
    const name = NAMES[banoCounter % NAMES.length];
    banoCounter++;
    const item: QueueItem = { id: Date.now() + banoCounter, label: name, color, icon: 'person' };
    cola.enqueue(item);
    addLog(`${name} llegó al baño (ENQUEUE) — se puso al final de la fila`);
    onChange();
  }

  function entrar() {
    const item = cola.dequeue();
    if (item) {
      addLog(`${item.label} entró al baño (DEQUEUE) — era el primero en la fila`);
    } else {
      addLog('Fila vacía — nadie esperando');
    }
    onChange();
  }

  function clear() {
    cola.clear();
    banoCounter = 0;
    addLog('Fila limpiada');
    onChange();
  }

  const items = cola.items;

  return (
    <div className="space-y-4">
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">Estructura: Cola (FIFO)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Los baños portátiles del concierto son individuales. Las personas hacen fila afuera
          y <strong>la primera en llegar es la primera en entrar</strong> (FIFO). Cada nueva persona
          se coloca al final de la fila. No se puede "saltar" la cola.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={llegar}
          className="bg-blue-400 hover:bg-blue-300 text-blue-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> Llegar (Enqueue)
        </button>
        <button
          onClick={entrar}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <DoorOpen className="w-4 h-4" /> Entrar (Dequeue)
        </button>
        <button
          onClick={clear}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg px-3 py-2 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Queue visualization with toilet door */}
      <div className="flex items-stretch gap-3">
        {/* Toilet */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="w-16 h-24 bg-blue-900 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center">
            <DoorOpen className="w-6 h-6 text-blue-400 mb-1" />
            <span className="text-[10px] text-blue-300 font-semibold">BAÑO</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 font-semibold">FRENTE</span>
        </div>

        {/* Queue */}
        <div className="flex-1 overflow-x-auto">
          <div className="h-full flex items-center gap-1">
            {items.length > 0 ? (
              <>
                <ArrowRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <div className="flex gap-1.5">
                  {items.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-1.5 flex-shrink-0">
                      <div
                        className={`rounded-lg px-3 py-3 text-center text-sm font-medium text-white min-w-[80px] transition-all ${
                          i === 0 ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 scale-105' : ''
                        }`}
                        style={{ backgroundColor: p.color }}
                      >
                        {p.label}
                        {i === 0 && <div className="text-[10px] opacity-80 mt-0.5">¡Próximo!</div>}
                      </div>
                      {i < items.length - 1 && <span className="text-slate-600">→</span>}
                    </div>
                  ))}
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
              </>
            ) : (
              <div className="text-slate-600 text-sm flex-1 text-center">Fila vacía</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-amber-400 mb-1 font-semibold">FINAL</span>
          <div className="w-16 h-24 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="text-xs text-slate-500 mb-2 font-semibold">Operaciones:</div>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
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
        <span>Esperando: <span className="text-blue-400 font-bold">{cola.size}</span></span>
        <span>Enqueue: O(1)</span>
        <span>Dequeue: O(1)</span>
      </div>
    </div>
  );
}
