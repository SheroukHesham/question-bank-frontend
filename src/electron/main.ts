import { app, BrowserWindow, protocol, screen } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./utils.js";
import { getPreloadPath } from "./pathResolver.js";
import { getDb } from "./database/connection.js";
import { QuestionsRepository } from "./repositories/question.repository.js";
import { QuestionsService } from "./services/question.service.js";
import { registerQuestionIPC } from "./ipc/question.ipc.js";
import { CategoriesRepository } from "./repositories/category.repository.js";
import { CategoryService } from "./services/category.service.js";
import { registerCategoryIPC } from "./ipc/category.ipc.js";
import { SubcategoryRepository } from "./repositories/subcategory.repository.js";
import { SubCategoryService } from "./services/subcategory.service.js";
import { registerSubcategoryIPC } from "./ipc/subcategory.ipc.js";
import { ImageStorageService } from "./services/image-storage.service.js";
import { registerImageIPC } from "./ipc/image.ipc.js";
// import { ExamRepository } from "./repositories/exam.repository.js";
// import { ExamService } from "./services/exam.service.js";
// import { registerExamIPC } from "./ipc/exam.ipc.js";

app.whenReady().then(() => {
  const db = getDb();

  // 2. Create repository
  const questionsRepository = new QuestionsRepository(db);
  const categoryRepository = new CategoriesRepository(db);
  const subcategoryRepository = new SubcategoryRepository(db);
  // const examRepository = new ExamRepository(db);

  // 3. Create service
  const categoryService = new CategoryService(categoryRepository);
  const subcategoryService = new SubCategoryService(
    subcategoryRepository,
    categoryService,
  );
  const imageStorageService = new ImageStorageService();
  const questionsService = new QuestionsService(
    questionsRepository,
    categoryService,
    subcategoryService,
    imageStorageService,
  );
  // const examService = new ExamService(examRepository, questionsService);

  // 4. Register IPC handlers
  registerQuestionIPC(questionsService);
  registerCategoryIPC(categoryService);
  registerSubcategoryIPC(subcategoryService);
  registerImageIPC(imageStorageService);
  // registerExamIPC(examService);

  // image handler protocol
  protocol.handle("app-image", (request) => {
    const filename = request.url.replace("app-image://", "");
    const filePath = imageStorageService.resolveImagePath(filename);
    if (!fs.existsSync(filePath)) {
      return new Response("Not found", { status: 404 });
    }
    const buffer = fs.readFileSync(filePath);
    return new Response(buffer);
  });

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
