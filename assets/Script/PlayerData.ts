// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Utils } from "./Utils";

export class PlayerData {
  private static _instance: PlayerData = null;
  public static instance() {
    if (!this._instance) {
      this._instance = new PlayerData();
    }
    return this._instance;
  }

  constructor() {
    this._storeData = Utils.getParmFromURL(
      // "https://null.jsbin.com/runner?processId=19211414&&userName=小明" // 测试用
      window.location.href
    );
  }

  // 储存字段
  public paperId = 0;
  public paperName = "";
  public score = 0;
  public totalTime = 0;
  public subjects = [];
  private _storeData = null;
  public get userName() {
    return this._storeData["userName"];
  }

  public storeData() {
    cc.log("记录数据");

    this._storeData["paperId"] = this.paperId;
    this._storeData["paperName"] = this.paperName;
    this._storeData["score"] = this.score;
    this._storeData["subjects"] = this.subjects;
    this._storeData["totalTime"] = this.totalTime;
    this._storeData["type"] = 1;
    this._storeData["num"] = 0;

    cc.error(this._storeData);
    return JSON.stringify(this._storeData);
  }
}
