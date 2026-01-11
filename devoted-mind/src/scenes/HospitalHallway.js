import React, { Suspense, useRef, useState } from 'react';
import { View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, SpotLight, useTexture } from '@react-three/drei/native';
import { PlayerController } from '../systems/PlayerController';
import { HeavyObject } from '../components/HeavyObject';
import { DiegeticInventory } from '../systems/DiegeticInventory';
import { InputOverlay } from '../systems/InputOverlay';
import { StalkerAI } from '../systems/PathfindingController';
import { InteractiveDoor } from '../components/InteractiveDoor';
import { VisualEffects } from '../components/VisualEffects';
import { AudioSystem } from '../systems/AudioSystem';
import * as THREE from 'three';

// --- Assets & Materials (Placeholders for PBR) ---
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color="#111"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

function Wall({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
        <boxGeometry args={[10, 5, 1]} />
        <meshStandardMaterial color="#222" />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <SpotLight
        position={[0, 8, 5]}
        angle={0.5}
        penumbra={0.5}
        castShadow
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        color="#aaccff"
      />
      <pointLight position={[0, 2, -10]} intensity={0.5} color="red" distance={5} />
    </>
  );
}

export default function HospitalHallway() {
  // Input State Ref
  const inputState = useRef({
      joystick: new THREE.Vector2(0, 0),
      isInteractingButton: false
  });

  // Shared Refs
  const playerRef = useRef(null);
  const enemyRef = useRef(null); // Reference to Stalker for AudioSystem

  // Game State (Synced with XState ideally, here local for simpler binding)
  const [isInteracting, setIsInteracting] = useState(false);
  const [health, setHealth] = useState(100);
  const [sanity, setSanity] = useState(100);

  const updateJoystick = (x, y) => {
      inputState.current.joystick.set(x, y);
  };

  const handleInteractPress = () => {
      inputState.current.isInteractingButton = true;
  };

  const handleInteractRelease = () => {
      inputState.current.isInteractingButton = false;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
        {/* 3D Scene Layer */}
        <Canvas shadows dpr={[1, 2]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />

            <Physics gravity={[0, -9.81, 0]}>
                <Floor />
                <Wall position={[-3, 2.5, 0]} rotation={[0, Math.PI/2, 0]} />
                <Wall position={[3, 2.5, 0]} rotation={[0, Math.PI/2, 0]} />

                <PlayerController
                    inputState={inputState}
                    playerRef={playerRef}
                    onInteractChange={setIsInteracting}
                />

                {/* AI Enemy */}
                <StalkerAI playerRef={playerRef} />

                {/* Interactive Elements */}
                <HeavyObject
                    position={[0, 1, -5]}
                    playerRef={playerRef}
                    isInteracting={isInteracting}
                />

                <InteractiveDoor
                    position={[2.9, 0, 0]}
                    isOpen={false}
                    onInteract={() => console.log('Door Open')}
                />
            </Physics>

            <Atmosphere />

            {/* Systems that don't render but need Scene access */}
            <AudioSystem playerRef={playerRef} enemyRef={enemyRef} playerState={{ health, sanity }} />

            <VisualEffects health={health} sanity={sanity} />

            {/* Diegetic Inventory Overlay (3D) */}
            <DiegeticInventory isOpen={true} collectedItems={['rosary', 'photo_torn']} />
        </Canvas>

        {/* UI Overlay Layer (Touch Controls) */}
        <InputOverlay
            onJoystickMove={updateJoystick}
            onInteractPress={handleInteractPress}
            onInteractRelease={handleInteractRelease}
        />
    </View>
  );
}
