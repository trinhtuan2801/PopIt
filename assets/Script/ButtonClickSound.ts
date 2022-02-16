
import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
import { common } from './data';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ButtonClickSound
 * DateTime = Wed Feb 16 2022 09:19:37 GMT+0700 (Indochina Time)
 * Author = trinhtuan123
 * FileBasename = ButtonClickSound.ts
 * FileBasenameNoExtension = ButtonClickSound
 * URL = db://assets/Script/ButtonClickSound.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('ButtonClickSound')
export class ButtonClickSound extends Component {
    
    @property(AudioClip)
    sound: AudioClip = null

    audioSource: AudioSource = new AudioSource('button_click')

    onLoad()
    {
        this.node.on(Node.EventType.TOUCH_START, ()=>
        {
            if (common.isAudio)
                this.audioSource.playOneShot(this.sound, 1)
        }, this)
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
