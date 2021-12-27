
import { _decorator, Component, Node, Label, tween, Vec3, UIOpacity, Tween, find } from 'cc';
import { GameController, GameState } from './GameController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BonusPopUp
 * DateTime = Tue Dec 28 2021 00:04:02 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = BonusPopUp.ts
 * FileBasenameNoExtension = BonusPopUp
 * URL = db://assets/Script/BonusPopUp.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('UIBonusPopUp')
export class UIBonusPopUp extends Component {
    
    @property(Node)
    UI: Node = null

    @property(Label)
    header: Label = null

    @property(Node)
    light_effect: Node = null

    game: GameController = null

    onLoad()
    {
        this.game = find('GameController').getComponent(GameController)
    }

    start()
    {

    }

    showUI()
    {
        this.UI.active = true
        this.UI.getComponent(UIOpacity).opacity = 0
        tween(this.UI.getComponent(UIOpacity)).to(0.1, {opacity: 255}).start()
        tween(this.light_effect).by(2, {eulerAngles: new Vec3(0 ,0, -360)}).repeatForever().start()
    }

    hideUI()
    {
        this.game.gamestate = GameState.POP_BUBBLE
        tween(this.UI.getComponent(UIOpacity)).to(0.1,  {opacity: 0})
        .call(()=>{
            this.game.UIMainScreen.showBonusBar()
            this.game.UIMainScreen.showLevelLabel()
            Tween.stopAllByTarget(this.light_effect)
            this.UI.active = false
        }).start()
    }

    setHeader(name: string)
    {
        this.header.string = name
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
