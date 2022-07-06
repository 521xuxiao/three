import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { RGBELoader } from "three/examples/jsm/loaders/RGBEloader.js"  // 加载 HDR 图片

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 0.1);  // 设置相机的位置

// 3、将相机添加到场景中
scene.add(camera);

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
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

// 使用标准材质，就得需要灯光了
// 环境光
const light = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( light );
// 平行光
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(5, 5, 5);
scene.add( directionalLight );


// // 添加坐标辅助器
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 添加立方体 ( 方法一 )
// const geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
// 添加材质（ map贴图 ）
// var arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f" ];
// var boxMaterials = [];
// arr.forEach((item)=> {
//     let texture = new THREE.TextureLoader().load("./imgs/living/"+ item +".jpg");
//     if(item == "4_u" || item == "4_d") {
//         // 找到上下面材质围绕着中心点旋转180度
//         texture.rotation = Math.PI;
//         texture.center = new THREE.Vector2(0.5, 0.5);
//     }
//     boxMaterials.push(new THREE.MeshBasicMaterial({
//         map: texture,
//         side: THREE.DoubleSide
//     }))
// })
// const cube = new THREE.Mesh( geometry, boxMaterials );  // 构建物体的时候第二个参数可以放一个材质， 也可以放一个材质数组, 分别对应立方体的六个面
// scene.add( cube );


// 添加材质（ 加载hdr纹理, 方法二 ）
const geometry = new THREE.SphereGeometry( 8, 32, 32 );
const texture = new RGBELoader();
texture.load("./imgs/hdr/Living.hdr", function (val) {
    const meshStandardMaterial = new THREE.MeshStandardMaterial({
        map: val,
        side: THREE.BackSide
    })
    const cube = new THREE.Mesh( geometry, meshStandardMaterial );  // hdr贴图
    scene.add( cube );
})


