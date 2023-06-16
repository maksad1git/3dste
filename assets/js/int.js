import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';

function init() {
  let container = document.querySelector('div.equa');

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#E2DFE1");

  // Cameras
  const cameras = [];
  const cameraPositions = [
    new THREE.Vector3(5, 10, 20),
    new THREE.Vector3(10, 5, 20),
    new THREE.Vector3(-10, 5, -20),
    new THREE.Vector3(20, 5, 10),
    new THREE.Vector3(-20, 5, 10)
  ];

  for (let i = 0; i < 5; i++) {
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.5, 3000);
    camera.position.copy(cameraPositions[i]);
    cameras.push(camera);
  }

  let activeCameraIndex = 0;
  let activeCamera = cameras[activeCameraIndex];

  // Render
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  let model; // Variable to hold the loaded model

  // Model
  {
    const loader = new GLTFLoader();
    loader.load('/assets/models/floorplan1.gltf', gltf => {
      model = gltf.scene; // Store the loaded model in the 'model' variable
      model.position.set(0, 0, 0);
      scene.add(gltf.scene);
    },
    function (error) {
      console.log('Error: ' + error);
    });
  }

  // Lights
  {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(110, 110, 110);
    light.lookAt(100, -1, 100);
    scene.add(light);
  }

  // OrbitControls
  const controls = new OrbitControls(activeCamera, renderer.domElement);
  controls.autoRotateSpeed = 1;
  controls.enableDamping = true;

  // Resize
  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
    activeCamera.aspect = window.innerWidth / window.innerHeight;
    activeCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, activeCamera);
  }
  animate();

  // Switch cameras
  function switchCamera(index) {
    if (index >= 0 && index < cameras.length) {
      const targetCamera = cameras[index];

      // Set up the camera transition parameters
      const startCameraPosition = activeCamera.position.clone();
      const startLookAt = activeCamera.getWorldDirection(new THREE.Vector3()).add(activeCamera.position);
      const endCameraPosition = targetCamera.position.clone();
      const endLookAt = model.position.clone();
      const duration = 1000; // Duration of the camera transition in milliseconds
      const startTime = Date.now();

      // Function to update the camera position and lookAt during the transition
      function updateCamera() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Interpolation value between 0 and 1
        const newPosition = startCameraPosition.clone().lerp(endCameraPosition, t);
        activeCamera.position.copy(newPosition);
        activeCamera.lookAt(startLookAt.clone().lerp(endLookAt, t));

        if (elapsed < duration) {
          // Continue the transition animation
          requestAnimationFrame(updateCamera);
        }
      }

      activeCameraIndex = index;
      activeCamera = targetCamera;
      controls.object = activeCamera;

      updateCamera();
    }
  }

  // Button click event handlers
  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      switchCamera(index);
    });
  });
}

init();
