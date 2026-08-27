import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getPreloadPath } from "./pathResolver.js";
import { getDb } from "./database/connection.js";
import { QuestionsRepository } from "./repositories/question.repository.js";
import { QuestionsService } from "./services/question.service.js";
import { registerQuestionIPC } from "./ipc/question.ipc.js";
import { CategoriesRepository } from "./repositories/category.repository.js";
import { CategoryService } from "./services/category.service.js";
import { registerCategoryIPC } from "./ipc/category.ipc.js";

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath("userData"), "question-bank.db");

  console.log("Database path:", dbPath);
  const db = getDb();
  console.log("database", db);
  // 2. Create repository
  const questionsRepository = new QuestionsRepository(db);
  const categoryRepository = new CategoriesRepository(db);

  // 3. Create service
  const questionsService = new QuestionsService(questionsRepository);
  const categoryService = new CategoryService(categoryRepository);

  // 4. Register IPC handlers
  registerQuestionIPC(questionsService);
  registerCategoryIPC(categoryService);

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    minHeight: 500,
    minWidth: 550,
    width: width,
    height: height,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
