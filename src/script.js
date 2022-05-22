import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// Textures
function makeImageTexture(imageFilename) {
    const img = new Image()
    const tex = new THREE.Texture(img)
    img.onload = () => {
      tex.needsUpdate = true
    }
    img.src = imageFilename
    return tex
}

const texMarkus = makeImageTexture('mrks.jpeg')
const texWenMoon = makeImageTexture('wenMoon.jpeg')


const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('star.png')


// Particles

const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)
const count = 4223

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 23
    colors[i] = Math.random()

}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
//particlesMaterial.color = new THREE.Color ('#00ff00')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.alphaTest = 0.001
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const matMarkus = new THREE.MeshBasicMaterial({ map: texMarkus })
matMarkus.flatShading = true
const matWenMoon = new THREE.MeshBasicMaterial({ map: texWenMoon })
matWenMoon.flatShading = true

const markus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 16),
    matMarkus
)
markus.position.x = 0

const wenMoon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 16),
    matWenMoon
)
wenMoon.position.x = 0

scene.add(markus, particles)
scene.add(wenMoon)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    particles.rotation.y = 0.02 * elapsedTime
    markus.rotation.x = 0.3 * elapsedTime
    markus.rotation.y = 0.1 * elapsedTime


    const 𝛕 = 6.28318
    const orbit = {
      eccentricity: 0.0,
      siderealOrbitPeriod: 1.0,
    }
    const aRadius = 1.25
    const bRadius = aRadius * Math.sqrt(1.0 - Math.pow(orbit.eccentricity, 2.0))
    const angle = 1.0 * 0.02 * elapsedTime / orbit.siderealOrbitPeriod * 𝛕
    const x = aRadius * Math.cos(angle)
    const y = bRadius * Math.sin(angle)
    const z = 0
    wenMoon.position.set(x, y, z)
    wenMoon.rotation.x = 𝛕 / 2
    wenMoon.rotation.z = 𝛕 / 3
    wenMoon.rotation.y = -1 + 2 * markus.rotation.y * 𝛕 / 3


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
