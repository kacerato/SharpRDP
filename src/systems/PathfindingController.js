import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { Pathfinding } from 'three-pathfinding';
import * as THREE from 'three';

// Inicializa a engine de pathfinding
const pathfinding = new Pathfinding();
const ZONE = 'level1';

export function StalkerAI({ playerRef, navMeshUrl = 'navmesh_placeholder.glb' }) {
  const enemyRef = useRef();
  const [path, setPath] = useState([]); // Lista de pontos para andar

  // Em produção, isso carregaria o arquivo real. Aqui mockamos para não crashar sem o arquivo.
  // const { scene } = useGLTF(navMeshUrl);
  const scene = new THREE.Group(); // Placeholder

  // 1. Configuração Inicial: Cria a Zona de Navegação
  useEffect(() => {
    // Pega a malha do arquivo GLB e cria a zona
    let mesh = null;

    // Simulação: Criamos uma malha simples para ser o NavMesh se não houver arquivo
    const geometry = new THREE.PlaneGeometry(10, 10);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    // Se estivesse carregando real:
    /*
    scene.traverse((node) => {
      if (node.isMesh && !mesh) mesh = node;
    });
    */

    if (mesh) {
      // Pathfinding exige Geometry do Threejs (BufferGeometry)
      pathfinding.setZoneData(ZONE, Pathfinding.createZone(mesh.geometry));
    }
  }, [scene]);

  // 2. Loop de Inteligência (Roda a cada frame)
  useFrame((state, delta) => {
    if (!enemyRef.current || !playerRef.current) return;

    const enemyPos = enemyRef.current.position;
    const playerPos = playerRef.current.position;

    // A. Recalcula o caminho (Otimização: a cada 10 frames ou distância grande)
    // Para simplificar aqui, calculamos se a distância for > 1
    const dist = enemyPos.distanceTo(playerPos);

    if (dist < 10 && dist > 1) { // Só persegue se estiver perto mas não colado
        const groupID = pathfinding.getGroup(ZONE, enemyPos);

        // Em um setup real, playerPos precisa estar clamped na NavMesh
        // const targetNode = pathfinding.getClosestNode(playerPos, ZONE, groupID);

        // Mock de Path: Linha reta por enquanto pois não temos NavMesh real
        const calculatedPath = [playerPos];

        if (calculatedPath && calculatedPath.length > 0) {
            const nextPoint = calculatedPath[0];

            // B. Movimentação Suave
            const direction = new THREE.Vector3().subVectors(nextPoint, enemyPos).normalize();
            // Ignora Y para não voar
            direction.y = 0;

            const moveSpeed = 2.5; // Mais lento que o player correndo
            const moveDistance = moveSpeed * delta;

            enemyRef.current.position.add(direction.multiplyScalar(moveDistance));

            // C. Rotação Suave (LookAt com Slerp)
            const targetRotation = new THREE.Quaternion();
            const lookMatrix = new THREE.Matrix4().lookAt(enemyPos, nextPoint, new THREE.Vector3(0, 1, 0));
            targetRotation.setFromRotationMatrix(lookMatrix);
            enemyRef.current.quaternion.slerp(targetRotation, 0.1);
        }
    }
  });

  return (
    <group ref={enemyRef} position={[5, 0, -5]}>
        {/* Modelo visual da Freira (Placeholder) */}
        <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[0.6, 1.8, 0.6]} />
            <meshStandardMaterial color="#880000" />
        </mesh>
        {/* Olhos Brilhantes */}
        <mesh position={[0, 1.6, 0.25]}>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshBasicMaterial color="yellow" />
        </mesh>
    </group>
  );
}
