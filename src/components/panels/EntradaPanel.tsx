import { Cola, type QueueItem } from '@/lib/structures';
import { useState } from 'react';
import { Users, ArrowRight, RotateCcw, UserPlus, Ticket as TicketIcon } from 'lucide-react';

interface EntradaPanelProps {
  cola: Cola<QueueItem>;
  onChange: () => void;
}

const COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1', '#f368e0', '#ff9f43', '#54a0ff'];
const NAMES = ['Ana', 'Beto', 'Carla', 'David', 'Eva', 'Frank', 'Gina', 'Hugo', 'Iris', 'Juan'];
let entryCounter = 0;

export default function EntradaPanel({ cola, onChange }: EntradaPanelProps) {
  const [log, setLog] = useState<string[]>([]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 7));
  }

  function llegar() {
    const color = COLORS[entryCounter % COLORS.length];
    const name = NAMES[entryCounter % NAMES.length];
    entryCounter++;
    const item: QueueItem = { id: Date.now() + entryCounter, label: name, color, icon: 'person' };
    cola.enqueue(item);
    addLog(`${name} llegó con su ticket (ENQUEUE) — se puso al final de la fila`);
    onChange();
  }

  function entrar() {
    const item = cola.dequeue();
    if (item) {
      addLog(`${item.label} entró al concierto (DEQUEUE) — primero en llegar, primero en entrar`);
    } else {
      addLog('Fila vacía — nadie esperando');
    }
    onChange();
  }

  function clear() {
    cola.clear();
    entryCounter = 0;
    addLog('Fila limpiada');
    onChange();
  }

  const items = cola.items;

  return (
    <div className="space-y-4">
      <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">Estructura: Cola (FIFO)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Con el ticket en mano, las personas hacen fila para entrar al concierto.
          <strong> El primero que compró ticket es el primero en llegar</strong> y por tanto el primero en entrar.
          Cada nueva persona se coloca al final. FIFO: primero en entrar, primero en salir.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={llegar}
          className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> Llegar con ticket (Enqueue)
        </button>
        <button
          onClick={entrar}
          className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <TicketIcon className="w-4 h-4" /> Entrar (Dequeue)
        </button>
        <button
          onClick={clear}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg px-3 py-2 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Queue visualization with stadium gate */}
      <div className="flex items-stretch gap-3">
        {/* Stadium entrance */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="w-20 h-28 bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-emerald-500 rounded-lg flex flex-col items-center justify-center">
            <TicketIcon className="w-7 h-7 text-emerald-400 mb-1" />
            <span className="text-[10px] text-emerald-300 font-bold">ENTRADA</span>
            <span className="text-[10px] text-emerald-300">ESTADIO</span>
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
                          i === 0 ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-slate-900 scale-105' : ''
                        }`}
                        style={{ backgroundColor: p.color }}
                      >
                        {p.label}
                        {i === 0 && <div className="text-[10px] opacity-80 mt-0.5">¡Entra ahora!</div>}
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
          <div className="w-20 h-28 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-slate-600" />
          </div>
        </div>
      </div>

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
        <span>En fila: <span className="text-emerald-400 font-bold">{cola.size}</span></span>
        <span>Enqueue: O(1) | Dequeue: O(1)</span>
      </div>
    </div>
  );
}
