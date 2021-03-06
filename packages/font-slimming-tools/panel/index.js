// panel/index.js, this filename needs to match the one registered in package.json
const fs = require("fs");
const path = require("path");
const { remote } = require("electron");
const { fileURLToPath } = require("url");

Editor.Panel.extend({
  // css style for panel
  style:
    fs.readFileSync(
      Editor.url("packages://font-slimming-tools/panel/index.css", "utf8")
    ) + "",

  // html template for panel
  template:
    fs.readFileSync(
      Editor.url("packages://font-slimming-tools/panel/index.html", "utf8")
    ) + "",
  // method executed when template and styles are successfully loaded and initialized

  $: {
    logListUI: "#logListUI",
  },
  ready() {
    let logCtrl = this.$logListUI;
    let msgEnd = this.$msg_end;
    let logListScrollToBottom = function () {
      setTimeout(function () {
        logCtrl.scrollTop = logCtrl.scrollHeight;
      }, 10);
    };
    window.app = new window.Vue({
      el: this.shadowRoot,
      created() {
        console.log("created");
        let CfgUtil = Editor.require(
          "packages://font-slimming-tools/panel/CfgUtil"
        );
        CfgUtil.initCfg(
          function (data) {
            this.baseFontPath = data.baseFontPath;
            this.outPutFontPath = data.outPutFontPath;
          }.bind(this)
        );
      },
      init() {
        console.log("init");
      },
      data: {
        fileList: [],
        logList: [],
        baseFontPath: "",
        outPutFontPath: "",
        isShowFontDirBtn: false,
        newFontPath: "",
        progressValue: 0,
        isUseSuggestString: false,
      },
      methods: {
        _addLog(str) {
          let time = new Date();
          let log = "[" + time.toLocaleString() + "] " + str;
          this.logList.push(log);
          logListScrollToBottom();
        },
        clickUseSuggestString() {
          this.isUseSuggestString = !this.isUseSuggestString;
          let stringFile = Editor.url(
            "packages://font-slimming-tools/SuggestString.txt"
          );
          let FileUtil = Editor.require(
            "packages://font-slimming-tools/panel/FileUtil"
          );
          if (this.isUseSuggestString) {
            if (FileUtil._isFileExit(stringFile)) {
              this.fileList.push(stringFile);
              this._addLog("?????????????????????");
            }
          } else {
            for (let i = 0; i < this.fileList.length; i++) {
              if (this.fileList[i].indexOf(stringFile) >= 0) {
                // ?????????
                this.fileList.splice(i, 1);
                this._addLog("?????????????????????");
              }
            }
          }
        },
        drop(event) {
          let FileUtil = Editor.require(
            "packages://font-slimming-tools/panel/FileUtil"
          );
          let fs = require("fs");

          event.preventDefault();
          let file = event.dataTransfer.files[0].path;
          //TODO ?????????????????????????????????

          // this.fileList = [];
          let stat = fs.lstatSync(file);
          if (stat.isDirectory()) {
            let b = false;
            for (let key in this.fileList) {
              let index = this.fileList[key].indexOf(file);
              if (index >= 0) {
                b = true;
                break;
              }
            }
            if (b) {
              this._addLog("??????????????????????????????:" + file);
            } else {
              let fileArr = [];
              FileUtil.getDirAllFiles(file, fileArr);
              for (let key in fileArr) {
                this.fileList.push(fileArr[key]);
              }
            }
          } else if (stat.isFile()) {
            let b = false;
            for (let key in this.fileList) {
              if (this.fileList[key] === file) {
                b = true;
                break;
              }
            }
            if (b) {
              this._addLog("??????????????????????????????:" + file);
            } else {
              this.fileList.push(file);
            }
          }
          this._addLog("????????????: " + this.fileList.length);
          return false;
        },
        dragOver(event) {
          event.preventDefault();
          event.stopPropagation();
          // console.log("dragOver");
        },
        dragEnter(event) {
          event.preventDefault();
          event.stopPropagation();

          console.log("dragEnter");
        },
        dragLeave(event) {
          event.preventDefault();
          console.log("dragLeave");
        },
        onCleanFileList() {
          this.fileList = [];
          this._addLog("????????????????????????");
        },
        onCollectString() {
          console.log("collect string");
          this.isShowFontDirBtn = false;
          this.progressValue = 0;
          let FileUtil = Editor.require(
            "packages://font-slimming-tools/panel/FileUtil"
          );
          let options = {
            stepCb: this._onCollectStep.bind(this),
            compCb: this._onCollectOver.bind(this),
          };
          if (this.fileList.length > 0) {
            FileUtil.getFileString(this.fileList, options);
          } else {
            this._addLog("??????????????????????????????????????????, ??????????????????????????????");
          }
        },
        _onCollectStep(str, cur, total) {
          // console.log("dealFile: " + str);
          this.progressValue = ((cur * 1.0) / total) * 1.0 * 100;
        },
        _onCollectOver(str) {
          let fs = require("fs");
          let path = require("path");
          this.progressValue = 100;
          this.isShowFontDirBtn = true;
          this._addLog("??????????????????:" + str.length + "???");
          if (str.length > 0) {
            // ????????????
            let FileUtil = Editor.require(
              "packages://font-slimming-tools/panel/FileUtil"
            );
            let b1 = FileUtil._isFileExit(this.baseFontPath);
            if (b1 === false) {
              this._addLog("??????ttf??????, ?????????????????????:" + this.baseFontPath);
              return;
            }
            let b2 = FileUtil._isFileExit(this.outPutFontPath);
            if (b2 === false) {
              this._addLog(
                "??????ttf??????, ???????????????????????????:" + this.outPutFontPath
              );
              return;
            }
            // ?????????????????????????????????
            let strFile = path.join(this.outPutFontPath, "char.txt");
            fs.writeFile(
              strFile,
              str,
              function (error) {
                if (!error) {
                  window.app._addLog("????????????????????????: " + strFile);
                }
              }.bind(this)
            );

            let fontCarrier = Editor.require(
              "packages://font-slimming-tools/node_modules/font-carrier"
            );

            let pathArr = this.baseFontPath.split("\\");
            let fileFullName = pathArr[pathArr.length - 1];
            let charArray = fileFullName.split("/");
            let fileName = charArray[charArray.length - 1].split(".")[0];

            this.newFontPath = path.join(
              this.outPutFontPath,
              "./" + fileName + "-new"
            );

            let transFont = fontCarrier.transfer(this.baseFontPath);
            transFont.min(str);
            transFont.output({
              path: this.newFontPath,
              types: ["ttf"],
            });
            this._addLog("????????????ttf??????:" + this.newFontPath + ".ttf");
          } else {
            this._addLog("??????ttf????????????");
          }
        },
        onSetOutPutFontPath() {
          let res = Editor.Dialog.openFile({
            title: "??????????????????????????????",
            defaultPath: Editor.Project.path,
            properties: ["openDirectory"],
          });
          if (res != -1) {
            this.outPutFontPath = res[0];
            let CfgUtil = Editor.require(
              "packages://font-slimming-tools/panel/CfgUtil"
            );
            CfgUtil.saveConfig(this);
          }
        },
        onSetBaseFontPath() {
          let res = Editor.Dialog.openFile({
            title: "??????????????????",
            defaultPath: Editor.Project.path,
            properties: ["openFile"],
          });
          if (res != -1) {
            let file = res[0];
            let FileUtil = Editor.require(
              "packages://font-slimming-tools/panel/FileUtil"
            );
            if (FileUtil.is_fileType(file, "ttf")) {
              this.baseFontPath = file;
              let CfgUtil = Editor.require(
                "packages://font-slimming-tools/panel/CfgUtil"
              );
              CfgUtil.saveConfig(this);
            } else {
              this.baseFontPath = "";
              Editor.Dialog.messageBox({
                type: "info",
                buttons: ["OK"],
                title: "??????",
                message: "????????????ttf????????????",
              });
            }
          }
        },
        onShowFontDir() {
          let fs = require("fs");
          let Electron = require("electron");
          let fontFilePath = this.newFontPath + ".ttf";
          if (!fs.existsSync(fontFilePath)) {
            this._addLog("??????????????????" + fontFilePath);
            return;
          }

          // Electron.shell.showItemInFolder(this.outPutFontPath);
          Electron.shell.showItemInFolder(fontFilePath);
          Electron.shell.beep();
        },
      },
    });
  },

  // register your ipc messages here
  messages: {
    "fontSlimming:hello"(event) {},
  },
});
