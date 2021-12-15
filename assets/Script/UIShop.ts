
import { _decorator, Component, Node, Prefab, instantiate, Color, Sprite, color, PageView, tween, Vec3, Vec2, find, MeshRenderer, SpriteFrame, Label } from 'cc';
import { InitData } from './data';
import { GameController } from './GameController';
import { ThemeItem } from './ThemeItem';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UIShop
 * DateTime = Tue Nov 23 2021 09:13:59 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = UIShop.ts
 * FileBasenameNoExtension = UIShop
 * URL = db://assets/Script/UIShop.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

export class ThemeInfo {
    url: string //material and spriteframe
    price: number
    isBought: boolean
    isChosen: boolean

    constructor(url: string, price: number, isBought: boolean, isChosen: boolean)
    {
        this.url = url
        this.price = price
        this.isBought = isBought
        this.isChosen = isChosen
    }
}
 
@ccclass('UIShop')
export class UIShop extends Component {
    
    @property(Node)
    UI: Node = null

    @property(Node)
    tab_theme : Node = null

    @property(Node)
    tab_collection: Node = null

    @property(Node)
    indicator_theme: Node = null

    @property(Node)
    indicator_collection: Node = null

    @property(Prefab)
    page_prefab: Prefab = null

    @property(PageView)
    pageview_theme: PageView = null

    @property(PageView)
    pageview_collection: PageView = null

    @property(Prefab)
    themeitem_prefab:Prefab = null

    game: GameController = null

    themeitems: ThemeItem[]=[]

    chosen_theme_item: ThemeItem = null

    @property(MeshRenderer)
    ground_mesh: MeshRenderer = null

    @property(Sprite)
    theme_frame: Sprite = null

    @property(Sprite)
    collection_frame: Sprite = null

    @property(Label)
    theme_label: Label = null

    @property(Label)
    collection_label: Label = null

    @property(SpriteFrame)
    button_on: SpriteFrame = null

    @property(SpriteFrame)
    button_off: SpriteFrame = null

    onLoad()
    {
        this.game = find('GameController').getComponent(GameController)
    }

    start()
    {
        this.init()
        this.switchToThemeTab()
    }

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

    switchToThemeTab()
    {
        this.pageview_theme.node.active = true
        this.pageview_collection.node.active = false
        this.indicator_theme.active = true
        this.indicator_collection.active = false
        this.theme_frame.spriteFrame = this.button_on
        this.collection_frame.spriteFrame = this.button_off
        this.theme_label.color = color(255, 255, 255)
        this.collection_label.color = color(0, 0, 80)
    }

    switchToCollectionTab()
    {
        this.pageview_theme.node.active = false
        this.pageview_collection.node.active = true
        this.indicator_theme.active = false
        this.indicator_collection.active = true
        this.theme_frame.spriteFrame = this.button_off
        this.collection_frame.spriteFrame = this.button_on
        this.theme_label.color = color(0, 0, 80)
        this.collection_label.color = color(255, 255, 255)
    }

    init()
    {
        let themes = InitData.themes
        let page_num = Math.ceil(InitData.themes.length / 4)

        for (let i = 0; i < page_num; i++)
        {
            let page = this.createPage()
            this.pageview_theme.addPage(page)
        }

        let pages = this.pageview_theme.getPages()
        let pos = [new Vec3(-100, 120, 0), new Vec3(100, 120, 0), new Vec3(-100, -120, 0), new Vec3(100, -120, 0)]

        for (let i = 0; i < themes.length; i++)
        {
            let theme = themes[i]
            let themeitem = instantiate(this.themeitem_prefab)
            themeitem.getComponent(ThemeItem).init(theme, this.game, this)
            let page_index = Math.floor(i / 4)
            let item_index = i % 4
            pages[page_index].addChild(themeitem)
            themeitem.setPosition(pos[item_index])
            this.themeitems.push(themeitem.getComponent(ThemeItem))
        }
    }

    createPage()
    {
        let page = instantiate(this.page_prefab)
        return page
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
