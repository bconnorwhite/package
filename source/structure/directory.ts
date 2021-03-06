import { writeDir, writeDirSync } from "write-dir-safe";
import readDir from "recursive-readdir";
import { getBase } from "../root";
import { definePaths, getPathFields, Paths, PathFields, PathDefinitions } from "./path";
import { FileDefinition } from "./file";

export type DirectoryDefinition = {
  files: FilesDefinition;
} & Pick<FileDefinition, "name">;

export type FilesDefinition = PathDefinitions | ((...args: any) => PathDefinitions);

export type Directory = PathFields & DirectoryFields;

export type DirectoryFields = {
  files: ((...args: any) => Paths);
  read: () => Promise<string[]>;
  write: () => Promise<boolean>;
  writeSync: () => boolean;
};

export function isFunction(files: FilesDefinition): files is ((...args: any) => PathDefinitions) {
  return typeof (files as PathDefinitions) === "function";
}

export function defineDirectory(directory: DirectoryDefinition, parent: string = getBase()): Directory {
  const pathFields = getPathFields(directory, parent);
  return {
    ...pathFields,
    ...getDirectoryFields(directory, pathFields.path)
  }
}

function getFilesFunction(files: FilesDefinition, parent: string) {
  if(isFunction(files)) {
    return (...args: any) => definePaths(files(args), parent);
  } else {
    return () => definePaths(files, parent);
  }
}

function getDirectoryFields(definition: DirectoryDefinition, path: string): DirectoryFields {
  return {
    files: getFilesFunction(definition.files, path),
    read: () => readDir(path),
    write: () => writeDir(path),
    writeSync: () => writeDirSync(path)
  };
}
