import { Suspense, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import './HeroScene.css';
import {
  PALETTE,
  rng,
  Tree,
  Bush,
  Person,
  Kite,
  Windsock,
  Cart,
  Bench,
  Dog,
  Blanket,
} from './scene3d/parts';

/*
 * The hero scene as real 3D rather than a drawing of one.
 *
 * A generated image would give render fidelity but kill the motion —
 * a bitmap cannot spin its own pinwheel. Actual geometry gives both:
 * true depth, a single key light casting real shadows across the
 * field, and every object still independently animated.
 *
 * The canvas is transparent, so the page's cream shows through as sky
 * and fog fades the distance into it.
 */

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Ground() {
  const r = rng(4242);
  const tufts = Array.from({ length: 90 }, () => ({
    x: (r() - 0.5) * 74,
    z: (r() - 0.5) * 34 - 4,
    s: 0.5 + r() * 0.7,
    dark: r() > 0.6,
  }));

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 120]} />
        <meshStandardMaterial color={PALETTE.grass} roughness={1} metalness={0} />
      </mesh>
      {/* low mounds so the ground is not a flat sheet */}
      {[
        [-22, -16, 7],
        [16, -20, 9],
        [34, -12, 6],
        [-38, -22, 8],
      ].map(([x, z, s], i) => (
        <mesh key={i} position={[x, -1.2, z]} scale={[s, 1.1, s * 0.7]} receiveShadow castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={PALETTE.grassDeep} roughness={1} metalness={0} flatShading />
        </mesh>
      ))}
      {tufts.map((t, i) => (
        <mesh key={i} position={[t.x, 0.12 * t.s, t.z]} scale={t.s} castShadow>
          <coneGeometry args={[0.09, 0.42, 4]} />
          <meshStandardMaterial
            color={t.dark ? '#5B8C45' : '#7FB463'}
            roughness={1}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function Hills() {
  const rows: Array<{ z: number; color: string; scale: number; y: number }> = [
    { z: -58, color: PALETTE.indigo, scale: 1.35, y: -2 },
    { z: -46, color: PALETTE.periwinkle, scale: 1.1, y: -2 },
    { z: -36, color: PALETTE.teal, scale: 0.85, y: -1.6 },
  ];
  const r = rng(77);
  return (
    <group>
      {rows.map((row, ri) =>
        Array.from({ length: 9 }, (_, i) => {
          const x = -60 + i * 15 + (r() - 0.5) * 8;
          const h = (6 + r() * 7) * row.scale;
          return (
            <mesh key={`${ri}-${i}`} position={[x, row.y, row.z]} scale={[h * 1.7, h, h * 1.2]}>
              <coneGeometry args={[1, 1, 5]} />
              <meshStandardMaterial color={row.color} roughness={1} metalness={0} flatShading />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function Crowd() {
  const s = PALETTE.skin;
  const h = PALETTE.hair;
  return (
    <group>
      {/* picnic pair, mid-left */}
      <Blanket position={[-7.5, 0.02, 3]} rotation={0.2} color={PALETTE.indigo} />
      <Person position={[-8.3, 0, 3.4]} rotation={0.7} seated shirt={PALETTE.mustard} pants={PALETTE.periwinkle} skin={s[0]} hair={h[0]} />
      <Person position={[-6.6, 0, 2.6]} rotation={-2.4} seated shirt={PALETTE.coral} pants={PALETTE.teal} skin={s[2]} hair={h[1]} />

      {/* picnic single, mid-right */}
      <Blanket position={[6.5, 0.02, 4.2]} rotation={-0.15} color={PALETTE.mustard} />
      <Person position={[6.2, 0, 4.4]} rotation={-0.4} seated shirt={PALETTE.periwinkle} pants={PALETTE.mustard} skin={s[0]} hair={h[2]} />

      {/* the kite flyer, arms up, bouncing */}
      <Person position={[-1.6, 0, 1.2]} rotation={-0.3} bob={0.12} shirt={PALETTE.periwinkle} pants={PALETTE.coral} skin={s[2]} hair={h[0]} />

      {/* couple strolling */}
      <Person position={[11.5, 0, 1.4]} rotation={-1.1} shirt={PALETTE.coral} pants={PALETTE.indigo} skin={s[0]} hair={h[1]} />
      <Person position={[12.6, 0, 1.9]} rotation={-1.1} shirt={PALETTE.periwinkle} pants={PALETTE.mustard} skin={s[2]} hair={h[2]} />

      {/* vendor at the cart */}
      <Person position={[17.8, 0, 0.4]} rotation={-1.9} shirt={PALETTE.mustard} pants={PALETTE.teal} skin={s[0]} hair={h[0]} />

      {/* two by the kite rack, left */}
      <Person position={[-15.5, 0, 0.2]} rotation={1.2} shirt={PALETTE.teal} pants={PALETTE.coral} skin={s[1]} hair={h[0]} />
      <Person position={[-14.2, 0, 1.1]} rotation={0.9} shirt={PALETTE.mustard} pants={PALETTE.periwinkle} skin={s[2]} hair={h[1]} />
    </group>
  );
}

/* Aims the camera slightly upward so the horizon sits near the middle
   of the band: level with the crowd, with sky above for the kites,
   rather than staring down at an empty apron of grass. */
function CameraRig() {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.lookAt(0, 4.85, -4);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Scene() {
  return (
    <>
      <CameraRig />
      {/* warm bounce + a single low key light, as a paper set would be lit */}
      <hemisphereLight args={['#FFF6E2', '#7FA35C', 1.05]} />
      <directionalLight
        position={[-14, 20, 12]}
        intensity={2.1}
        color="#FFF3DC"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={30}
        shadow-camera-bottom={-20}
        shadow-camera-far={90}
        shadow-bias={-0.0006}
      />
      <fog attach="fog" args={['#F3EEDF', 34, 96]} />

      <Hills />
      <Ground />

      <Tree position={[9.5, 0, -3]} scale={1.25} seed={3} />
      <Tree position={[20, 0, -6]} scale={1.05} seed={9} />
      <Tree position={[-19, 0, -5]} scale={0.95} seed={15} />
      <Tree position={[-27, 0, -9]} scale={0.8} seed={21} />
      <Bush position={[13.5, 0, -1.5]} scale={1.1} />
      <Bush position={[-22, 0, -2]} scale={0.9} />
      <Bush position={[24, 0, -3]} scale={1} />

      <Windsock position={[-11.5, 0, -1.5]} />
      <Cart position={[19, 0, 1]} rotation={-0.35} />
      <Bench position={[2.5, 0, -1.5]} rotation={0.1} />
      <Dog position={[3.5, 0, 5]} />

      <Crowd />

      <Kite position={[3, 8.4, -6]} color={PALETTE.indigo} accent={PALETTE.mustard} anchor={[-1.4, 1.6, 1.2]} speed={0.7} />
      <Kite position={[-13, 10.2, -10]} color={PALETTE.teal} accent="#A9D3D3" anchor={[-15, 1.5, 0.4]} speed={0.5} sway={0.3} />
      <Kite position={[14, 9.6, -12]} color={PALETTE.coral} accent="#F0A088" anchor={[12, 1.5, 1.6]} speed={0.62} />
      <Kite position={[24, 7.8, -8]} color={PALETTE.mustard} accent="#F5D68C" anchor={[18, 1.6, 0.6]} speed={0.8} sway={0.18} />
    </>
  );
}

export function HeroScene3D() {
  return (
    <div className="kite-scene kite-scene--3d" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 4.4, 23], fov: 36 }}
        frameloop={REDUCED ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
