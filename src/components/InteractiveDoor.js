import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Html } from '@react-three/drei/native';

export function InteractiveDoor({ position, isOpen, onInteract }) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}>
      {/* O Objeto 3D da Porta */}
      <mesh
        position={[0, 1, 0]}
        // Em React Native, onPointerOver/Out tem suporte limitado no touch,
        // idealmente usamos Raycast manual ou Distância, mas Drei suporta básico
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={onInteract}
      >
        <boxGeometry args={[1.2, 2.5, 0.1]} />
        <meshStandardMaterial color={isOpen ? "#4a3b32" : "#3a2b22"} />
      </mesh>

      {/* Maçaneta */}
      <mesh position={[0.4, 1, 0.1]}>
         <sphereGeometry args={[0.05]} />
         <meshStandardMaterial color="gold" />
      </mesh>

      {/* A UI Diegética */}
      {hovered && !isOpen && (
        <Html
          transform // Faz o texto girar junto com o mundo 3D
          occlude // Esconde o texto se a porta estiver atrás de uma parede
          position={[0.8, 1, 0.2]} // Flutua ao lado da maçaneta
          scale={0.2} // Escala para não ficar gigante
        >
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 8,
            borderRadius: 4,
            borderColor: 'white',
            borderWidth: 1,
            width: 120
          }}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              OPEN
            </Text>
          </View>
        </Html>
      )}
    </group>
  );
}
