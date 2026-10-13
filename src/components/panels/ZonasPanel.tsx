import { buildZoneTree, type TreeNode } from '@/lib/structures';
import { useState } from 'react';
import { TreePine } from 'lucide-react';

interface ZonasPanelProps {
  soldCounts: { vip: number; platino: number; general: number };
}

function getBarColor(node: TreeNode): string {
  const ratio = node.capacity > 0 ? node.sold / node.capacity : 0;
  if (ratio >= 0.85) return 'bg-rose-500';
  if (ratio >= 0.5) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getTextColor(node: TreeNode): string {
  const ratio = node.capacity > 0 ? node.sold / node.capacity : 0;
  if (ratio >= 0.85) return 'text-rose-400';
  if (ratio >= 0.5) return 'text-amber-400';
  return 'text-emerald-400';
}

function TreeNodeView({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const ratio = node.capacity > 0 ? Math.round((node.sold / node.capacity) * 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`relative rounded-xl px-4 py-2.5 border-2 transition-all ${
          hasChildren ? 'cursor-pointer hover:scale-105' : ''
        }`}
        style={{ borderColor: node.color, backgroundColor: `${node.color}15` }}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <span className="text-xs text-slate-400 w-4">{expanded ? '▼' : '▶'}</span>
          )}
          <div>
            <div className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.color }} />
              {node.label}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              <span className={getTextColor(node)}>{node.sold}</span>
              <span className="text-slate-500"> / {node.capacity}</span>
              <span className="ml-1 text-slate-600">({ratio}%)</span>
            </div>
          </div>
        </div>
        <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${getBarColor(node)} transition-all duration-500`} style={{ width: `${ratio}%` }} />
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">
          {node.type === 'root' && 'Nodo raíz'}
          {node.type === 'zone' && 'Zona'}
          {node.type === 'section' && 'Sección'}
          {node.type === 'row' && 'Fila'}
        </div>
      </div>

      {expanded && hasChildren && (
        <>
          <div className="w-px h-4" style={{ backgroundColor: node.color }} />
          <div className="flex gap-3 items-start flex-wrap justify-center">
            {node.children.map((child) => (
              <TreeNodeView key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ZonasPanel({ soldCounts }: ZonasPanelProps) {
  const tree = buildZoneTree(soldCounts);
  const totalSold = soldCounts.vip + soldCounts.platino + soldCounts.general;

  return (
    <div className="space-y-4">
      <div className="bg-violet-400/10 border border-violet-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <TreePine className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-violet-400">Estructura: Árbol</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          El estadio se organiza como un árbol: la <strong>raíz</strong> es el evento completo,
          las <strong>ramas</strong> son las zonas (VIP, Platino, General),
          y las <strong>hojas</strong> son las secciones y filas dentro de cada zona.
          Cada nodo tiene una capacidad y muestra cuántos tickets se han vendido.
        </p>
      </div>

      <div className="overflow-auto flex justify-center pt-2 pb-4 bg-slate-800/30 rounded-xl">
        <TreeNodeView node={tree} depth={0} />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
        <span>Total vendido: <span className="text-white font-bold">{totalSold}</span> / 600</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;50%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> 50-85%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;85%
        </span>
      </div>
    </div>
  );
}
