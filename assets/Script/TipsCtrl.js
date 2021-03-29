cc.Class({
  extends: cc.Component,

  properties: {
    content: cc.Label,
  },

  setContent(str) {
    this.node.opacity = 255;
    if (str) {
      this.content.string = str;
    }
  },
});
