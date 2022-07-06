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



// 点光源 PointLight


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

// 点光源
const pointLight = new THREE.PointLight( "yellow", 1 );
pointLight.castShadow = true;     // 开启阴影
pointLight.shadow.radius = 5;    // 设置聚光灯的模糊度
pointLight.shadow.mapSize.set(2048, 2048);  // 设置聚光灯的分辨率
pointLight.target = cube;   // 聚光灯打在物体上
pointLight.distance = 0;
pointLight.penumbra = 0;
pointLight.decay = 0;

// scene.add( pointLight );

// 创建一个发光的小球
const boxLight = new THREE.SphereBufferGeometry(0.2, 20, 20);
const basicMaterial = new THREE.MeshBasicMaterial({color: "yellow"});
const cube3 = new THREE.Mesh(boxLight, basicMaterial);
cube3.position.set(-2, 2, 2);
cube3.add(pointLight);
scene.add( cube3 );

const gui = new Dat.GUI();
gui.add(cube.position, "x").min(0).max(10).step(0.01)
gui.add(pointLight, "distance").min(0).max(10).step(0.01)
gui.add(pointLight, "decay").min(0).max(5).step(0.01)

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


// 物体滚动的规律总结：
//     1、围绕着y轴旋转就得Math.sin x 轴 和 Math.cos z 轴
//     2、Math.sin x 轴 和 Math.cos z 轴 如果翻过来就是逆时针旋转
//     3、如下 time 乘除就是转速的快慢
//     4、如下 Math.sin(time) 后面乘除就是转动的距离
//     5、如下 Math.sin(time) 后面加减就是移动的距离
const clock = new THREE.Clock();
function renders() {
    // 小物体围绕着旋转
    let time = clock.getElapsedTime();
    cube3.position.x = Math.cos(time / 2) * 3;
    cube3.position.z = Math.sin(time / 2) * 3;

    cube3.position.y = Math.sin(time) * 2 + 2;


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
