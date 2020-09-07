import { readFile, readFileSync } from "read-file-safe";
import { writeFile, writeFileSync } from "write-file-safe";
import { getBase } from "../../root";
import { jsonFileType, getJSONFileFields, JSONFile, JSONFileType, JSONObject, JSONFileFields } from "./json";
import { markdownFileType, getMarkdownFileFields, MarkdownFileType, MarkdownFile, MarkdownTokens } from "./markdown";
import { getPathFields, PathFields } from "../path";

export type FileDefinition = {
  name?: string;
  type?: FileType;
}

type FileType = JSONFileType | MarkdownFileType;

export type File<T> = PathFields & (T extends JSONObject ? JSONFileFields<T> : FileFields<string>);

export type FileFields<T> = {
  read: () => Promise<T | undefined>;
  readSync: () => T | undefined;
  write: (content?: T) => Promise<void>;
  writeSync: (content?: T) => void;
}

type ConditionalFileFields<T, U extends JSONObject> = (T extends undefined ? FileFields<string> : JSONFileFields<U>);

export function defineFile(file: FileDefinition, parent: string = getBase()): File<any> {
  const pathFields = getPathFields(file, parent);
  return {
    ...pathFields,
    ...getFileFields(pathFields.path, file.type)
  };
}

function getFileFields<T extends FileType | undefined, U extends JSONObject>(path: string, type: T): ConditionalFileFields<T, U> {
  if(type === jsonFileType) {
    return getJSONFileFields<U>(path) as ConditionalFileFields<T, U>;
  } else if(type === markdownFileType) {
    return getMarkdownFileFields<U>(path) as ConditionalFileFields<T, U>;
  } else {
    return {
      read: () => readFile(path),
      readSync: () => readFileSync(path),
      write: (content?: string) => writeFile(path, content),
      writeSync: (content?: string) => writeFileSync(path, content)
    } as ConditionalFileFields<T, U>;
  }
}

export {
  JSONFile,
  JSONObject,
  MarkdownFile,
  MarkdownTokens
}
