import React, { useRef, useState, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber/native';
import { useMachine } from '@xstate/react';
import { Vector3, Quaternion } from 'three';
import { elaraMachine } from '../machines/elaraMachine';
import { ElaraAnimator } from '../components/ElaraAnimator';
import { HeavyObject } from '../components/HeavyObject';

export function PlayerController({ inputState }) {
  // XState Logic
  const [state, send] = useMachine(elaraMachine);

  // Physics Body (Player)
  const [ref, api] = useSphere(() => ({
      mass: 60,
      position: [0, 5, 0],
      args: [1], // Radius
      fixedRotation: true, // Prevent player from tipping over
      linearDamping: 0.9 // Friction against air/ground
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);

  // Camera Follow Logic
  const { camera } = useThree();

  useFrame((rootState, delta) => {
    // 1. Process Input -> Force
    const { joystick, isInteractingButton } = inputState.current;

    // Determine State Transitions based on Input
    if (joystick.length() > 0.1 && state.matches('idle')) {
        send('MOVE');
    } else if (joystick.length() < 0.1 && (state.matches('walking') || state.matches('running'))) {
        send('STOP');
    }

    if (isInteractingButton && state.matches('idle')) {
        send('INTERACT');
    } else if (!isInteractingButton && state.matches('interacting')) {
        send('FINISH_INTERACTION');
    }

    // 2. Apply Physics Forces based on State
    const speed = state.matches('running') ? 8 : (state.matches('walking') ? 4 : 0);
    const direction = new Vector3(joystick.x, 0, -joystick.y).normalize(); // Assuming y is up on joystick

    // "Heavy Object" Logic: If interacting, we move slower and lock rotation
    if (state.matches('interacting')) {
         // Slow down for pushing/pulling
         const pushSpeed = 2;
         api.velocity.set(direction.x * pushSpeed, velocity.current[1], direction.z * pushSpeed);

         // Note: Rotation is handled by the constraint in HeavyObject mostly,
         // but we might want to force player orientation here too.
    } else {
        // Normal movement
        if (speed > 0) {
            api.velocity.set(direction.x * speed, velocity.current[1], direction.z * speed);

            // Rotate character to face movement direction
            const targetRotation = Math.atan2(direction.x, direction.z);
            // api.rotation.set(0, targetRotation, 0); // Direct set (snappy)
            // Ideally we use a slerp on the mesh, not the physics body directly if fixedRotation is true
            // ref.current.rotation.y = targetRotation; (Visual only)
        }
    }

    // 3. Camera Follow
    camera.position.lerp(new Vector3(ref.current.position.x, ref.current.position.y + 5, ref.current.position.z + 10), 0.1);
    camera.lookAt(ref.current.position);
  });

  return (
    <group ref={ref}>
       <ElaraAnimator
          currentRootState={state}
          sanityLevel={state.context.sanity}
       />
       {/*
         Example of connection:
         In a real scene, 'HeavyObject' would be separate, and we'd pass 'ref' (playerRef) to it
         so it can attach the constraint.
       */}
    </group>
  );
}
