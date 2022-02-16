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

export class CollectionInfo {
    Name: string
    isUnlock: boolean

    constructor(name: string, isUnlock: boolean)
    {
        this.Name = name
        this.isUnlock = isUnlock
    }
}

export var InitData = 
{
    coin: 1000,
    theme_index: 0,
    themes : 
    [
        new ThemeInfo('ground', 0, true, true),
        new ThemeInfo('cyan', 50, false, false),
        new ThemeInfo('green', 50, false, false),
        new ThemeInfo('orange', 60, false, false),
        new ThemeInfo('bg-1', 60, false, false),
        new ThemeInfo('bg-2', 100, false, false),
        new ThemeInfo('bg-3', 200, false, false),
        new ThemeInfo('bg-4', 200, false, false),
    ],
    collections :
    [
        new CollectionInfo('level 3', false),
        new CollectionInfo('level 7', false)
    ]
}

export var common = 
{
    isAudio: true,
}