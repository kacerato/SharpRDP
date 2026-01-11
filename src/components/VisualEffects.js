import React from 'react';
import { EffectComposer, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';

export function VisualEffects({ health, sanity }) {
  // Calcula intensidade baseada na vida (0 a 100)
  // Health 100 -> darkness 0.5 (normal)
  // Health 0 -> darkness 1.5 (very dark)
  const darkness = 0.5 + ((100 - health) / 100);
  const isCritical = health < 30;

  // Sanity Effects
  const isInsane = sanity < 50;

  return (
    <EffectComposer>
      <Vignette
        offset={0.3}
        darkness={darkness}
        eskil={false}
      />

      {/* Noise increases as Sanity drops */}
      <Noise opacity={isInsane ? 0.2 : 0.05} />

      {(isCritical || isInsane) && (
        <ChromaticAberration
          offset={[0.005, 0.005]} // Deslocamento RGB forte
          modulationOffset={0.5}
        />
      )}
    </EffectComposer>
  );
}
