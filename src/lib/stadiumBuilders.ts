import * as THREE from 'three';

// ===================== MATERIALS =====================
export const MATERIALS = {
  ground: new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.9 }),
  field: new THREE.MeshStandardMaterial({ color: 0x2d4a2d, roughness: 0.95 }),
  concrete: new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.7 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.4, metalness: 0.6 }),
  metalDark: new THREE.MeshStandardMaterial({ color: 0x2a2a35, roughness: 0.5, metalness: 0.4 }),
  stageDark: new THREE.MeshStandardMaterial({ color: 0x1a0a2e, roughness: 0.3, emissive: 0x4a148c, emissiveIntensity: 0.15 }),
  ledScreen: new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff00ff, emissiveIntensity: 0.5 }),
  vipFloor: new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.12, roughness: 0.6 }),
  platinoFloor: new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.1, roughness: 0.6 }),
  generalFloor: new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.08, roughness: 0.6 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xe0ac69, roughness: 0.6 }),
  darkFabric: new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.8 }),
};

// ===================== PERSONS =====================
export function createPerson(color: number): THREE.Group {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const skin = MATERIALS.skin;
  const fabric = MATERIALS.darkFabric;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skin);
  head.position.y = 0.62;
  group.add(head);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.5, 8), bodyMat);
  body.position.y = 0.28;
  group.add(body);

  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6), bodyMat);
  armL.position.set(-0.2, 0.3, 0);
  armL.rotation.z = 0.3;
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6), bodyMat);
  armR.position.set(0.2, 0.3, 0);
  armR.rotation.z = -0.3;
  group.add(armR);

  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 6), fabric);
  legL.position.set(-0.08, -0.05, 0);
  group.add(legL);

  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 6), fabric);
  legR.position.set(0.08, -0.05, 0);
  group.add(legR);

  group.userData.head = head;
  group.userData.armL = armL;
  group.userData.armR = armR;
  return group;
}

export function createSinger(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, emissive: color, emissiveIntensity: 0.15 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), mat);
  head.position.y = 0.75;
  group.add(head);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.6, 8), mat);
  body.position.y = 0.34;
  group.add(body);

  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), mat);
  armL.position.set(-0.26, 0.38, 0);
  armL.rotation.z = 0.8;
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), mat);
  armR.position.set(0.26, 0.38, 0);
  armR.rotation.z = -0.8;
  group.add(armR);

  const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  mic.position.set(0.18, 0.3, 0.12);
  group.add(mic);

  group.userData.head = head;
  group.userData.armL = armL;
  group.userData.armR = armR;
  return group;
}

export function createVendor(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), MATERIALS.skin);
  head.position.y = 0.62;
  group.add(head);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.5, 8), mat);
  body.position.y = 0.28;
  group.add(body);

  return group;
}

// ===================== STADIUM STRUCTURES =====================

export function createStadiumRing(): THREE.Group {
  const ring = new THREE.Group();

  // Outer wall — segmented stands
  const segments = 24;
  const ringRadius = 40;
  const standHeight = 12;
  const tierDepth = 10;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const nextAngle = ((i + 1) / segments) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;

    // Skip segments for stage opening (front) and entry gates
    const stageGap = Math.abs(midAngle) < 0.35;
    if (stageGap) continue;

    const arcLen = ringRadius * (nextAngle - angle);
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(arcLen + 0.5, standHeight, tierDepth),
      new THREE.MeshStandardMaterial({ color: 0x2a2a38, roughness: 0.7 }),
    );
    seg.position.set(
      Math.cos(midAngle) * (ringRadius + tierDepth / 2),
      standHeight / 2,
      Math.sin(midAngle) * (ringRadius + tierDepth / 2),
    );
    seg.rotation.y = -midAngle + Math.PI / 2;
    seg.castShadow = true;
    seg.receiveShadow = true;
    ring.add(seg);

    // Seating rows (colored steps)
    const tiers = 5;
    for (let t = 0; t < tiers; t++) {
      const tierRow = new THREE.Mesh(
        new THREE.BoxGeometry(arcLen + 0.3, 0.5, 1.5),
        new THREE.MeshStandardMaterial({
          color: [0x1a3a5a, 0x2a4a6a, 0x3a5a7a, 0x4a6a8a, 0x5a7a9a][t],
          roughness: 0.8,
        }),
      );
      tierRow.position.set(
        Math.cos(midAngle) * (ringRadius + t * 1.8),
        0.5 + t * 1.8,
        Math.sin(midAngle) * (ringRadius + t * 1.8),
      );
      tierRow.rotation.y = -midAngle + Math.PI / 2;
      ring.add(tierRow);
    }

    // Roof canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(arcLen + 0.4, 0.3, 4),
      new THREE.MeshStandardMaterial({ color: 0x1a1a28, roughness: 0.4, emissive: 0x222244, emissiveIntensity: 0.1 }),
    );
    canopy.position.set(
      Math.cos(midAngle) * (ringRadius + tierDepth / 2),
      standHeight + 0.2,
      Math.sin(midAngle) * (ringRadius + tierDepth / 2),
    );
    canopy.rotation.y = -midAngle + Math.PI / 2;
    ring.add(canopy);

    // Roof LED strip
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(arcLen + 0.4, 0.15, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 }),
    );
    ledStrip.position.set(
      Math.cos(midAngle) * (ringRadius + tierDepth / 2),
      standHeight + 0.5,
      Math.sin(midAngle) * (ringRadius + tierDepth / 2 - 1.5),
    );
    ledStrip.rotation.y = -midAngle + Math.PI / 2;
    ledStrip.userData.isLED = true;
    ring.add(ledStrip);
  }

  return ring;
}

export function createFloodlights(): THREE.Group[] {
  const lights: THREE.Group[] = [];
  const positions = [
    { x: -25, z: -25 },
    { x: 25, z: -25 },
    { x: -25, z: 25 },
    { x: 25, z: 25 },
  ];

  positions.forEach((pos) => {
    const tower = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 20, 8),
      MATERIALS.metalDark,
    );
    pole.position.y = 10;
    pole.castShadow = true;
    tower.add(pole);

    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x888899, emissive: 0xffffaa, emissiveIntensity: 0.3 }),
    );
    panel.position.y = 21;
    panel.lookAt(0, 5, 0);
    tower.add(panel);

    tower.position.set(pos.x, 0, pos.z);
    lights.push(tower);
  });

  return lights;
}

export function createStage(): { group: THREE.Group; ledScreen: THREE.Mesh } {
  const group = new THREE.Group();

  // Stage platform
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(20, 2, 10),
    MATERIALS.stageDark,
  );
  platform.position.set(0, 1, -18);
  platform.castShadow = true;
  platform.receiveShadow = true;
  group.add(platform);

  // Stage backdrop
  const backdrop = new THREE.Mesh(
    new THREE.BoxGeometry(22, 10, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x0a0a1a, roughness: 0.3 }),
  );
  backdrop.position.set(0, 6, -22.5);
  group.add(backdrop);

  // LED screen
  const ledScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 8),
    MATERIALS.ledScreen.clone(),
  );
  ledScreen.position.set(0, 6, -22.2);
  group.add(ledScreen);

  // Stage edge light strips
  [0xff006e, 0x00ffff, 0xfeca57].forEach((c, i) => {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(20.5, 0.12, 0.12),
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9 }),
    );
    strip.position.set(0, 0.15 + i * 0.2, -13);
    group.add(strip);
  });

  // Speaker towers
  [-11, 11].forEach((x) => {
    for (let i = 0; i < 5; i++) {
      const speaker = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.8, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 }),
      );
      speaker.position.set(x, 1 + i * 2, -15);
      speaker.castShadow = true;
      group.add(speaker);
    }
  });

  return { group, ledScreen };
}

export function createEntranceGate(x: number, color: number, label: string): THREE.Group {
  const gate = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.5, metalness: 0.3 });

  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5, 8), mat);
  postL.position.set(-2, 2.5, 0);
  postL.castShadow = true;
  gate.add(postL);

  const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5, 8), mat);
  postR.position.set(2, 2.5, 0);
  postR.castShadow = true;
  gate.add(postR);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }),
  );
  top.position.set(0, 5, 0);
  gate.add(top);

  // Sign box
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x111118, emissive: color, emissiveIntensity: 0.2 }),
  );
  sign.position.set(0, 5.5, 0.3);
  gate.add(sign);

  gate.userData.label = label;
  gate.userData.gateColor = color;
  gate.position.set(x, 0, 32);
  return gate;
}

export function createBuilding(
  x: number,
  z: number,
  w: number,
  h: number,
  d: number,
  color: number,
  emissive: number,
  label: string,
  roofColor?: number,
): THREE.Group {
  const group = new THREE.Group();

  // Main body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 }),
  );
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Glowing trim
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.1, 0.2, d + 0.1),
    new THREE.MeshStandardMaterial({ color: emissive, emissive: emissive, emissiveIntensity: 0.6 }),
  );
  trim.position.y = h + 0.15;
  group.add(trim);

  // Roof
  if (roofColor !== undefined) {
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(w, d) * 0.7, 1.5, 4),
      new THREE.MeshStandardMaterial({ color: roofColor, emissive: roofColor, emissiveIntensity: 0.15 }),
    );
    roof.position.y = h + 1;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
  }

  // Door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x111118, emissive: emissive, emissiveIntensity: 0.15 }),
  );
  door.position.set(0, 1.25, d / 2 + 0.05);
  group.add(door);

  group.position.set(x, 0, z);
  group.userData.label = label;
  return group;
}

export function createPortableToilet(x: number, z: number): THREE.Group {
  const group = new THREE.Group();

  const colors = [0x2d8fd6, 0x6b2d8f, 0x2d8f6b, 0xd67b2d];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.3, 1.2),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5 }),
  );
  body.position.y = 1.15;
  body.castShadow = true;
  group.add(body);

  // Door line
  const doorLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.05, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x222222 }),
  );
  doorLine.position.set(0, 1.2, 0.61);
  group.add(doorLine);

  // Vent
  const vent = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.15, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x111111 }),
  );
  vent.position.set(0, 2.1, 0.61);
  group.add(vent);

  group.position.set(x, 0, z);
  return group;
}

export function createFoodStand(x: number, z: number, color: number): THREE.Group {
  const group = new THREE.Group();

  // Counter
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 1.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.5 }),
  );
  counter.position.y = 0.6;
  counter.castShadow = true;
  group.add(counter);

  // Counter top glow
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.1, 1.1),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 }),
  );
  top.position.y = 1.25;
  group.add(top);

  // Umbrella
  const umbrella = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 1, 8),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.15 }),
  );
  umbrella.position.y = 2.8;
  group.add(umbrella);

  // Pole
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 2.5, 6),
    new THREE.MeshStandardMaterial({ color: 0x666666 }),
  );
  pole.position.y = 1.8;
  group.add(pole);

  group.position.set(x, 0, z);
  return group;
}
