// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnswerItem extends cc.Component {
  @property(cc.Toggle)
  toggle: cc.Toggle = null;
  @property(cc.Label)
  label: cc.Label = null;
  @property([cc.SpriteFrame])
  bgList: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  checkMarkIcon: cc.Sprite = null;
  @property([cc.SpriteFrame])
  icons: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  itemBg: cc.Sprite = null;
  @property(cc.Sprite)
  normalBg: cc.Sprite = null;

  init(data) {
    this.toggle.isChecked = false;
    this.label.string = `${data["optioni"]}.${data["content"]}`;

    if (this.itemBg) {
      const index = data["optionPic"].lastIndexOf(".");
      const newSrc = data["optionPic"].substring(0, index);
      cc.resources.load(
        `optionPics/${newSrc}`,
        cc.SpriteFrame,
        (err, asset: cc.SpriteFrame) => {
          if (err) {
            cc.error(err);
            return;
          }
          this.itemBg.spriteFrame = asset;
        }
      );
    } else {
    }
  }

  onToggleEvent(evt: cc.Toggle, parm) {
    if (evt.isChecked) {
      this.normalBg.spriteFrame = this.bgList[2];
    } else {
      this.normalBg.spriteFrame = this.bgList[3];
    }
  }

  unuse() {
    this.normalBg.spriteFrame = this.bgList[3];
  }
}
