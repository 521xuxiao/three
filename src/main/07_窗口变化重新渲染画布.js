import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gsap from "gsap"

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);  // 设置相机的位置

// 3、将相机添加到场景中
scene.add(camera);

//创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(geometry, cubeMaterial);

// 4、将物体添加到场景中
scene.add(cube);

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小

// 6、画布添加到html标签中
document.body.appendChild(render.domElement);

// 添加控制器
const controls =  new OrbitControls(camera, render.domElement);
controls.enableDamping = true;  // 给控制器添加阻尼的感觉， 更真实一点

// const clock = new THREE.Clock();

// gsap 动画属性的演示
var animate1 = gsap.to(cube.position, {
    x: 5,
    duration: 5,
    ease: 'power1.inOut',
    repeat: -1,  // 重复2次动画， 设置为-1时，是一直重复
    yoyo: true,  // 设置往返运动
    onComplete: function () {
        console.log("动画完成了");
    },
    onStart: function () {
        console.log("动画开始");
    }
})
var animate2 = gsap.to(cube.rotation, {
    x: Math.PI * 2,
    duration: 5,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
})
// gsap动画方法的演示
window.addEventListener("dblclick", function () {
    if( animate1.isActive() && animate2.isActive() ) { // 判断当前动画是否在运动
        animate1.pause();  // 动画停止
        animate2.pause();
    }else{
        animate1.resume();  // 动画运动
        animate2.resume();
    }
})

function renders() {
    // console.log(clock.getElapsedTime())
    // console.log(clock.getDelta())

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
