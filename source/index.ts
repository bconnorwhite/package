import {
  getBase,
  getPath,
  getRelative,
  exists,
  getWorkspaceBase,
  getWorkspacePath,
  getWorkspaceRelative,
  existsWorkspace,
  isWorkspace,
  isWorkspaceRoot,
  getWorkspacePackages,
  WorkspacePackages,
  WorkspacePackage,
} from "./root";
import { defineFrom, File, JSONFile, JSONObject, MarkdownFile, MarkdownTokens, Directory } from "./structure";
import pkg, { structure as packageStructure, PackageJSON, getPackageJSON } from "./package-json";

export const structure = defineFrom(packageStructure, {
  main: {
    name: pkg?.main
  }
});

export const define = defineFrom(structure);

export function getRootDir() {
  return structure;
}

export function getMain() {
  return structure.files().main as File<string>;
}

export {
  getBase,
  getPath,
  getRelative,
  exists,
  getWorkspaceBase,
  getWorkspacePath,
  getWorkspaceRelative,
  getWorkspacePackages,
  WorkspacePackages,
  WorkspacePackage,
  existsWorkspace,
  isWorkspace,
  isWorkspaceRoot,
  defineFrom,
  File,
  JSONFile,
  JSONObject,
  MarkdownFile,
  MarkdownTokens,
  Directory,
  pkg,
  getPackageJSON,
  PackageJSON
};
