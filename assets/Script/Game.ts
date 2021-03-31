import AnswerItem from "./AnswerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
  @property(cc.Label)
  titleNumLabel: cc.Label = null;
  @property(cc.Label)
  titleLabel: cc.Label = null;
  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;
  @property(cc.Prefab)
  itemNoPicPrefab: cc.Prefab = null;
  @property(cc.Node)
  itemParent: cc.Node = null;
  @property(cc.Node)
  itemNoPicParent: cc.Node = null;
  @property(cc.Prefab)
  tipPrefab: cc.Prefab = null;
  @property(cc.Node)
  initUI: cc.Node = null;
  private _tip: cc.Node = null;
  private _isInitConfig: boolean = false; // 是否加载完题目配置
  private _subjectConfig = null; // 试卷配置
  private _;
  private _curTitleId: number = 0; // 当前题目Id
  private _itemPool: cc.NodePool = null;
  private _itemNoPicPool: cc.NodePool = null;

  public static instance: Game = null;
  onLoad() {
    Game.instance = this;

    this._itemPool = new cc.NodePool("AnswerItem");
    this._itemNoPicPool = new cc.NodePool("AnswerItem");
    for (let i = 0; i < 4; ++i) {
      this._itemPool.put(cc.instantiate(this.itemPrefab));
      this._itemNoPicPool.put(cc.instantiate(this.itemNoPicPrefab));
    }

    this.initUI.active = true;

    cc.resources.preloadDir("configs", cc.JsonAsset);
    cc.resources.preloadDir("itemBgs", cc.SpriteFrame);

    this.loadAllConfig()
      .then(() => {
        cc.log("评测配置全部加载完");
        this._isInitConfig = true;
        this.initUI
          .getChildByName("title")
          .getComponent(cc.Label).string = this._subjectConfig.name;
        this.updateContent();
      })
      .catch(() => {
        cc.error("评测配置加载失败");
      });
  }

  loadSubjectConfig() {
    return new Promise((resolve, reject) => {
      cc.resources.load(
        "configs/anxun_subject",
        cc.JsonAsset,
        (err, jsonAsset: cc.JsonAsset) => {
          if (err) {
            reject("anxun_subject加载出错");
            return;
          }
          this._subjectConfig = jsonAsset.json;
          cc.log(this._subjectConfig);
          resolve(null);
        }
      );
    });
  }

  async loadAllConfig() {
    cc.log("开始加载所有配置");
    try {
      return await Promise.all([this.loadSubjectConfig()]);
    } catch (err) {
      cc.error(err);
      throw new Error(err);
    }
  }

  // 更新标题和选项
  updateContent() {
    const titleList = this._subjectConfig["subjectList"];
    cc.log(`总共${titleList.length}题`);

    if (this._curTitleId > titleList.length - 1) {
      this._curTitleId = titleList.length - 1;
    }

    // 隐藏选项
    this._hideAllItem();

    this.titleNumLabel.string = `${this._curTitleId + 1}/${titleList.length}`;

    // 标题
    this.titleLabel.string = `第${this._curTitleId + 1}题: ${
      titleList[this._curTitleId].title
    }`;

    // 创建选项列表
    // const optionList = titleList[this._curTitleId]["options"];
    // for (let i = 0, len = optionList.length; i < len; i++) {
    //   const optionData = optionList[i];
    //   let node = null;
    //   if (optionData["picUrl"].length != 0) {
    //     node = this._createOptionItem();
    //   } else {
    //     node = this._createNoPicItem();
    //   }
    //   node.getComponent(AnswerItem).init(optionData);
    // }
  }

  _createOptionItem() {
    let node = null;
    if (this._itemPool.size() > 0) {
      node = this._itemPool.get();
    } else {
      node = cc.instantiate(this.itemPrefab);
    }
    node.parent = this.itemParent;
    return node;
  }

  _createNoPicItem() {
    let node = null;
    if (this._itemPool.size() > 0) {
      node = this._itemNoPicPool.get();
    } else {
      node = cc.instantiate(this.itemPrefab);
    }
    node.parent = this.itemNoPicParent;
    return node;
  }

  _hideAllItem() {
    for (let i = this.itemParent.childrenCount - 1; i >= 0; i--) {
      this._itemPool.put(this.itemParent.children[i]);
    }

    for (let i = this.itemNoPicParent.childrenCount - 1; i >= 0; i--) {
      this._itemNoPicPool.put(this.itemNoPicParent.children[i]);
    }
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

  onClickStartGame() {
    const ani = this.initUI.getComponent(cc.Animation);
    ani.on(
      "finished",
      () => {
        this.initUI.active = false;
      },
      this
    );
    ani.play();
  }

  // 记录所选择的选项,到时要生成文件到本地
  onclickSubmit() {
    if (!this._isInitConfig) {
      this.showTips("题目配置在加载中,请等候...");
    } else {
      this._curTitleId++;
      this.updateContent();
    }
  }
}
