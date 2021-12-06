
import { _decorator, Component, Node, Sprite, Label, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UICongrats
 * DateTime = Fri Nov 26 2021 14:29:18 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = UICongrats.ts
 * FileBasenameNoExtension = UICongrats
 * URL = db://assets/Script/UICongrats.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('UICongrats')
export class UICongrats extends Component {
    
    @property(Node)
    UI: Node = null

    @property(Sprite)
    avatar: Sprite = null

    @property(Label)
    congrats_label: Label = null

    showUI()
    {
        this.UI.active = true
        this.UI.scale = new Vec3(0, 0, 0)
        tween(this.UI).to(0.1, {scale: new Vec3(1, 1, 1)}).start()
    }

    hideUI()
    {
        tween(this.UI).to(0.1, {scale: new Vec3(0, 0, 0)})
        .call(()=>{this.UI.active = false})
        .start()
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
