import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  PageBreak,
} from "docx";
import { IQuestions, IExam } from "@/shared/interfaces/index.js";
import { imageStorageService } from "./image-storage.service.js";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

import { imageSize } from "image-size";

const MAX_WIDTH_PX = 400; // stays comfortably inside standard page margins
const MAX_HEIGHT_PX = 500; // guards against very tall/narrow images too

function getScaledImageDimensions(imageBuffer: Buffer): {
  width: number;
  height: number;
} {
  const { width, height } = imageSize(imageBuffer);

  if (!width || !height) {
    // Couldn't read the real dimensions - fall back rather than crash the export.
    return { width: MAX_WIDTH_PX, height: Math.round(MAX_WIDTH_PX * 0.75) };
  }

  const widthScale = width > MAX_WIDTH_PX ? MAX_WIDTH_PX / width : 1;
  const heightScale = height > MAX_HEIGHT_PX ? MAX_HEIGHT_PX / height : 1;
  const scale = Math.min(widthScale, heightScale, 1); // never upscale past the original

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function buildQuestionBlock(question: IQuestions, index: number): Paragraph[] {
  const blocks: Paragraph[] = [
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({ text: `${index + 1}. `, bold: true }),
        new TextRun({ text: question.header, bold: true }),
      ],
    }),
  ];

  if (question.headerImageUrl) {
    const imagePath = imageStorageService.resolveImagePath(
      question.headerImageUrl,
    );
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(imagePath).slice(1).toLowerCase();
      const { width, height } = getScaledImageDimensions(imageBuffer);
      blocks.push(
        new Paragraph({
          alignment: "center",
          children: [
            new ImageRun({
              type: (ext === "jpeg" ? "jpg" : ext) as
                | "png"
                | "jpg"
                | "gif"
                | "bmp",
              data: imageBuffer,
              transformation: { width, height },
            }),
          ],
        }),
      );
    }
  }

  if (question.type === "mcq") {
    const key = question.choices.find((choice) => choice.isCorrect);
    const distractors = question.choices.filter((choice) => !choice.isCorrect);

    if (key) {
      blocks.push(
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: "Key:",
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: key.choice,
            }),
          ],
        }),
      );
    }

    blocks.push(
      new Paragraph({
        indent: { left: 400 },
        children: [
          new TextRun({
            text: "Distractors:",
            bold: true,
          }),
        ],
      }),
    );

    distractors.forEach((choice) => {
      blocks.push(
        new Paragraph({
          indent: { left: 400 },
          children: [
            new TextRun({
              text: choice.choice,
            }),
          ],
        }),
      );
    });
  }

  return blocks;
}

function buildAnswerKeySection(questions: IQuestions[]): Paragraph[] {
  const blocks: Paragraph[] = [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      text: "Answer Key",
      spacing: { after: 200 },
    }),
  ];

  questions.forEach((question, index) => {
    if (question.type === "mcq") {
      const correctIdx = question.choices.findIndex((c) => c.isCorrect);
      const letter = correctIdx >= 0 ? CHOICE_LETTERS[correctIdx] : "N/A";
      blocks.push(
        new Paragraph({
          children: [new TextRun({ text: `${index + 1}. ${letter}` })],
        }),
      );
    } else {
      blocks.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${question.header}`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({ text: question.modelAnswer, spacing: { after: 200 } }),
      );
    }
  });

  return blocks;
}

export async function generateExamDocx(
  exam: IExam,
  questions: IQuestions[],
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            text: exam.title,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...questions.flatMap((q, i) => buildQuestionBlock(q, i)),
          ...buildAnswerKeySection(questions),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
