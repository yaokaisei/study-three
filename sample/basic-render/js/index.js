
const init = () => {
    // instance：レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setClearColor(0xf4eff3);

    // instance：シーンを作成
    const scene = new THREE.Scene();

    // instance：カメラを作成
    // new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
    const camera = new THREE.PerspectiveCamera(45, 1.0);
    camera.position.set(0, 0, +1000);

    // ----------------------------------
    // 立方体を作る
    // ----------------------------------
    // instance：ジオメトリ（形状）
    // new THREE.BoxGeometry(幅, 高さ, 奥行き)
    // const geometry = new THREE.BoxGeometry(300, 300, 300);
    const geometry = new THREE.BoxGeometry(300, 300, 300);

    const material = new THREE.MeshStandardMaterial({
        color: 0x3d3276
    })

    // new THREE.Mesh(ジオメトリ,マテリアル)
    const box = new THREE.Mesh(geometry, material);
    // シーンに追加
    scene.add(box);

    // ----------------------------------
    // 光源を作成(半球光源)
    // ----------------------------------
    // new THREE.HemisphereLight(空の色, 地の色, 光の強さ)
    const directionalLight = new THREE.HemisphereLight(0xffffff, 0x434343, 1);
    directionalLight.intensity = 1; // 光の強さを倍に
    directionalLight.position.set(1, 1, 1);
    // シーンに追加
    scene.add(directionalLight);


    // ----------------------------------
    // 動かす
    // ----------------------------------
    function tick() {
        requestAnimationFrame(tick);

        // 箱を回転させる
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        // レンダリング
        renderer.render(scene, camera);
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
