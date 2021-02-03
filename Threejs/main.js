//创建一个新的场景，表示即将显示的整个3D世界
let scene = new THREE.Scene();
//用摄影机看到整个场景，摄像机代表观察者在世界里的位置。
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 5;
//五个参数分别为观察区域（用角度表示的镜头视角大小）、屏幕宽高比、近裁切面、远裁切面） 近裁切面：停止渲染前对象离摄像机的最近距离
//渲染器，渲染给定的场景，
let renderer = new THREE.WebGLRenderer();
//设定渲染器在当前摄像机视角下的尺寸
renderer.setSize(window.innerWidth,window.innerHeight);
//渲染好的<canvas>对象加入到HTML的<body>中
document.body.appendChild(renderer.domElement);
//创建魔方
let cube;
let loader = new THREE.TextureLoader();

loader.load('metal003.png',function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2,2);

    let geometry = new THREE.BoxGeometry(2.4,2.4,2.4);
    let material = new THREE.MeshLambertMaterial({map:texture,shading:THREE.FlatShading});
    cube = new THREE.Mesh(geometry,material);
    scene.add(cube);

    draw();
})
//为场景打光
let light = new THREE.AmbientLight('rgb(255,255,255)'); //soft white light
scene.add(light);

let spotLight = new THREE.SpotLight('rgb(255,255,255)');
spotLight.position.set( 100, 1000, 1000 );
spotLight.castShadow = true;
scene.add(spotLight);

//每一帧都沿着X轴和Y轴将魔方轻微转动，然后按摄像机视角渲染场景，然后调用requestAnimationFrame()来调用准备下一帧
function draw() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene,camera);

    requestAnimationFrame(draw);
}