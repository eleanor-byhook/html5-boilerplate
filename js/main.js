'use strict'
var scene,
    camera,
    renderer,
    element,
    container,
    effect,
    controls,
    clock,

    //Particles
    particles = new THREE.Object3D(),
    totalParticles = 100,
    maxParticleSize = 120,
    particleRotationSpeed = 0,
    particleRotationDeg = 0,
    lastColorRange = [0, 0.3],
    currentColorRange = [0, 0.3],

    //City and Weather API set up
    cities = [['Sydney', '2147714'], ['New York', '5128638'], ['Tokyo', '1850147'], ['London', '2643743'], ['Mexico City', '3530597'], ['Miami', '4164138'], ['San Francisco', '5391959'], ['Rome', '369070']], 
    cityWeather = {},
    cityTimes = [],
    currentCity = 0,
    currentCityText = new THREE.TextGeometry(),
    currentCityTextMesh = new THREE.Mesh();

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
  camera.position.set(0, 15, 0);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('webglviewer');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  //control fallback for mouse/touch events incase DeviceOrientation isn't
  //available

  controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
  );
  controls.noPan = true;
  controls.noZoom = true;

  //prefered controls

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);

  //Lighting
//ambient
 var light = new THREE.AmbientLight(0xffffff);
light.position.set(50, 50, 50);
scene.add(light);

//Floor

var floorTexture = THREE.ImageUtils.loadTexture('img/planks.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat = new THREE.Vector2(50, 50);
floorTexture.anisotropy = renderer.getMaxAnisotropy();

var floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      shading: THREE.FlatShading,
      map: floorTexture
});

var geometry = new THREE.PlaneBufferGeometry(1000, 1000);

var floor = new THREE.Mesh(geometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
 
//particles

var particleTexture = THREE.ImageUtils.loadTexture('img/particle.png'),
    spriteMaterial = new THREE.SpriteMaterial({
      map: particleTexture,
    color: 0xaa00aa
    });

for (var i = 0; i < totalParticles; i++) {
  var sprite = new THREE.Sprite(spriteMaterial);
  var randomX = Math.random() - 0.5;
  var randomY = Math.random() -0.52;
  var randomZ = Math.random() - 0.75;

  if(Math.abs(randomZ) < 0.2) { 
    randomZ = randomZ * 10;
  }

  sprite.scale.set(64, 64, 1.0);
  sprite.position.set(randomX, randomY, randomZ);
  sprite.position.setLength(maxParticleSize * Math.random());
  sprite.material.blending = THREE.AdditiveBlending;

  particles.add(sprite);
}
particles.position.y = 70;
scene.add(particles);


clock = new THREE.Clock();

animate();
}


function animate() {
  var elapsedSeconds = clock.getElapsedTime(),
      particleRotationDirection = particleRotationDeg <= 180 ? -1 : 1;

  particles.rotation.y = elapsedSeconds * particleRotationSpeed * particleRotationDirection;
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}


function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}

function getURL(url, callback) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200){
        callback(JSON.parse(xmlhttp.responseText));
      }
      else {
        console.log('We had an error, status code: ', xmlhttp.status);
      }
    }
  }

  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}
