import React, { Component } from 'react';

import posx from './static/cube/Bridge2/posx.jpg';
import negx from './static/cube/Bridge2/negx.jpg';
import posy from './static/cube/Bridge2/posy.jpg';
import negy from './static/cube/Bridge2/negy.jpg';
import posz from './static/cube/Bridge2/posz.jpg';
import negz from './static/cube/Bridge2/negz.jpg';

const THREE = require('three');
window.THREE = THREE;
require('three/examples/js/renderers/CSS3DRenderer');



class css3dPanorama extends Component {
    // state = {};
    // scene;
    // camera;
    // renderer;
    // cube;
    // width;
    // height;
    //
    // //初始化场景
    // initScene(){
    //     this.scene = new THREE.Scene()
    // }
    //
    // //初始化相机
    // initCamera(){
    //     this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    //     this.camera.position.z = 3;
    // }
    //
    // //初始化渲染器
    // initRenderer(){
    //     this.renderer = new THREE.WebGLRenderer({canvas:this.el});
    //     this.renderer.setSize(this.width, this.height);
    // }
    //
    // //初始化对象
    // initCube(){
    //     var geometry = new THREE.BoxGeometry(1,1,1); //创建一个新的box几何模型
    //     var material = new THREE.MeshBasicMaterial({
    //         color: 0x00ff00,
    //         wireframe: true
    //     }); //创建一个新的基础网孔材料
    //     this.cube = new THREE.Mesh(geometry, material); //创建一个立方体
    //     this.scene.add(this.cube);
    // }

    componentDidMount(){
        var camera, scene, renderer;
        // var geometry, material, mesh;
        var target = new THREE.Vector3();
        var lon = 90, lat = 0;
        var phi = 0, theta = 0;
        var touchX, touchY;
        var panoramaBox = this.el;
        init();
        animate();
        function init() {
            camera = new THREE.PerspectiveCamera( 75, panoramaBox.clientWidth / panoramaBox.clientHeight, 1, 1000 );
            scene = new THREE.Scene();
            var sides = [
                {
                    url: posx,
                    position: [ -512, 0, 0 ],
                    rotation: [ 0, Math.PI / 2, 0 ]
                },
                {
                    url: negx,
                    position: [ 512, 0, 0 ],
                    rotation: [ 0, -Math.PI / 2, 0 ]
                },
                {
                    url: posy,
                    position: [ 0,  512, 0 ],
                    rotation: [ Math.PI / 2, 0, Math.PI ]
                },
                {
                    url: negy,
                    position: [ 0, -512, 0 ],
                    rotation: [ - Math.PI / 2, 0, Math.PI ]
                },
                {
                    url: posz,
                    position: [ 0, 0,  512 ],
                    rotation: [ 0, Math.PI, 0 ]
                },
                {
                    url: negz,
                    position: [ 0, 0, -512 ],
                    rotation: [ 0, 0, 0 ]
                }
            ];
            for ( var i = 0; i < sides.length; i ++ ) {
                var side = sides[ i ];
                var element = document.createElement( 'img' );
                element.width = 1026; // 2 pixels extra to close the gap.
                element.src = side.url;
                var object = new THREE.CSS3DObject( element );
                object.position.fromArray( side.position );
                object.rotation.fromArray( side.rotation );
                scene.add( object );
            }
            renderer = new THREE.CSS3DRenderer();
            renderer.setSize( panoramaBox.clientWidth, panoramaBox.clientHeight );
            panoramaBox.appendChild( renderer.domElement );
            //
            panoramaBox.addEventListener( 'mousedown', onDocumentMouseDown, false );
            panoramaBox.addEventListener( 'wheel', onDocumentMouseWheel, false );
            panoramaBox.addEventListener( 'touchstart', onDocumentTouchStart, false );
            panoramaBox.addEventListener( 'touchmove', onDocumentTouchMove, false );
            window.addEventListener( 'resize', onWindowResize, false );
        }
        function onWindowResize() {
            camera.aspect = panoramaBox.clientWidth / panoramaBox.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( panoramaBox.clientWidth, panoramaBox.clientHeight );
        }
        function onDocumentMouseDown( event ) {
            event.preventDefault();
            panoramaBox.addEventListener( 'mousemove', onDocumentMouseMove, false );
            panoramaBox.addEventListener( 'mouseup', onDocumentMouseUp, false );
        }
        function onDocumentMouseMove( event ) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            lon -= movementX * 0.1;
            lat += movementY * 0.1;
        }
        function onDocumentMouseUp( event ) {
            panoramaBox.removeEventListener( 'mousemove', onDocumentMouseMove );
            panoramaBox.removeEventListener( 'mouseup', onDocumentMouseUp );
        }
        function onDocumentMouseWheel( event ) {
            var fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.Math.clamp( fov, 10, 75 );
            camera.updateProjectionMatrix();
        }
        function onDocumentTouchStart( event ) {
            event.preventDefault();
            var touch = event.touches[ 0 ];
            touchX = touch.screenX;
            touchY = touch.screenY;
        }
        function onDocumentTouchMove( event ) {
            event.preventDefault();
            var touch = event.touches[ 0 ];
            lon -= ( touch.screenX - touchX ) * 0.1;
            lat += ( touch.screenY - touchY ) * 0.1;
            touchX = touch.screenX;
            touchY = touch.screenY;
        }
        function animate() {
            requestAnimationFrame( animate );
            // lon +=  0.1;
            // lat = Math.max( - 85, Math.min( 85, lat ) );
            phi = THREE.Math.degToRad( 90 - lat );
            theta = THREE.Math.degToRad( lon );
            target.x = Math.sin( phi ) * Math.cos( theta );
            target.y = Math.cos( phi );
            target.z = Math.sin( phi ) * Math.sin( theta );
            camera.lookAt( target );
            renderer.render( scene, camera );
        }
    }

    render() {
        return (
            <div className="render-box" ref={el => this.el = el}></div>
        );
    }
}

export default css3dPanorama;
