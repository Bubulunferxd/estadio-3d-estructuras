import { useState, useMemo } from 'react';
import StadiumScene, { type LocationId } from '@/components/ConcertScene';
import LocationModal from '@/components/LocationModal';
import BoleteriaPanel from '@/components/panels/BoleteriaPanel';
import AsientosPanel from '@/components/panels/AsientosPanel';
import BanosPanel from '@/components/panels/BanosPanel';
import ComidaPanel from '@/components/panels/ComidaPanel';
import GuardarropaPanel from '@/components/panels/GuardarropaPanel';
import EntradaPanel from '@/components/panels/EntradaPanel';
import ZonasPanel from '@/components/panels/ZonasPanel';
import { ListaTickets, Pila, Cola, type StackItem, type QueueItem } from '@/lib/structures';
import {
  Music, Info, X, Ticket, Armchair, DoorOpen, UtensilsCrossed, Shirt,
  TreePine, Users, MapPin, List, Layers,
} from 'lucide-react';

const LOCATIONS: {
  id: LocationId;
  label: string;
  subtitle: string;
  structure: string;
  icon: typeof Ticket;
  color: string;
}[] = [
  { id: 'boleteria', label: 'Boletería', subtitle: 'Compra de tickets en línea', structure: 'Lista Enlazada', icon: Ticket, color: '#fbbf24' },
  { id: 'asientos', label: 'Asientos', subtitle: 'Sentarse y retirarse del estadio', structure: 'Pila (LIFO)', icon: Armchair, color: '#48dbfb' },
  { id: 'banos', label: 'Baños Portátiles', subtitle: 'Fila individual — FIFO', structure: 'Cola (FIFO)', icon: DoorOpen, color: '#2d8fd6' },
  { id: 'comida', label: 'Puestos de Comida', subtitle: 'Apilar vasos, platos, gorras', structure: 'Pila (LIFO)', icon: UtensilsCrossed, color: '#ff6b6b' },
  { id: 'guardarropa', label: 'Guardarropa', subtitle: 'Depositar y retirar abrigos', structure: 'Pila (LIFO)', icon: Shirt, color: '#a78bfa' },
  { id: 'zonas', label: 'Zonas del Estadio', subtitle: 'Jerarquía VIP, Platino, General', structure: 'Árbol', icon: TreePine, color: '#22d3ee' },
];

export default function App() {
  const lista = useMemo(() => new ListaTickets(), []);
  const pilaAsientos = useMemo(() => new Pila<StackItem>(), []);
  const colaBanos = useMemo(() => new Cola<QueueItem>(), []);
  const pilaComida = useMemo(() => new Pila<StackItem>(), []);
  const pilaGuardarropa = useMemo(() => new Pila<StackItem>(), []);
  const colaEntrada = useMemo(() => new Cola<QueueItem>(), []);

  const [activeLocation, setActiveLocation] = useState<LocationId | null>(null);
  const [, forceUpdate] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  function refresh() {
    forceUpdate((n) => n + 1);
  }

  const soldCounts = useMemo(() => {
    const counts = { vip: 0, platino: 0, general: 0 };
    lista.all.forEach((p) => { counts[p.zone]++; });
    return counts;
  }, [lista.size, lista]);

  const crowdCount = useMemo(() => ({
    vip: Math.max(soldCounts.vip, 8),
    platino: Math.max(soldCounts.platino, 15),
    general: Math.max(soldCounts.general, 25),
  }), [soldCounts]);

  const activeLoc = LOCATIONS.find((l) => l.id === activeLocation);

  function renderPanel() {
    if (!activeLocation) return null;
    switch (activeLocation) {
      case 'boleteria': return <BoleteriaPanel lista={lista} onChange={refresh} />;
      case 'asientos': return <AsientosPanel pila={pilaAsientos} onChange={refresh} />;
      case 'banos': return <BanosPanel cola={colaBanos} onChange={refresh} />;
      case 'comida': return <ComidaPanel pila={pilaComida} onChange={refresh} />;
      case 'guardarropa': return <GuardarropaPanel pila={pilaGuardarropa} onChange={refresh} />;
      case 'zonas': return <ZonasPanel soldCounts={soldCounts} />;
      default: return null;
    }
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent truncate">
              Estadio 3D Interactivo
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Estructuras de datos: Lista, Pila, Cola y Árbol</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-400">VIP: <span className="text-white font-semibold">{soldCounts.vip}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-slate-400">Platino: <span className="text-white font-semibold">{soldCounts.platino}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400">General: <span className="text-white font-semibold">{soldCounts.general}</span></span>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Info className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* 3D Scene — full screen */}
      <div className="relative flex-1 min-h-0">
        <StadiumScene
          activeLocation={activeLocation}
          onLocationClick={(id) => setActiveLocation(id)}
          crowdCount={crowdCount}
        />

        {/* Controls hint */}
        <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md rounded-xl px-3 py-2 text-xs text-slate-300 pointer-events-none">
          <div className="font-semibold text-white mb-1">Controles</div>
          <div>Arrastra: rotar cámara</div>
          <div>Rueda: zoom</div>
          <div className="text-amber-400 mt-1">Clic en esferas brillantes</div>
        </div>

        {/* Location buttons — bottom bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-slate-900/85 backdrop-blur-md rounded-xl p-1.5 max-w-[95vw] overflow-x-auto">
          {LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const isActive = activeLocation === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(isActive ? null : loc.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive ? 'text-slate-950' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                style={isActive ? { backgroundColor: loc.color } : undefined}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{loc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location modal */}
      {activeLoc && (
        <LocationModal
          title={activeLoc.label}
          subtitle={activeLoc.subtitle}
          structure={activeLoc.structure}
          accentColor={activeLoc.color}
          icon={<activeLoc.icon className="w-5 h-5" style={{ color: activeLoc.color }} />}
          onClose={() => setActiveLocation(null)}
        >
          {renderPanel()}
        </LocationModal>
      )}

      {/* Welcome info modal */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-cyan-400 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Bienvenido al Estadio 3D</h2>
              </div>
              <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              Explora un estadio en 3D mientras aprendes cuatro estructuras de datos fundamentales.
              Haz clic en las <span className="text-amber-400 font-semibold">esferas brillantes</span> del estadio
              o usa los botones de abajo para abrir cada ubicación:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {LOCATIONS.map((loc) => {
                const Icon = loc.icon;
                return (
                  <button
                    key={loc.id}
                    onClick={() => { setActiveLocation(loc.id); setShowInfo(false); }}
                    className="text-left bg-slate-800 hover:bg-slate-750 rounded-xl p-4 border-l-4 transition-all hover:scale-[1.02]"
                    style={{ borderColor: loc.color }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" style={{ color: loc.color }} />
                      <h3 className="font-semibold text-white text-sm">{loc.label}</h3>
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${loc.color}20`, color: loc.color }}>
                        {loc.structure}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{loc.subtitle}</p>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-400">
                <span className="text-white font-semibold">Zonas:</span> VIP (dorada, frente al escenario) ·
                Platino (plateada, centro) · General (cian, atrás). Cada zona tiene su propia puerta de entrada.
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90 text-white font-semibold rounded-xl py-3 transition-opacity"
            >
              Empezar a explorar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
