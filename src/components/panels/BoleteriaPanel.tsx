import { ListaTickets, type ZoneType, type TicketNode } from '@/lib/structures';
import { useState, useRef } from 'react';
import { Ticket, Trash2, Plus, List, ArrowRight, UserCheck } from 'lucide-react';

const ZONE_STYLES: Record<ZoneType, { bg: string; border: string; label: string; color: string }> = {
  vip: { bg: 'bg-amber-400', border: 'border-amber-400', label: 'VIP', color: '#fbbf24' },
  platino: { bg: 'bg-slate-400', border: 'border-slate-400', label: 'PLATINO', color: '#94a3b8' },
  general: { bg: 'bg-cyan-400', border: 'border-cyan-400', label: 'GENERAL', color: '#22d3ee' },
};

interface BoleteriaPanelProps {
  lista: ListaTickets;
  onChange: () => void;
}

export default function BoleteriaPanel({ lista, onChange }: BoleteriaPanelProps) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState<ZoneType>('general');
  const [registered, setRegistered] = useState<TicketNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function comprar() {
    if (!name.trim()) return;
    const s = ZONE_STYLES[zone];
    const ticket = lista.comprar(name.trim(), zone, s.color);
    setRegistered(ticket);
    setName('');
    onChange();
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }, 50);
    setTimeout(() => setRegistered(null), 3000);
  }

  function remover(id: number) {
    lista.remover(id);
    onChange();
  }

  const all = lista.all;

  return (
    <div className="space-y-4">
      {/* Explanation */}
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <List className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">Estructura: Lista Enlazada</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Cuando alguien compra un ticket en línea, se <strong>registra</strong> al final de la lista.
          Cada nodo contiene los datos del comprador y un puntero (<code className="text-amber-300">next</code>) al siguiente ticket.
          Así se mantiene el orden de registro: el primero que compra queda primero en la lista.
        </p>
      </div>

      {/* Registration form */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400" /> Registrar compra de ticket
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && comprar()}
            placeholder="Nombre del comprador..."
            className="flex-1 bg-slate-900 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-amber-400 focus:outline-none"
          />
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value as ZoneType)}
            className="bg-slate-900 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none"
          >
            <option value="vip">VIP — $100</option>
            <option value="platino">Platino — $60</option>
            <option value="general">General — $30</option>
          </select>
          <button
            onClick={comprar}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-sm rounded-lg px-4 py-2 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Registrar
          </button>
        </div>

        {registered && (
          <div className="bg-amber-400/20 border border-amber-400/40 rounded-lg p-2.5 text-xs text-amber-200 animate-pulse">
            Registrado: <strong>{registered.name}</strong> compró ticket #{registered.id} para zona {ZONE_STYLES[registered.zone].label}. Nodo agregado al final de la lista.
          </div>
        )}
      </div>

      {/* Linked list visualization */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Lista de tickets registrados (Lista Enlazada)</h3>
        {all.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm bg-slate-800/50 rounded-xl">
            No hay tickets vendidos. Registra el primero arriba.
          </div>
        ) : (
          <div ref={scrollRef} className="flex items-center gap-1 overflow-x-auto pb-3">
            <div className="text-xs text-slate-500 flex-shrink-0 mr-1">HEAD →</div>
            {all.map((p, i) => {
              const s = ZONE_STYLES[p.zone];
              return (
                <div key={p.id} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`relative bg-slate-800 border-2 ${s.border} rounded-lg px-3 py-2 min-w-[110px]`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Ticket className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">#{p.id}</span>
                    </div>
                    <div className="text-white text-sm font-semibold truncate max-w-[95px]">{p.name}</div>
                    <div className={`inline-block text-[10px] px-1.5 py-0.5 rounded mt-1 font-bold text-black ${s.bg}`}>
                      {s.label}
                    </div>
                    <button
                      onClick={() => remover(p.id)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-400 text-white rounded-full p-0.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="text-[9px] text-slate-600 mt-1 font-mono">next → {p.next ?? 'null'}</div>
                  </div>
                  {i < all.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
                </div>
              );
            })}
            <div className="text-slate-600 text-sm flex-shrink-0 ml-1">∅ NULL</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
        <span>Total: <span className="text-amber-400 font-bold">{lista.size}</span> tickets</span>
        <span>Inserción: O(n)</span>
        <span>Eliminación: O(n)</span>
      </div>
    </div>
  );
}
