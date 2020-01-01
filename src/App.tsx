import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    Link
} from 'react-router-dom'
import { connect } from 'react-redux'

import { Layout, Menu } from 'antd';
import logo from './logo.svg';
import './App.css';
// import Cube from './pages/Cube'
// import Line from './pages/Line'
// import CSS3dPanorama from './pages/CSS3dPanorama'
// import WebglPanorama from './pages/WebglPanorama'
// import MagicCube from './pages/MagicCube'

const { Sider } = Layout;


class App extends Component {

    state = {
        // currentPage:['css3dPanorama']
    };

    componentDidMount() {
        console.log(this.props, 'props')
    }

    changePage(arr: string[]) {
        this.setState({
            currentPage: arr
        });
    }

    render() {
        return (
            <Router>
                <Layout>
                    <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                        <div className="logo"><img src={logo} className="App-logo" alt="logo" /></div>
                        <Menu theme="dark" mode="inline">
                            <Menu.Item key="cube">
                                <Link to="/cube">Cube</Link>
                            </Menu.Item>
                            <Menu.Item key="line">
                                <Link to="/line">line</Link>
                            </Menu.Item>
                            <Menu.Item key="css3dPanorama">
                                <Link to="/css3d-panorama">css3d-panorama</Link>
                            </Menu.Item>
                            <Menu.Item key="webglPanorama">
                                <Link to="/webgl-panorama">webgl-panorama</Link>
                            </Menu.Item>
                            <Menu.Item key="magicCube">
                                <Link to="/magic-cube">magic-cube</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="app-right" style={{ marginLeft: 200 }}>
                        {/* <Switch>
                            <Route exact path="/" render={() => <Redirect to='/magic-cube'/>}/>
                            <Route exact path="/cube" component={Cube}/>
                            <Route path="/line" component={Line}/>
                            <Route path="/css3d-panorama" component={CSS3dPanorama}/>
                            <Route path="/webgl-panorama" component={WebglPanorama}/>
                            <Route path="/magic-cube" component={MagicCube}/>
                        </Switch> */}
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

// 添加公共state到组件props
function mapStateToProps(state:any) {
    console.log(state, 'mapStateToProps')
    return {
        currentPage: state.pageName
    }
}
// // 添加actions方法到组件props
// function mapDispatchToProps(dispatch) {
//     return {
//         onIncreaseClick: () => dispatch({ type: 'changePage', pageName:'' })
//     }
// }

export default connect(mapStateToProps)(App);
