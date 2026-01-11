import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useSpring, a } from '@react-spring/three';
import { Text, PresentationControls } from '@react-three/drei/native';

// Mock Data for Inventory Items
const ITEMS_DB = {
  'rosary': {
      name: 'Broken Rosary',
      description: 'The beads are cracked. It feels warm.',
      modelColor: '#882222'
  },
  'key_rusty': {
      name: 'Rusty Key',
      description: 'Covered in dried blood. Opens the Pharmacy.',
      modelColor: '#BBAA88'
  },
  'photo_torn': {
      name: 'Torn Photograph',
      description: 'A family portrait. The faces are scratched out.',
      modelColor: '#DDDDDD',
      hasClue: true
  }
};

function InventoryItem({ itemId, isActive }) {
  const mesh = useRef();
  const itemData = ITEMS_DB[itemId];

  // Spring animation for appearing/disappearing
  const { scale } = useSpring({
    scale: isActive ? 1 : 0,
    config: { tension: 200, friction: 15 }
  });

  return (
    <a.mesh ref={mesh} scale={scale} castShadow>
      {/* Placeholder Geometry - In real game, useGLTF(itemData.modelUrl) */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={itemData.modelColor} roughness={0.6} />
    </a.mesh>
  );
}

export function DiegeticInventory({ isOpen, onClose, collectedItems = ['rosary', 'key_rusty'] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeItemId = collectedItems[selectedIndex];
  const itemData = ITEMS_DB[activeItemId];

  if (!isOpen) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Darkened Background */}
      <mesh position={[0, 0, -5]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="black" transparent opacity={0.8} />
      </mesh>

      {/* Lighting for the Item */}
      <pointLight position={[2, 2, 5]} intensity={1.5} />

      {/* The 3D Item Container with PresentationControls for Inspection */}
      <group position={[0, 0, -2]}>
         <PresentationControls
            global={false} // Only control this object
            cursor={true} // Show cursor
            snap={true} // Snap back to center
            speed={1.5} // Rotation speed
            zoom={0.8} // Max zoom
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 2, Math.PI / 2]} // Vertical limits
            azimuth={[-Infinity, Infinity]} // Horizontal limits
         >
            <InventoryItem itemId={activeItemId} isActive={true} />
         </PresentationControls>
      </group>

      {/* 3D Text for Description (Diegetic UI) */}
      <group position={[0, -2, -2]}>
          <Text
            color="white"
            fontSize={0.2}
            maxWidth={3}
            anchorX="center"
            anchorY="top"
          >
            {itemData.name.toUpperCase()}
            {'\n'}
            {itemData.description}
          </Text>
      </group>

      {/* Navigation Arrows (Visual) */}
      <mesh position={[2, 0, -2]} onClick={() => setSelectedIndex((i) => (i + 1) % collectedItems.length)}>
          <coneGeometry args={[0.2, 0.5, 3]} rotation={[0, 0, -Math.PI/2]}/>
          <meshBasicMaterial color="white" />
      </mesh>
       <mesh position={[-2, 0, -2]} onClick={() => setSelectedIndex((i) => (i - 1 + collectedItems.length) % collectedItems.length)}>
          <coneGeometry args={[0.2, 0.5, 3]} rotation={[0, 0, Math.PI/2]}/>
          <meshBasicMaterial color="white" />
      </mesh>

    </group>
  );
}
