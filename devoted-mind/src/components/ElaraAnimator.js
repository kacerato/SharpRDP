import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useAnimations, useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';

// Placeholder for the GLB model path
const MODEL_URL = 'elara_placeholder.glb';

export function ElaraAnimator({ currentRootState, sanityLevel, lookAtTarget, modelUrl = MODEL_URL }) {
  // MOCKING the useGLTF hook for now since we don't have the file
  const nodes = {
      Spine_01: new THREE.Bone(),
      Head: new THREE.Bone(),
      Hand_R: new THREE.Bone(),
      Scene: new THREE.Group() // Placeholder scene
  };
  const animations = []; // Empty animations for now
  const ref = useRef();

  const { actions, names } = useAnimations(animations, ref);

  // 1. Initial Setup for Bone Masking (Upper Body Isolation)
  useEffect(() => {
    // Conceptual Logic provided in previous steps
  }, [actions]);

  // 2. Frame Processing Loop (60 FPS)
  useFrame((state, delta) => {

    // --- Layer 0 Logic: Locomotion Based on Physics and Health ---
    const isRunning = currentRootState.matches('running');

    // --- Layer 2 Logic: Head Tracking (IK) ---
    // The head looks at the monster (if any) or forward
    const headBone = nodes.Head;
    if (headBone && lookAtTarget) {
          // const targetPos = lookAtTarget.clone();
          // headBone.lookAt(targetPos);
    }

    // --- Procedural Logic: Fear Tremor ---
    // If sanity is low, inject "Noise" into hand bones
    if (sanityLevel < 30) {
       const shakeAmount = (30 - sanityLevel) * 0.002;
       if (nodes.Hand_R) {
           nodes.Hand_R.position.x += (Math.random() - 0.5) * shakeAmount;
           nodes.Hand_R.position.y += (Math.random() - 0.5) * shakeAmount;
       }
    }
  });

  return (
    <primitive
        object={nodes.Scene}
        ref={ref}
        dispose={null}
    />
  );
}
