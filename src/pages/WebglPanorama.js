import React, { Component } from 'react';
import { connect } from 'react-redux'

import posx from './assets/cube/Bridge2/posx.jpg';
import negx from './assets/cube/Bridge2/negx.jpg';
import posy from './assets/cube/Bridge2/posy.jpg';
import negy from './assets/cube/Bridge2/negy.jpg';
import posz from './assets/cube/Bridge2/posz.jpg';
import negz from './assets/cube/Bridge2/negz.jpg';

// const THREE = require('three');
const THREE = require('three/build/three');
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls');



class WebglPanorama extends Component {

    componentDidMount(){
        this.props.changePage()

        var camera, controls;
        var renderer;
        var scene;
        var container = this.el;
        init();
        animate();
        function init() {

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( container.clientWidth / container.clientHeight );
            renderer.setSize( container.clientWidth, container.clientHeight );
            container.appendChild( renderer.domElement );
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( 90, container.clientWidth / container.clientHeight, 0.1, 100 );
            camera.position.z = 0.01;
            controls = new THREE.OrbitControls( camera, renderer.domElement );
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableDamping = true;

            var materials = addTexture([posx, negx, posy, negy, posz, negz]);
            var skyBox = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), materials );
            skyBox.geometry.scale( 1, 1, - 1 );
            scene.add( skyBox );
            window.addEventListener( 'resize', onWindowResize, false );
        }
        function addTexture(imgs){
            var materials = [], texture;
            for (var i = 0; i < imgs.length; i ++){
                texture = new THREE.TextureLoader().load( imgs[i] );
                // texture.needsUpdate = true
                materials.push( new THREE.MeshBasicMaterial( { map: texture } ) );
            }

            return materials
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( container.clientWidth, container.clientHeight );
        }
        function animate() {
            requestAnimationFrame( animate );
            controls.update(); // required when damping is enabled
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
        changePage: () => dispatch({ type: 'changePage', pageName:['webglPanorama'] })
    }
}

export default connect(null, mapDispatchToProps)(WebglPanorama);
