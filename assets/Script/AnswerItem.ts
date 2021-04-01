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
  private _optionId: number = 0;
  public get optionId() {
    return this._optionId;
  }

  private _result: number = -1;
  public get result() {
    return this._result;
  }

  init(id, data) {
    this._optionId = id;
    this._result = data["result"];
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
    }
  }

  onToggleEvent(evt: cc.Toggle, parm) {
    if (evt.isChecked) {
      this.normalBg.spriteFrame = this.bgList[2];
      Game.instance.addSelectToList(this);
    } else {
      this.normalBg.spriteFrame = this.bgList[3];
      Game.instance.removeSelectToList(this);
    }
  }

  unuse() {
    this.normalBg.spriteFrame = this.bgList[3];
    this.checkMarkIcon.spriteFrame = null;
    this.checkMarkIcon.node.active = false;
  }

  setMarkIconState(isCorrect: boolean) {
    this.checkMarkIcon.node.active = true;
    if (isCorrect) {
      this.checkMarkIcon.spriteFrame = this.icons[0];
      this.normalBg.spriteFrame = this.bgList[0];
    } else {
      this.checkMarkIcon.spriteFrame = this.icons[1];
      this.normalBg.spriteFrame = this.bgList[1];
    }
  }
}
