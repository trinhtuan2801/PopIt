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
    // return
    return new Promise<String>((resolve, reject)=>{
        FBInstant.player
        .getDataAsync(['level', 'coin', 'theme_index', 'themes', 'collections', 'isAudio'])
        .then((data: Object) => {
            if (Object.keys(data).length === 0) {
                console.log('hok co data')
                setData()
            }
            else {
                console.log('data ne:', data)
                InitData.level = data['level']
                InitData.coin = data['coin']
                InitData.theme_index = data['theme_index']
                InitData.themes = data['themes']
                InitData.collections = data['collections']
                common.isAudio = data['isAudio']
            }
            resolve('lay data xong rui')
        })
    })
    
}

export function setData() {
    // return 
    let data: Object = {
        level: InitData.level,
        coin: InitData.coin,
        theme_index: InitData.theme_index,
        themes: InitData.themes,
        collections: InitData.collections,
        isAudio: common.isAudio
    }
    console.log(data)
    FBInstant.player
        .setDataAsync(data)
        .then(function () {
            console.log('data is set');
            // console.log(InitData)
        });
}