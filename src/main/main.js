import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer"

// 生命全局变量
let camera, scene, renderer, labelRenderer;
let moon, earth;

// 地球和月球半径大小
const EARTH_RADIUS = 2.5;
const MOON_RADIUS = 0.27;
let clock = new THREE.Clock();

// 实例化纹理加载器
const textureLoader = new THREE.TextureLoader();

function init() {


    // 实例化相机
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(10, 5, 20);

    // 实例化场景
    scene = new THREE.Scene();

    // 创建聚光灯灯源添加到场景中
    const dirLight = new THREE.SpotLight(0xffffff, 2);
    dirLight.position.set(0, 0, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const light = new THREE.AmbientLight( 0x404040, 1 );
    scene.add( light );

    // 添加月球
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        map: textureLoader.load("./assets/planets/moon_1024.jpg")
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.receiveShadow = true;
    moon.castShadow = true;
    scene.add(moon);

    // 添加地球
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("./assets/planets/earth_atmos_2048.jpg"),
        color: 0xffffff,
        shininess: 10,  // .specular高亮的程度，越高的值越闪亮。默认值为 30
        specularMap: textureLoader.load("./assets/planets/earth_specular_2048.jpg"),  // 镜面反射贴图， MeshPhongMaterial材质才有的贴图
        normalMap: textureLoader.load("./assets/planets/earth_normal_2048.jpg"),  // 法线贴图
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    scene.add(earth);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true // 给父元素添加背景图片的时候， 此处打开说明渲染画布是透明的颜色，才可以看到设置到body元素上的背景图
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 字体渲染(第二步)
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    animate()
}
init()



function animate() {
    const elapsed = clock.getElapsedTime();
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);  // 月球围绕着地球做公转

    // 地球自转
    var axis = new THREE.Vector3(0, 1, 0);
    earth.rotateOnAxis(axis, Math.PI / 1000);  // 地球围绕着y轴自转

    // 渲染器渲染
    renderer.render(scene, camera);

    // 字体渲染(第三步)
    labelRenderer.render(scene, camera);


    window.requestAnimationFrame(animate);


    // 字体渲染(第一步)
    const earthDiv = document.createElement("div");
    earthDiv.className = "label";
    earthDiv.textContent = "Earth";
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0, EARTH_RADIUS + 0.3, 0);
    earth.add(earthLabel);

    // 字体渲染月球(第一步)  （再多的文字展示框只需要添加第一步就可以了）
    const moonDiv = document.createElement("div");
    moonDiv.className = "label";
    moonDiv.textContent = "Moon";
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0, MOON_RADIUS + 0.3, 0);
    moon.add(moonLabel);
}
