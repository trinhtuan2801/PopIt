export class ThemeInfo {
    url: string //material and spriteframe
    price: number
    isBought: boolean
    isChosen: boolean

    constructor(url: string, price: number, isBought: boolean, isChosen: boolean) {
        this.url = url
        this.price = price
        this.isBought = isBought
        this.isChosen = isChosen
    }
}

export class CollectionInfo {
    Name: string
    isUnlock: boolean

    constructor(name: string, isUnlock: boolean) {
        this.Name = name
        this.isUnlock = isUnlock
    }
}

export var InitData =
{
    level: 0,
    coin: 0,
    theme_index: 0,
    themes:
        [
            new ThemeInfo('ground', 0, true, true),
            new ThemeInfo('cyan', 50, false, false),
            new ThemeInfo('green', 50, false, false),
            new ThemeInfo('orange', 50, false, false),
            new ThemeInfo('bg-1', 200, false, false),
            new ThemeInfo('bg-2', 200, false, false),
            new ThemeInfo('bg-3', 200, false, false),
            new ThemeInfo('bg-4', 200, false, false),
        ],
    collections:
        [
            new CollectionInfo('level 3', false),
            new CollectionInfo('level 7', false)
        ]
}

export var common =
{
    isAudio: true,
}

export function getData() {
    console.log(
        JSON.parse(localStorage.getItem('level')),
        JSON.parse(localStorage.getItem('coin')),
        JSON.parse(localStorage.getItem('theme_index')),
        JSON.parse(localStorage.getItem('themes')),
        JSON.parse(localStorage.getItem('collections')),
        JSON.parse(localStorage.getItem('isAudio')),
    )
    InitData.level = JSON.parse(localStorage.getItem('level')) || InitData.level
    InitData.coin = JSON.parse(localStorage.getItem('coin')) || InitData.coin
    InitData.theme_index = JSON.parse(localStorage.getItem('theme_index')) || InitData.theme_index
    InitData.themes = JSON.parse(localStorage.getItem('themes')) || InitData.themes
    InitData.collections = JSON.parse(localStorage.getItem('collections')) || InitData.collections
    let isAudio = JSON.parse(localStorage.getItem('isAudio'))
    common.isAudio = isAudio !== null ? isAudio : true
}

export function setData() {
    localStorage.setItem('level', JSON.stringify(InitData.level))
    localStorage.setItem('coin', JSON.stringify(InitData.coin))
    localStorage.setItem('theme_index', JSON.stringify(InitData.theme_index))
    localStorage.setItem('themes', JSON.stringify(InitData.themes))
    localStorage.setItem('collections', JSON.stringify(InitData.collections))
    localStorage.setItem('isAudio', JSON.stringify(common.isAudio))
}