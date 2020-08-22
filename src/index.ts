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
import { defineFrom, File, Directory } from "./definition";
import pkg, { structure as packageStructure, PackageJSON, getPackageJSON } from "./package-json";

export const structure = defineFrom(packageStructure, {
  main: {
    name: pkg.main
  }
});

export const define = defineFrom(structure);

export function getRootDir() {
  return structure;
}

export function getMain() {
  return structure.files().main as File<any>;
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
  Directory,
  pkg,
  getPackageJSON,
  PackageJSON
};
