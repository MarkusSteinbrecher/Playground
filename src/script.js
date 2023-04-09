import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

async function loadSpheresData() {
  const response = await fetch('spheres.json');
  const data = await response.json();
  createSpheresFromData(data);
  scene.add(particles);
}

function createSpheresFromData(data) {
  data.forEach((sphereData) => {
    const texture = makeImageTexture(sphereData.texture);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    material.flatShading = true;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(sphereData.radius, 32, 16),
      material
    );
    sphere.position.set(
      sphereData.position.x,
      sphereData.position.y,
      sphereData.position.z
    );

    sphere.name = sphereData.id;
    sphere.userData = { link: sphereData.link };
    scene.add(sphere);
  });
}



// Textures
function makeImageTexture(imageFilename) {
  const img = new Image();
  const tex = new THREE.Texture(img);
  img.onload = () => {
    tex.needsUpdate = true;
  };
  img.src = imageFilename;
  return tex;
}

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('star.png');

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 4223;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 23;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
);

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.alphaTest = 0.001;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

// Base
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
camera.target = new THREE.Vector3();


function transitionCameraTo(position, target) {
  const startPosition = camera.position.clone();
  const startTarget = camera.target.clone();
  const startTime = performance.now();

  function transition() {
    const duration = 1000;
    const t = Math.min((performance.now() - startTime) / duration, 1);
    const easingFactor = t * (2 - t); // ease in-out cubic

    camera.position.lerpVectors(startPosition, position, easingFactor);
    camera.target.lerpVectors(startTarget, target, easingFactor);
    camera.lookAt(camera.target);

    if (t < 1) {
      requestAnimationFrame(transition);
    }
  }

  transition();
}

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  particles.rotation.y = 0.02 * elapsedTime;

  const markus = scene.getObjectByName('markus');
  if (markus) {
    markus.rotation.x = 0.3 * elapsedTime;
    markus.rotation.y = 0.1 * elapsedTime;
  }

  const wenMoon = scene.getObjectByName('wenMoon');
  if (wenMoon) {
    const 𝛕 = 6.28318;
    const orbit = {
      eccentricity: 0.0,
      siderealOrbitPeriod: 1.0,
    };
    const aRadius = 1.25;
    const bRadius = aRadius * Math.sqrt(1.0 - Math.pow(orbit.eccentricity, 2.0));
    const angle = 1.0 * 0.02 * elapsedTime / orbit.siderealOrbitPeriod * 𝛕;
    const x = aRadius * Math.cos(angle);
    const y = bRadius * Math.sin(angle);
    const z = 0;
    wenMoon.position.set(x, y, z);
    wenMoon.rotation.x = 𝛕 / 2;
    wenMoon.rotation.z = 𝛕 / 3;
    wenMoon.rotation.y = -1 + 2 * (markus ? markus.rotation.y : 0) * 𝛕 / 3;
  }

  const bldrs = scene.getObjectByName('Bldrs');
  if (bldrs) {
    const 𝛕 = 6.28318;
    const orbit = {
      eccentricity: 0.0,
      siderealOrbitPeriod: 1.0,
    };
    const aRadius = 0.7;
    const bRadius = aRadius * Math.sqrt(1.0 - Math.pow(orbit.eccentricity, 2.0));
    const angle = 2.3 * 0.02 * elapsedTime / orbit.siderealOrbitPeriod * 𝛕;
    const x = aRadius * Math.cos(angle);
    const y = bRadius * Math.sin(angle);
    const z = 0;
    bldrs.position.set(x, y, z);
    bldrs.rotation.x = 𝛕 / 2;
    bldrs.rotation.z = 𝛕 / 3;
    bldrs.rotation.y = -1 + 2 * (markus ? markus.rotation.y : 0) * 𝛕 / 3;
  }

  const opensourceConstruction = scene.getObjectByName('opensourceConstruction');
  if (opensourceConstruction) {
    const 𝛕 = 6.28318;
    const orbit = {
      eccentricity: 0.0,
      siderealOrbitPeriod: 1.0,
    };
    const aRadius = 0.7;
    const bRadius = aRadius * Math.sqrt(1.0 - Math.pow(orbit.eccentricity, 2.0));
    const angle = 4.2 * 0.02 * elapsedTime / orbit.siderealOrbitPeriod * 𝛕;
    const x = aRadius * Math.cos(angle);
    const y = bRadius * Math.sin(angle);
    const z = 0;
    opensourceConstruction.position.set(x, y, z);
    opensourceConstruction.rotation.x = 𝛕 / 2;
    opensourceConstruction.rotation.z = 𝛕 / 3;
    opensourceConstruction.rotation.y = -1 + 2 * (markus ? markus.rotation.y : 0) * 𝛕 / 3;
  }

  

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks
raycaster.params.Points.threshold = 0.1;
canvas.addEventListener('click', (event) => {
  event.preventDefault();

  // Convert mouse click coordinates to normalized device coordinates
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if a sphere or the GitHub logo was clicked
  if (intersects.length > 0) {
    if (intersects[0].object.userData.link) {
      const anchor = document.createElement('a');
      anchor.href = intersects[0].object.userData.link;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    } else if (intersects[0].object.type === 'Mesh') {
      const spherePosition = intersects[0].object.position.clone();
      const cameraPosition = spherePosition.clone().add(new THREE.Vector3(0, 0, 2));
      transitionCameraTo(cameraPosition, spherePosition);
    }
  }
});



loadSpheresData();
tick();
