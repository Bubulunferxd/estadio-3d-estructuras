// Estructuras de datos para el concierto interactivo

export type ZoneType = 'vip' | 'platino' | 'general';

export interface Person {
  id: number;
  name: string;
  zone: ZoneType;
  color: string;
}

// ===================== LISTA (Compra de Tickets) =====================
export interface TicketNode extends Person {
  next: number | null;
  timestamp: number;
}

export class ListaTickets {
  head: TicketNode[] = [];
  private nextId = 1;

  comprar(name: string, zone: ZoneType, color: string): TicketNode {
    const ticket: TicketNode = {
      id: this.nextId++,
      name,
      zone,
      color,
      next: null,
      timestamp: Date.now(),
    };
    if (this.head.length > 0) {
      this.head[this.head.length - 1].next = ticket.id;
    }
    this.head.push(ticket);
    return ticket;
  }

  remover(id: number): void {
    const idx = this.head.findIndex((p) => p.id === id);
    if (idx === -1) return;
    if (idx > 0) {
      this.head[idx - 1].next = this.head[idx].next;
    }
    this.head.splice(idx, 1);
  }

  get all(): TicketNode[] {
    return [...this.head];
  }

  get size(): number {
    return this.head.length;
  }

  clear(): void {
    this.head = [];
    this.nextId = 1;
  }
}

// ===================== PILA (LIFO) =====================
export interface StackItem {
  id: number;
  label: string;
  color: string;
  icon: string;
}

export class Pila<T extends StackItem> {
  items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// ===================== COLA (FIFO) =====================
export interface QueueItem {
  id: number;
  label: string;
  color: string;
  icon: string;
}

export class Cola<T extends QueueItem> {
  items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// ===================== ÁRBOL (Jerarquía de Zonas) =====================
export interface TreeNode {
  id: string;
  label: string;
  type: 'root' | 'zone' | 'section' | 'row';
  color: string;
  capacity: number;
  sold: number;
  children: TreeNode[];
}

export function buildZoneTree(soldCounts: Record<string, number>): TreeNode {
  const vipSold = soldCounts['vip'] || 0;
  const platinoSold = soldCounts['platino'] || 0;
  const generalSold = soldCounts['general'] || 0;

  return {
    id: 'concierto',
    label: 'Estadio 3D',
    type: 'root',
    color: '#f59e0b',
    capacity: 600,
    sold: vipSold + platinoSold + generalSold,
    children: [
      {
        id: 'vip',
        label: 'Zona VIP',
        type: 'zone',
        color: '#fbbf24',
        capacity: 100,
        sold: vipSold,
        children: [
          { id: 'vip-a', label: 'Fila A', type: 'row', color: '#fbbf24', capacity: 25, sold: Math.min(vipSold, 25), children: [] },
          { id: 'vip-b', label: 'Fila B', type: 'row', color: '#fbbf24', capacity: 25, sold: Math.min(Math.max(vipSold - 25, 0), 25), children: [] },
          { id: 'vip-c', label: 'Fila C', type: 'row', color: '#fbbf24', capacity: 25, sold: Math.min(Math.max(vipSold - 50, 0), 25), children: [] },
          { id: 'vip-d', label: 'Fila D', type: 'row', color: '#fbbf24', capacity: 25, sold: Math.min(Math.max(vipSold - 75, 0), 25), children: [] },
        ],
      },
      {
        id: 'platino',
        label: 'Zona Platino',
        type: 'zone',
        color: '#94a3b8',
        capacity: 200,
        sold: platinoSold,
        children: [
          { id: 'platino-norte', label: 'Sección Norte', type: 'section', color: '#94a3b8', capacity: 100, sold: Math.min(platinoSold, 100), children: [] },
          { id: 'platino-sur', label: 'Sección Sur', type: 'section', color: '#94a3b8', capacity: 100, sold: Math.min(Math.max(platinoSold - 100, 0), 100), children: [] },
        ],
      },
      {
        id: 'general',
        label: 'Zona General',
        type: 'zone',
        color: '#22d3ee',
        capacity: 300,
        sold: generalSold,
        children: [
          { id: 'gen-izq', label: 'Lado Izquierdo', type: 'section', color: '#22d3ee', capacity: 150, sold: Math.min(generalSold, 150), children: [] },
          { id: 'gen-der', label: 'Lado Derecho', type: 'section', color: '#22d3ee', capacity: 150, sold: Math.min(Math.max(generalSold - 150, 0), 150), children: [] },
        ],
      },
    ],
  };
}
