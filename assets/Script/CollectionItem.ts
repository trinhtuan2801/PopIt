
import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UI } from 'cc';
import { CollectionInfo } from './data';
import { GameController } from './GameController';
import { UIShop } from './UIShop';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CollectionItem
 * DateTime = Tue Dec 28 2021 07:03:28 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = CollectionItem.ts
 * FileBasenameNoExtension = CollectionItem
 * URL = db://assets/Script/CollectionItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('CollectionItem')
export class CollectionItem extends Component {

    UIShop: UIShop = null
    
    game: GameController = null

    @property(Sprite)
    background: Sprite = null

    @property(Node)
    watch_button: Node = null

    info: CollectionInfo = null

    init(info: CollectionInfo, game: GameController, UIShop: UIShop)
    {
        this.info = info
        this.setBackground(info.Name)
        this.game = game
        this.UIShop = UIShop
        if (info.isUnlock) this.unlockState()
    }

    setBackground(url: string)
    {
        let path = `UI/Level Picture/${url}/spriteFrame`

        resources.load(path, SpriteFrame, (err, frame)=>
        {
            this.background.spriteFrame = frame
        })
    }

    watchAds()
    {
        this.info.isUnlock = true
        this.unlockState()
    }

    unlockState()
    {
        this.watch_button.active = false
    }

    playThisLevel()
    {   
        if (this.info.isUnlock)
        {
            this.game.initBonusLevel(this.info.Name)
            this.UIShop.hideUI()
        }
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
