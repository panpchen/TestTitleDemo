// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const ItemsConfigs = [
  {
    id: 0,
    title:
      "2020年1月23日，城乡建设局提出请求对武汉市建设“新冠病毒肺炎应急医院”进行支持，经过商议，决定建设两家集中收治新型冠状病毒肺炎患者的医院，这两家医院的名字叫（）。",
    options: ["A. 雷神山医院", "B. 小汤山医院", "C. 火神山医院", "D. 新冠医院"],
    reasons: ["", ""],
    answerIdList: [0, 2],
  },
  {
    id: 1,
    title:
      "为与时间竞速，与疫魔赛跑，火神山和雷神山医院火雷速度建设，体现中国决心，展现中国力量。火神山医院建设仅用不到（）时间，就拔地而起，完成交付。",
    options: ["A. 8天", "A. 9天", "C. 10天", "D. 11天"],
    reasons: ["", ""],
    answerIdList: [2],
  },
  {
    id: 2,
    title:
      "有种响应叫做不计回报不论生死，短短两天时间，全国非公立医疗机构千余名医护人员，按手印、书写请战书，强烈要求驰援武汉一线。现在，疫情还未过去，作为普通群众的我们也可以贡献自己的力量，下列做法正确的是（）。",
    options: [
      "A. 积极配合防疫工作",
      "B. 存侥幸心理，不重视戴口罩",
      "C. 勤洗手，做好个人防护",
    ],
    reasons: ["", ""],
    answerIdList: [0, 2],
  },
  {
    id: 3,
    title:
      "当时，全国各省对武汉搬家式地支援，缺啥给啥，包括山东寿光的蔬菜、黑龙江的大米等等——武汉的背后有我们。我们不缺物资，但是也要节约物资。当前，为响应节约粮食号召，我们应该（）。",
    options: [
      "A. 不偏食，不挑食",
      "B. 适量定餐，避免剩餐",
      "C. 不攀比,以节约为荣,浪费为耻",
    ],
    reasons: ["", ""],
    answerIdList: [0, 1, 2],
  },
  {
    id: 4,
    title:
      "现在，疫情还未过去。为应对疫情，协助做好抗疫工作，我们每个人都有自己的责任和义务。在日常生活中，我们可以做到的是（）。",
    options: [
      "A. 外出尽量避免人流量大的场所",
      "B. 出行有计划，必要时要将出行路线时间报备社区或村委",
      "C. 出现发烧等症状时，刻意隐瞒病情",
    ],
    reasons: ["", ""],
    answerIdList: [0, 1],
  },
];
export class ItemConfig {
  static getItemConfigById(id) {
    return ItemsConfigs[id];
  }

  static getItemsLength() {
    return ItemsConfigs.length;
  }
}
