import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Create spheres - Geometry and Materials
const sphereColors = ["#EE82EE", "#808080", "#4CBB17", "#48D1CC"];
const spheres = [];

for (let i = 0; i < 4; i++) {
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: sphereColors[i],
    roughness: 0.3,
    metalness: 0.3,
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(i * 5 - 6, 2, 0); // Adjust the Y position to make them horizontal
  scene.add(sphere);
  spheres.push(sphere);
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

// Add Camera
const camera = new THREE.PerspectiveCamera(45, 1400 / 800);
camera.position.z = 25;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(1400, 800);

// Create capsules and position them in a larger circular formation
const capsuleColors = ["#FF5733", "#2E64FE", "#EADDCA", "#9A2EFE", "#FF00FF", "#FF0000", "#A52A2A", "#FFFF00"];
const capsules = [];
const capsuleRadius = 12; // Widen the capsule circle

for (let i = 0; i < 8; i++) {
  const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 30, 15); // Increase segments for smoother capsules
  const material = new THREE.MeshStandardMaterial({
    color: capsuleColors[i],
    roughness: 0.3,
    metalness: 0.3,
  });

  const capsule = new THREE.Mesh(capsuleGeometry, material);

  const angle = (i / 8) * Math.PI * 2;
  const x = capsuleRadius * Math.cos(angle);
  const z = capsuleRadius * Math.sin(angle);

  capsule.position.set(x, 0, z);
  scene.add(capsule);
  capsules.push(capsule);
}

// Animation variables
const speed = 0.02;
let time = 0;
let phase = 0;

// Create OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;

// Resize function
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animateJugglingSpheres() {
  time += speed;

  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    const amplitude = 5;
    const frequency = 1;
    const xPosition = amplitude * Math.sin(frequency * time + phase + i * (2 * Math.PI / 4));
    sphere.position.x = xPosition;
  }

  for (let i = 0; i < capsules.length; i++) {
    const capsule = capsules[i];
    capsule.rotation.y += 0.02; // Rotate capsules 360 degrees
  }

  if (Math.floor(time / (2 * Math.PI)) % 2 === 1) {
    phase = Math.PI;
  } else {
    phase = 0;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animateJugglingSpheres);
}

animateJugglingSpheres();
