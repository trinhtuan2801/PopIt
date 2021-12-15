
import { _decorator, Component, Node, tween, Vec3, RigidBody, SliderComponent, SpriteFrame } from 'cc';
import { Bubble } from './Bubble';
const { ccclass, property } = _decorator;

@ccclass('BigPiece')
export class BigPiece extends Component {

    @property
    bubble_amount = 0

    @property
    piece_amount = 0

    @property(Node)
    plate: Node = null

    @property
    isBonusLevel = false

    @property
    BonusLevelName = ''

    @property(Bubble)
    frontBubbles: Bubble[] = []

    @property(Bubble)
    backBubbles: Bubble[] = []

    isFrontBubble = true

    TurnTimeCount = 0

    MaxTurnTime = 4

    total_pop_count = 0

    @property(SpriteFrame)
    LevelPicture: SpriteFrame = null

    onLoad()
    {
        if (this.isBonusLevel)
        {
            this.setBubblePopable(this.frontBubbles, this.isFrontBubble)
            this.setBubblePopable(this.backBubbles, !this.isFrontBubble)
        }

        this.total_pop_count = this.bubble_amount * (this.MaxTurnTime + 1)
    }

    addToPlate(node: Node)
    {
        this.plate.addChild(node)
    }

    smallStretch()
    {
        tween(this.plate)
        .by(0.15, {position: new Vec3(0, 1, 0)}, {easing: 'quadOut'})
        .by(0.15, {position: new Vec3(0, -1, 0)}, {easing: 'quadIn'})
        .start()
    }

    bigStretch()
    {
        tween(this.plate)
        .by(0.15, {position: new Vec3(0, 3, 0)}, {easing: 'quadOut'})
        .by(0.15, {position: new Vec3(0, -3, 0)}, {easing: 'quadIn'})
        .start()
    }

    boom()
    {
        let angle = Math.random()*20 + 10
        let sign = Math.floor(Math.random()*2)
        angle = (sign == 1) ? angle : -angle
        tween(this.node)
        .delay(0.2)
        .by(0.3, {position: new Vec3(4, 5, 0), eulerAngles: new Vec3(0, angle, 0)}, {easing: 'quadOut'})
        .by(0.5, {position: new Vec3(-50, 0, 0)}, {easing: 'quadOut'})
        .call(()=>{
            this.node.destroy()
        })
        .start()
    }

    forceByPop(bubble: Node)
    {
        let bubble_pos = bubble.getWorldPosition()
        let this_pos = this.node.getWorldPosition()
        
        let force_vec = this_pos.subtract(bubble_pos).multiply3f(0.6, 0, 0.6)
        let angle = this.isFrontBubble ? new Vec3(-force_vec.z, 0, force_vec.x) : new Vec3(force_vec.z, 0, -force_vec.x)
        
        let oldangle = this.isFrontBubble ? new Vec3(0, 0, 0) : new Vec3(180, 0, 0)
        
        tween(this.plate).by(0.2, {eulerAngles: angle}).to(0.2, {eulerAngles: oldangle}).start()
    }

    changeSide()
    {
        this.TurnTimeCount ++
        this.isFrontBubble = !this.isFrontBubble
        this.setBubblePopable(this.frontBubbles, false)
        this.setBubblePopable(this.backBubbles, false)

        let newpos = this.plate.getPosition()
        newpos.y = this.isFrontBubble ? 3 : 6

        tween(this.plate).to(0.5, {position: newpos}).start()

        tween(this.plate).by(0.5, {eulerAngles: new Vec3(180, 0, 0)}, {easing: 'quadOut'})
        .call(()=>
        {
            let newangle = this.isFrontBubble ? new Vec3(0, 0, 0) : new Vec3(180, 0, 0)
            this.plate.setRotationFromEuler(newangle)
            this.frontBubbles.forEach(bubble => {bubble.setNormalState()});
            this.backBubbles.forEach(bubble => {bubble.setNormalState()});
            this.setBubblePopable(this.frontBubbles, this.isFrontBubble)
            this.setBubblePopable(this.backBubbles, !this.isFrontBubble)
        }).start()
    }

    setBubblePopable(arr: Bubble[], isPopable: boolean)
    {
        arr.forEach(bubble => {bubble.isPopable = isPopable});
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
