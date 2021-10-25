import './style.css'
import * as THREE from 'three'

import sakura1 from './textures/sprites/sakuraPetal.png'
import sakura2 from './textures/sprites/sakura.png'

let camera, scene, renderer, stats, parameters;
let mouseX = 0, mouseY = 0;
const canvas = document.querySelector('canvas.webgl')
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const materials = [];

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0020 );

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const textureLoader = new THREE.TextureLoader();

    
    const sprite1 = textureLoader.load( sakura1 );
    const sprite2 = textureLoader.load( sakura2 );
    

    for ( let i = 0; i < 10000; i ++ ) {

        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        vertices.push( x, y, z );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    parameters = [
        [[ 1.0, 0.2, 0.5 ], sprite2, 25],
        [[ 0.95, 0.1, 0.5 ], sprite1, 10 ],
    ];

    for ( let i = 0; i < parameters.length; i ++ ) {

        const color = parameters[ i ][ 0 ];
        const sprite = parameters[ i ][ 1 ];
        const size = parameters[ i ][ 2 ];

        materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );

        const particles = new THREE.Points( geometry, materials[ i ] );

        particles.rotation.x = Math.random() * 3;
        particles.rotation.y = Math.random() * 3;
        particles.rotation.z = Math.random() * 3;

        scene.add( particles );

    }


    renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(new THREE.Color(`#21283a`),1)
    
    document.body.appendChild( renderer.domElement );
    document.body.style.touchAction = 'none';
    document.body.addEventListener( 'pointermove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );
    

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const time = Date.now() * 0.00005;

    camera.position.x += ( mouseX - camera.position.x ) * 0.025;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.025;

    camera.lookAt( scene.position );

    for ( let i = 0; i < scene.children.length; i ++ ) {

        const object = scene.children[ i ];

        if ( object instanceof THREE.Points ) {

            object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

        }

    }

    renderer.render( scene, camera );

}