/**
 * 通用 3D 模型预览组件
 * 可用于灵兽、人物、装备等任何需要 3D 预览的面板
 */
class ModelPreview {
    constructor() {
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.canvas = null;
        this.currentModel = null;
        this.animationGroups = null;
        this.rotationSpeed = 0.003; // 自动旋转速度
    }

    /**
     * 初始化预览引擎
     * @param {string} canvasId - canvas 元素 ID
     */
    init(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error('ModelPreview: canvas not found:', canvasId);
            return false;
        }
        this.canvas = canvas;

        // 确保canvas有实际像素尺寸 - 使用固定值作为后备
        const container = canvas.parentElement;
        let w = 400, h = 300; // 默认更大的尺寸
        if (container) {
            const rect = container.getBoundingClientRect();
            if (rect.width > 10) w = rect.width;
            if (rect.height > 10) h = rect.height;
        }
        canvas.width = Math.floor(w);
        canvas.height = Math.floor(h);
        console.log('ModelPreview: canvas size', canvas.width, 'x', canvas.height);

        try {
            // 创建引擎
            this.engine = new BABYLON.Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
        } catch (e) {
            console.error('ModelPreview: failed to create engine:', e);
            return false;
        }

        // 创建场景
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);

        // 创建相机（自动旋转，用户不可控制）
        this.camera = new BABYLON.ArcRotateCamera(
            'previewCamera',
            0, // alpha
            Math.PI / 2 - 0.15, // beta - 接近平视（略低一点点更自然）
            2, // radius
            BABYLON.Vector3.Zero(),
            this.scene
        );

        // 灯光
        const hemiLight = new BABYLON.HemisphericLight(
            'previewHemiLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemiLight.intensity = 0.8;
        hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
        hemiLight.groundColor = new BABYLON.Color3(0.3, 0.3, 0.4);

        const pointLight = new BABYLON.PointLight(
            'previewPointLight',
            new BABYLON.Vector3(1, 2, 1),
            this.scene
        );
        pointLight.intensity = 0.6;
        pointLight.diffuse = new BABYLON.Color3(1, 0.95, 0.9);

        // 启动渲染循环
        this.engine.runRenderLoop(() => {
            if (this.scene && this.camera) {
                // 自动旋转
                this.camera.alpha += this.rotationSpeed;
                this.scene.render();
            }
        });

        // 窗口大小变化时调整
        window.addEventListener('resize', () => {
            if (this.engine) this.engine.resize();
        });

        console.log('ModelPreview: initialized');
        return true;
    }

    /**
     * 展示模型
     * @param {Object} config
     * @param {string} config.glbPath - GLB 文件路径
     * @param {number} [config.quality=0] - 品质等级 0-3
     * @param {Object} [config.color] - 基础颜色 {r, g, b}
     * @param {number} [config.scale=1] - 缩放比例
     * @param {boolean} [config.autoRotate=true] - 是否自动旋转（默认true）
     */
    show(config) {
        if (!this.scene) {
            console.error('ModelPreview: not initialized, cannot show');
            return;
        }

        const { glbPath, quality = 0, color, scale = 1, autoRotate = true } = config;
        console.log('ModelPreview: show called, path=' + glbPath + ', quality=' + quality);

        // 清理上一个模型
        this.clear();

        // 基础颜色
        const baseColor = color
            ? new BABYLON.Color3(color.r, color.g, color.b)
            : new BABYLON.Color3(0.3, 0.7, 0.4);

        // 配置 Draco 解码器路径
        if (BABYLON.DracoCompression) {
            BABYLON.DracoCompression.Configuration = {
                decoder: {
                    wasmUrl: 'lib/draco_wasm_wrapper_gltf.js',
                    wasmBinaryUrl: 'lib/draco_decoder_gltf.wasm',
                    fallbackUrl: 'lib/draco_wasm_wrapper_gltf.js'
                }
            };
        }

        // 加载 GLB
        BABYLON.SceneLoader.ImportMesh(
            '', '', glbPath, this.scene,
            (meshes, particleSystems, skeletons, animationGroups) => {
                if (!meshes || meshes.length === 0) {
                    console.warn('ModelPreview: no meshes loaded, trying geometry fallback');
                    this.showGeometry(config);
                    return;
                }

                // 过滤掉空mesh
                const validMeshes = meshes.filter(m => m.getTotalVertices && m.getTotalVertices() > 0);
                if (validMeshes.length === 0) {
                    console.warn('ModelPreview: all meshes have 0 vertices');
                    this.showGeometry(config);
                    return;
                }

                console.log('ModelPreview: loaded', validMeshes.length, 'meshes,', validMeshes.reduce((s, m) => s + m.getTotalVertices(), 0), 'total vertices');

                // 存储引用
                this.currentModel = meshes;
                this.animationGroups = animationGroups;

                // 居中模型
                this._centerMeshes(meshes);

                // 应用品质着色（跳过眼睛、鼻子等面部细节）
                for (const mesh of meshes) {
                    if (mesh.material && !ModelPreview._isFacialMesh(mesh)) {
                        ModelPreview.applyQualityMaterial(mesh, quality, baseColor, this.scene);
                    }
                }

                // 缩放
                if (scale !== 1) {
                    for (const mesh of meshes) {
                        mesh.scaling.setAll(scale);
                    }
                }

                // 启动骨骼动画（如果有）
                if (animationGroups && animationGroups.length > 0) {
                    animationGroups[0].start(true); // loop
                }

                // 自动旋转
                this.rotationSpeed = autoRotate ? 0.003 : 0;

                console.log('ModelPreview: model loaded, quality=' + quality);
            },
            null,
            (scene, message) => {
                console.error('ModelPreview: load error:', message);
            }
        );
    }

    /**
     * 展示几何体（fallback）
     * @param {Object} config
     * @param {Object} [config.color] - 颜色 {r, g, b}
     * @param {number} [config.scale=1] - 缩放
     */
    showGeometry(config) {
        if (!this.scene) return;

        const { color, scale = 1 } = config;
        this.clear();

        const baseColor = color
            ? new BABYLON.Color3(color.r, color.g, color.b)
            : new BABYLON.Color3(0.3, 0.7, 0.4);

        // 创建简化几何体
        const body = BABYLON.MeshBuilder.CreateCylinder('previewBody', {
            diameterTop: 0.5,
            diameterBottom: 0.7,
            height: 0.8,
            tessellation: 12
        }, this.scene);
        body.position.y = 0.4;

        const head = BABYLON.MeshBuilder.CreateSphere('previewHead', {
            diameter: 0.5
        }, this.scene);
        head.position.y = 0.95;

        // 应用材质
        const mat = new BABYLON.StandardMaterial('previewMat', this.scene);
        mat.diffuseColor = baseColor;
        mat.emissiveColor = baseColor.scale(0.15);
        mat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        body.material = mat;
        head.material = mat;

        body.scaling.setAll(scale);
        head.scaling.setAll(scale);

        this.currentModel = [body, head];
    }

    /**
     * 清除当前模型
     */
    clear() {
        if (this.animationGroups) {
            for (const ag of this.animationGroups) {
                ag.stop();
            }
            this.animationGroups = null;
        }

        if (this.currentModel) {
            for (const mesh of this.currentModel) {
                if (mesh.dispose) mesh.dispose();
            }
            this.currentModel = null;
        }
    }

    /**
     * 销毁预览引擎
     */
    dispose() {
        this.clear();

        if (this.scene) {
            this.scene.dispose();
            this.scene = null;
        }

        if (this.engine) {
            this.engine.dispose();
            this.engine = null;
        }

        this.camera = null;
        this.canvas = null;

        console.log('ModelPreview: disposed');
    }

    /**
     * 居中模型
     */
    _centerMeshes(meshes) {
        // 先渲染一帧确保数据正确
        this.scene.render();

        // 强制刷新所有mesh的包围盒
        for (const mesh of meshes) {
            if (mesh.refreshBoundingInfo) mesh.refreshBoundingInfo();
            mesh.computeWorldMatrix(true);
        }

        // 用顶点数据计算真实包围盒
        let min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
        let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

        for (const mesh of meshes) {
            if (!mesh.getTotalVertices || mesh.getTotalVertices() === 0) continue;
            const positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            if (!positions) continue;
            const wm = mesh.getWorldMatrix();
            for (let i = 0; i < positions.length; i += 3) {
                const v = new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                const wv = BABYLON.Vector3.TransformCoordinates(v, wm);
                if (wv.x < min.x) min.x = wv.x;
                if (wv.y < min.y) min.y = wv.y;
                if (wv.z < min.z) min.z = wv.z;
                if (wv.x > max.x) max.x = wv.x;
                if (wv.y > max.y) max.y = wv.y;
                if (wv.z > max.z) max.z = wv.z;
            }
        }

        if (!isFinite(min.x)) {
            console.warn('ModelPreview: no valid vertices');
            return;
        }

        const size = max.subtract(min);
        const maxSize = Math.max(size.x, size.y, size.z);
        const center = min.add(max).scale(0.5);
        console.log('ModelPreview: center=',
            center.x.toFixed(2), center.y.toFixed(2), center.z.toFixed(2),
            'size=', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2));

        // 移动模型：中心到原点，底部在 Y=0
        for (const mesh of meshes) {
            mesh.position.x -= center.x;
            mesh.position.y -= min.y;
            mesh.position.z -= center.z;
        }

        // 调整相机：目标指向模型中心高度，平视角确保完整可见
        if (this.camera) {
            const modelHeight = size.y;
            this.camera.target = new BABYLON.Vector3(0, modelHeight / 2, 0);
            // 半径根据模型尺寸自适应，确保模型占画面约 70%
            this.camera.radius = Math.max(maxSize * 1.4, 1.5);
            this.camera.beta = Math.PI / 2 - 0.1; // 平视，略微俯视一点更自然
        }
    }

    /**
     * 判断是否为面部细节mesh（眼睛、鼻子、嘴巴等，不应被品质着色覆盖）
     */
    static _isFacialMesh(mesh) {
        const name = (mesh.name || '').toLowerCase();
        // 中文名和英文名关键词
        const facialKeywords = [
            'eye', 'eyes', 'pupil', '瞳', '眼',
            'nose', '鼻', 'mouth', '嘴', 'lip', '唇',
            'tongue', '舌', 'teeth', '牙',
            'claw', '爪', 'nail', '指甲',
            'crystal', '水晶', 'gem', '宝石'
        ];
        return facialKeywords.some(kw => name.includes(kw));
    }

    /**
     * 品质着色（静态方法，可被其他模块复用）
     * 保留原始材质纹理（包括眼睛、鼻子等面部细节），仅添加品质光晕
     * @param {BABYLON.Mesh} mesh
     * @param {number} quality - 0~3
     * @param {BABYLON.Color3} baseColor
     * @param {BABYLON.Scene} scene
     */
    static applyQualityMaterial(mesh, quality, baseColor, scene) {
        const QUALITY_GLOW = [
            new BABYLON.Color3(0.05, 0.08, 0.05), // 凡品 - 微弱绿光
            new BABYLON.Color3(0.25, 0.1, 0.5),  // 灵品 - 紫色光晕
            new BABYLON.Color3(0.5, 0.4, 0.05),  // 仙品 - 金色光晕
            new BABYLON.Color3(0.5, 0.1, 0.2),   // 神品 - 红粉光晕
        ];

        const glow = QUALITY_GLOW[quality];
        let mat = mesh.material;

        if (!mat) {
            // 无材质才创建新的
            mat = new BABYLON.StandardMaterial('qMat_' + quality, scene);
            mat.diffuseColor = baseColor;
            mat.backFaceCulling = false;
            mesh.material = mat;
        }

        // 无论什么材质类型（StandardMaterial / PBRMaterial），都只加 emissive 光晕
        // 保留原始 diffuseColor / albedo 纹理不动
        mat.backFaceCulling = false;

        if (mat.emissiveColor) {
            mat.emissiveColor = mat.emissiveColor.add(glow);
        } else {
            mat.emissiveColor = glow;
        }

        // PBRMaterial 用 emissiveColor + emissiveTexture
        if (mat.emissiveTexture) {
            // 已有自发光贴图，叠加颜色
            mat.emissiveColor = glow;
        }

        // 高品质增加高光
        if (quality >= 2) {
            if (mat.specularColor) {
                mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            }
            // PBR 材质用 metallic/roughness
            if (mat.metallic !== undefined) {
                mat.metallic = Math.min((mat.metallic || 0) + 0.1, 0.5);
                mat.roughness = Math.max((mat.roughness || 1) - 0.1, 0.3);
            }
        }
    }
}

// 挂载到全局
if (typeof window !== 'undefined') {
    window.ModelPreview = ModelPreview;
}

// Node 环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModelPreview };
}