import './style.css'
import {
    AxesHelper,
    BufferGeometry,
    Clock,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    MathUtils,
    Mesh,
    MeshBasicMaterial, MeshDepthMaterial, MeshLambertMaterial,
    MeshNormalMaterial,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    SphereBufferGeometry,
    TextureLoader,
    VertexColors,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const count = 100;
const distance = 4;
const size = 0.2;

const scene = new Scene();
// scene.add(new AxesHelper());

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 2;
camera.position.y = -0.5;
camera.position.x = -0.5;

const textureLoader = new TextureLoader();
const circleTexture = textureLoader.load('/circle.png');
const alphaMap = textureLoader.load('/alphamap.png');

const points = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < points.length; i++) {
    points[i] = MathUtils.randFloatSpread(distance * 2);
    colors[i] = Math.random() * 0.5 + 0.5;
}

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

const pointsMaterial = new PointsMaterial({
    vertexColors: VertexColors,
    size: size,
    transparent: true,
    alphaMap: alphaMap,
    alphaTest: 0.5,
    // map: circleTexture,
});

const pointsObj = new Points(geometry, pointsMaterial);
const group = new Group();
group.add(pointsObj);

const lineMaterial = new LineBasicMaterial({
    color: 0x000000,
    opacity: .05,
    depthTest: false
})
const lineObj = new Line(geometry,lineMaterial);
group.add(lineObj);

group.add(new Mesh(new SphereBufferGeometry(0.5,32), new MeshNormalMaterial));


scene.add(camera, group);



const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
})
renderer.setClearColor(0x000000, 0)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// const clock = new Clock();

let mouseX = 0;
let mouseY = 0;
addEventListener('mousemove',(e) =>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function tick() {
    // const time = clock.getElapsedTime();
    renderer.render(scene, camera);
    // controls.update();
    // group.rotation.y = time * 0.05;
    const ratioX = (mouseX / window.innerWidth - 0.5) * 2;
    group.rotation.y = ratioX * Math.PI *  0.1;
    const ratioY = (mouseY / window.innerWidth - 0.5) * 2;
    group.rotation.x = ratioY * Math.PI * 0.1;


    requestAnimationFrame(tick);
}

tick();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})