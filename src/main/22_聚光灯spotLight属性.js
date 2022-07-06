import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from "gsap"

import * as Dat from "dat.gui"

import { RGBELoader } from "three/examples/jsm/loaders/RGBEloader.js"  // 加载 HDR 图片

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);  // 设置相机的位置

// 3、将相机添加到场景中
scene.add(camera);



// 聚光灯 SpotLight：设置聚光灯的属性，见下面（一般用的不多）


// 创建物体
const cubeGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
})
const cube = new THREE.Mesh(cubeGeometry, material);
cube.castShadow = true;
scene.add(cube);

// 创建平面
const plane = new THREE.PlaneBufferGeometry(100, 100);
const cube2 = new THREE.Mesh(plane, material);
cube2.receiveShadow = true;
cube2.position.z = -1
cube2.rotation.x = -Math.PI / 2;
cube2.position.y = -1;
scene.add(cube2);

// 使用标准材质，就得需要灯光了
// 环境光
const light = new THREE.AmbientLight( 0x404040, 0.6 );
scene.add( light );

// 聚光灯
const spotLight = new THREE.SpotLight( 0xffffff, 5 );
spotLight.position.set(5, 5, 5);
spotLight.castShadow = true;     // 开启阴影
spotLight.shadow.radius = 5;    // 设置聚光灯的模糊度
spotLight.shadow.mapSize.set(2048, 2048);  // 设置聚光灯的分辨率
spotLight.target = cube;   // 聚光灯打在物体上
spotLight.angle = Math.PI / 6;
spotLight.distance = 0;
spotLight.penumbra = 0;
spotLight.decay = 0;

scene.add( spotLight );

const gui = new Dat.GUI();
gui.add(cube.position, "x").min(0).max(10).step(0.01)
gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.01)
gui.add(spotLight, "distance").min(0).max(10).step(0.01)
gui.add(spotLight, "decay").min(0).max(5).step(0.01)

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小
render.shadowMap.enabled = true;
render.physicallyCorrectLights = true;

// 6、画布添加到html标签中
document.body.appendChild(render.domElement);

// 添加控制器
const controls =  new OrbitControls(camera, render.domElement);
controls.enableDamping = true;  // 给控制器添加阻尼的感觉， 更真实一点

function renders() {
    // 7、渲染器将场景和相机渲染在页面实现显示功能
    render.render(scene, camera);

    // 控制器的阻尼
    controls.update();

    // 渲染下一帧的时候就会调用renders函数
    requestAnimationFrame(renders);
}
renders();

// 窗口变化canvase变化
window.addEventListener("resize", function () {
    // 更新摄像头的宽高比
    camera.aspect = window.innerWidth / window.innerHeight;

    // 更新摄像头的投影矩阵
    camera.updateProjectionMatrix();

    // 更新渲染器
    render.setSize(window.innerWidth, window.innerHeight);

    // 设置渲染器的像素比
    render.setPixelRatio(window.devicePixelRatio);
})

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
