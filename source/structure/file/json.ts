import merge from "deepmerge";
import { JSONObject } from "@bconnorwhite/json-types";
import { readJSONFile, readJSONFileSync } from "read-json-safe";
import { writeJSON, writeJSONSync } from "write-json-safe";
import { FileFields, File } from "./";

export type JSONFileType = "json";

export type JSONFile<T extends JSONObject> = File<T>;

export interface JSONFileFields<T extends JSONObject> extends FileFields<T> {
  merge: (content?: T) => Promise<void>;
  mergeSync: (content?: T) => void;
}

export const jsonFileType = "json";

export function getJSONFileFields<T extends JSONObject>(path: string): JSONFileFields<T> {
  return {
    read: () => readJSONFile(path) as Promise<T | undefined>,
    readSync: () => readJSONFileSync(path) as (T | undefined),
    write: (content?: T) => writeJSON(path, content),
    writeSync: (content?: T) => writeJSONSync(path, content),
    merge: (content: Partial<T> = {}) => readJSONFile(path).then((old) => {
      return writeJSON(path, merge(old ?? {}, content));
    }),
    mergeSync: (content: Partial<T> = {}) => {
      const old = readJSONFileSync(path);
      return writeJSONSync(path, merge(old ?? {}, content));
    }
  }
}

export {
  JSONObject
}
