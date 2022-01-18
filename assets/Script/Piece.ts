
import { _decorator, Component, Node, tween, Vec3, director, MeshRenderer, Material, geometry, PhysicsSystem, resources, Prefab, instantiate, MeshCollider, find } from 'cc';
import { BigPiece } from './BigPiece';
import { CustomAngle } from './CustomAngle';
import { PieceTarget } from './PieceTarget';
const { ccclass, property } = _decorator;

@ccclass('Piece')
export class Piece extends Component {

    @property
    isPickable = true

    isMatch = false

    startpos: Vec3 = null

    @property(PieceTarget)
    target: PieceTarget = null

    ray: geometry.Ray = new geometry.Ray()

    @property(Prefab)
    bubble_prefab: Prefab = null

    material: Material = null

    bigpiece: BigPiece = null

    onLoad()
    {
        this.init()

    }

    appear()
    {
        let pos = this.node.getPosition()
        pos.y -= 7
        this.node.setPosition(pos)
        let randtime = Math.random()*0.5
        this.scheduleOnce(()=>
        {
            tween(this.node)
            .by(0.15, {position: new Vec3(0, 8, 0)})
            .by(0.15, {position: new Vec3(0, -1, 0)})
            .start()
        }, randtime)
    }

    init()
    {
        this.startpos = this.node.getPosition()
        this.bigpiece = this.node.parent.getComponent(BigPiece)
        if (this.node.parent.name == 'Plate') this.bigpiece = this.node.parent.parent.getComponent(BigPiece)
        this.material = this.bigpiece.material
        this.node.children[0].getComponent(MeshRenderer).setMaterial(this.material, 0)
        if (this.bigpiece.isBonusLevel)
        {
            this.bigpiece.addToPlate(this.node)
        }
        else
        {
            this.appear()
        }
        this.addMeshCollider(this.node.children[0]) 
        this.node.children.forEach(child => {
            this.addShadow(child)
        });
        this.node.children.forEach(child =>
        {
            if (child.name.includes('Hole'))
            {
                this.addBubble(child)
                this.addMeshCollider(child)
            }
        })
    }

    addBubble(hole: Node)
    {
        let bb = instantiate(this.bubble_prefab)
        this.node.addChild(bb)
        bb.setPosition(hole.getPosition())
        let angle = hole.getComponent(CustomAngle).angle
        if (angle) bb.setRotationFromEuler(angle)
        hole.getComponent(MeshRenderer).setMaterial(this.material, 0)
        bb.children[0].getComponent(MeshRenderer).setMaterial(this.material, 0)
        let mesh = hole.getComponent(MeshRenderer).mesh
        bb.children[0].getComponent(MeshRenderer).mesh = mesh
        this.addMeshCollider(bb.children[0])
    }

    addMeshCollider(node: Node)
    {
        let meshrender = node.getComponent(MeshRenderer)
        if (meshrender)
        {
            if (!node.getComponent(MeshCollider))
            {
                node.addComponent(MeshCollider)
            }
            else
            {
                node.getComponent(MeshCollider).enabled = true
            }
            node.getComponent(MeshCollider).mesh = meshrender.mesh
        }
    }

    addShadow(node: Node)
    {
        let meshrender = node.getComponent(MeshRenderer)
        if (meshrender)
        {
            meshrender.shadowCastingMode = MeshRenderer.ShadowCastingMode.ON
            meshrender.receiveShadow = MeshRenderer.ShadowReceivingMode.ON
        }
    }

    pick(pos: Vec3)
    {
        pos.y = this.target.node.position.y + this.bigpiece.match_height + 2
        let temppos = pos.clone()
        temppos.y = this.startpos.y + this.bigpiece.match_height + 2.5
        tween(this.node)
        .to(0.04, {position: temppos}, {easing: 'quadOut'})
        .start()
        // tween(this.node)
        // .to(0.15, {scale: new Vec3(0.95, 1, 1.05)}, {easing: 'quadOut'})
        // .to(0.15, {scale: new Vec3(1, 1, 1)}, {easing: 'quadIn'})
        // .start()
    }

    drop(isSmallStretch: boolean)
    {
        tween(this.node).to(0.2, {position: this.startpos}, {easing: 'quadOut'})
        .call(()=>
        {
            if (!this.isPickable)
            {
                let bigpiece = this.node.parent.getComponent(BigPiece)
                bigpiece.addToPlate(this.node)
                if (isSmallStretch)
                    bigpiece.smallStretch()
                else
                {
                    bigpiece.bigStretch()
                    bigpiece.removeAllPieceTargets()
                }
            }
            else
            {
                tween(this.node)
                .to(0.15, {scale: new Vec3(0.97, 1, 1.03)}, {easing: 'quadOut'})
                .to(0.15, {scale: new Vec3(1, 1, 1)}, {easing: 'quadIn'})
                .start()
            } 
        }).start()
    }

    match()
    {
        this.isPickable = false
        let pos = this.target.node.getPosition()
        this.startpos = pos
        this.startpos.y += this.bigpiece.match_height
    }

    rayCast()
    {
        let pos = this.node.getPosition()
        this.ray = new geometry.Ray(pos.x, pos.y, pos.z, 0, -1, 0)
        if (PhysicsSystem.instance.raycast(this.ray))
        {
            this.isMatch = false
            const r = PhysicsSystem.instance.raycastResults;
            for (let i = 0; i < r.length; i++)
            {
                const item = r[i]
                if (item.collider.node.layer == 1 << 0)
                {
                    let target = item.collider.node.parent
                    if (target === this.target.node)
                    {
                        this.isMatch = true
                        break
                    }
                }
            }
            if (this.isMatch)
                this.target.setCyan()
            else
                this.target.setTransparent()
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
