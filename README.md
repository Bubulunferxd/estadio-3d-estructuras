# Estadio 3D Interactivo — Estructuras de Datos

Proyecto educativo que enseña las 4 estructuras de datos fundamentales (Lista, Pila, Cola y Árbol) mediante un estadio 3D interactivo construido con Three.js y React.

## Estructuras cubiertas

| Estructura | Ubicación en el estadio | Concepto |
|---|---|---|
| **Lista Enlazada** | Boletería | Cada ticket comprado se registra al final de la lista, con puntero `next` al siguiente nodo |
| **Pila (LIFO)** | Asientos, Puestos de Comida, Guardarropa | Último en entrar, primero en salir. Personas sentadas, productos apilados, abrigos depositados |
| **Cola (FIFO)** | Baños Portátiles, Entrada al estadio | Primero en llegar, primero en salir. Filas individuales |
| **Árbol** | Zonas del estadio | Jerarquía: Estadio → VIP/Platino/General → Secciones → Filas |

## Cómo usarlo

1. Haz clic en las **esferas brillantes** del estadio 3D para abrir cada ubicación
2. O usa los **botones inferiores** para navegar entre ubicaciones
3. En cada panel interactúa con las operaciones (Push/Pop, Enqueue/Dequeue, Comprar ticket)
4. **Arrastra** para rotar la cámara, **rueda del mouse** para zoom

## Requisitos previos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Previsualizar build de producción
npm run typecheck  # Verificar tipos de TypeScript
```

## Tecnologías

- React 18 + TypeScript
- Vite
- Three.js (renderizado 3D)
- Tailwind CSS (estilos)
- Lucide React (iconos)

## Estructura del proyecto

```
src/
├── App.tsx                    # Componente principal + navegación
├── lib/
│   ├── structures.ts          # Clases: ListaTickets, Pila, Cola, buildZoneTree
│   └── stadiumBuilders.ts     # Constructores de objetos 3D (estadio, stage, personas)
├── components/
│   ├── ConcertScene.tsx       # Escena 3D del estadio con hotspots clicables
│   ├── LocationModal.tsx      # Modal contenedor para cada ubicación
│   └── panels/
│       ├── BoleteriaPanel.tsx     # Lista enlazada — compra de tickets
│       ├── AsientosPanel.tsx      # Pila LIFO — sentarse/retirarse
│       ├── BanosPanel.tsx         # Cola FIFO — baños portátiles
│       ├── ComidaPanel.tsx        # Pila LIFO — apilar productos
│       ├── GuardarropaPanel.tsx   # Pila LIFO — depositar abrigos
│       ├── EntradaPanel.tsx       # Cola FIFO — entrada al estadio
│       └── ZonasPanel.tsx         # Árbol — jerarquía de zonas
```

## Licencia

MIT
