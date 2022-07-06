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



// 灯光阴影的设置：
//    1、设置渲染器开启阴影计算 render.shadowMap.enabled = true;
//    2、设置光照投射阴影      directionalLight.castShadow = true;
//    3、设置物体投射阴影      cube.castShadow = true;
//    4、设置物体接受阴影      cube2.receiveShadow = true;



// 创建物体
const cubeGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
})
const cube = new THREE.Mesh(cubeGeometry, material);
cube.castShadow = true;
scene.add(cube);

// 创建平面
const plane = new THREE.PlaneBufferGeometry(10, 10);
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

// 平行光
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add( directionalLight );

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小
render.shadowMap.enabled = true;

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
