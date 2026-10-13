import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  MATERIALS,
  createPerson,
  createSinger,
  createVendor,
  createStadiumRing,
  createFloodlights,
  createStage,
  createEntranceGate,
  createBuilding,
  createPortableToilet,
  createFoodStand,
} from '@/lib/stadiumBuilders';

export type LocationId =
  | 'boleteria'
  | 'asientos'
  | 'banos'
  | 'comida'
  | 'guardarropa'
  | 'zonas';

interface Hotspot {
  id: LocationId;
  mesh: THREE.Object3D;
  position: THREE.Vector3;
}

interface StadiumSceneProps {
  activeLocation: LocationId | null;
  onLocationClick: (id: LocationId) => void;
  crowdCount: { vip: number; platino: number; general: number };
}

const ZONE_COLORS = { vip: 0xfbbf24, platino: 0x94a3b8, general: 0x22d3ee };
const SINGER_COLORS = [0xff6b6b, 0xfeca57, 0x48dbfb];
const PERSON_NAMES = ['Ana', 'Beto', 'Carla', 'David', 'Eva', 'Frank', 'Gina', 'Hugo', 'Iris', 'Juan', 'Karl', 'Lena', 'Mark', 'Nora', 'Otto', 'Pia', 'Quin', 'Rosa', 'Sergio', 'Tina'];

export default function StadiumScene({ activeLocation, onLocationClick, crowdCount }: StadiumSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeLocRef = useRef(activeLocation);
  const onLocClickRef = useRef(onLocationClick);
  const crowdRef = useRef(crowdCount);

  activeLocRef.current = activeLocation;
  onLocClickRef.current = onLocationClick;
  crowdRef.current = crowdCount;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a14, 50, 140);
    scene.background = new THREE.Color(0x05050a);

    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 400);
    camera.position.set(0, 30, 55);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ===== LIGHTING =====
    scene.add(new THREE.AmbientLight(0x404060, 1.0));
    const moonLight = new THREE.DirectionalLight(0x8090ff, 0.5);
    moonLight.position.set(30, 50, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(1024, 1024);
    scene.add(moonLight);

    // Stage spotlights
    const spotColors = [0xff6b6b, 0xfeca57, 0x48dbfb, 0xff9ff3];
    spotColors.forEach((c, i) => {
      const spot = new THREE.SpotLight(c, 2.0, 60, Math.PI / 8, 0.4, 1.5);
      const angle = (i / spotColors.length) * Math.PI * 2;
      spot.position.set(Math.cos(angle) * 14, 18, Math.sin(angle) * 14 - 10);
      spot.target.position.set(0, 2, -18);
      spot.castShadow = true;
      scene.add(spot);
      scene.add(spot.target);
    });

    // ===== GROUND =====
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), MATERIALS.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Field / pitch area
    const field = new THREE.Mesh(new THREE.CircleGeometry(35, 32), MATERIALS.field);
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.01;
    field.receiveShadow = true;
    scene.add(field);

    // ===== STADIUM RING (stands) =====
    scene.add(createStadiumRing());

    // ===== FLOODLIGHTS =====
    createFloodlights().forEach((fl) => scene.add(fl));

    // ===== STAGE =====
    const { group: stageGroup, ledScreen } = createStage();
    scene.add(stageGroup);

    // Singers
    const singers: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const singer = createSinger(SINGER_COLORS[i]);
      singer.position.set(-6 + i * 6, 2, -18);
      singer.userData.phase = i * 2;
      scene.add(singer);
      singers.push(singer);
    }

    // ===== ZONE FLOORS =====
    const vipFloor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), MATERIALS.vipFloor);
    vipFloor.rotation.x = -Math.PI / 2;
    vipFloor.position.set(0, 0.02, -8);
    vipFloor.userData.zone = 'vip';
    scene.add(vipFloor);

    const platinoFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), MATERIALS.platinoFloor);
    platinoFloor.rotation.x = -Math.PI / 2;
    platinoFloor.position.set(0, 0.02, 4);
    platinoFloor.userData.zone = 'platino';
    scene.add(platinoFloor);

    const generalFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), MATERIALS.generalFloor);
    generalFloor.rotation.x = -Math.PI / 2;
    generalFloor.position.set(0, 0.02, 18);
    generalFloor.userData.zone = 'general';
    scene.add(generalFloor);

    // Zone barriers
    const vipBarrier = new THREE.Mesh(
      new THREE.BoxGeometry(12.5, 0.5, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.3 }),
    );
    vipBarrier.position.set(0, 0.25, -3);
    scene.add(vipBarrier);

    // ===== ENTRANCE GATES =====
    createEntranceGate(-16, ZONE_COLORS.vip, 'VIP').position.set(-16, 0, 32);
    scene.add(createEntranceGate(-16, ZONE_COLORS.vip, 'VIP'));
    scene.add(createEntranceGate(0, ZONE_COLORS.platino, 'PLATINO'));
    scene.add(createEntranceGate(16, ZONE_COLORS.general, 'GENERAL'));

    // ===== CLICKABLE BUILDINGS / HOTSPOTS =====
    const hotspots: Hotspot[] = [];

    // Boleteria (ticket booth) — left side
    const boleteria = createBuilding(-32, 10, 5, 3.5, 4, 0x2a2a3a, 0xfbbf24, 'Boletería', 0xfbbf24);
    scene.add(boleteria);
    hotspots.push({ id: 'boleteria', mesh: boleteria, position: new THREE.Vector3(-32, 4, 10) });

    // Guardarropa — right side
    const guardarropa = createBuilding(32, 10, 5, 3.5, 4, 0x2a2a3a, 0xa78bfa, 'Guardarropa', 0xa78bfa);
    scene.add(guardarropa);
    hotspots.push({ id: 'guardarropa', mesh: guardarropa, position: new THREE.Vector3(32, 4, 10) });

    // Puestos de comida — food stands
    const foodPositions = [
      { x: -30, z: -8, color: 0xff6b6b },
      { x: 30, z: -8, color: 0xfeca57 },
      { x: -30, z: 22, color: 0x48dbfb },
      { x: 30, z: 22, color: 0xff9ff3 },
    ];
    const foodGroup = new THREE.Group();
    foodPositions.forEach((f) => {
      const stand = createFoodStand(f.x, f.z, f.color);
      foodGroup.add(stand);
    });
    scene.add(foodGroup);
    hotspots.push({ id: 'comida', mesh: foodGroup, position: new THREE.Vector3(-30, 3, 22) });

    // Baños portátiles — back area
    const toiletGroup = new THREE.Group();
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const toilet = createPortableToilet(-14 + col * 2.5, 28 + row * 2);
        toiletGroup.add(toilet);
      }
    }
    scene.add(toiletGroup);
    hotspots.push({ id: 'banos', mesh: toiletGroup, position: new THREE.Vector3(-10, 3, 29) });

    // Asientos (seating area) — the stands
    const seatingMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.01),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    seatingMarker.position.set(20, 8, 20);
    scene.add(seatingMarker);
    hotspots.push({ id: 'asientos', mesh: seatingMarker, position: new THREE.Vector3(20, 8, 20) });

    // Zonas (zone area marker)
    const zoneMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.01),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    zoneMarker.position.set(0, 0.5, 4);
    scene.add(zoneMarker);
    hotspots.push({ id: 'zonas', mesh: zoneMarker, position: new THREE.Vector3(0, 0.5, 4) });

    // ===== FLOATING GLOW MARKERS above each hotspot =====
    const glowMarkers: { mesh: THREE.Mesh; baseY: number; hotspotId: LocationId }[] = [];
    hotspots.forEach((h) => {
      const colors: Record<LocationId, number> = {
        boleteria: 0xfbbf24,
        asientos: 0x48dbfb,
        banos: 0x2d8fd6,
        comida: 0xff6b6b,
        guardarropa: 0xa78bfa,
        zonas: 0x22d3ee,
      };
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshStandardMaterial({
          color: colors[h.id],
          emissive: colors[h.id],
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.8,
        }),
      );
      glow.position.copy(h.position);
      glow.position.y += 2.5;
      glow.userData.hotspotId = h.id;
      scene.add(glow);
      glowMarkers.push({ mesh: glow, baseY: glow.position.y, hotspotId: h.id });

      // Pulsing ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.08, 8, 24),
        new THREE.MeshStandardMaterial({ color: colors[h.id], emissive: colors[h.id], emissiveIntensity: 0.6, transparent: true, opacity: 0.5 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(glow.position);
      ring.position.y -= 0.5;
      ring.userData.hotspotId = h.id;
      scene.add(ring);
      glowMarkers.push({ mesh: ring, baseY: ring.position.y, hotspotId: h.id });
    });

    // ===== CROWD =====
    const crowdGroups: { vip: THREE.Group[]; platino: THREE.Group[]; general: THREE.Group[] } = {
      vip: [],
      platino: [],
      general: [],
    };

    const zoneAreaMap = {
      vip: { x: 0, z: -8, w: 10, d: 8 },
      platino: { x: 0, z: 4, w: 14, d: 10 },
      general: { x: 0, z: 18, w: 22, d: 12 },
    };

    function syncCrowd() {
      const counts = crowdRef.current;
      (Object.keys(crowdGroups) as ('vip' | 'platino' | 'general')[]).forEach((zone) => {
        const target = counts[zone];
        const current = crowdGroups[zone];
        while (current.length > target) {
          const p = current.pop();
          if (p) scene.remove(p);
        }
        while (current.length < target) {
          const a = zoneAreaMap[zone];
          const color = new THREE.Color().setHSL(Math.random(), 0.6, 0.5);
          const person = createPerson(color.getHex());
          person.position.set(
            a.x + (Math.random() - 0.5) * a.w * 0.85,
            0,
            a.z + (Math.random() - 0.5) * a.d * 0.85,
          );
          person.lookAt(0, 2, -18);
          person.userData.phase = Math.random() * Math.PI * 2;
          person.userData.zone = zone;
          scene.add(person);
          current.push(person);
        }
      });
    }
    syncCrowd();

    // Vendors near food stands
    foodPositions.forEach((f) => {
      const vendor = createVendor(f.color);
      vendor.position.set(f.x, 0, f.z - 1.5);
      vendor.lookAt(0, 0, 0);
      scene.add(vendor);
    });

    // ===== PARTICLES =====
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 300;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 100;
      particlePos[i * 3 + 1] = Math.random() * 40 + 8;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true, opacity: 0.4 }),
    );
    scene.add(particles);

    // ===== INTERACTION =====
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clickableMeshes = glowMarkers.map((g) => g.mesh);

    function getClickableMeshes(): THREE.Object3D[] {
      return glowMarkers.map((g) => g.mesh);
    }

    function onCanvasClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(getClickableMeshes(), true);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const hotspotId = obj.userData.hotspotId as LocationId;
        if (hotspotId) {
          onLocClickRef.current(hotspotId);
        }
      }
    }
    renderer.domElement.addEventListener('click', onCanvasClick);

    function onCanvasMove(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(getClickableMeshes(), true);
      renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    }
    renderer.domElement.addEventListener('mousemove', onCanvasMove);

    // Camera orbit
    let cameraAngle = 0;
    let cameraRadius = 55;
    let cameraHeight = 30;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetAngle = 0;
    let targetHeight = 30;
    let autoRotate = true;

    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      autoRotate = false;
    }
    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;
      targetAngle += (e.clientX - lastX) * 0.005;
      targetHeight = Math.max(8, Math.min(50, targetHeight - (e.clientY - lastY) * 0.1));
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onPointerUp() {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 4000);
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      cameraRadius = Math.max(25, Math.min(80, cameraRadius + e.deltaY * 0.05));
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener('resize', onResize);

    // ===== ANIMATION LOOP =====
    let frameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (autoRotate) targetAngle += 0.002;
      cameraAngle += (targetAngle - cameraAngle) * 0.08;
      cameraHeight += (targetHeight - cameraHeight) * 0.08;
      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.lookAt(0, 5, 0);

      // Singers
      singers.forEach((singer) => {
        const phase = singer.userData.phase as number;
        (singer.userData.head as THREE.Mesh).position.y = 0.75 + Math.sin(t * 3 + phase) * 0.06;
        (singer.userData.armL as THREE.Mesh).rotation.z = 0.8 + Math.sin(t * 4 + phase) * 0.25;
        (singer.userData.armR as THREE.Mesh).rotation.z = -0.8 - Math.sin(t * 4 + phase) * 0.25;
      });

      // Crowd
      const allCrowd = [...crowdGroups.vip, ...crowdGroups.platino, ...crowdGroups.general];
      allCrowd.forEach((person) => {
        const phase = person.userData.phase as number;
        const zone = person.userData.zone as 'vip' | 'platino' | 'general';
        const intensity = zone === 'vip' ? 1.5 : zone === 'platino' ? 1.0 : 0.7;
        person.position.y = Math.abs(Math.sin(t * 2.5 + phase)) * 0.18 * intensity;
        (person.userData.armL as THREE.Mesh).rotation.z = 0.3 + Math.sin(t * 3 + phase) * 0.35;
        (person.userData.armR as THREE.Mesh).rotation.z = -0.3 - Math.sin(t * 3 + phase) * 0.35;
      });

      // LED screen color cycle
      const ledMat = ledScreen.material as THREE.MeshStandardMaterial;
      ledMat.emissive.setHSL((t * 0.15) % 1, 0.9, 0.4);

      // Glow markers pulse
      glowMarkers.forEach((g) => {
        const isActive = activeLocRef.current === g.hotspotId;
        const pulse = Math.sin(t * 2.5) * 0.15 + 0.85;
        if (g.mesh.geometry instanceof THREE.TorusGeometry) {
          g.mesh.scale.setScalar(pulse * (isActive ? 1.5 : 1));
          (g.mesh.material as THREE.MeshStandardMaterial).opacity = isActive ? 0.9 : 0.4;
        } else {
          g.mesh.scale.setScalar(pulse * (isActive ? 1.4 : 1));
          (g.mesh.material as THREE.MeshStandardMaterial).opacity = isActive ? 1.0 : 0.7;
        }
      });

      // Particles drift
      const ppos = particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        ppos.array[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.015;
      }
      ppos.needsUpdate = true;

      syncCrowd();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onCanvasClick);
      renderer.domElement.removeEventListener('mousemove', onCanvasMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full bg-slate-950" />;
}
