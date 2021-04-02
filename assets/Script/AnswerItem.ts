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
  public get score() {
    return this._data["score"];
  }
  public get partScore() {
    return this._data["partScore"];
  }
  private _optioni: string = "";
  public get optioni() {
    return this._optioni;
  }

  public get content() {
    return this._data["content"];
  }

  public get titleId() {
    return this._data["id"];
  }

  private _result: number = -1;
  public get result() {
    return this._result;
  }
  private _data = null;

  init(id, data) {
    this._data = data;
    this._optionId = id;
    this._result = data["result"];
    this.toggle.isChecked = false;
    this._optioni = data["optioni"];
    this.label.string = `${this._optioni}.${data["content"]}`;

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
