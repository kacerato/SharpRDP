import React, { useRef, useState, useEffect } from 'react';
import { useBox, usePointToPointConstraint } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber/native';
import { Audio } from 'expo-av';

export function HeavyObject({ position, playerRef, isInteracting, onInteractStart, onInteractEnd }) {
  // 1. Corpo Físico do Objeto (Pesado e com alto atrito)
  const [ref, api] = useBox(() => ({
    mass: 100, // Heavy object (100kg)
    position,
    args: [1, 2, 1], // Size (e.g., a bookshelf)
    material: { friction: 0.8, restitution: 0.1 }, // High friction, low bounce
    linearDamping: 0.9, // Stops quickly when force is removed
  }));

  // Reference to hold the Constraint (the connection)
  const [constraintApi, , constraintRef] = usePointToPointConstraint(
    null, // Body A (Will be the player when activated)
    null, // Body B (This object)
    { pivotA: [0, 0, 0], pivotB: [0, 0, 0] }
  );

  // Sound ref for scraping noise
  const soundRef = useRef(null);
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    // Subscribe to velocity to drive sound
    const unsub = api.velocity.subscribe((v) => (velocity.current = v));
    return unsub;
  }, []);

  // 2. Grabbing Logic (Activate/Deactivate Constraint)
  useEffect(() => {
    if (isInteracting && playerRef.current) {
      // Connect Player (A) to this Object (B)
      constraintApi.enable();
      constraintApi.setBodies(playerRef.current, ref.current);

      // Pivot Setup:
      // Pivot A: Point in front of the player (where hands are)
      // Pivot B: Point on the object surface closest to player
      constraintApi.setPivotA([0, 0, 1]); // 1 unit forward of player center
      constraintApi.setPivotB([0, 0, -0.5]); // Back of the object

      if (onInteractStart) onInteractStart();

    } else {
      constraintApi.disable();
      if (onInteractEnd) onInteractEnd();
    }
  }, [isInteracting, playerRef]);

  // 3. Procedural Audio (The "Juice")
  useFrame(() => {
    // Calculate speed magnitude
    const speed = Math.sqrt(
      velocity.current[0]**2 + velocity.current[2]**2
    );

    // If moving and technically "on the ground" (velocity y is low)
    if (speed > 0.1) {
       // Adjust volume based on speed (simulating drag friction)
       if(soundRef.current) {
         // Note: setVolumeAsync is async, in a tight loop ideally we use a non-async worklet or throttle this
         // For React Native Audio, we might throttle to every 10 frames
         // soundRef.current.setVolumeAsync(Math.min(speed / 2, 1));
         // soundRef.current.setRateAsync(0.8 + speed * 0.1);
       }
       // Spawn dust particles here (conceptual)
    } else {
       // if(soundRef.current) soundRef.current.setVolumeAsync(0);
    }
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 2, 1]} />
      {/* PBR Material Placeholder: Rusted Metal/Wood */}
      <meshStandardMaterial
        color="#554433"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
