import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from "gsap"

import * as Dat from "dat.gui"

import { RGBELoader } from "three/examples/jsm/loaders/RGBEloader.js"  // 加载 HDR 图片

// 导入gltf载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js" // gltf加载器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'    // 导入glb的解压模型的库

import { Water } from "three/examples/jsm/objects/Water2.js"

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-50, 50, 130);  // 设置相机的位置

// 3、将相机添加到场景中
scene.add(camera);

// 5、初始化渲染器
const render = new THREE.WebGLRenderer({
    antialias: true,  // 设置锯齿
    logarithmicDepthBuffer: true  // 对数深度缓冲，对大的glb模型渲染的时候闪烁就需要用到它
});
render.outputEncoding = THREE.sRGBEncoding;  // 设置渲染器的编码

render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小

// 6、画布添加到html标签中
document.body.appendChild(render.domElement);

// 添加控制器
const controls =  new OrbitControls(camera, render.domElement);
controls.enableDamping = true;  // 给控制器添加阻尼的感觉， 更真实一点

function renders() {

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

// // 添加坐标辅助器
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const geometry = new THREE.SphereGeometry( 1000, 32, 32 );

const texture = new THREE.TextureLoader();
const mapTexture = texture.load("textures/tianshuiyise/sky.jpg");  // 天空纹理
const material = new THREE.MeshBasicMaterial( {
    // map: mapTexture,
    side: THREE.DoubleSide
} );
material.map = mapTexture;
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

// 加载天空的视频纹理
const video = document.createElement("video");
video.src = "./textures/tianshuiyise/sky.mp4";
video.loop = "loop";
window.addEventListener("click", function () {
    if(video.paused) {  // 判断当前视频是否正在播放
        video.play();  // 播放视频
        material.map = new THREE.VideoTexture(video);
        material.map.needsUpdate = true;
    }
})


// 创建THREEjs中的水面
const waterGeometry = new THREE.CircleBufferGeometry(300, 64); // 平面圆
const water = new Water(waterGeometry, {
    textureWidth: 1024,  // 设置水面的宽
    textureHeight: 1024, // 设置水面的高
    color: 0xeeeeff,     // 设置水面的颜色
    flowDirection: new THREE.Vector2(1, 1), // 设置水面的流动方向
    scale: 1,   // 设置水面的波纹的大小
    flowSpeed: 0.01,  // 设置水流的速度
})
water.rotation.x = -Math.PI / 2;
water.position.y = 3;
scene.add(water);


// 加载glb 小岛模型
const loader = new GLTFLoader();  // 实例化gltf载入库
const dracoloader = new DRACOLoader();   // 实例化draco载入库
dracoloader.setDecoderPath("./draco/");
loader.setDRACOLoader(dracoloader);

loader.load("./model/island2.glb",  function (gltf) {
    const gltfScene = gltf.scene;
    // gltfScene.position.y = -60;
    scene.add(gltfScene);
})

// 导入的小岛模型是黑色的， 还得加上环境纹理
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./assets/050.hdr").then(function (texture) {
    texture.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = texture;
    scene.environment = texture;
})

// 加入平行光， 让小岛更亮一些
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(-100, 100, 100);
scene.add( directionalLight );
