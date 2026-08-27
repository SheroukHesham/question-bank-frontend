const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getQuestions: () => {
    console.log("all questions");
  },
});
