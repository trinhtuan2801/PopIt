
import { _decorator, Component, Node, Material, MeshRenderer, instantiate, Vec3, MeshCollider, resources, tween, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PieceTarget')
export class PieceTarget extends Component {
    
    @property(Material)
    trans_material: Material = null

    @property(Material)
    cyan_material: Material = null

    onLoad()
    {
        this.init()
        this.appear()
    }

    init()
    {
        this.node.children.forEach(child => {
            this.addMeshCollider(child)
            this.removeShadow(child)
            if (child.name.includes('Hole'))
            {
                this.removeMeshRenderer(child)
            }
        })
        this.setTransparent()
    }

    appear()
    {
        
    }

    addMeshCollider(node: Node)
    {
        let meshrender = node.getComponent(MeshRenderer)
        if (meshrender)
        {
            if (!node.getComponent(MeshCollider))
            {
                let mesh = meshrender.mesh
                node.addComponent(MeshCollider)
                node.getComponent(MeshCollider).mesh = mesh
            }
        }
    }

    removeShadow(node: Node)
    {
        let meshrender = node.getComponent(MeshRenderer)
        if (meshrender)
        {
            meshrender.shadowCastingMode = MeshRenderer.ShadowCastingMode.OFF
            meshrender.receiveShadow = MeshRenderer.ShadowReceivingMode.OFF
        }
    }

    setCyan()
    {
        this.setMaterial(this.node.children[0], this.cyan_material)
    }

    setTransparent()
    {
        this.setMaterial(this.node.children[0], this.trans_material)
    }

    setMaterial(node: Node, material: Material)
    {
        let meshrenderer = node.getComponent(MeshRenderer)
        if (meshrenderer)
        {
            let length = meshrenderer.materials.length
            for (let i = 0; i < length; i++)
            {
                meshrenderer.setMaterial(material, i)
            }
        }
    }

    removeMeshRenderer(node: Node)
    {
        let meshrender = node.getComponent(MeshRenderer)
        if (meshrender)
        {
            meshrender.enabled = false
        } 

    }


}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
