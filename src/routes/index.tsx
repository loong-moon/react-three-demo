import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import routes from './three-route'


const RouterView: React.FC = () => {
  return (
    <Switch>
      {routes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
        {/* <Route exact path="/" render={() => <Redirect to='/magic-cube'/>}/>
        <Route path="/cube" component={Cube}/>
        <Route path="/line" component={Line}/>
        <Route path="/css3d-panorama" component={CSS3dPanorama}/>
        <Route path="/webgl-panorama" component={WebglPanorama}/>
        <Route path="/magic-cube" component={MagicCube}/> */}
    </Switch>
  );
}

export default RouterView;
