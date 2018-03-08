import React, { Component } from 'react';
import * as THREE from 'three';

class CubeA extends Component {
    state = {};
    scene;
    camera;
    renderer;
    cube;
    width;
    height;

    //初始化场景
    initScene(){
        this.scene = new THREE.Scene()
    }

    //初始化相机
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.z = 3;
    }

    //初始化渲染器
    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({canvas:this.el});
        this.renderer.setSize(this.width, this.height);
    }

    //初始化对象
    initCube(){
        var geometry = new THREE.BoxGeometry(1,1,1); //创建一个新的box几何模型
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        }); //创建一个新的基础网孔材料
        this.cube = new THREE.Mesh(geometry, material); //创建一个立方体
        this.scene.add(this.cube);
    }

    componentDidMount(){
        this.width = this.el.clientWidth
        this.height = this.el.clientHeight

        this.initScene()
        this.initCamera();
        this.initRenderer()
        this.initCube();

        let render = () => {
            requestAnimationFrame(render);
            this.cube.rotation.x += 0.1;
            this.cube.rotation.y += 0.1;
            this.renderer.render(this.scene, this.camera);
        }
        render()
    }

    render() {
        return (
            <canvas ref={el => this.el = el}></canvas>
        );
    }
}

export default CubeA;
