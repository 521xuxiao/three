import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from "gsap"

import * as Dat from "dat.gui"

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);  // 设置相机的位置

// 3、将相机添加到场景中
scene.add(camera);

// 环境贴图
const cubeTextureLoader = new THREE.CubeTextureLoader();
const env = cubeTextureLoader.load([
    "textures/environmentMaps/2/px.jpg",
    "textures/environmentMaps/2/nx.jpg",
    "textures/environmentMaps/2/py.jpg",
    "textures/environmentMaps/2/ny.jpg",
    "textures/environmentMaps/2/pz.jpg",
    "textures/environmentMaps/2/nz.jpg",
])

// 创建物体
const cubeGeometry = new THREE.SphereBufferGeometry( 1, 20, 20 );

const material = new THREE.MeshStandardMaterial({
    // envMap: env,     // 环境贴图
    metalness: 0.9,  // 环境贴图必须设置金属材质， 尽量偏金属才会有效果
    roughness: 0.1   // 环境贴图必须设置粗糙属性， 尽量光滑才会有效果
})
scene.background = env;  // 给场景加上背景图
scene.environment = env;   // 环境贴图也可以这样设置，和在材质里面设置 envMap 这个属性，效果是一样的，在这里设置是给场景里面所有的物体都加上贴图
const cube = new THREE.Mesh(cubeGeometry, material);

scene.add(cube);

// 使用标准材质，就得需要灯光了
// 环境光
const light = new THREE.AmbientLight( 0x404040, 0.6 );
scene.add( light );
// 平行光
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set(5, 5, 5);
scene.add( directionalLight );

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小

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


// 添加右上角控制属性的框 GUI, 更多内容，将cube物体打印出来都可以进行修改
const gui = new Dat.GUI();
// gui控制物体的x轴移动
gui.add(cube.position, "x").min(0).max(5).step(0.01).name("控制物体的x轴移动").onChange(function (value) {
    console.log("修改的值是：" + value);
}).onFinishChange(function (val) {
    console.log("完全停下来的值：" + val);
});
// gui控制物体的颜色
gui.addColor({color: 0xffff00}, "color").onChange(function (val) {
    console.log("修改的颜色值：" + val);
    // 修改物体的颜色
    cube.material.color.set(val);
})
// gui控制物体的显示和隐藏
gui.add(cube, "visible").name("物体显隐");
// gui添加函数功能
const params = {
    fn: function () {
        gsap.to(cube.position, {
            x: 5,
            duration: 5,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true
        })
    }
}
gui.add(params, "fn").name("添加函数");
// gui添加文件夹
const folder = gui.addFolder("文件夹名字");
folder.add(cube.material, "wireframe").name("控制线性");





// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
