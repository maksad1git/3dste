import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { RenderPass } from 'https://unpkg.com/three@0.153.0/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'https://unpkg.com/three@0.153.0/examples/jsm/postprocessing/EffectComposer.js';

import { BloomPass } from 'https://unpkg.com/three@0.153.0/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'https://unpkg.com/three@0.153.0/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.153.0/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'https://unpkg.com/three@0.153.0/examples/jsm/shaders/VignetteShader.js';
import { ColorCorrectionShader } from 'https://unpkg.com/three@0.153.0/examples/jsm/shaders/ColorCorrectionShader.js';




function init() {
    let container = document.querySelector('div.webgl');
    
    // Render
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    
    container.appendChild(renderer.domElement);
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbdd7ee);
    // const textureLoader = new THREE.TextureLoader();
    
    // // Load the image
    // const texture = textureLoader.load('/img/bg1.jpg', () => {
    // // Once the image is loaded, set it as the background
    // scene.background = texture;
    // });
    scene.fog = new THREE.Fog("#ffffff", 160, 200);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(2.2, window.innerWidth / window.innerHeight, 1, 100000);
    camera.updateProjectionMatrix();
    scene.add(camera);
  
    // Set camera position and rotation

    // const distance = cameraHeight * focalLength;



    // Mouse
    const mouse = new THREE.Vector2();
    let prevMouseX = 0;

    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    }
    window.addEventListener('mousemove', onMouseMove);
    const center = new THREE.Vector3(0, 0.5, 0); // Adjust the y-offset as desired (changed from -50 to -80)

    // Environment Map
    const envMapTexture = new THREE.TextureLoader().load('assets/img/hdri5.jpg', () => {

    });

    // GLTF Loader
    const loader = new GLTFLoader();
    const loader_trees = new GLTFLoader();

    loader.load('assets/models/8.gltf', function (glb) {
        const model = glb.scene;
        model.position.set(0.45, -2.6, -0.6);
        scene.add(model);
        model.scale.set(1, 1, 1);
        model.castShadow = true;
        model.receiveShadow = true; // Enable receiving shadows
    
        const materials = {}; // Object to store materials
    
        const envMapLoader = new THREE.TextureLoader();
        envMapLoader.load('assets/img/hrdi4.jpg', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping; // Use EquirectangularReflectionMapping for the environment map

            model.traverse(function (node) {
                if (node.isMesh) {
                    const originalMaterial = node.material;
    
                    // Store original material colors and maps
                    const originalColor = originalMaterial.color.clone();
                    const originalMap = originalMaterial.map ? originalMaterial.map.clone() : null;
                    const originalEnvMap = originalMaterial.envMap ? originalMaterial.envMap.clone() : null;
    
                    // Create a new MeshStandardMaterial
                    const standardMaterial = new THREE.MeshStandardMaterial();
                    standardMaterial.color = originalColor;

                    standardMaterial.map = originalMap;
                    standardMaterial.envMap = texture; // Set the environment map
                    standardMaterial.envMapIntensity = 0.1; // Adjust the intensity as desired
                    standardMaterial.roughness = 0; // Set roughness to 0 for reflective areas
    
                    node.material = standardMaterial;
    
                    // Store the new material in the materials object
                    materials[node.uuid] = {
                        originalMaterial: originalMaterial,
                        standardMaterial: standardMaterial
                    };
    
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
        });
        preloader.style.opacity = 0;
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000); // Adjust the delay as desired
    });



    loader_trees.load('assets/models/8Palms.gltf', function (glb) {
        const model = glb.scene;
        model.position.set(0.45, -2.6, -0.6);
        scene.add(model);
        model.scale.set(1, 1, 1);
        model.castShadow = true;
        model.receiveShadow = true; // Enable receiving shadows
        model.traverse(function (node) {
            if (node.isMesh) {
              // Create a new standard material for each mesh
              const standardMaterial_trees = new THREE.MeshStandardMaterial({
                map: node.material.map, // Assign the texture map
                transparent: true,
                side: THREE.DoubleSide,
              });
        
              node.material = standardMaterial_trees;
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
    });





    // Texture Loading
    const texture1 = new THREE.TextureLoader().load('assets/img/clouds.png');
    const texture2 = new THREE.TextureLoader().load('assets/img/clouds.png');
    const texture3 = new THREE.TextureLoader().load('assets/img/fbirds1.png');
    const texture4 = new THREE.TextureLoader().load('assets/img/fbirds1.png');
    const texture5 = new THREE.TextureLoader().load('assets/img/plane.png');
    const texture6 = new THREE.TextureLoader().load('assets/img/plane.png');
    const treeTexture = new THREE.TextureLoader().load('assets/img/palml1.png');
    const treeTexture2 = new THREE.TextureLoader().load('assets/img/palml2.png');

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(1, 1);

    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(1, 1);

    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set(1, 1);

    texture4.wrapS = THREE.RepeatWrapping;
    texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set(1, 1);

    texture5.wrapS = THREE.RepeatWrapping;
    texture5.wrapT = THREE.RepeatWrapping;
    texture5.repeat.set(1, 1);
    
    texture6.wrapS = THREE.RepeatWrapping;
    texture6.wrapT = THREE.RepeatWrapping;
    texture6.repeat.set(1, 1);

    const planeGeometry = new THREE.PlaneGeometry(20, 8);
    const planeGeometry2 = new THREE.PlaneGeometry(13, 2.8);
    const planeGeometryPlane = new THREE.PlaneGeometry(13, 0.3);
    const treePlaneGeometry1 = new THREE.PlaneGeometry(7, 7);
    const treePlaneGeometry2 = new THREE.PlaneGeometry(5, 7);


    const material = new THREE.MeshStandardMaterial({ map: texture1, transparent: true });
    const material2 = new THREE.MeshStandardMaterial({ map: texture3, transparent: true });
    const materialPlane = new THREE.MeshStandardMaterial({ map: texture3, transparent: true });
    const treePlaneMaterial1 = new THREE.MeshBasicMaterial({
        map: treeTexture,
        transparent: true,
        alphaTest: 0.5,
      });
    const treePlaneMaterial2 = new THREE.MeshBasicMaterial({
    map: treeTexture2,
    transparent: true,
    alphaTest: 0.5,
    });
    
    const plane = new THREE.Mesh(planeGeometry, material);
    const plane2 = new THREE.Mesh(planeGeometry2, material2);
    const planePlane = new THREE.Mesh(planeGeometryPlane, materialPlane);
    const treePlane1 = new THREE.Mesh(treePlaneGeometry1, treePlaneMaterial1);
    const treePlane2 = new THREE.Mesh(treePlaneGeometry2, treePlaneMaterial2);

    plane.position.set(1.8, 2, -2.3);
    plane.rotation.set(0, -0.3, 0);
    plane2.position.set(0, 0.2, -1);
    plane2.rotation.set(0, -0.25, 0);
    planePlane.position.set(0.6, 2, -1);
    planePlane.rotation.set(-0.12, -0.4, 0);
    treePlane1.position.set(-0.5, 0.8, 10);
    treePlane2.position.set(-10, 1, 8.4);

    scene.add(plane, plane2, planePlane, treePlane1, treePlane2);

    const scrollSpeed = 0.000035;
    const scrollSpeed2 = 0.00025;
    const scrollSpeedPlane = 0.0001;
    let textureOffset = 0;
    let textureOffset2 = 0;
    let textureOffsetPlane = 0;

    function animateTexture() {
        textureOffset -= scrollSpeed;
        textureOffset2 -= scrollSpeed2;
        textureOffsetPlane -= scrollSpeedPlane;
      
        if (textureOffset <= -1) {
            textureOffset += 1;
            material.map = texture2;
        } else if (textureOffset <= 0) {
            material.map = texture1;
        }

        if (textureOffset2 <= -1) {
            textureOffset2 += 1;
            material2.map = texture3;
        } else if (textureOffset2 <= 0) {
            material2.map = texture4;
        }

        if (textureOffsetPlane <= -1) {
            textureOffsetPlane += 1;
            materialPlane.map = texture5;
        } else if (textureOffsetPlane <= 0) {
            materialPlane.map = texture6;
        }
      
        material.map.offset.set(textureOffset, 0);
        material2.map.offset.set(textureOffset2, 0);
        materialPlane.map.offset.set(textureOffsetPlane, 0);

        requestAnimationFrame(animateTexture);
    }

    animateTexture();

    const texture_trees = new THREE.TextureLoader().load('assets/img/bgtrees1.png');
    const planeGeometry3_trees = new THREE.PlaneGeometry(16, 0.8);
    const material3_trees = new THREE.MeshStandardMaterial({ map: texture_trees, transparent: true });
    const plane3_trees = new THREE.Mesh(planeGeometry3_trees, material3_trees);
    plane3_trees.position.set(0.8, -1.8, -2);
    plane3_trees.rotation.set(0, -0.25, 0);
    scene.add(plane3_trees);



    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(50, 60, 70);
    light.lookAt(-50, 0, 0);
    light.shadow.mapSize.width = 2048 * 2;
    light.shadow.mapSize.height = 2048 * 2;
    light.castShadow = true;
    light.shadow.bias = 0;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10000;
    light.shadow.focus = 100;
    light.shadow.camera.left = -8;
    light.shadow.camera.right = 8;
    light.shadow.camera.top = 8;
    light.shadow.camera.bottom = -8;
    scene.add(light);
    
   


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


        // Post-processing
    const composer = new EffectComposer(renderer);
    composer.autoClear = false;
    const renderPass = new RenderPass(scene, camera);
    renderPass.renderToScreen = false;  // Set renderToScreen to false to avoid direct rendering
    renderPass.clear = false;           // Disable automatic scene clearing
    renderPass.clearDepth = true;       // Enable clearing of depth buffer
    const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
    colorCorrectionPass.uniforms['powRGB'].value = new THREE.Vector4(0.7, 0.7, 0.7, 0.1);
    const filmPass = new FilmPass(0.25, 0, 0, false, false, false, 0, 0, -5, 0);
    // filmPass.uniforms[ 'tDiffuse' ].value = 0.1;
    const vignettePass = new ShaderPass(VignetteShader);

    vignettePass.uniforms[ 'offset' ].value = 1.3;  // Adjust the offset of the vignette (0 to 1)
    vignettePass.uniforms[ 'darkness' ].value = 1;  // Adjust the darkness of the vignette (0 to 1)

    composer.addPass(renderPass);
    composer.addPass(filmPass);
    composer.addPass(vignettePass);
    composer.addPass(colorCorrectionPass);
    

    function render(scene, camera) {
        composer.render();
    }












    // Animation
    let cameraAngle = 30.9;
    const cameraRotationSpeed = 0.2;
    const cameraRadius = 89;
    const pitchAngle = Math.PI / 4;
    const defaultCameraRotation = new THREE.Euler(
        -pitchAngle, 0, 0, 'XYZ'
    );
    const defaultCameraPosition = new THREE.Vector3(0, cameraRadius, 0);

    camera.rotation.copy(defaultCameraRotation);

    function animate() {
        const mouseMoveX = mouse.x - prevMouseX;

        cameraAngle -= mouseMoveX * cameraRotationSpeed;
        const cameraX = Math.sin(cameraAngle) * cameraRadius -30;
        const cameraY = defaultCameraPosition.y - 80;
        const cameraZ = Math.cos(cameraAngle) * cameraRadius +70;

        camera.position.set(
            cameraX + defaultCameraPosition.x,
            cameraY,
            cameraZ
        );
        camera.lookAt(center);

        prevMouseX = mouse.x;

        requestAnimationFrame(animate);
        render();
    }

    animate();

}

init();
