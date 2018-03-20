import React, { Component } from 'react';
import { connect } from 'react-redux';

import posx from './assets/cube/Bridge2/posx.jpg';
import negx from './assets/cube/Bridge2/negx.jpg';
import posy from './assets/cube/Bridge2/posy.jpg';
import negy from './assets/cube/Bridge2/negy.jpg';
import posz from './assets/cube/Bridge2/posz.jpg';
import negz from './assets/cube/Bridge2/negz.jpg';

// const THREE = require('three');
const THREE = require('three/build/three');

window.THREE = THREE;
require('three/examples/js/renderers/Projector');
require('three/examples/js/renderers/CanvasRenderer');



class CanvasPanorama extends Component {

    componentDidMount(){
        this.props.changePage();

        var camera, scene, renderer;
        var texture_placeholder,
            isUserInteracting = false,
            onPointerDownPointerX = 0, onPointerDownPointerY = 0,
            lon = 90, onPointerDownLon = 0,
            lat = 0, onPointerDownLat = 0,
            phi = 0, theta = 0,
            target = new THREE.Vector3(),
            container = this.el;
        init();
        animate();
        function init() {
            var mesh;
            camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 1, 1100 );
            scene = new THREE.Scene();
            texture_placeholder = document.createElement( 'canvas' );
            texture_placeholder.width = 128;
            texture_placeholder.height = 128;
            var context = texture_placeholder.getContext( '2d' );
            context.fillStyle = 'rgb( 200, 200, 200 )';
            context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
            var materials = [
                loadTexture( posx ), // right
                loadTexture( negx ), // left
                loadTexture( posy ), // top
                loadTexture( negy ), // bottom
                loadTexture( posz ), // back
                loadTexture( negz )  // front
            ];
            var geometry = new THREE.BoxGeometry( 300, 300, 300, 7, 7, 7 );
            geometry.scale( - 1, 1, 1 );
            mesh = new THREE.Mesh( geometry, materials );
            scene.add( mesh );
            renderer = new THREE.CanvasRenderer();

            renderer.setSize( container.clientWidth, container.clientHeight );
            container.appendChild( renderer.domElement );
            container.addEventListener( 'mousedown', onDocumentMouseDown, false );
            container.addEventListener( 'mousemove', onDocumentMouseMove, false );
            container.addEventListener( 'mouseup', onDocumentMouseUp, false );
            container.addEventListener( 'wheel', onDocumentMouseWheel, false );
            container.addEventListener( 'touchstart', onDocumentTouchStart, false );
            container.addEventListener( 'touchmove', onDocumentTouchMove, false );
            //
            window.addEventListener( 'resize', onWindowResize, false );
        }
        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( container.clientWidth, container.clientHeight );
        }
        function loadTexture( path ) {
            var texture = new THREE.Texture( texture_placeholder );
            var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
            var image = new Image();
            image.onload = function () {
                texture.image = this;
                texture.needsUpdate = true;
            };
            image.src = path;
            return material;
        }
        function onDocumentMouseDown( event ) {
            event.preventDefault();
            isUserInteracting = true;
            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
        }
        function onDocumentMouseMove( event ) {
            if ( isUserInteracting === true ) {
                lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
                lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
            }
        }
        function onDocumentMouseUp( event ) {
            isUserInteracting = false;
        }
        function onDocumentMouseWheel( event ) {
            var fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.Math.clamp( fov, 10, 75 );
            camera.updateProjectionMatrix();
        }
        function onDocumentTouchStart( event ) {
            if ( event.touches.length === 1 ) {
                event.preventDefault();
                onPointerDownPointerX = event.touches[ 0 ].pageX;
                onPointerDownPointerY = event.touches[ 0 ].pageY;
                onPointerDownLon = lon;
                onPointerDownLat = lat;
            }
        }
        function onDocumentTouchMove( event ) {
            if ( event.touches.length === 1 ) {
                event.preventDefault();
                lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
                lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
            }
        }
        function animate() {
            requestAnimationFrame( animate );
            update();
        }
        function update() {
            if ( isUserInteracting === false ) {
                lon += 0.1;
            }
            lat = Math.max( - 85, Math.min( 85, lat ) );
            phi = THREE.Math.degToRad( 90 - lat );
            theta = THREE.Math.degToRad( lon );
            target.x = 500 * Math.sin( phi ) * Math.cos( theta );
            target.y = 500 * Math.cos( phi );
            target.z = 500 * Math.sin( phi ) * Math.sin( theta );
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
function mapDispatchToProps(dispatch) {
    return {
        changePage: () => dispatch({ type: 'changePage', pageName:['canvasPanorama'] })
    }
}

export default connect(null, mapDispatchToProps)(CanvasPanorama);
