
import { _decorator, Component, Node, Camera, geometry, systemEvent, PhysicsSystem, Touch, MeshRenderer, Material, Vec3, Prefab, Scene, director, ShadowStage, SceneAsset, ShadowFlow, Mask, instantiate, RaycastResult2D, PhysicsRayResult, TerrainLayer, Game, tween, SystemEvent, resources, AudioClip, AudioSourceComponent, AudioSource } from 'cc';
import { BigPiece } from './BigPiece';
import { Bubble } from './Bubble';
import { common, InitData } from './data';
import { Piece } from './Piece';
import { UIMainScreen } from './UIMainScreen';

const { ccclass, property } = _decorator;

export enum GameState {
    MATCH_PIECE,
    POP_BUBBLE,
    STANDBY,
}

enum GameMode {
    NORMAL,
    BONUS
}

enum SoundType {
    MATCH_COMPLETE,
    MATCH,
    POP,
    LEVEL_COMPLETE
}

@ccclass('GameController')
export class GameController extends Component {
    @property(Camera)
    camera_3d: Camera = null

    ray: geometry.Ray = new geometry.Ray()

    @property(Node)
    ground: Node = null

    isHit = false

    objectHit: Node = null

    hit_diff: Vec3 = null

    @property(Node)
    piece_node: Node = null

    level = 0

    level_piece_count = 0

    piece_count = 0

    level_bubble_count = 0

    bubble_count = 0

    gamestate: GameState = GameState.MATCH_PIECE

    @property(Prefab)
    level_prefabs: Prefab[] = []

    level_big_piece: BigPiece = null

    @property(UIMainScreen)
    UIMainScreen: UIMainScreen = null

    coin = 0

    gamemode: GameMode = GameMode.NORMAL

    isBonusFromChoose = false

    isTouched = false

    @property(AudioClip)
    pop_sounds: AudioClip[] = []

    audioSource: AudioSource = new AudioSource('pop')

    @property(AudioClip)
    match_complete_sound: AudioClip = null

    @property(AudioClip)
    level_complete_sound: AudioClip = null

    @property(AudioClip)
    match_sound: AudioClip = null

    onLoad() {
        console.log(PhysicsSystem)
        this.coin = InitData.coin
        this.setCoin()
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        this.init()
        // this.initBonusLevel('level 3')

        console.log(FBInstant.player.getID());
         
    }

    init() {
        if (this.level_big_piece && this.level_big_piece.isValid) {
            this.level_big_piece.destroy()
            this.level_big_piece = null
        }
        this.isBonusFromChoose = false
        this.isHit = false
        this.objectHit = null
        this.level_big_piece = null
        this.piece_count = 0
        this.bubble_count = 0
        this.level_big_piece = instantiate(this.level_prefabs[this.level % this.level_prefabs.length]).getComponent(BigPiece)
        this.piece_node.addChild(this.level_big_piece.node)
        console.log('big', this.level_big_piece.node.position.y)
        this.level_bubble_count = this.level_big_piece.bubble_amount
        this.level_piece_count = this.level_big_piece.piece_amount
        this.UIMainScreen.showLevelLabel()
        if (this.level_big_piece.isBonusLevel) {
            this.UIMainScreen.showBonusPopUp(this.level_big_piece.BonusLevelName)
            this.gamemode = GameMode.BONUS
            this.gamestate = GameState.STANDBY
            this.UIMainScreen.setBonusProgress(0)
            this.setLevel(this.level_big_piece.BonusLevelName, true)
            this.UIMainScreen.hideLevelLabel()
        }
        else {
            this.UIMainScreen.showUI()
            this.gamemode = GameMode.NORMAL
            this.gamestate = GameState.MATCH_PIECE
            this.UIMainScreen.hideBonusBar()
            this.setLevel(this.level + 1, false)
        }
        this.setCoin()
    }

    initBonusLevel(name: string) {
        this.UIMainScreen.showUI()
        if (this.level_big_piece && this.level_big_piece.isValid) {
            this.level_big_piece.boom()
            this.level_big_piece = null
        }
        this.isBonusFromChoose = true
        let path = `Prefab/Levels/${name}`
        this.scheduleOnce(() => {
            resources.load(path, Prefab, (err, prefab) => {
                console.log(prefab)
                this.isHit = false
                this.objectHit = null
                this.level_big_piece = null
                this.piece_count = 0
                this.bubble_count = 0
                this.level_big_piece = instantiate(prefab).getComponent(BigPiece)
                this.piece_node.addChild(this.level_big_piece.node)
                // this.level_big_piece.node.setPosition(0, 0, 0)
                this.level_bubble_count = this.level_big_piece.bubble_amount
                this.level_piece_count = this.level_big_piece.piece_amount
                this.UIMainScreen.showLevelLabel()
                if (this.level_big_piece.isBonusLevel) {
                    this.gamemode = GameMode.BONUS
                    this.gamestate = GameState.POP_BUBBLE
                    this.UIMainScreen.showBonusBar()
                    this.UIMainScreen.setBonusProgress(0)
                    this.setLevel(this.level_big_piece.BonusLevelName, true)
                }
                this.setCoin()
            })
        }, 1.1)

    }

    setCoin(amount: number = this.coin) {
        this.coin = amount
        InitData.coin = this.coin
        this.UIMainScreen.setCoinLabel(this.coin)
    }

    setLevel(name: string | number, isRelax: boolean) {
        this.UIMainScreen.setLevel(name, isRelax)
    }

    onTouchStart(touch: Touch) {
        if (this.UIMainScreen.isSettingOpened) this.UIMainScreen.closeSetting()
        if (this.gamestate == GameState.STANDBY) return
        this.UIMainScreen.hideUI()
        this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
        this.isHit = false        

        if (PhysicsSystem.instance.raycastClosest(this.ray)) {
            const result = PhysicsSystem.instance.raycastClosestResult
            let hitnode = result.collider.node
            // console.log(result)
            if (this.gamestate == GameState.MATCH_PIECE) {
                if (hitnode.layer == 1 << 0) // layer piece
                {
                    this.checkPiece(hitnode.parent, result.hitPoint, touch)
                }
                else if (hitnode.layer == 1 << 1) {
                    this.checkPiece(hitnode.parent.parent, result.hitPoint, touch)
                }

                if (hitnode.layer == 1 << 0 || hitnode.layer == 1 << 1)
                {
                    this.isTouched = true
                    this.unschedule(this.setTouchFalse)
                    this.scheduleOnce(this.setTouchFalse, 2)
                    this.unschedule(this.checkTouched)
                    this.scheduleOnce(this.checkTouched, 3)
                }
                
            }
            else if (this.gamestate == GameState.POP_BUBBLE) {
                if (hitnode.layer == 1 << 1) // layer bubble
                {
                    this.popBubble(hitnode.parent)
                }
            }
        }
    }

    checkPiece(piecenode: Node, hitpoint: Vec3, touch: Touch) {
        let piece = piecenode.getComponent(Piece)
        if (piece && piece.isPickable) {
            this.hit_diff = piecenode.getPosition().subtract(hitpoint)
            this.objectHit = piecenode
            this.isHit = true

            let ray: geometry.Ray = new geometry.Ray()
            this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), ray);
            if (PhysicsSystem.instance.raycast(this.ray)) {
                const result = PhysicsSystem.instance.raycastResults;

                for (let i = 0; i < result.length; i++) {
                    const item = result[i];

                    if (item.collider.node.uuid == this.ground.uuid) {
                        let pos = item.hitPoint
                        pos.x = (pos.x + this.hit_diff.x) * 0.75
                        pos.z = (pos.z + this.hit_diff.z) * 0.75
                        pos.y = this.objectHit.position.y
                        // this.objectHit.setPosition(pos)
                        piece.pick(pos)
                        break
                    }
                }
            }
        }
    }

    popBubble(bubblenode: Node) {
        let bubble = bubblenode.getComponent(Bubble)

        if (bubble && !bubble.isPop && bubble.isPopable) {
           
            this.playAudio(SoundType.POP)
            
            bubble.popIt()
            this.bubble_count++
            this.coin++
            this.setCoin()

            if (this.gamemode == GameMode.BONUS) {
                let count = this.bubble_count + this.level_big_piece.TurnTimeCount * this.level_big_piece.bubble_amount
                this.UIMainScreen.setBonusProgress(count / this.level_big_piece.total_pop_count)
            }

            if (this.bubble_count == this.level_bubble_count) {
                if (this.gamemode == GameMode.NORMAL) {
                    this.winNormal()
                }
                else if (this.gamemode == GameMode.BONUS) {
                    this.bubble_count = 0
                    if (this.level_big_piece.TurnTimeCount == this.level_big_piece.MaxTurnTime)
                        this.winBonus()
                    else
                        this.scheduleOnce(() => {
                            this.level_big_piece.changeSide()
                        }, 0.5)
                }
            }
            this.level_big_piece.forceByPop(bubble.node)
        }

    }

    winNormal() {
        this.level++
        let picture = this.level_big_piece.LevelPicture.clone()
        this.level_big_piece.boom()
        this.scheduleOnce(() => {
            this.UIMainScreen.showUI()
            this.UIMainScreen.openLevelComplete(this.bubble_count, picture)
        }, 1.2)
        this.playAudio(SoundType.LEVEL_COMPLETE, 0.2)
    }

    winBonus() {
        // this.winNormal()
        if (!this.isBonusFromChoose) this.level++
        this.level_big_piece.boom()
        this.scheduleOnce(() => {
            this.UIMainScreen.hideBonusBar()
            this.init()
        }, 1)
    
        this.playAudio(SoundType.LEVEL_COMPLETE, 0.2)

    }

    onTouchMove(touch: Touch) {
        if (this.isHit && this.gamestate == GameState.MATCH_PIECE) {

            this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
            if (PhysicsSystem.instance.raycast(this.ray)) {
                const result = PhysicsSystem.instance.raycastResults;

                for (let i = 0; i < result.length; i++) {
                    const item = result[i];

                    if (item.collider.node.uuid == this.ground.uuid) {
                        let pos = item.hitPoint
                        pos.x = (pos.x + this.hit_diff.x) * 0.75
                        pos.z = (pos.z + this.hit_diff.z) * 0.75
                        pos.y = this.objectHit.position.y
                        this.objectHit.setPosition(pos)
                        break
                    }
                }
            }
            this.objectHit.getComponent(Piece).rayCast()
            this.isTouched = true
            this.unschedule(this.setTouchFalse)
            this.scheduleOnce(this.setTouchFalse, 2)
            this.unschedule(this.checkTouched)
            this.scheduleOnce(this.checkTouched, 3)
        }
        else if (this.gamestate == GameState.POP_BUBBLE) {
            this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
            if (PhysicsSystem.instance.raycastClosest(this.ray)) {
                const result = PhysicsSystem.instance.raycastClosestResult;

                let hitnode = result.collider.node
                if (hitnode.layer == 1 << 1) // layer bubble
                {
                    this.popBubble(hitnode.parent)
                }
            }
        }
    }

    onTouchEnd() {
        if (this.gamestate == GameState.MATCH_PIECE && this.isHit) {
            let piece = this.objectHit.getComponent(Piece)
            if (piece.isMatch) 
            {
                piece.match()
                this.piece_count++
                if (this.piece_count == this.level_piece_count)
                {
                    this.gamestate = GameState.POP_BUBBLE

                    this.playAudio(SoundType.MATCH_COMPLETE, 0.1)
                }
                else
                {
                    this.playAudio(SoundType.MATCH, 0.1)
                }
            }
            if (this.piece_count == this.level_piece_count)
                piece.drop(false)
            else
                piece.drop(true)
            this.objectHit = null
            this.isHit = false
            this.hit_diff = null

            this.unschedule(this.setTouchFalse)
            this.unschedule(this.checkTouched)
        }
    }

    setTouchFalse()
    {
        this.isTouched = false
    }

    checkTouched()
    {
        if (this.gamestate == GameState.MATCH_PIECE)
        {
            console.log('is touched', this.isTouched)
            this.level_big_piece.checkTouched(this.objectHit, this.isTouched)
            if (!this.isTouched)
            {
                this.objectHit = null
                this.isHit = false
                this.hit_diff = null
            }
        }
    }

    playAudio(type: SoundType, delay = 0)
    {
        if (!common.isAudio) return
        let clip: AudioClip = null
        switch(type)
        {
            case SoundType.POP: clip = this.pop_sounds[Math.floor(Math.random()*this.pop_sounds.length)];break
            case SoundType.MATCH: clip = this.match_sound;break
            case SoundType.MATCH_COMPLETE: clip = this.match_complete_sound;break
            case SoundType.LEVEL_COMPLETE: clip = this.level_complete_sound;break
        }

        if (delay > 0)
        {
            this.scheduleOnce(()=>
            {
                this.audioSource.playOneShot(clip, 1)
            }, delay)
        }
        else
            this.audioSource.playOneShot(clip, 1)
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
