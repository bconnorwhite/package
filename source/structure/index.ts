import { Paths, PathDefinitions, PathFields } from "./path";
import { defineDirectory, Directory, isFunction, FilesDefinition, } from "./directory";
import { File, JSONFile, JSONObject, MarkdownFile, MarkdownTokens } from "./file";

function mergeFiles(oldFiles: (...args: any) => Paths, newFiles: FilesDefinition): (...args: any) => PathDefinitions {
  return (...args: any) => {
    if(isFunction(newFiles)) {
      return {
        ...oldFiles(args),
        ...newFiles(args)
      }
    } else {
      return {
        ...oldFiles(args),
        ...newFiles
      }
    }
  }
}

export function defineFrom(structure: Directory): (files: FilesDefinition) => Directory;
export function defineFrom(structure: Directory, files: FilesDefinition): Directory;
export function defineFrom(structure: Directory, files?: FilesDefinition): Directory | ((files: FilesDefinition) => Directory) {
  const resolve = (files: FilesDefinition) => defineDirectory({
    name: structure.name,
    files: mergeFiles(structure.files, files)
  });
  if(files) {
    return resolve(files);
  } else {
    return resolve;
  }
}

export const structure = defineDirectory({
  name: "",
  files: {}
});

export const define = defineFrom(structure);

export {
  PathDefinitions,
  Directory,
  File,
  JSONFile,
  JSONObject,
  MarkdownFile,
  MarkdownTokens,
  PathFields
}
