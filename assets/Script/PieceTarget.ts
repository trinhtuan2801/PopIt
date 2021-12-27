
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
        let pos = this.node.getPosition()
        pos.y -= 4.8
        this.node.setPosition(pos)
        this.scheduleOnce(()=>
        {
            tween(this.node)
            .by(0.15, {position: new Vec3(0, 6, 0)})
            .by(0.15, {position: new Vec3(0, -1, 0)})
            .start()
        }, 0.2)
        
        this.addMeshCollider(this.node.children[0])
        this.node.children.forEach(child => {
            this.removeShadow(child)
            if (child.name.includes('Hole'))
                this.removeMeshRenderer(child)
        })
        this.setTransparent()
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
            console.log(meshrender)
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
