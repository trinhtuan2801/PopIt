
import { _decorator, Component, Node, Label, ProgressBar, tween, Sprite, Color, UIOpacity, Vec3, find, SpriteFrame } from 'cc';
import { UIBonusPopUp } from './UIBonusPopUp';
import { UILevelComplete } from './UILevelComplete';
import { UIShop } from './UIShop';
const { ccclass, property } = _decorator;

@ccclass('UIMainScreen')
export class UIMainScreen extends Component {

    @property(Node)
    UI: Node = null

    @property(Label)
    level_label: Label = null

    @property(Node)
    setting_button: Node = null

    @property(Node)
    setting_bar: Node = null

    isSettingOpened = false

    @property(Label)
    coin_label: Label = null

    @property(UIShop)
    UIShop: UIShop = null

    @property(UILevelComplete)
    UILevelComplete: UILevelComplete = null

    @property(ProgressBar)
    bonus_bar: ProgressBar = null

    @property(Node)
    face_on_bar: Node = null

    @property(UIBonusPopUp)
    BonusPopUp: UIBonusPopUp = null

    @property(Node)
    setting_cloak: Node = null

    @property(Sprite)
    sound_button: Sprite = null

    @property(SpriteFrame)
    sound_on_frame: SpriteFrame = null

    @property(SpriteFrame)
    sound_off_frame: SpriteFrame = null

    isSoundOn = true

    start()
    {
        
    }

    hideUI()
    {
        tween(this.UI.getComponent(UIOpacity)).to(0.1, {opacity: 0}).call(()=>{this.UI.active = false}).start()
    }

    showUI()
    {
        this.UI.active = true
        tween(this.UI.getComponent(UIOpacity)).to(0.1, {opacity: 255}).start()
    }

    setLevel(name: string | number, isRelax)
    {
        if (isRelax)
            this.level_label.string = name.toString()      
        else
            this.level_label.string = "Level " + name
    }

    showLevelLabel()
    {
        this.level_label.node.active = true
    }

    hideLevelLabel()
    {
        this.level_label.node.active = false
    }

    onClickSettingButton()
    {   
        if (this.isSettingOpened) this.closeSetting()
        else this.openSetting()
    }

    openSetting()
    {
        this.isSettingOpened = true
        tween(this.setting_button).to(0.2, {eulerAngles: new Vec3(0, 0, -90)}).start()
        tween(this.setting_bar).to(0.2, {position: new Vec3(0, -700, 0)}).start()
        this.setting_cloak.active = true
        tween(this.setting_cloak.getComponent(UIOpacity)).to(0.2, {opacity: 255}).start()
    }

    closeSetting()
    {
        this.isSettingOpened = false
        tween(this.setting_button).to(0.2, {eulerAngles: new Vec3(0, 0, 0)}).start()
        tween(this.setting_bar).to(0.2, {position: new Vec3(0, 0, 0)}).start()
        tween(this.setting_cloak.getComponent(UIOpacity)).to(0.2, {opacity: 0})
        .call(()=>{
            this.setting_cloak.active = false
        }).start()
    }

    setCoinLabel(amount: number)
    {
        this.coin_label.string = amount.toString()
    }

    openShop()
    {
        this.UIShop.showUI()
        this.closeSetting()
    }

    openLevelComplete(score: number, picture: SpriteFrame)
    {
        this.UILevelComplete.init(score, picture)
        this.UILevelComplete.showUI()
    }

    setBonusProgress(progress: number)
    {
        this.bonus_bar.progress = progress
        // this.face_on_bar.setPosition(this.bonus_bar.totalLength*progress, 0)
        tween(this.face_on_bar).parallel(
            tween()
            .to(0.1, {position: new Vec3(this.bonus_bar.totalLength*progress, 0)}),
            tween()
            .to(0.1, {eulerAngles: new Vec3(0, 0, 20)})
            .to(0.1, {eulerAngles: new Vec3(0, 0, -20)})
            .to(0.1, {eulerAngles: new Vec3(0, 0, 10)})
            .to(0.1, {eulerAngles: new Vec3(0, 0, -10)})
            .to(0.1, {eulerAngles: new Vec3(0, 0, 0)}),
            tween()
            .to(0.25, {scale: new Vec3(1.2, 1.2, 1.1)})
            .to(0.25, {scale: new Vec3(1, 1, 1)})
        )
        .start()
    }

    showBonusPopUp(name: string)
    {
        this.BonusPopUp.showUI()
        this.BonusPopUp.setHeader(name)
    }

    hideBonusPopUp()
    {
        this.BonusPopUp.hideUI()
    }

    showBonusBar()
    {
        this.bonus_bar.node.active = true
        this.bonus_bar.node.scale = new Vec3(0,0,0)
        tween(this.bonus_bar.node).to(0.2, {scale: new Vec3(0.9, 0.9, 0.9)}).start()
    }

    hideBonusBar()
    {
        this.bonus_bar.node.active = true
        tween(this.bonus_bar.node).to(0.2, {scale: new Vec3(0, 0, 0)})
        .call(()=>{
            this.bonus_bar.node.active = false  
        })
        .start()
    }

    onClickSoundButton()
    {
        this.isSoundOn = !this.isSoundOn
        if (this.isSoundOn) this.sound_button.spriteFrame = this.sound_on_frame
        else this.sound_button.spriteFrame = this.sound_off_frame
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
