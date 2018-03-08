import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import { Layout, Menu } from 'antd';
import logo from './logo.svg';
import './App.css';
import CubeA from './pages/CubeA'
import CubeB from './pages/CubeB'

const { Sider } = Layout;


class App extends Component {

    state = {
        canvas: null,
    };

    componentDidMount() {

    }

    render() {
        return (
            <Router>
                <Layout>
                    <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                        <div className="logo"><img src={logo} className="App-logo" alt="logo" /></div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/">CubeA</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/about">CubeB</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="app-right" style={{ marginLeft: 200 }}>
                        <Route exact path="/" component={CubeA}/>
                        <Route path="/about" component={CubeB}/>
                    </Layout>
                </Layout>
            </Router>

        );
    }
}

export default App;
