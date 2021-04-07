// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerData } from "./PlayerData";
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
  @property(cc.Node)
  offBtn: cc.Node = null;
  @property(cc.Animation)
  scorePanelAni: cc.Animation = null;
  @property(cc.Node)
  endInfoUI: cc.Node = null;
  @property(cc.Node)
  aniNode: cc.Node = null;

  init(gameTime: number, score: number) {
    cc.error("时间: ", gameTime, "分数: ", score);
    this.nameLabel.string = PlayerData.instance().userName;
    this.timeLabel.string = Utils.timeFormat(gameTime);
    this.scoreLabel.string = `${score}分`;
    this.bigScoreLabel.string = score.toString();
    this.showOffBtn(false);
    this.aniNode.active = true;
    this.endInfoUI.active = false;

    this.offBtn.opacity = 0;
    this.scorePanelAni.on(
      "finished",
      () => {
        cc.tween(this.offBtn).to(2, { opacity: 255 }).start();
        this.showOffBtn(true);
      },
      this
    );
    const aniList = this.node.getComponentsInChildren(cc.Animation);
    aniList.forEach((ani, i) => {
      ani.play();
    });
  }

  showOffBtn(enable: boolean) {
    this.offBtn.active = enable;
  }

  onClickHide() {
    this.aniNode.active = false;
    this.endInfoUI.active = true;
  }
}
