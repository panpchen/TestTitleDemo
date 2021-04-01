// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndUI extends cc.Component {
  @property(cc.Label)
  nameLabel: cc.Label = null;
  @property(cc.Label)
  scoreLabel: cc.Label = null;
  @property(cc.Label)
  bigScoreLabel: cc.Label = null;
  @property(cc.Label)
  timeLabel: cc.Label = null;

  init(gameTime: number) {
    cc.error(gameTime);
    this.timeLabel.string = Utils.timeFormat(gameTime);
  }
}
