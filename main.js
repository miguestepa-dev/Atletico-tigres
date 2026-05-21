// IMPORTS

import * as THREE from 'three'

import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'

import gsap from 'gsap'

import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

// GSAP

gsap.registerPlugin(ScrollTrigger) 

// SCENE

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x050816)

scene.fog = new THREE.Fog(0x050816, 10, 40)

// CAMERA

const camera = new THREE.PerspectiveCamera(

    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000

)

camera.position.set(0, 0, 6)

// RENDERER

const renderer = new THREE.WebGLRenderer({

    canvas: document.querySelector('#bg'),

    antialias: true,

    alpha: true

})

renderer.setSize(

    window.innerWidth,
    window.innerHeight

)

renderer.setPixelRatio(window.devicePixelRatio)

renderer.shadowMap.enabled = true

renderer.outputColorSpace = THREE.SRGBColorSpace

// LIGHTS

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
)

scene.add(ambientLight)

// DIRECTIONAL

const directionalLight = new THREE.DirectionalLight(
    0xF05A24,
    3
)

directionalLight.position.set(5,5,5)

directionalLight.castShadow = true

scene.add(directionalLight)

// POINT LIGHT

const pointLight = new THREE.PointLight(
    0x123D8D,
    5
)

pointLight.position.set(-5,2,5)

scene.add(pointLight)

// SPOT LIGHT

const spotLight = new THREE.SpotLight(
    0xffffff,
    5
)

spotLight.position.set(0,10,5)

spotLight.castShadow = true

scene.add(spotLight)

// PARTICLES

const particlesGeometry = new THREE.BufferGeometry()

const particlesCount = 4000

const positions = new Float32Array(
    particlesCount * 3
)

for(let i = 0; i < particlesCount * 3; i++){

    positions[i] = (Math.random() - 0.5) * 50

}

particlesGeometry.setAttribute(

    'position',

    new THREE.BufferAttribute(positions,3)

)

const particlesMaterial = new THREE.PointsMaterial({

    color:0xffffff,

    size:0.03

})

const particles = new THREE.Points(

    particlesGeometry,
    particlesMaterial

)

scene.add(particles)

// LOADER

const loader = new GLTFLoader()

// MODEL

let model

// LOAD MODEL

loader.load(

    './models/pelota.glb',

    function(gltf){

        model = gltf.scene

        // SCALE

        model.scale.set(2,2,2)

        // POSITION

        model.position.set(0,0,0)

        // SHADOWS

        model.traverse((child)=>{

            if(child.isMesh){

                child.castShadow = true

                child.receiveShadow = true

            }

        })

        // ADD SCENE

        scene.add(model)

        console.log('Modelo cargado')

    },

    function(xhr){

        console.log(

            (xhr.loaded / xhr.total * 100)
            + '% cargado'

        )

    },

    function(error){

        console.error(error)

    }

)

// RAYCASTER

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

// MOUSE MOVE

window.addEventListener('mousemove',(event)=>{

    mouse.x =
        (event.clientX / window.innerWidth)
        * 2 - 1

    mouse.y =
        -(event.clientY / window.innerHeight)
        * 2 + 1

})

// CLICK EVENT

window.addEventListener('click',()=>{

    if(model){

        gsap.to(model.scale,{

            x:2.5,
            y:2.5,
            z:2.5,

            duration:0.2,

            yoyo:true,

            repeat:1

        })

    }

})

// HERO ANIMATION

gsap.from('.hero .content',{

    opacity:0,

    y:100,

    duration:1.5,

    ease:'power3.out'

})

// SECTION ANIMATIONS

gsap.utils.toArray('.section').forEach((section)=>{

    const content = section.querySelector('.content')

    if(content){

        gsap.from(content,{

            opacity:0,

            y:80,

            duration:1,

            scrollTrigger:{

                trigger:section,

                start:'top 75%',

                end:'bottom 30%',

                toggleActions:'play none none reverse'

            }

        })

    }

})

// CAMERA SCROLL

gsap.to(camera.position,{

    z:4,

    y:1.5,

    scrollTrigger:{

        trigger:'.about',

        start:'top center',

        end:'bottom center',

        scrub:true

    }

})

// LIGHT ANIMATION

gsap.to(directionalLight.position,{

    x:-5,

    z:2,

    scrollTrigger:{

        trigger:'.services',

        start:'top center',

        end:'bottom center',

        scrub:true

    }

})

// PARTICLE MOVEMENT

gsap.to(particles.rotation,{

    y:Math.PI * 2,

    scrollTrigger:{

        trigger:'.experience',

        start:'top center',

        end:'bottom center',

        scrub:true

    }

})

// RESPONSIVE

window.addEventListener('resize',()=>{

    camera.aspect =
        window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(

        window.innerWidth,
        window.innerHeight

    )

})

// ANIMATE

function animate(){

    requestAnimationFrame(animate)

    // MODEL ROTATION

    if(model){

        model.rotation.y += 0.005

    }

    // PARTICLES

    particles.rotation.y += 0.0005

    // RAYCASTER

    raycaster.setFromCamera(mouse,camera)

    const intersects = raycaster.intersectObjects(

        scene.children,
        true

    )

    // HOVER EFFECT

    if(intersects.length > 0 && model){

        gsap.to(model.scale,{

            x:2.2,
            y:2.2,
            z:2.2,

            duration:0.3

        })

    }else if(model){

        gsap.to(model.scale,{

            x:2,
            y:2,
            z:2,

            duration:0.3

        })

    }

    // RENDER

    renderer.render(scene,camera)

}

animate()