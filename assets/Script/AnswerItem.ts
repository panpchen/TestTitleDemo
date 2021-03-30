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
  private _itemId: number = 0;

  init(data) {
    this.toggle.isChecked = false;
    this.label.string = data["content"];
  }
}
