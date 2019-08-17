import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r107/build/three.module.js'
import { OutlineEffect } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r107/examples/jsm/effects/OutlineEffect.js'
import { PLYLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r107/examples/jsm/loaders/PLYLoader.js'

let scene, camera, effect, logo
let paused = false

init()
animate()


/* FUNCTION DEFINITIONS */

function init() {
  const renderer = new THREE.WebGLRenderer({antialias: true})
  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera()
  logo = new THREE.Group()

  scene.background = new THREE.Color(0xe7e5e6)
  adjustCamera(camera)
  renderer.setSize(window.innerWidth, window.innerHeight)
  effect = new OutlineEffect(renderer)

  // react to window resize
  window.onresize = () => {
    effect.setSize(window.innerWidth, window.innerHeight)
    adjustCamera(camera)
    effect.render(scene, camera)
  }

  // pause-resume animation
  effect.domElement.onclick = () => {
    paused = !paused
    if(!paused) {
      animate()
    }
  }

  document.body.appendChild(effect.domElement)

  const loader = new PLYLoader()

  // load parts, set-up materials and render
  Promise.all([
    promiseLoad(loader, './part-1.ply'),
    promiseLoad(loader, './part-2.ply'),
  ])
  .then(geometries => {
    geometries.forEach((geometry, index) => {
      geometry.computeFaceNormals()
      const material = new THREE.MeshBasicMaterial()
      material.vertexColors = THREE.VertexColors
      material.side = THREE.DoubleSide
      material.userData.outlineParameters = {
        thickness: index === 0 ? 0.003 : 0      // give outline effect to part-1
      }
      const mesh = new THREE.Mesh(geometry, material)
      logo.add(mesh)
    })
  })
  .then(() => {
    logo.rotation.x = Math.PI / 6
    scene.add(logo)
    effect.render(scene, camera)
  })
}

function adjustCamera(cam) {
  const s = 2
  const w = window.innerWidth
  const h = window.innerHeight
  let ratio

  if (w <= h) {
    ratio = h / w
    cam.right = s
    cam.left = -s
    cam.top = s * ratio
    cam.bottom = -s * ratio
  } else {
    ratio = w / h
    cam.right = s * ratio
    cam.left = -s * ratio
    cam.top = s
    cam.bottom = -s
  }
  
  camera.position.z = 5;
  cam.updateProjectionMatrix()
}

function promiseLoad(loader, file) {
  return new Promise(resolve => {
    loader.load(file, geometry => resolve(geometry))
  })
}

function animate() {
  if(!paused) {
    logo.rotation.y += -0.01
    effect.render(scene, camera)
    requestAnimationFrame(animate)
  }
}