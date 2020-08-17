import recursive from "recursive-readdir";
import { readFile, readFileSync } from "read-file-safe";
import { readJSONFile } from "read-json-safe";
import { getBase, getPath, getRelative } from "./root";

export type PathFields = {
  name: string;
  path: string;
  relative: string;
}

type FileFields<T> = {
  read: () => Promise<T>;
  readSync: () => T;
}

type DirectoryFields = {
  files: ((...args: any) => Paths);
  read: () => Promise<string[]>;
};

export type File<T> = PathFields & FileFields<T>;

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
}

type DirectoryDefinition = {
  files: Definitions | ((...args: any) => Definitions);
} & FileDefinition;

async function read(path: string)  {
  if(path.endsWith(".json")) {
    return readJSONFile(path);
  } else {
    return readFile(path);
  }
}

function readDir(path: string) {
  return recursive(path);
}

function getFileFields(path: string): FileFields<any> {
  return {
    read: () => read(path),
    readSync: () => readFileSync(path)
  }
}

function getDirectoryFields(definition: DirectoryDefinition, path: string): DirectoryFields {
  const files = definition.files;
  if(typeof files === "object") {
    return {
      files: () => definePaths(files),
      read: () => readDir(path)
    };
  } else {
    return {
      files: (...args: any) => definePaths(files(args)),
      read: () => readDir(path)
    };
  }
}

function getPathFields(file: FileDefinition, parent: string): PathFields {
  const name = file.name ?? "";
  const path = getPath(parent, name);
  return {
    name,
    path,
    relative: getRelative(path)
  }
}

function defineFile(file: FileDefinition, parent: string = getBase()): File<any> {
  const pathFields = getPathFields(file, parent);
  return {
    ...pathFields,
    ...getFileFields(pathFields.path)
  };
}

function defineDirectory(directory: DirectoryDefinition, parent: string = getBase()): Directory {
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
        [key]: defineDirectory(definition, parent)
      }
    } else {
      return {
        ...retval,
        [key]: defineFile(definition, parent)
      }
    }
  }, {});
}

export const structure = defineDirectory({
  name: "",
  files: {}
});

export function defineFrom(structure: Directory): (files: Definitions) => Directory;
export function defineFrom(structure: Directory, files: Definitions): Directory;
export function defineFrom(structure: Directory, files?: Definitions): Directory | ((files: Definitions) => Directory) {
  const resolve = (files: Definitions) => defineDirectory({
    ...structure,
    files: {
      ...structure.files,
      files
    }
  });
  if(files) {
    return resolve(files);
  } else {
    return resolve;
  }
}

export const define = defineFrom(structure);
