
import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UISoundSetting
 * DateTime = Wed Dec 01 2021 10:13:21 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = UISoundSetting.ts
 * FileBasenameNoExtension = UISoundSetting
 * URL = db://assets/Script/UISoundSetting.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('UISoundSetting')
export class UISoundSetting extends Component {

    @property(Node)
    UI: Node = null

    isSoundCheck = true
    isHapticCheck = true

    showUI()
    {
        this.UI.active = true
        tween(this.UI).to(0.1, {scale: new Vec3(1, 1, 1)}).start()
    }

    hideUI()
    {
        tween(this.UI).to(0.1, {scale: new Vec3(0, 0, 1)})
        .call(()=>{this.UI.active = false}).start()
    }

    checkSound()
    {
        this.isSoundCheck = !this.isSoundCheck
    }

    checkHaptic()
    {
        this.isHapticCheck = !this.isHapticCheck
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
