import React, { Component } from 'react';
import * as THREE from 'three';

class Line extends Component {
    state = {};
    scene;
    camera;
    renderer;
    width;
    height;

    //初始化场景
    initScene(){
        this.scene = new THREE.Scene()
    }

    //初始化相机
    initCamera(){

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.y = 1000;
        this.camera.position.z = 0;
        this.camera.up.x = 0;
        this.camera.up.y = 0;
        this.camera.up.z = 1;
        this.camera.lookAt(0,0,0);

        // this.camera.position.set(0,0,50);
        // this.camera.lookAt(new THREE.Vector3(0,0,0));
    }

    //初始化渲染器
    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.el,
            // antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xFFFFFF, 1.0);
    }

    //初始化对象
    initObject(){

        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({ vertexColors: true });
        var color1 = new THREE.Color( 0x00FF00 ), color2 = new THREE.Color( 0xFF0000 );

        // 线的材质可以由2点的颜色决定
        var p1 = new THREE.Vector3( -100, 0, 100 );
        var p2 = new THREE.Vector3(  100, 0, -100 );
        geometry.vertices.push( p1, p2);
        geometry.colors.push( color1, color2 );
        // console.log(THREE.VertexColors)

        // geometry.vertices.push(
        //     new THREE.Vector3( -10, 0, 0 ),
        //     new THREE.Vector3( 0, 10, 0 ),
        //     new THREE.Vector3( 10, 0, 0 )
        // );

        var line = new THREE.Line( geometry, material );
        this.scene.add(line);
    }

    //初始化灯光
    initLight() {
        let light = new THREE.DirectionalLight(0xFF0000, 1.0);
        light.position.set(100, 100, 200);
        this.scene.add(light);
    }

    componentDidMount(){
        this.width = this.el.clientWidth
        this.height = this.el.clientHeight

        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLight();
        this.initObject();

        this.renderer.render(this.scene, this.camera);

        // let render = () => {
        //     this.renderer.clear();
        //     this.renderer.render(this.scene, this.camera);
        //     requestAnimationFrame(render);
        // }
        // render()



    }

    render() {
        return (
            <canvas className="render-box" ref={el => this.el = el}></canvas>
        );
    }
}

export default Line;
