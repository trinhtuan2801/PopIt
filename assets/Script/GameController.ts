
import { _decorator, Component, Node, Camera, geometry, systemEvent, PhysicsSystem, Touch, MeshRenderer, Material, Vec3, Prefab, Scene, director, ShadowStage, SceneAsset, ShadowFlow, Mask, instantiate, RaycastResult2D, PhysicsRayResult, TerrainLayer, Game, tween, SystemEvent } from 'cc';
import { BigPiece } from './BigPiece';
import { Bubble } from './Bubble';
import { InitData } from './data';
import { Piece } from './Piece';
import { UIMainScreen } from './UIMainScreen';

const { ccclass, property } = _decorator;

enum GameState {
    MATCH_PIECE,
    POP_BUBBLE
}

enum GameMode {
    NORMAL,
    BONUS
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

    onLoad()
    {
        console.log(PhysicsSystem)
        this.coin = InitData.coin
        this.setCoin()
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        this.init()
    }

    init()
    {
        this.isHit = false
        this.objectHit = null
        this.level_big_piece = null
        this.piece_count = 0
        this.bubble_count = 0
        this.level_big_piece = instantiate(this.level_prefabs[this.level % this.level_prefabs.length]).getComponent(BigPiece)
        this.piece_node.addChild(this.level_big_piece.node)
        this.level_big_piece.node.setPosition(0, 0, 0)
        this.level_bubble_count = this.level_big_piece.bubble_amount
        this.level_piece_count = this.level_big_piece.piece_amount
        if (this.level_big_piece.isBonusLevel)
        {
            this.gamemode = GameMode.BONUS
            this.gamestate = GameState.POP_BUBBLE
            this.UIMainScreen.showBonusBar()
            this.UIMainScreen.setBonusProgress(0)
            this.setLevel(this.level_big_piece.BonusLevelName, true)
        }
        else
        {
            this.gamemode = GameMode.NORMAL 
            this.gamestate = GameState.MATCH_PIECE
            this.UIMainScreen.hideBonusBar()
            this.setLevel(this.level + 1, false)
        } 
        this.setCoin()
    }

    setCoin(amount: number = this.coin)
    {
        this.coin = amount
        InitData.coin = this.coin
        this.UIMainScreen.setCoinLabel(this.coin)
    }

    setLevel(name: string | number, isRelax: boolean)
    {
        this.UIMainScreen.setLevel(name, isRelax)
    }

    onTouchStart(touch: Touch)
    {
        if (this.UIMainScreen.isSettingOpened) this.UIMainScreen.closeSetting()
        this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
        this.isHit = false

        if (PhysicsSystem.instance.raycastClosest(this.ray)) 
        {
            const result = PhysicsSystem.instance.raycastClosestResult
            let hitnode = result.collider.node

            if (this.gamestate == GameState.MATCH_PIECE)
            {
                if (hitnode.layer == 1 << 0 ) // layer piece
                {
                    this.checkPiece(hitnode.parent, result.hitPoint)
                }
                else if (hitnode.layer == 1 << 1)
                {
                    this.checkPiece(hitnode.parent.parent, result.hitPoint)
                }
            }
            else if (this.gamestate == GameState.POP_BUBBLE)
            {
                if (hitnode.layer == 1 << 1) // layer bubble
                {
                    this.popBubble(hitnode.parent)
                }
            }
        }
    }

    checkPiece(piecenode: Node, hitpoint: Vec3)
    {
        let piece = piecenode.getComponent(Piece)
        if (piece && piece.isPickable)
        {
            this.hit_diff = piecenode.getPosition().subtract(hitpoint)
            this.objectHit = piecenode
            this.isHit = true
            piece.pick()
        }
    }

    popBubble(bubblenode: Node)
    {
        let bubble = bubblenode.getComponent(Bubble)

        if (bubble && !bubble.isPop && bubble.isPopable)
        {
            bubble.popIt()
            this.bubble_count ++
            this.coin ++
            this.setCoin()

            if (this.gamemode == GameMode.BONUS)
            {
                let count = this.bubble_count + this.level_big_piece.TurnTimeCount * this.level_big_piece.bubble_amount
                this.UIMainScreen.setBonusProgress(count / this.level_big_piece.total_pop_count)
            }

            if (this.bubble_count == this.level_bubble_count)
            {
                if (this.gamemode == GameMode.NORMAL)
                {
                    this.winNormal()
                }
                else if (this.gamemode == GameMode.BONUS)
                {
                    this.bubble_count = 0
                    if (this.level_big_piece.TurnTimeCount == this.level_big_piece.MaxTurnTime)
                        this.winBonus()
                    else
                        this.scheduleOnce(()=>{
                            this.level_big_piece.changeSide()
                        }, 0.5)
                }
            }
            this.level_big_piece.forceByPop(bubble.node)
        }
        
    }

    winNormal()
    {
        this.level ++
        let picture = this.level_big_piece.LevelPicture.clone()
        this.level_big_piece.boom()
        this.scheduleOnce(()=>
        {
            this.UIMainScreen.openLevelComplete(this.bubble_count, picture)
        }, 1.2)
    }

    winBonus()
    {
        this.winNormal()
        this.scheduleOnce(()=>{this.UIMainScreen.hideBonusBar()}, 1)
        
    }

    onTouchMove(touch: Touch)
    {
        if (this.isHit && this.gamestate == GameState.MATCH_PIECE)
        {
            this.objectHit.getComponent(Piece).rayCast()
            this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
            if (PhysicsSystem.instance.raycast(this.ray))
            {
                const result = PhysicsSystem.instance.raycastResults;
                
                for (let i = 0; i < result.length; i++) 
                {
                    const item = result[i];
                    
                    if (item.collider.node.uuid == this.ground.uuid) 
                    {
                        let pos = item.hitPoint
                        pos.x = pos.x + this.hit_diff.x
                        pos.z = pos.z + this.hit_diff.z
                        pos.y = this.objectHit.position.y
                        this.objectHit.setPosition(pos)
                        break
                    }
                }
            }
        }
        else if (this.gamestate == GameState.POP_BUBBLE)
        {
            this.camera_3d.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this.ray);
            if (PhysicsSystem.instance.raycastClosest(this.ray))
            {
                const result = PhysicsSystem.instance.raycastClosestResult;
                
                let hitnode = result.collider.node
                if (hitnode.layer == 1 << 1) // layer bubble
                {
                    this.popBubble(hitnode.parent)
                }
            }
        }
    }

    onTouchEnd()
    {
        if (this.gamestate == GameState.MATCH_PIECE && this.isHit)
        {
            let piece = this.objectHit.getComponent(Piece)
            if (piece.isMatch)
            {
                piece.match()
                this.piece_count ++
                if (this.piece_count == this.level_piece_count)
                    this.gamestate = GameState.POP_BUBBLE
                
            } 
            if (this.piece_count == this.level_piece_count)
                piece.drop(false)
            else
                piece.drop(true)
            this.objectHit = null
            this.isHit = false
            this.hit_diff = null
        }
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
