/**
 * Text & SEO Calculators Logic
 */

// 1. Case Converter
export function convertCase(
  text: string,
  mode: "upper" | "lower" | "title" | "sentence" | "slug"
): string {
  if (!text) return "";
  
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
    case "slug":
      return textToSlug(text);
    default:
      return text;
  }
}

// 2. Text to Slug Converter
export function textToSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

// 3. Lorem Ipsum Generator
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function generateLoremIpsum(
  count: number = 3,
  unit: "paragraphs" | "sentences" | "words" = "paragraphs"
): string {
  if (count <= 0) return "";

  const generateSentence = (): string => {
    const len = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
    const sentenceWords = [];
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * LOREM_WORDS.length);
      sentenceWords.push(LOREM_WORDS[idx]);
    }
    const sentence = sentenceWords.join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  const generateParagraph = (): string => {
    const len = Math.floor(Math.random() * 3) + 3; // 3 to 5 sentences
    const sentences = [];
    for (let i = 0; i < len; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  };

  if (unit === "words") {
    const words = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * LOREM_WORDS.length);
      words.push(LOREM_WORDS[idx]);
    }
    return words.join(" ");
  }

  if (unit === "sentences") {
    const sentences = [];
    for (let i = 0; i < count; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  }

  // Paragraphs
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph());
  }
  return paragraphs.join("\n\n");
}

// 4. Meta Tag Length Checker
export interface MetaLengthResult {
  titleLength: number;
  titleStatus: "good" | "too-long" | "too-short";
  titlePixelWidth: number;
  descLength: number;
  descStatus: "good" | "too-long" | "too-short";
  descPixelWidth: number;
}

export function checkMetaLength(title: string, desc: string): MetaLengthResult {
  const titleLength = title.length;
  const descLength = desc.length;

  // Simple approximation: average character is 8px wide
  const titlePixelWidth = titleLength * 8.2;
  const descPixelWidth = descLength * 6.2;

  let titleStatus: "good" | "too-long" | "too-short" = "good";
  if (titleLength > 60) titleStatus = "too-long";
  else if (titleLength > 0 && titleLength < 30) titleStatus = "too-short";

  let descStatus: "good" | "too-long" | "too-short" = "good";
  if (descLength > 160) descStatus = "too-long";
  else if (descLength > 0 && descLength < 70) descStatus = "too-short";

  return {
    titleLength,
    titleStatus,
    titlePixelWidth: Math.round(titlePixelWidth),
    descLength,
    descStatus,
    descPixelWidth: Math.round(descPixelWidth),
  };
}

import { parseAIChatUniversal, type ChatMessage as ExportChatMessage } from "./ai-chat-exporter";

export type ChatMessage = ExportChatMessage;

export function parseAIChatHTML(htmlOrText: string): ChatMessage[] {
  const parsed = parseAIChatUniversal(htmlOrText);
  return parsed.messages;
}

