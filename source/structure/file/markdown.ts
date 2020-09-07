import { writeMarkdown, writeMarkdownSync, MarkdownContent } from "write-md-safe";
import { readMarkdown, readMarkdownSync, TokensList } from "read-md-safe";
import { FileFields, File } from "./";

export type MarkdownFileType = "md";

export type MarkdownFile<T extends MarkdownContent> = File<T>;

export type MarkdownTokens = TokensList;

export const markdownFileType = "md";

export function getMarkdownFileFields<T extends MarkdownContent>(path: string): FileFields<T> {
  return {
    read: () => readMarkdown(path) as Promise<TokensList | undefined>,
    readSync: () => readMarkdownSync(path) as (TokensList | undefined),
    write: (content?: T) => writeMarkdown(path, content),
    writeSync: (content?: T) => writeMarkdownSync(path, content)
  }
}
