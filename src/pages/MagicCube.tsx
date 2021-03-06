import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'




class MagicCube extends Component<any, any> {
    el: any;

    componentDidMount(){
        this.props.changePage()

        let win: any = window;
        let renderer: THREE.WebGLRenderer;//渲染器
        let container = this.el;//容器
        let width: number;//页面宽度
        let height: number;//页面高度
        let raycaster = new THREE.Raycaster();//光线碰撞检测器
        let mouse = new THREE.Vector2();//存储鼠标坐标或者触摸坐标
        let isRotating = false;//魔方是否正在转动
        let intersect: any;//碰撞光线穿过的元素
        let normalize: any;//触发平面法向量
        let startPoint: any;//触发点
        let movePoint: any;
        let initStatus: any[] | { x: any; y: any; z: any; cubeIndex: any; }[] = [];//魔方初始状态
        //魔方转动的六个方向
        let xLine = new THREE.Vector3( 1, 0, 0 );//X轴正方向
        let xLineAd = new THREE.Vector3( -1, 0, 0 );//X轴负方向
        let yLine = new THREE.Vector3( 0, 1, 0 );//Y轴正方向
        let yLineAd = new THREE.Vector3( 0, -1, 0 );//Y轴负方向
        let zLine = new THREE.Vector3( 0, 0, 1 );//Z轴正方向
        let zLineAd = new THREE.Vector3( 0, 0, -1 );//Z轴负方向

        win.requestAnimFrame = (() => {//如果有变化则可能还需要requestAnimationFrame刷新
            return win.requestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.msRequestAnimationFrame ||
            win.webkitRequestAnimationFrame;
        })();

        //根据页面宽度和高度创建渲染器，并添加容器中
        function initThree() {
            width = container.clientWidth;
            height = container.clientHeight;
            renderer = new THREE.WebGLRenderer({
                antialias : true
            });
            renderer.setSize(width, height);
            renderer.setClearColor(0xFFFFFF, 1.0);
            container.appendChild(renderer.domElement);

            window.addEventListener( 'resize', onWindowResize, false );
        }

        //创建相机，并设置正方向和中心点
        let camera: THREE.PerspectiveCamera;
        let controller: OrbitControls;//视角控制器
        function initCamera() {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
            camera.position.x = 0; //相机所在的位置
            camera.position.y = 0;
            camera.position.z = 500;
            camera.up.x = 0; //相机上部的方向
            camera.up.y = 1;
            camera.up.z = 0;
            camera.lookAt(0, 0, 0); //参数只能为Vector3对象或者三个浮点数，如果为{x:0,y:0,z:0}则更改数值无效

        }

        function onWindowResize() {
            width = container.clientWidth;
            height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix(); //在属性改变后更新渲染
            renderer.setSize( width, height );
        }

        //创建场景，后续元素需要加入到场景中才会显示出来
        var scene: THREE.Scene;
        function initScene() {
            scene = new THREE.Scene();
        }

        //创建光线
        var light;
        function initLight() {
            light = new THREE.AmbientLight(0xfefefe);
            scene.add(light);
        }

        var cubeParams = {//魔方参数
            x:-75,
            y:75,
            z:75,
            num:3,
            len:50,
            colors:['rgba(255,193,37,1)','rgba(0,191,255,1)',
                'rgba(50,205,50,1)','rgba(178,34,34,1)',
                'rgba(255,255,0,1)','rgba(255,255,255,1)']
        };

        /**
         * 魔方
         * x、y、z 魔方正面左上角坐标
         * num 魔方单位方向上数量
         * len 魔方单位正方体宽高
         * colors 魔方六面体颜色
         */
        function SimpleCube(cubeParams: { x: any; y: any; z: any; num: any; len: any; colors: any; }){
            var cubes = [];
            var x = cubeParams.x,
                y = cubeParams.y,
                z = cubeParams.z,
                num = cubeParams.num,
                len = cubeParams.len,
                colors = cubeParams.colors;
            for(let i=0; i<num; i++){
                for(var j=0; j<num*num; j++){
                    var cubegeo = new THREE.BoxGeometry(len,len,len);
                    var materials = [];
                    var myFaces = [];
                    //一个小正方体有六个面，每个面使用相同材质的纹理，但是颜色不一样
                    myFaces.push(faces(colors[0]));
                    myFaces.push(faces(colors[1]));
                    myFaces.push(faces(colors[2]));
                    myFaces.push(faces(colors[3]));
                    myFaces.push(faces(colors[4]));
                    myFaces.push(faces(colors[5]));
                    for (var k = 0; k < 6; k++) {
                        var texture = new THREE.Texture(myFaces[k]);
                        texture.needsUpdate = true;
                        materials.push(new THREE.MeshLambertMaterial({
                            map: texture
                        }));
                    }
                    // var cubemat = new THREE.MeshFaceMaterial(materials);
                    var cube = new THREE.Mesh( cubegeo, materials );
                    //假设整个魔方的中心在坐标系原点，推出每个小正方体的中心
                    cube.position.x = (x+len/2)+(j%3)*len;
                    cube.position.y = (y-len/2)-parseInt(j/3, 10)*len;
                    cube.position.z = (z-len/2)-i*len;

                    cubes.push(cube)
                }
            }
            return cubes;
        }

        //生成canvas素材
        function faces(rgbaColor: string | CanvasGradient | CanvasPattern) {
            var canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            var context = canvas.getContext('2d');
            if (context) {
                //画一个宽高都是256的黑色正方形
                context.fillStyle = 'rgba(0,0,0,1)';
                context.fillRect(0, 0, 256, 256);
                //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
                context.rect(16, 16, 224, 224);
                context.lineJoin = 'round';
                context.lineWidth = 16;
                context.fillStyle = rgbaColor;
                context.strokeStyle = rgbaColor;
                context.stroke();
                context.fill();
            } else {
                alert('您的浏览器不支持Canvas无法预览.\n');
            }
            return canvas;
        }

        //创建展示场景所需的各种元素
        let cubes: any[]
        function initObject() {
            //生成魔方小正方体
            cubes = SimpleCube(cubeParams);
            for(let i=0;i<cubes.length;i++){
                var item = cubes[i];
                /**
                 * 由于筛选运动元素时是根据物体的id规律来的，但是滚动之后位置发生了变化；
                 * 再根据初始规律筛选会出问题，而且id是只读变量；
                 * 所以这里给每个物体设置一个额外变量cubeIndex，每次滚动之后更新根据初始状态更新该cubeIndex；
                 * 让该变量一直保持初始规律即可。
                 */
                initStatus.push({
                    x:item.position.x,
                    y:item.position.y,
                    z:item.position.z,
                    cubeIndex:item.id
                });
                item.cubeIndex = item.id;
                scene.add(cubes[i]);//并依次加入到场景中
            }

            //透明正方体
            let cubegeo = new THREE.BoxGeometry(150,150,150);
            let hex = 0x000000;
            for ( let i = 0; i < cubegeo.faces.length; i += 2 ) {
                cubegeo.faces[ i ].color.setHex( hex );
                cubegeo.faces[ i + 1 ].color.setHex( hex );
            }
            let cubemat: any = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors,opacity: 0, transparent: true});
            let cube: any = new THREE.Mesh( cubegeo, cubemat );
            cube.cubeType = 'coverCube';
            scene.add( cube );
        }

        //渲染
        function render(){
            renderer.clear();
            renderer.render(scene, camera);
            win.requestAnimFrame(render);
        }

        //开始
        function threeStart() {
            initThree();
            initCamera();
            initScene();
            initLight();
            initObject();
            render();
            //监听鼠标事件
            renderer.domElement.addEventListener('mousedown', startCube, false);
            renderer.domElement.addEventListener('mousemove', moveCube, false );
            renderer.domElement.addEventListener('mouseup', stopCube,false);
            //监听触摸事件
            renderer.domElement.addEventListener('touchstart', startCube, false);
            renderer.domElement.addEventListener('touchmove', moveCube, false);
            renderer.domElement.addEventListener('touchend', stopCube, false);

            //视角控制
            controller = new OrbitControls(camera, renderer.domElement);
            controller.target = new THREE.Vector3(200, 0, 0);//设置控制点
        }

        //魔方操作结束
        function stopCube(){
            intersect = null;
            startPoint = null
        }

        //绕着世界坐标系的某个轴旋转
        function rotateAroundWorldY(obj: any, rad: number){
            var x0 = obj.position.x;
            var z0 = obj.position.z;
            /**
             * 因为物体本身的坐标系是随着物体的变化而变化的，
             * 所以如果使用rotateZ、rotateY、rotateX等方法，
             * 多次调用后就会出问题，先改为Quaternion实现。
             */
            var q = new THREE.Quaternion();
            q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateY(rad);
            obj.position.x = Math.cos(rad)*x0+Math.sin(rad)*z0;
            obj.position.z = Math.cos(rad)*z0-Math.sin(rad)*x0;
        }
        function rotateAroundWorldZ(obj: any, rad: number){
            var x0 = obj.position.x;
            var y0 = obj.position.y;
            var q = new THREE.Quaternion();
            q.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateZ(rad);
            obj.position.x = Math.cos(rad)*x0-Math.sin(rad)*y0;
            obj.position.y = Math.cos(rad)*y0+Math.sin(rad)*x0;
        }
        function rotateAroundWorldX(obj: any, rad: number){
            var y0 = obj.position.y;
            var z0 = obj.position.z;
            var q = new THREE.Quaternion();
            q.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rad );
            obj.quaternion.premultiply( q );
            //obj.rotateX(rad);
            obj.position.y = Math.cos(rad)*y0-Math.sin(rad)*z0;
            obj.position.z = Math.cos(rad)*z0+Math.sin(rad)*y0;
        }

        //滑动操作魔方
        function moveCube(event: any){
            getIntersects(event);
            if(intersect){
                if(!isRotating&&startPoint){//魔方没有进行转动且满足进行转动的条件
                    movePoint = intersect.point;
                    if(!movePoint.equals(startPoint)){//和起始点不一样则意味着可以得到转动向量了
                        isRotating = true;//转动标识置为true
                        var sub = movePoint.sub(startPoint);//计算转动向量
                        var direction = getDirection(sub);//获得方向
                        var elements = getBoxs(intersect,direction);
                        // var startTime = new Date().getTime();
                        win.requestAnimFrame(function(timestamp: any){
                            rotateAnimation(elements, direction,timestamp, 0);
                        });
                    }
                }
            }
            event.preventDefault();
        }

        /**
         * 旋转动画
         */
        function rotateAnimation(elements: any[], direction: any, currentstamp: any, startstamp: any, laststamp?: any){
            var totalTime = 500;//转动的总运动时间
            if(startstamp===0){
                startstamp = currentstamp;
                laststamp = currentstamp;
            }
            if(currentstamp-startstamp>=totalTime){
                currentstamp = startstamp+totalTime;
                isRotating = false;
                startPoint = null;
                updateCubeIndex(elements);
                //转动之后需要更新魔方此时所处的状态
                updateCubeStatus();
            }
            switch(direction){
                //绕z轴顺时针
                case 0.1:
                case 1.2:
                case 2.4:
                case 3.3:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldZ(elements[i],-90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                //绕z轴逆时针
                case 0.2:
                case 1.1:
                case 2.3:
                case 3.4:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldZ(elements[i],90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                //绕y轴顺时针
                case 0.4:
                case 1.3:
                case 4.3:
                case 5.4:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldY(elements[i],-90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                //绕y轴逆时针
                case 1.4:
                case 0.3:
                case 4.4:
                case 5.3:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldY(elements[i],90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                //绕x轴顺时针
                case 2.2:
                case 3.1:
                case 4.1:
                case 5.2:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldX(elements[i],90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                //绕x轴逆时针
                case 2.1:
                case 3.2:
                case 4.2:
                case 5.1:
                    for(let i=0;i<elements.length;i++){
                        rotateAroundWorldX(elements[i],-90*Math.PI/180*(currentstamp - laststamp)/totalTime);
                    }
                    break;
                default:
                    break;
            }
            if(currentstamp-startstamp<totalTime){
                win.requestAnimFrame(function(timestamp: any){
                    rotateAnimation(elements, direction, timestamp, startstamp, currentstamp);
                });
            }
        }

        //更新位置索引
        function updateCubeIndex(elements: any[]){
            for(let i=0;i<elements.length;i++){
                var temp1 = elements[i];
                for(var j=0;j<initStatus.length;j++){
                    var temp2 = initStatus[j];
                    if( Math.abs(temp1.position.x - temp2.x)<=cubeParams.len/2 &&
                        Math.abs(temp1.position.y - temp2.y)<=cubeParams.len/2 &&
                        Math.abs(temp1.position.z - temp2.z)<=cubeParams.len/2 ){
                        temp1.cubeIndex = temp2.cubeIndex;
                        break;
                    }
                }
            }
        }

        /**
         * 更新魔方状态
         * 假设初始化时按固定位置给魔方编号，还原之后位置和编号不变
         */
        function updateCubeStatus(){
            for(let i=0;i<cubes.length;i++){
                var item = cubes[i];
                if(item.id!==item.cubeIndex){
                    return false;
                }
            }
            return true;
        }

        //根据方向获得运动元素
        function getBoxs(target: { object: { cubeIndex: any; }; },direction: number | undefined){
            var targetId = target.object.cubeIndex;
            var ids = [];
            for(let i=0;i<cubes.length;i++){
                ids.push(cubes[i].cubeIndex);
            }
            var minId = min(ids);
            targetId = targetId-minId;
            var numI = parseInt(targetId/9, 10);
            var numJ = targetId%9;
            var boxs = [];
            //根据绘制时的规律判断 no = i*9+j
            switch(direction){
                //绕z轴
                case 0.1:
                case 0.2:
                case 1.1:
                case 1.2:
                case 2.3:
                case 2.4:
                case 3.3:
                case 3.4:
                    for(let i=0;i<cubes.length;i++){
                        let tempId = cubes[i].cubeIndex-minId;
                        if(numI===parseInt(tempId/9, 10)){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                //绕y轴
                case 0.3:
                case 0.4:
                case 1.3:
                case 1.4:
                case 4.3:
                case 4.4:
                case 5.3:
                case 5.4:
                    for(let i=0;i<cubes.length;i++){
                        let tempId = cubes[i].cubeIndex-minId;
                        if(parseInt(numJ/3, 10)===parseInt(tempId%9/3, 10)){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                //绕x轴
                case 2.1:
                case 2.2:
                case 3.1:
                case 3.2:
                case 4.1:
                case 4.2:
                case 5.1:
                case 5.2:
                    for(let i=0;i<cubes.length;i++){
                        let tempId = cubes[i].cubeIndex-minId;
                        if(tempId%9%3===numJ%3){
                            boxs.push(cubes[i]);
                        }
                    }
                    break;
                default:
                    break;
            }
            return boxs;
        }

        //获得旋转方向
        function getDirection(vector3: { angleTo: { (arg0: THREE.Vector3): void; (arg0: THREE.Vector3): void; (arg0: THREE.Vector3): void; (arg0: THREE.Vector3): void; (arg0: THREE.Vector3): void; (arg0: THREE.Vector3): void; }; }){
            var direction;
            //判断差向量和x、y、z轴的夹角
            var xAngle = vector3.angleTo(xLine);
            var xAngleAd = vector3.angleTo(xLineAd);
            var yAngle = vector3.angleTo(yLine);
            var yAngleAd = vector3.angleTo(yLineAd);
            var zAngle = vector3.angleTo(zLine);
            var zAngleAd = vector3.angleTo(zLineAd);
            var minAngle = min([xAngle,xAngleAd,yAngle,yAngleAd,zAngle,zAngleAd]);//最小夹角

            switch(minAngle){
                case xAngle:
                    direction = 0;//向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
                    if(normalize.equals(yLine)){
                        direction = direction+0.1;//绕z轴顺时针
                    }else if(normalize.equals(yLineAd)){
                        direction = direction+0.2;//绕z轴逆时针
                    }else if(normalize.equals(zLine)){
                        direction = direction+0.3;//绕y轴逆时针
                    }else{
                        direction = direction+0.4;//绕y轴顺时针
                    }
                    break;
                case xAngleAd:
                    direction = 1;//向x轴反方向旋转90度
                    if(normalize.equals(yLine)){
                        direction = direction+0.1;//绕z轴逆时针
                    }else if(normalize.equals(yLineAd)){
                        direction = direction+0.2;//绕z轴顺时针
                    }else if(normalize.equals(zLine)){
                        direction = direction+0.3;//绕y轴顺时针
                    }else{
                        direction = direction+0.4;//绕y轴逆时针
                    }
                    break;
                case yAngle:
                    direction = 2;//向y轴正方向旋转90度
                    if(normalize.equals(zLine)){
                        direction = direction+0.1;//绕x轴逆时针
                    }else if(normalize.equals(zLineAd)){
                        direction = direction+0.2;//绕x轴顺时针
                    }else if(normalize.equals(xLine)){
                        direction = direction+0.3;//绕z轴逆时针
                    }else{
                        direction = direction+0.4;//绕z轴顺时针
                    }
                    break;
                case yAngleAd:
                    direction = 3;//向y轴反方向旋转90度
                    if(normalize.equals(zLine)){
                        direction = direction+0.1;//绕x轴顺时针
                    }else if(normalize.equals(zLineAd)){
                        direction = direction+0.2;//绕x轴逆时针
                    }else if(normalize.equals(xLine)){
                        direction = direction+0.3;//绕z轴顺时针
                    }else{
                        direction = direction+0.4;//绕z轴逆时针
                    }
                    break;
                case zAngle:
                    direction = 4;//向z轴正方向旋转90度
                    if(normalize.equals(yLine)){
                        direction = direction+0.1;//绕x轴顺时针
                    }else if(normalize.equals(yLineAd)){
                        direction = direction+0.2;//绕x轴逆时针
                    }else if(normalize.equals(xLine)){
                        direction = direction+0.3;//绕y轴顺时针
                    }else{
                        direction = direction+0.4;//绕y轴逆时针
                    }
                    break;
                case zAngleAd:
                    direction = 5;//向z轴反方向旋转90度
                    if(normalize.equals(yLine)){
                        direction = direction+0.1;//绕x轴逆时针
                    }else if(normalize.equals(yLineAd)){
                        direction = direction+0.2;//绕x轴顺时针
                    }else if(normalize.equals(xLine)){
                        direction = direction+0.3;//绕y轴逆时针
                    }else{
                        direction = direction+0.4;//绕y轴顺时针
                    }
                    break;
                default:
                    break;
            }
            return direction;
        }

        //获取数组中的最小值
        function min(arr: any[]){
            var min = arr[0];
            for(let i=1;i<arr.length;i++){
                if(arr[i]<min){
                    min = arr[i];
                }
            }
            return min;
        }

        //开始操作魔方
        function startCube(event: any){
            getIntersects(event);
            //魔方没有处于转动过程中且存在碰撞物体
            if(!isRotating&&intersect){
                startPoint = intersect.point;//开始转动，设置起始点
                controller.enabled = false;//当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
            }else{
                controller.enabled = true;//当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
            }
        }

        //获取操作焦点以及该焦点所在平面的法向量
        function getIntersects(event: { touches: any[]; clientX: number; clientY: number; }){
            //触摸事件和鼠标事件获得坐标的方式有点区别
            if(event.touches){
                var touch = event.touches[0];
                mouse.x = (touch.clientX / width)*2 - 1;
                mouse.y = -(touch.clientY / height)*2 + 1;
            }else{
                mouse.x = (event.clientX / width)*2 - 1;
                mouse.y = -(event.clientY / height)*2 + 1;
            }
            raycaster.setFromCamera(mouse, camera);
            //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
            var intersects = raycaster.intersectObjects(scene.children);
            if(intersects.length){
                let inter0: any = intersects[0]
                let inter1: any = intersects[1]
                try{
                    if(inter0.object.cubeType==='coverCube'){
                        intersect = inter1;
                        normalize = inter0.face.normal;
                    }else{
                        intersect = inter0;
                        normalize = inter1.face.normal;
                    }
                }catch(err){
                    //nothing
                }
            }
        }

        threeStart();

    }

    render() {
        return (
            <div className="render-box" ref={el => this.el = el}></div>
        );
    }
}

// 添加actions方法到组件props
function mapDispatchToProps(dispatch: (arg0: { type: string; pageName: string[]; }) => void) {
    return {
        changePage: () => dispatch({ type: 'changePage', pageName:['magicCube'] })
    }
}
export default connect(null, mapDispatchToProps)(MagicCube);
