
import { _decorator, Component, Node, Label, LabelComponent, tween, Vec3, UIOpacity, find, Button, Sprite, SpriteFrame } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UILevelComplete
 * DateTime = Thu Nov 25 2021 09:36:26 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = UILevelComplete.ts
 * FileBasenameNoExtension = UILevelComplete
 * URL = db://assets/Script/UILevelComplete.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('UILevelComplete')
export class UILevelComplete extends Component {

    @property(Node)
    UI: Node = null

    @property(Sprite)
    LevelPicture: Sprite = null
    
    @property(Node)
    nothanks: Node = null

    @property(Label)
    score_label: Label = null

    game: GameController = null

    @property(Node)
    cloak: Node = null

    onLoad()
    {
        this.game = find('GameController').getComponent(GameController)
    }

    init(score: number, picture: SpriteFrame)
    {
        this.score_label.string = score.toString()
        this.LevelPicture.spriteFrame = picture
    }

    onClickNoThanks()
    {
        this.scheduleOnce(()=>{
            this.game.init()
        }, 1)

        this.hideUI()
    }

    showUI()
    {
        this.UI.active = true
        this.UI.setScale(0, 0, 0)
        tween(this.UI).to(0.1, {scale: new Vec3(1, 1, 1)}).start()
        this.cloak.active = true
        tween(this.cloak.getComponent(UIOpacity)).to(0.1, {opacity: 255}).start()
        this.nothanks.active = true
        this.nothanks.getComponent(Button).interactable = false
        this.nothanks.getComponent(UIOpacity).opacity = 0
        this.scheduleOnce(()=>{
            tween(this.nothanks.getComponent(UIOpacity)).to(0.2, {opacity: 255}).call(()=>
            {
                this.nothanks.getComponent(Button).interactable = true
            }).start()
        }, 2)
    }

    hideUI()
    {
        tween(this.UI).to(0.1, {scale: new Vec3(0, 0, 0)})
        .call(()=>
        {
            this.nothanks.getComponent(UIOpacity).opacity = 0
            this.nothanks.active = false
            this.UI.active = false
        }).start()

        tween(this.cloak.getComponent(UIOpacity)).to(0.1, {opacity: 0})
        .call(()=>
        {
            this.cloak.active = false
        }).start()
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
