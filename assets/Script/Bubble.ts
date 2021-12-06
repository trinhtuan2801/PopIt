
import { _decorator, Component, Node, find, tween, Vec3, MeshRenderer, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bubble')
export class Bubble extends Component {

    isPop = false
    isPopable = true
    bubble: Node = null

    onLoad()
    {
        this.bubble = this.node.children[0]
    }

    popIt()
    {
        this.isPop = true
        tween(this.node).to(0.12, {scale: new Vec3(1, 0, 1)}, {easing: 'quadIn'})
        .call(()=>{this.bubble.active = false}).start()
    }

    setNormalState()
    {
        this.isPop = false
        this.isPopable = true
        this.node.scale = new Vec3(1, 1, 1)
        this.bubble.active = true
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
