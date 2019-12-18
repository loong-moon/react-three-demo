import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';

import posx from './assets/cube/Bridge2/posx.jpg';
import negx from './assets/cube/Bridge2/negx.jpg';
import posy from './assets/cube/Bridge2/posy.jpg';
import negy from './assets/cube/Bridge2/negy.jpg';
import posz from './assets/cube/Bridge2/posz.jpg';
import negz from './assets/cube/Bridge2/negz.jpg';
import { Event } from 'three';

// const THREE = require('three');
import * as THREE from "three"
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

console.log(React, 'React')

class css3dPanorama extends Component<any, any> {
    el: any;

    componentDidMount(){
        this.props.changePage()

        let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: CSS3DRenderer;
        // var geometry, material, mesh;
        let target = new THREE.Vector3();
        let lon = 90, lat = 0;
        let phi = 0, theta = 0;
        let touchX: number, touchY: number;
        let panoramaBox = this.el;
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
                var object = new CSS3DObject( element );
                object.position.fromArray( side.position );
                object.rotation.fromArray( side.rotation );
                scene.add( object );
            }
            renderer = new CSS3DRenderer();
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
        function onDocumentMouseDown(event: Event) {
            event.preventDefault();
            panoramaBox.addEventListener( 'mousemove', onDocumentMouseMove, false );
            panoramaBox.addEventListener( 'mouseup', onDocumentMouseUp, false );
        }
        function onDocumentMouseMove(event: Event) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            lon -= movementX * 0.1;
            lat += movementY * 0.1;
        }
        function onDocumentMouseUp() {
            panoramaBox.removeEventListener( 'mousemove', onDocumentMouseMove );
            panoramaBox.removeEventListener( 'mouseup', onDocumentMouseUp );
        }
        function onDocumentMouseWheel(event: Event) {
            var fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.Math.clamp( fov, 10, 75 );
            camera.updateProjectionMatrix();
        }
        function onDocumentTouchStart(event: Event) {
            event.preventDefault();
            var touch = event.touches[ 0 ];
            touchX = touch.screenX;
            touchY = touch.screenY;
        }
        function onDocumentTouchMove(event: Event) {
            event.preventDefault();
            var touch = event.touches[ 0 ];
            lon -= ( touch.screenX - touchX ) * 0.1;
            lat += ( touch.screenY - touchY ) * 0.1;
            touchX = touch.screenX;
            touchY = touch.screenY;
        }
        function animate() {
            // requestAnimationFrame( animate );
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

// 添加actions方法到组件props
function mapDispatchToProps(dispatch: any) {
    return {
        changePage: () => dispatch({ type: 'changePage', pageName:['css3dPanorama'] })
    }
}

export default  connect(null, mapDispatchToProps)(css3dPanorama);
