
import { _decorator, Component, Node, Label, ProgressBar, tween, Sprite, Color, UIOpacity, Vec3, find } from 'cc';
import { UICongrats } from './UICongrats';
import { UILevelComplete } from './UILevelComplete';
import { UIShop } from './UIShop';
import { UISoundSetting } from './UISoundSetting';
const { ccclass, property } = _decorator;

@ccclass('UIMainScreen')
export class UIMainScreen extends Component {

    @property(Node)
    UI: Node = null

    @property(Label)
    level_label: Label = null

    setLevel(level: string | number, isRelax: boolean)
    {
        if (!isRelax)
            this.level_label.string = "Màn " + level
        else
            this.level_label.string = "Relax"
    }

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

    @property(UICongrats)
    UICongrats: UICongrats = null

    @property(ProgressBar)
    bonus_bar: ProgressBar = null

    @property(Node)
    face_on_bar: Node = null

    @property(UISoundSetting)
    UISoundSetting: UISoundSetting = null

    @property(Node)
    BonusPopUp: Node = null

    start()
    {
        
    }

    hideUI()
    {
        this.UI.active = false
    }

    showUI()
    {
        this.UI.active = true
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
        tween(this.setting_bar).to(0.2, {position: new Vec3(0, -240, 0)}).start()
    }

    closeSetting()
    {
        this.isSettingOpened = false
        tween(this.setting_button).to(0.2, {eulerAngles: new Vec3(0, 0, 0)}).start()
        tween(this.setting_bar).to(0.2, {position: new Vec3(0, 0, 0)}).start()
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

    openLevelComplete(score: number)
    {
        this.UICongrats.showUI()
        this.scheduleOnce(()=>{
            this.UICongrats.hideUI()
            this.scheduleOnce(()=>{
                this.UILevelComplete.showUI()
                this.UILevelComplete.setScore(score)
            }, 1)
            
        }, 2)
    }

    setBonusProgress(progress: number)
    {
        this.bonus_bar.progress = progress
        this.face_on_bar.setPosition(this.bonus_bar.totalLength*progress, 0)
    }

    openSoundSetting()
    {
        this.UISoundSetting.showUI()
        this.closeSetting()
    }

    showBonusPopUp()
    {
        this.BonusPopUp.active = true
        this.BonusPopUp.getComponent(UIOpacity).opacity = 0
        tween(this.BonusPopUp.getComponent(UIOpacity)).to(0.1, {opacity: 255}).start()
    }

    hideBonusPopUp()
    {
        tween(this.BonusPopUp.getComponent(UIOpacity)).to(0.1, {opacity: 0})
        .call(()=>
        {
            this.BonusPopUp.active = false
        }).start()

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
