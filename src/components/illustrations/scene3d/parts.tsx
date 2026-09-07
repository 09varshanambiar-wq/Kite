import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';

/*
 * Scene furniture, built from primitives with flatShading so every face
 * catches the key light separately — that facetting is what reads as
 * folded paper rather than moulded plastic. Materials are fully rough
 * and non-metallic for the same reason.
 */

export const PALETTE = {
  indigo: '#2C42B4',
  indigoDeep: '#1B2E8C',
  periwinkle: '#4A6FC8',
  mustard: '#E8B84B',
  mustardDeep: '#C08F28',
  coral: '#E07A5F',
  coralDeep: '#B85742',
  teal: '#7FB3B3',
  cream: '#FBF6EA',
  paper: '#F3EEDF',
  grass: '#8CC069',
  grassDeep: '#6D9F4E',
  leaf: '#7FB463',
  leafDeep: '#5B8C45',
  bark: '#8A5F3C',
  skin: ['#E8B48A', '#D9A276', '#C98D5E'],
  hair: ['#5A4632', '#2E2419', '#8A5F3C'],
} as const;

/** Deterministic scatter, so the scene composes the same way every load. */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const paper = (color: string) => (
  <meshStandardMaterial color={color} roughness={1} metalness={0} flatShading />
);

export function Tree({
  position,
  scale = 1,
  seed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  seed?: number;
}) {
  const r = rng(seed);
  const tilt = (r() - 0.5) * 0.14;
  return (
    <group position={position} scale={scale} rotation={[0, r() * Math.PI, tilt]}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.24, 2.2, 6]} />
        {paper(PALETTE.bark)}
      </mesh>
      {/* three offset lobes read as foliage clusters, not one ball */}
      <mesh position={[0, 3.0, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        {paper(PALETTE.leaf)}
      </mesh>
      <mesh position={[0.85, 2.4, 0.3]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.95, 0]} />
        {paper(PALETTE.leafDeep)}
      </mesh>
      <mesh position={[-0.7, 2.6, -0.35]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.05, 0]} />
        {paper('#95C878')}
      </mesh>
    </group>
  );
}

export function Bush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        {paper(PALETTE.leafDeep)}
      </mesh>
      <mesh position={[0.4, 0.3, 0.15]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.42, 0]} />
        {paper(PALETTE.leaf)}
      </mesh>
    </group>
  );
}

export function Person({
  position,
  rotation = 0,
  shirt,
  pants,
  skin,
  hair,
  seated = false,
  bob = 0,
}: {
  position: [number, number, number];
  rotation?: number;
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  seated?: boolean;
  /** >0 makes them bounce, for the runner */
  bob?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current || !bob) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * bob;
    ref.current.rotation.z = Math.sin(t * 4) * 0.05;
  });

  const legLen = seated ? 0.34 : 0.62;
  const bodyY = seated ? 0.52 : 0.92;

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      {!seated && (
        <>
          <mesh position={[-0.11, legLen / 2, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, legLen, 6]} />
            {paper(pants)}
          </mesh>
          <mesh position={[0.11, legLen / 2, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, legLen, 6]} />
            {paper(pants)}
          </mesh>
        </>
      )}
      {seated && (
        <mesh position={[0, 0.16, 0.22]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.085, 0.5, 6]} />
          {paper(pants)}
        </mesh>
      )}
      {/* torso */}
      <mesh position={[0, bodyY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.26, seated ? 0.56 : 0.66, 7]} />
        {paper(shirt)}
      </mesh>
      {/* arms */}
      <mesh position={[-0.27, bodyY + 0.04, 0]} rotation={[0, 0, 0.28]} castShadow>
        <cylinderGeometry args={[0.055, 0.05, 0.5, 6]} />
        {paper(skin)}
      </mesh>
      <mesh position={[0.27, bodyY + 0.04, 0]} rotation={[0, 0, -0.28]} castShadow>
        <cylinderGeometry args={[0.055, 0.05, 0.5, 6]} />
        {paper(skin)}
      </mesh>
      {/* head */}
      <mesh position={[0, bodyY + 0.52, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.23, 0]} />
        {paper(skin)}
      </mesh>
      <mesh position={[0, bodyY + 0.6, -0.02]} castShadow>
        <icosahedronGeometry args={[0.21, 0]} />
        {paper(hair)}
      </mesh>
    </group>
  );
}

export function Kite({
  position,
  color,
  accent,
  anchor,
  speed = 1,
  sway = 0.22,
}: {
  position: [number, number, number];
  color: string;
  accent: string;
  /** ground point the line runs down to */
  anchor: [number, number, number];
  speed?: number;
  sway?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.z = Math.sin(t) * sway;
    ref.current.position.x = position[0] + Math.sin(t * 0.7) * 0.8;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
  });

  const linePoints = new Float32Array([
    position[0], position[1], position[2],
    anchor[0], anchor[1], anchor[2],
  ]);

  return (
    <>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9BFA6" transparent opacity={0.7} />
      </line>
      <group ref={ref} position={position}>
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.95, 0.95, 0.04]} />
          {paper(color)}
        </mesh>
        <mesh position={[0, 0.34, 0.03]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.04]} />
          {paper(accent)}
        </mesh>
        {/* ribbon tail */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.sin(i * 1.4) * 0.12, -0.75 - i * 0.34, 0]} castShadow>
            <boxGeometry args={[0.13, 0.24, 0.03]} />
            {paper(i % 2 ? accent : color)}
          </mesh>
        ))}
      </group>
    </>
  );
}

export function Pinwheel({ position, speed = 2 }: { position: [number, number, number]; speed?: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  const blades = [PALETTE.indigo, PALETTE.mustard, PALETTE.coral, PALETTE.teal];
  return (
    <group position={position}>
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 5]} />
        {paper('#D8CDB6')}
      </mesh>
      <group ref={ref}>
        {blades.map((c, i) => (
          <mesh key={i} rotation={[0, 0, (i / blades.length) * Math.PI * 2]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.28, 0.14, 0.02]} />
            {paper(c)}
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Windsock({ position }: { position: [number, number, number] }) {
  const sock = useRef<Group>(null);
  const cups = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (cups.current) cups.current.rotation.y += delta * 2.4;
    if (sock.current) sock.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.9) * 0.25;
  });
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 4.4, 6]} />
        {paper('#E4DAC5')}
      </mesh>
      <group ref={cups} position={[0, 4.5, 0]}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.42, 0, Math.sin(a) * 0.42]} castShadow>
              <icosahedronGeometry args={[0.15, 0]} />
              {paper(i === 0 ? PALETTE.teal : i === 1 ? PALETTE.indigo : '#80AFFF')}
            </mesh>
          );
        })}
      </group>
      <group ref={sock} position={[0, 3.6, 0]}>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.34, 1.4, 8, 1, true]} />
          <meshStandardMaterial color={PALETTE.indigo} roughness={1} metalness={0} flatShading side={2} />
        </mesh>
      </group>
    </group>
  );
}

export function Cart({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.9, 1.3]} />
        {paper('#A0714A')}
      </mesh>
      <mesh position={[0, 1.36, 0]} castShadow>
        <boxGeometry args={[2.7, 0.14, 1.4]} />
        {paper(PALETTE.bark)}
      </mesh>
      {/* striped awning */}
      {[-1, -0.5, 0, 0.5, 1].map((x, i) => (
        <mesh key={i} position={[x * 1.05, 2.25, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.52, 0.06, 1.5]} />
          {paper(i % 2 ? PALETTE.cream : [PALETTE.coral, PALETTE.indigo, PALETTE.mustard][i % 3])}
        </mesh>
      ))}
      <mesh position={[-1.2, 1.85, -0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 5]} />
        {paper('#D8CDB6')}
      </mesh>
      <mesh position={[1.2, 1.85, -0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 5]} />
        {paper('#D8CDB6')}
      </mesh>
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 0.42, 0.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 9]} />
          {paper(i ? PALETTE.indigo : PALETTE.mustard)}
        </mesh>
      ))}
      <Pinwheel position={[-0.7, 2.9, 0.4]} speed={2.4} />
      <Pinwheel position={[0.6, 2.75, 0.4]} speed={-1.8} />
    </group>
  );
}

export function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.1, 0.6]} />
        {paper(PALETTE.bark)}
      </mesh>
      <mesh position={[0, 0.9, -0.28]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[2.4, 0.44, 0.08]} />
        {paper('#9A6C44')}
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.5]} />
          {paper('#75502F')}
        </mesh>
      ))}
    </group>
  );
}

export function Dog({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(t * 0.55) * 2.4;
    ref.current.position.y = position[1] + Math.abs(Math.sin(t * 5)) * 0.06;
    ref.current.rotation.y = Math.cos(t * 0.55) > 0 ? 0 : Math.PI;
  });
  return (
    <group ref={ref} position={position} scale={0.62}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.95, 0.42, 0.4]} />
        {paper(PALETTE.cream)}
      </mesh>
      <mesh position={[0.6, 0.72, 0]} castShadow>
        <icosahedronGeometry args={[0.26, 0]} />
        {paper('#EFE2CC')}
      </mesh>
      <mesh position={[0.82, 0.66, 0]} castShadow>
        <boxGeometry args={[0.22, 0.16, 0.18]} />
        {paper('#A0714A')}
      </mesh>
      <mesh position={[0.52, 0.86, 0.16]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.1, 0.24, 0.06]} />
        {paper('#A0714A')}
      </mesh>
      <mesh position={[-0.55, 0.66, 0]} rotation={[0, 0, 0.9]} castShadow>
        <boxGeometry args={[0.1, 0.34, 0.08]} />
        {paper('#C79468')}
      </mesh>
      {[[-0.3, 0.16], [0.3, 0.16], [-0.3, -0.16], [0.3, -0.16]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.34, 5]} />
          {paper('#C79468')}
        </mesh>
      ))}
    </group>
  );
}

export function Blanket({
  position,
  rotation = 0,
  color,
}: {
  position: [number, number, number];
  rotation?: number;
  color: string;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={[3, 2.2]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  );
}
