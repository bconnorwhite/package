import { promises, writeFileSync, mkdirSync } from "fs";
import readDir from "recursive-readdir";
import merge from "deepmerge";
import { readFile, readFileSync } from "read-file-safe";
import { readJSONFile, readJSONFileSync, JSONObject } from "read-json-safe";
import { getBase, getPath, getRelative, existsContextual } from "../root";

export {
  JSONObject
}

type FileType = "json";

export type PathFields = {
  name: string;
  path: string;
  relative: string;
  exists: () => Promise<boolean | undefined>;
}

export interface JSONFileFields<T extends JSONObject> extends FileFields<T> {
  merge: (content: T) => Promise<void>;
  mergeSync: (content: T) => void;
}

type FileFields<T> = {
  read: () => Promise<T | undefined>;
  readSync: () => T | undefined;
  write: (content: T) => Promise<void>;
  writeSync: (content: T) => void;
}

type DirectoryFields = {
  files: ((...args: any) => Paths);
  read: () => Promise<string[]>;
  write: () => Promise<void>;
  writeSync: () => void;
};

export type JSONFile<T extends JSONObject> = File<T>;

export type File<T> = PathFields & (T extends JSONObject ? JSONFileFields<T> : FileFields<string>);

export type Directory = PathFields & DirectoryFields;

type Path = File<any> | Directory;

type Paths = {
  [key: string]: Path;
}

export type Definitions = {
  [key: string]: Definition;
}

type Definition = FileDefinition | DirectoryDefinition;

type FileDefinition = {
  name?: string;
  type?: FileType;
}

type FilesDefinition = Definitions | ((...args: any) => Definitions);

type DirectoryDefinition = {
  files: FilesDefinition;
} & FileDefinition;

function getJSONFileFields<T extends JSONObject>(path: string): JSONFileFields<T> {
  return {
    read: () => readJSONFile(path) as Promise<T | undefined>,
    readSync: () => readJSONFileSync(path) as (T | undefined),
    write: (content: T) => promises.writeFile(path, JSON.stringify(content)),
    writeSync: (content: T) => writeFileSync(path, JSON.stringify(content)),
    merge: (content: Partial<T>) => readJSONFile(path).then((old) => {
      return promises.writeFile(path, JSON.stringify(merge(old ?? {}, content)));
    }),
    mergeSync: (content: Partial<T>) => {
      const old = readJSONFileSync(path);
      return writeFileSync(path, JSON.stringify(merge(old ?? {}, content)));
    }
  }
}

type ConditionalFileFields<T, U extends JSONObject> = (T extends undefined ? FileFields<string> : JSONFileFields<U>);

function getFileFields<T extends FileType | undefined, U extends JSONObject>(path: string, type: T): ConditionalFileFields<T, U> {
  if(type === "json") {
    return getJSONFileFields<U>(path) as ConditionalFileFields<T, U>;
  } else {
    return {
      read: () => readFile(path),
      readSync: () => readFileSync(path),
      write: (content: string) => promises.writeFile(path, content),
      writeSync: (content: string) => writeFileSync(path, content)
    } as ConditionalFileFields<T, U>;
  }
}

function getDirectoryFields(definition: DirectoryDefinition, path: string): DirectoryFields {
  const files = typeof definition.files === "object" ? () => definePaths(files, path) : (...args: any) => definePaths(files(args), path);
  return {
    files,
    read: () => readDir(path),
    write: () => promises.mkdir(path),
    writeSync: () => mkdirSync(path)
  };
}

function getPathFields(file: FileDefinition, parent: string): PathFields {
  const name = file.name ?? "";
  const path = getPath(parent, name);
  const relative = getRelative(path);
  return {
    name,
    path,
    relative,
    exists: () => existsContextual(relative)
  }
}

function defineFile(file: FileDefinition, parent: string = getBase()): File<any> {
  const pathFields = getPathFields(file, parent);
  return {
    ...pathFields,
    ...getFileFields(pathFields.path, file.type)
  };
}

export function defineDirectory(directory: DirectoryDefinition, parent: string = getBase()): Directory {
  const pathFields = getPathFields(directory, parent);
  return {
    ...pathFields,
    ...getDirectoryFields(directory, pathFields.path)
  }
}

function isDirectoryDefinition(definition: Definition): definition is DirectoryDefinition {
  return (definition as DirectoryDefinition).files !== undefined;
}

function definePaths(definitions: Definitions, parent: string = getBase()): Paths {
  return Object.keys(definitions).reduce((retval, key) => {
    const definition = definitions[key];
    if(isDirectoryDefinition(definition)) {
      return {
        ...retval,
        [key]: defineDirectory({
          name: key,
          ...definition
        }, parent)
      }
    } else {
      return {
        ...retval,
        [key]: defineFile({
          name: key,
          ...definition
        }, parent)
      }
    }
  }, {});
}

function mergeFiles(oldFiles: (...args: any) => Paths, newFiles: FilesDefinition) {
  return (...args: any) => {
    if(typeof newFiles === "object") {
      return {
        ...oldFiles(args),
        ...newFiles
      }
    } else {
      return {
        ...oldFiles(args),
        ...newFiles(args)
      }
    }
  }
}

export function defineFrom(structure: Directory): (files: FilesDefinition) => Directory;
export function defineFrom(structure: Directory, files: FilesDefinition): Directory;
export function defineFrom(structure: Directory, files?: FilesDefinition): Directory | ((files: FilesDefinition) => Directory) {
  const resolve = (files: FilesDefinition) => defineDirectory({
    ...structure,
    files: mergeFiles(structure.files, files)
  });
  if(files) {
    return resolve(files);
  } else {
    return resolve;
  }
}
