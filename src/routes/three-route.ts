/** three.js的页面route **/
import {Redirect} from 'react-router-dom'

import Cube from 'pages/Cube'
import Line from 'pages/Line'
import CSS3dPanorama from 'pages/CSS3dPanorama'
import WebglPanorama from 'pages/WebglPanorama'
import MagicCube from 'pages/MagicCube'

let routes =  [
    {
      path: '/',
      exact: true,
      redirect: '/magic-cube'
    },
    {
      name: 'cube',
      path: '/cube',
      component: Cube
    },
    {
      name: 'line',
      path: '/line',
      component: Line
    },
    {
      name: 'css3dPanorama',
      path: '/css3d-panorama',
      component: CSS3dPanorama
    },
    {
      name: 'webglPanorama',
      path: '/webgl-panorama',
      component: WebglPanorama
    },
    {
      name: 'magicCube',
      path: '/magic-cube',
      component: MagicCube
    }
  ]
   export default routes