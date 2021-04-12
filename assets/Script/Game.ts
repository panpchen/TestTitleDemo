import AnswerItem from "./AnswerItem";
import EndUI from "./EndUI";
import { PlayerData } from "./PlayerData";
import { Utils } from "./Utils";

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
  @property(cc.Node)
  endUI: cc.Node = null;
  @property(cc.Node)
  submitBtn: cc.Node = null;
  @property(cc.Label)
  gameTimeLabel: cc.Label = null;
  @property(cc.Label)
  gameScoreLabel: cc.Label = null;
  @property(cc.Node)
  titleBg: cc.Node = null;
  private _tip: cc.Node = null;
  private _isInitConfig: boolean = false; // 是否加载完题目配置
  private _subjectConfig = null; // 试卷配置
  private _titleList = []; // 所有试卷题目配置

  private _titleCfg = null; // 当前题目配置
  private _curTitleId: number = 0; // 当前题目Id
  private _itemPool: cc.NodePool = null;
  private _itemNoPicPool: cc.NodePool = null;
  private _selectOptions: AnswerItem[] = [];
  // private _constSelectOptions = [];
  public _allItemList: AnswerItem[] = [];
  private _currentTime: number = 0;
  private _currentScore: number = 0;
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

    // 预加载
    cc.resources.preloadDir("configs", cc.JsonAsset);
    cc.resources.preloadDir("optionPics", cc.SpriteFrame);

    this.loadAllConfig()
      .then(() => {
        cc.log("评测配置全部加载完");
        this._titleList = this._subjectConfig["subjectList"];
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

  startTime() {
    this.schedule(this.gameTimeCallback, 1, cc.macro.REPEAT_FOREVER, 0.01);
  }

  gameTimeCallback() {
    this._currentTime++;
    this.gameTimeLabel.string = `用时:${Utils.countDownFormat(
      this._currentTime
    )}`;
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
          this._subjectConfig = jsonAsset.json[0];
          PlayerData.instance().paperId = this._subjectConfig["id"];
          PlayerData.instance().paperName = this._subjectConfig["name"];
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

  isGameOver() {
    return this._curTitleId >= this._titleList.length - 1;
  }

  // 更新标题和选项
  updateContent() {
    cc.log(`总共${this._titleList.length}题`);

    // 隐藏选项
    this._hideAllItem();

    this.titleNumLabel.string = `${this._curTitleId + 1}/${
      this._titleList.length
    }`;

    this._titleCfg = this._titleList[this._curTitleId];

    cc.tween(this.titleBg)
      .to(0.25, { y: 500 }, { easing: "smooth" })
      .call(() => {
        // 显示标题
        let titleType = "";
        if (this._titleCfg.titleType == 1) {
          titleType = "(单选题)";
        } else if (this._titleCfg.titleType == 2) {
          titleType = "(多选题)";
        }
        this.titleLabel.string = `第${this._curTitleId + 1}题: ${
          this._titleCfg.title
        }   ${titleType}`;
      })
      .to(0.5, { y: 260 }, { easing: "smooth" })
      .start();

    // 显示选项列表
    this.scheduleOnce(() => {
      const optionList = this._titleList[this._curTitleId]["options"];
      for (let i = 0, len = optionList.length; i < len; i++) {
        const optionData = optionList[i];
        let node = null;
        if (optionData["optionPic"].length == 0) {
          node = this._createNoPicItem();
        } else {
          node = this._createOptionItem();
        }
        this._allItemList.push(node.getComponent(AnswerItem));
        node.getComponent(AnswerItem).init(i, optionData);
      }

      this.scheduleOnce(() => {
        this._onShowSubmitBtn(true);
      }, 0.8);
    }, 0.5);
  }

  _showSubmitBtn() {}

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

    this._allItemList = [];
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
        this.startTime();
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
      this.checkAnswer();
      this.storePlayerData();
      this._selectOptions = [];
      this._onShowSubmitBtn(false);
      if (this.isGameOver()) {
        this.unscheduleAllCallbacks();
        this.unschedule(this.gameTimeCallback);
        this.scheduleOnce(() => {
          this.showEndUI();
        }, 1.5);
        return;
      }

      this._curTitleId++;

      this.unschedule(this.callback);
      this.scheduleOnce(this.callback, 1);
    }
  }

  callback() {
    this.updateContent();
  }

  _onShowSubmitBtn(enable: boolean) {
    if (!enable) {
      cc.tween(this.submitBtn)
        .to(0.2, { x: 800 }, { easing: "smooth" })
        .call(() => {
          this.submitBtn.active = false;
        })
        .start();
    } else {
      this.submitBtn.active = true;
      cc.tween(this.submitBtn)
        .to(0.2, { x: 470 }, { easing: "smooth" })
        .start();
    }
  }

  checkAnswer() {
    this._selectOptions.sort((a, b) => {
      return a.optionId - b.optionId;
    });

    const allAnswerList = this._allItemList.filter((v) => {
      return v.result == 1;
    });

    // 显示正确答案
    for (let i = 0; i < this._allItemList.length; i++) {
      for (let j = 0; j < allAnswerList.length; j++) {
        if (this._allItemList[i].optionId == allAnswerList[j].optionId) {
          this._allItemList[i].setMarkIconState(true);
          break;
        } else {
          this._allItemList[i].setMarkIconState(false);
        }
      }
    }

    // 答对数
    let correctNum = 0;
    for (let i = 0; i < allAnswerList.length; i++) {
      for (let j = 0; j < this._selectOptions.length; j++) {
        if (allAnswerList[i].optionId == this._selectOptions[j].optionId) {
          correctNum++;
          break;
        }
      }
    }

    // 算得分
    let awardScore = 0;
    if (
      this._selectOptions.length == allAnswerList.length &&
      correctNum == allAnswerList.length
    ) {
      awardScore = this._titleCfg["score"];
      cc.error("全对: ", awardScore);
    } else if (correctNum > 0) {
      awardScore = this._titleCfg["partScore"];
      cc.error("半对: ", awardScore);
    }
    this._currentScore += awardScore;

    const newCfg = {};
    newCfg["id"] = this._titleCfg["paperId"];
    newCfg["title"] = this._titleCfg["title"];
    newCfg["type"] = this._titleCfg["titleType"];
    newCfg["score"] = awardScore;
    newCfg["options"] = [];

    // if (!this._constSelectOptions[this._curTitleId]) {
    //   this._constSelectOptions[this._curTitleId] = [];
    // }
    // this._constSelectOptions[this._curTitleId] = this._selectOptions;

    // const options = [];
    // for (let i = 0; i < this._constSelectOptions.length; i++) {
    //   options[i] = this._constSelectOptions[i].map((item) => item["optioni"]);
    // }

    for (let i = 0; i < this._selectOptions.length; i++) {
      newCfg["options"][i] = {};
      newCfg["options"][i]["id"] = this._selectOptions[i].titleId;
      newCfg["options"][i]["title"] = this._selectOptions[i].content;
      newCfg["options"][i]["optioni"] = this._selectOptions[i].optioni;
    }

    PlayerData.instance().subjects.push(newCfg);

    this.gameScoreLabel.string = `得分:${this._currentScore}分`;
    if (this._currentScore > 0) {
      cc.tween(this.gameScoreLabel.node)
        .to(0.2, { scale: 2 }, { easing: "smooth" })
        .to(0.2, { scale: 1 }, { easing: "smooth" })
        .start();
    }

    PlayerData.instance().score = this._currentScore;
    PlayerData.instance().totalTime = this._currentTime;
  }

  storePlayerData() {
    const data = PlayerData.instance().storeData();

    const a = document.createElement("a");
    a.onclick = () => {
      // 发给客户端信息
      window.injectedObject.startFunction(data);
    };
    // document.body.appendChild(a);
  }

  addSelectToList(answerItem: AnswerItem) {
    this._selectOptions.push(answerItem);
  }
  removeSelectToList(answerItem: AnswerItem) {
    for (let i = this._selectOptions.length - 1; i >= 0; i--) {
      if (this._selectOptions[i].optionId == answerItem.optionId) {
        this._selectOptions.splice(i, 1);
        break;
      }
    }
  }

  showEndUI() {
    this.endUI.active = true;
    this.endUI.getComponent(EndUI).init(this._currentTime, this._currentScore);
  }
}
