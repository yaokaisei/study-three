
const init = () => {
    // instance：レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setClearColor(0x16344e);
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // instance：シーンを作成
    const scene = new THREE.Scene();

    // instance：カメラを作成
    // new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
    const camera = new THREE.PerspectiveCamera(50, 1.0);
    camera.position.set(0, 1, 4);

    // 床を作る
    const txttureLoader = new THREE.TextureLoader();
    const floreGeometry = new THREE.BoxGeometry(7, 0.01, 7);
    const floreMaterial = new THREE.MeshStandardMaterial({
            map: txttureLoader.load('img/bg01.jpg')
        }
    );
    const meshFloor = new THREE.Mesh(floreGeometry,floreMaterial);
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);


    // // ----------------------------------
    // // モデリングを表示
    // // ----------------------------------
    // instance：glTF を読み込む
    let mixer;
    let clock = new THREE.Clock();
    const gltfLoader = new THREE.GLTFLoader();
    const url = 'gltf/santa/scene.gltf';

    gltfLoader.load(url, (data) => {
        const gltf = data;
        const model = gltf.scene;
        const animations = gltf.animations;

        if (animations && animations.length) {
            //Animation Mixerインスタンスを生成
            mixer = new THREE.AnimationMixer(model);
            //全てのAnimation Clipに対して
            for (let i = 0; i < animations.length; i++) {
                let animation = animations[i];
                //Animation Actionを生成
                let action = mixer.clipAction(animation) ;
                //ループ設定（1回のみ）
                action.setLoop(THREE.Loop);
                //アニメーションの最後のフレームでアニメーションが終了
                action.clampWhenFinished = true;
                //アニメーションを再生
                action.play();
            }
        }

        model.castShadow = true;
        scene.add(model);
    });


    // // ----------------------------------
    // // 星となるパーティクルを表示
    // // ----------------------------------
    const starGeometry = new THREE.Geometry();
    const SIZE = 2500; // 配置する範囲
    const LENGTH = 10000; // 配置する個数

    for (let i = 0; i < LENGTH; i++) {
        starGeometry.vertices.push(new THREE.Vector3(
            SIZE * (Math.random() - 0.5),
            SIZE * (Math.random() - 0.5),
            SIZE * (Math.random() - 0.5),
        ));
    }
    // マテリアルを作成
    const starMaterial = new THREE.PointsMaterial({
        size: 5,　// 一つ一つのサイズ
        color: 0x366286,　// 色
    });

    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.fog = new THREE.Fog(0x284761, 50, 2000);
    scene.add(starMesh);


    // ----------------------------------
    // 光源を作成(半球光源)
    // ----------------------------------
    // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
    const directionalLight = new THREE.SpotLight(0xa7adbb, 10, 12, Math.PI / 5, 1);
    directionalLight.castShadow = true;
    directionalLight.intensity = 2; // 光の強さを倍に
    directionalLight.position.set(0, 3, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // シーンに追加
    scene.add(directionalLight);


    // ----------------------------------
    // 動かす
    // ----------------------------------
    function tick() {
        requestAnimationFrame(tick);
        // レンダリング
        renderer.render(scene, camera);
        meshFloor.rotation.y += 0.001;
        starMesh.rotation.x += 0.001;
        starMesh.rotation.y += 0.003;

        //Animation Mixerを実行
        if(mixer){
            mixer.update(clock.getDelta());
        }
    }
    // 初回実行
    tick();


    // ----------------------------------
    // リサイズ
    // ----------------------------------
    function onResize() {
        // サイズを取得
        const width = window.innerWidth;
        const height = window.innerHeight;

        // スマホでも綺麗に見えるように、デバイスピクセル比を設定
        renderer.setPixelRatio(window.devicePixelRatio);
        // レンダラーのサイズを調整する
        renderer.setSize(width, height);

        // カメラのアスペクト比を正す
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    // 初期化のために実行
    onResize();
    // リサイズイベント発生時に実行
    window.addEventListener('resize', onResize);
}


window.addEventListener('DOMContentLoaded', init);
