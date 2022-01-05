
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CustomAngle
 * DateTime = Wed Jan 05 2022 18:16:37 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = CustomAngle.ts
 * FileBasenameNoExtension = CustomAngle
 * URL = db://assets/Script/CustomAngle.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('CustomAngle')
export class CustomAngle extends Component {

    @property(Vec3)
    angle: Vec3 = new Vec3(0, 0, 0)

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
