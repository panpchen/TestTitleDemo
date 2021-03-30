import AnswerItem from "./AnswerItem";
import AnswerItemNoPic from "./AnswerItemNoPic";

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
  private _subjectConfigList = null; // 标题配置
  private _subjectOptionConfigList = null; // 选项配置
  private _curTitleId: number = 0; // 当前题目Id
  private _itemPool: cc.NodePool = null;

  public static instance: Game = null;
  onLoad() {
    Game.instance = this;

    this._itemPool = new cc.NodePool();
    for (let i = 0; i < 8; ++i) {
      if (i < 4) {
        this._itemPool.put(cc.instantiate(this.itemPrefab));
      } else {
        this._itemPool.put(cc.instantiate(this.itemNoPicPrefab));
      }
    }

    this.initUI.active = true;

    cc.resources.preloadDir("configs", cc.JsonAsset);
    cc.resources.preloadDir("itemBgs", cc.SpriteFrame);

    this.loadAllConfig()
      .then(() => {
        cc.log("评测配置全部加载完");
        this._isInitConfig = true;
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
          this._subjectConfigList = jsonAsset.json["RECORDS"];
          cc.log(this._subjectConfigList);
          resolve(null);
        }
      );
    });
  }

  loadSubjectOptionConfig() {
    return new Promise((resolve, reject) => {
      cc.resources.load(
        "configs/anxun_subject_option",
        cc.JsonAsset,
        (err, jsonAsset: cc.JsonAsset) => {
          if (err) {
            reject("anxun_subject_option加载出错");
            return;
          }
          this._subjectOptionConfigList = jsonAsset.json["RECORDS"];
          cc.log(this._subjectOptionConfigList);
          resolve(null);
        }
      );
    });
  }

  async loadAllConfig() {
    cc.log("开始加载所有配置");
    try {
      return await Promise.all([
        this.loadSubjectConfig(),
        this.loadSubjectOptionConfig(),
      ]);
    } catch (err) {
      cc.error(err);
      throw new Error(err);
    }
  }

  // 更新标题和选项
  updateContent() {
    cc.log(`总共${this._subjectConfigList.length}题`);
    this.titleNumLabel.string = `${this._curTitleId + 1}/${
      this._subjectConfigList.length
    }`;
    this.titleLabel.string = `第${this._curTitleId + 1}题: ${
      this._subjectConfigList[this._curTitleId].title
    }`;

    const curTitleId = this._subjectConfigList[this._curTitleId].id;
    const optionList = [];
    for (let i = 0, len = this._subjectOptionConfigList.length; i < len; i++) {
      const optionCfg = this._subjectOptionConfigList[i];
      if (optionCfg["subject_id"] == curTitleId) {
        optionList.push(optionCfg);
      }
    }

    for (let i = 0, len = optionList.length; i < len; i++) {
      const data = optionList[i];
      if (data["option_pic"].length == 0) {
        this._createOptionItem(
          data,
          this.itemNoPicPrefab,
          this.itemNoPicParent
        );
      } else {
        this._createOptionItem(data, this.itemPrefab, this.itemParent);
      }
    }
    cc.log(optionList);
  }

  _createOptionItem(data, prefab: cc.Prefab, parent: cc.Node) {
    const node = cc.instantiate(prefab);
    node.parent = parent;
    node.getComponent(AnswerItem).init(data);
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
      if (this._curTitleId > this._subjectConfigList.length - 1) {
        this._curTitleId = this._subjectConfigList.length - 1;
      }
      this.updateContent();
    }
  }
}
