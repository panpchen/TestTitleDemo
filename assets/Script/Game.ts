const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Label)
  titleNum: cc.Label = null;
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property([cc.Prefab])
  itemPrefabs: cc.Prefab[] = [];
  @property([cc.Node])
  itemParents: cc.Node[] = [];
  @property(cc.Prefab)
  tipPrefab: cc.Prefab = null;
  private _tip: cc.Node = null;

  public static instance: Game = null;
  onLoad() {
    Game.instance = this;
    if (!this.loadTitleConfig()) {
      this.showTips("题目配置还没加载完");
    }
  }

  async loadTitleConfig() {
    return false;
  }

  showTips(content) {
    if (!this._tip) {
      this._tip = cc.instantiate(this.tipPrefab);
    }

    this._tip.parent = cc.director.getScene();

    if (content) {
      this._tip.getComponent(cc.Animation).play();
      this._tip.getComponent("TipsCtrl").setContent(content);
    }
  }

  // 记录所选择的选项,到时要生成文件到本地
  onclickSubmit() {}
}
