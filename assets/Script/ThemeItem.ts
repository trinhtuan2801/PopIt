
import { _decorator, Component, Node, resources, SpriteFrame, Sprite, Label, LabelComponent, Material } from 'cc';
import { GameController } from './GameController';
import { ThemeInfo, UIShop } from './UIShop';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ThemeItem
 * DateTime = Tue Nov 23 2021 11:24:46 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = ThemeItem.ts
 * FileBasenameNoExtension = ThemeItem
 * URL = db://assets/Script/ThemeItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('ThemeItem')
export class ThemeItem extends Component {
    
    game: GameController = null

    @property(Sprite)
    frame: Sprite = null

    @property(Node)
    buy_button: Node = null

    @property(Node)
    choose_button: Node = null

    @property(Node)
    chosen_button: Node = null

    info: ThemeInfo = null

    @property(Label)
    coin_label: Label = null

    UIShop: UIShop = null

    material: Material = null

    onLoad()
    {
        // this.unboughtState()
    }

    init(info: ThemeInfo, game: GameController, UIShop: UIShop)
    {
        this.info = info
        this.setFrame(info.url)
        this.coin_label.string = info.price.toString()
        this.game = game
        this.UIShop = UIShop
        if (info.isBought) this.boughtState()
        if (info.isChosen) {this.chosenState(); this.UIShop.chosen_theme_item = this}
    }

    setFrame(url: string)
    {
        let path = `Themes/${url}/spriteFrame`
        resources.load(path, SpriteFrame, (err, frame)=>
        {
            this.frame.spriteFrame = frame
        })
        path = `Materials/${url}`
        resources.load(path, Material, (err, material)=>
        {
            this.material = material
            if (this.info.isChosen)
                this.UIShop.ground_mesh.setMaterial(this.material, 0)
        })
    }

    buy()
    {
        if (this.game.coin >= this.info.price)
        {
            this.info.isBought = true
            this.game.coin -= this.info.price
            this.game.setCoin()
            this.boughtState()
        }
    }

    choose()
    {
        this.info.isChosen = true
        this.UIShop.chosen_theme_item.unChoose()
        this.UIShop.chosen_theme_item = this
        this.chosenState()
        this.UIShop.ground_mesh.setMaterial(this.material, 0)
    }

    unChoose()
    {   
        this.info.isChosen = false
        this.boughtState()
    }

    unboughtState()
    {
        this.buy_button.active = true
        this.choose_button.active = false
        this.chosen_button.active = false
    }

    boughtState()
    {
        this.buy_button.active = false
        this.choose_button.active = true
        this.chosen_button.active = false
    }

    chosenState()
    {
        this.buy_button.active = false
        this.choose_button.active = false
        this.chosen_button.active = true
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
