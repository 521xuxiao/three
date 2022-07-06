import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

// cube.position.set(5, 0, 0);  // 移动物体的位置
// cube.position.x = 3;  // 移动物体的而另外一种方法
// cube.scale.set(3, 2, 1);  // 物体的缩放
// cube.scale.x = 10  // 物体的缩放
// cube.rotation.set(Math.PI / 4, 0, 0) // 围绕着x轴旋转45度
// cube.rotation.set(0, 0, Math.PI / 2, 'XZY')  // 围着z轴旋转90度, 最后一个参数是旋转的顺序，先旋转x轴，在旋转z轴，最后旋转y轴


// 4、将物体添加到场景中
scene.add(cube);

// 5、初始化渲染器
const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight); // 渲染器设置大小

// 6、画布添加到html标签中
document.body.appendChild(render.domElement);

// 添加控制器
const controls =  new OrbitControls(camera, render.domElement);

function renders() {
    // cube.position.x += 0.01;
    // if(cube.position.x > 5) {
    //     cube.position.x = 0;
    // }

    // 7、渲染器将场景和相机渲染在页面实现显示功能
    render.render(scene, camera);

    // 渲染下一帧的时候就会调用renders函数
    requestAnimationFrame(renders);
}
renders();

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
