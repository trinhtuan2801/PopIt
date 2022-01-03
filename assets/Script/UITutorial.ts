
import { _decorator, Component, Node, tween, UIOpacity, Sprite, SpriteFrame, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UITutorial
 * DateTime = Tue Dec 28 2021 23:00:34 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = UITutorial.ts
 * FileBasenameNoExtension = UITutorial
 * URL = db://assets/Script/UITutorial.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('UITutorial')
export class UITutorial extends Component {

    @property(Node)
    UI: Node = null

    @property(Sprite)
    step1: Sprite = null

    @property(Sprite)
    step2: Sprite = null

    @property(SpriteFrame)
    frames: SpriteFrame[] = []

    @property(Node)
    cloak: Node = null

    showUI()
    {
        this.UI.active = true
        tween(this.UI).to(0.1, {scale: new Vec3(1, 1, 1)}).start()
        this.cloak.active = true
        tween(this.cloak.getComponent(UIOpacity)).to(0.1, {opacity: 255}).start()
        this.tweenPicture()
    }

    hideUI()
    {
        tween(this.UI).to(0.1,  {scale: new Vec3(0 ,0 ,0)})
        .call(()=>{this.UI.active = false}).start()
        tween(this.cloak.getComponent(UIOpacity)).to(0.1, {opacity: 0})
        .call(()=>{this.cloak.active = false}).start()

        Tween.stopAllByTarget(this.node)
    }

    tweenPicture()
    {
        tween(this.node).repeatForever(
            tween()
            .delay(0.5)
            .call(()=>
            {
                this.step1.spriteFrame = this.frames[1]
                this.step2.spriteFrame = this.frames[3]
            })
            .delay(0.5)
            .call(()=>
            {
                this.step1.spriteFrame = this.frames[0]
                this.step2.spriteFrame = this.frames[2]
            })
        ).start()
        
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
