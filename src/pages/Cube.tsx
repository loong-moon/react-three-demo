import React, {Component} from 'react';
import {connect} from 'react-redux'

import * as THREE from "three"

class Cube extends Component<any, any> {
    state = {};
    scene: any;
    camera: any;
    renderer: any;
    cube: any;
    width: any;
    height: any;
    el: any;

    //初始化场景
    initScene(){
        this.scene = new THREE.Scene()
    }

    //初始化相机
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.x = 30;
        this.camera.position.y = -10;
        this.camera.position.z = 10;
        // this.camera.up.x = 0;//正方向
        // this.camera.up.y = 1;
        // this.camera.up.z = 0;
        // console.log(this.scene.position)
        this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    }

    //初始化渲染器
    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({canvas: this.el});
        this.renderer.setSize(this.width, this.height);
    }

    //初始化对象
    initCube(){
        var geometry = new THREE.BoxGeometry(10,10,10); //创建一个新的box几何模型
        var materials = [
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            }), //红 x+
            new THREE.MeshBasicMaterial({
                color: 0xffff00
            }), //黄 x-
            new THREE.MeshBasicMaterial({
                color: 0x00ff00
            }), //绿 y+
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            }), //青 y-
            new THREE.MeshBasicMaterial({
                color: 0x0000ff
            }), //蓝 z+
            new THREE.MeshBasicMaterial({
                color: 0xff00ff
            }) //洋红 z-
        ]

        // console.log(geometry)
        this.cube = new THREE.Mesh(geometry, materials); //创建一个立方体
        this.scene.add(this.cube);
    }

    componentDidMount(){
        console.log(this, 'cubeComponent')
        this.props.changePage()
        // this.props.setCurrentPage('end')

        this.width = this.el.clientWidth
        this.height = this.el.clientHeight

        this.initScene()
        this.initCamera();
        this.initRenderer()
        this.initCube();

        let render = () => {
            requestAnimationFrame(render);
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        }
        render()
    }

    render() {
        return (
            <canvas className="render-box" ref={el => this.el = el}></canvas>
        );
    }
}


// 添加actions方法到组件props
function mapDispatchToProps(dispatch: any) {
    return {
        changePage: () => dispatch({ type: 'changePage', pageName:['cube'] })
    }
}

export default connect(null, mapDispatchToProps)(Cube);
