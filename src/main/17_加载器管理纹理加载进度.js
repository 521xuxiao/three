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

// 加载管理器， 控制纹理或者模型比较多的时候，浏览器加载比较慢，可以做个加载进度条提醒
const param = {};
param.onLoad = function () {
    console.log("加载完成");
}
param.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log("加载的路径", url);
    console.log("加载的哪一个文件", itemsLoaded);
    console.log("加载的纹理或者模型的总数量", itemsTotal);
}
param.onError = function () {
    console.log("加载失败");
}
const manager = new THREE.LoadingManager(
    param.onLoad,
    param.onProgress,
    param.onError
);


// 颜色贴图 纹理  map
const textureLoader = new THREE.TextureLoader(manager);
const door = textureLoader.load("./textures/door/color.jpg");
const doorAlphaMap = textureLoader.load("./textures/door/alpha.jpg")     // 透明纹理 alphaMap 用于铁栅栏， 黑色的代表不透明， 白色的代表透明
const doorAoLoader = textureLoader.load("./textures/door/ambientOcclusion.jpg");    // AO贴图，也叫环境遮挡贴图，看起来更有3D的感觉， 但还是平面
const displacementTextureloader = textureLoader.load("./textures/door/height.jpg");  // 位移贴图，实现立体感，在创建几何体的时候需要加后面的几个参数
const roughness = textureLoader.load("./textures/door/roughness.jpg");     // 粗糙度贴图， 金属部分更光滑，木材质部分显得粗糙一些
const metalness = textureLoader.load("./textures/door/metalness.jpg");      // 金属贴图
const normal = textureLoader.load("./textures/door/normal.jpg");    // 法线贴图

// 创建物体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
cubeGeometry.setAttribute("uv2", new THREE.BufferAttribute( cubeGeometry.attributes.uv.array, 2 ));  // 给几何设置第二组uv，配合ao贴图一起使用（看材质里面的AO贴图）
const material = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    map: door,  // 纹理（颜色贴图） （带有颜色的图片）

    alphaMap: doorAlphaMap, // 透明纹理 alphaMap 用于铁栅栏， 黑色的代表不透明， 白色的代表透明  （一张黑白灰三色的图片）
    transparent: true,      // 设置透明纹理，此属性必须设置为 true

    aoMap: doorAoLoader,   // AO贴图，也叫环境遮挡贴图，看起来更有3D的感觉， 但还是平面, 需要第二组UV （一张类似于铅笔画的素描）
    aoMapIntensity: 1,     // AO贴图的颜色深浅

    displacementMap: displacementTextureloader,  // 位移贴图，实现立体感，在创建几何体的时候需要加后面的几个参数 （一张灰色的颜色的图片）
    displacementScale: 0.08,                     // 位移贴图的拉扯的位置

    roughnessMap: roughness,   // 粗糙度贴图
    roughness: 1,              // 粗糙度 0越光滑 1越粗糙

    metalnessMap: metalness,  // 金属贴图
    metalness: 1,             // 金属度

    normalMap: normal,        // 法线贴图

    side: THREE.DoubleSide,   // 材质中的双边渲染
})
const cube = new THREE.Mesh(cubeGeometry, material);

// 在添加一个平面的物体
const plane = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
const mesh2 = new THREE.Mesh(plane, material);
mesh2.position.x = 2;
mesh2.rotation.y = Math.PI / 2;
// 给平面几何体添加uv属性, 配合ao贴图一起配置
plane.setAttribute("uv2", new THREE.BufferAttribute(plane.attributes.uv.array, 2));

scene.add(mesh2);

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
