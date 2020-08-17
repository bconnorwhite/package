import recursive from "recursive-readdir";
import { readFile, readFileSync } from "read-file-safe";
import { readJSONFile, readJSONFileSync } from "read-json-safe";
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

type FilesDefinition = Definitions | ((...args: any) => Definitions);

type DirectoryDefinition = {
  files: FilesDefinition;
} & FileDefinition;

async function read(path: string)  {
  if(path.endsWith(".json")) {
    return readJSONFile(path);
  } else {
    return readFile(path);
  }
}

function readSync(path: string)  {
  if(path.endsWith(".json")) {
    return readJSONFileSync(path);
  } else {
    return readFileSync(path);
  }
}

function readDir(path: string) {
  return recursive(path);
}

function getFileFields(path: string): FileFields<any> {
  return {
    read: () => read(path),
    readSync: () => readSync(path)
  }
}

function getDirectoryFields(definition: DirectoryDefinition, path: string): DirectoryFields {
  const files = definition.files;
  if(typeof files === "object") {
    return {
      files: () => definePaths(files, path),
      read: () => readDir(path)
    };
  } else {
    return {
      files: (...args: any) => definePaths(files(args), path),
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
  const retval = {
    ...pathFields,
    ...getDirectoryFields(directory, pathFields.path)
  }
  return retval;
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

export const define = defineFrom(structure);
