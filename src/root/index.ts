import { join, relative } from "path";
import pathExists from "path-exists";
import {
  getWorkspaceBase,
  getWorkspacePath,
  getWorkspaceRelative,
  getWorkspacePackages,
  WorkspacePackages,
  WorkspacePackage,
  existsWorkspace,
  isWorkspace,
  isWorkspaceRoot
} from "./workspace";

export function getBase() {
  if(process.env.PWD === undefined) {
    throw Error("process.env.PWD is not set");
  } else if(typeof process.env.PWD !== "string") {
    throw Error("process.env.PWD is invalid");
  } else {
    return process.env.PWD as string;
  }
}

export function getPath(parent: string, name: string) {
  return join(parent, name);
}

export function getRelative(path: string) {
  const base = getBase();
  return relative(base, path);
}

export function exists(relative: string = "") {
  return pathExists(getRelative(relative));
}

export {
  getWorkspaceBase,
  getWorkspacePath,
  getWorkspaceRelative,
  getWorkspacePackages,
  WorkspacePackages,
  WorkspacePackage,
  existsWorkspace,
  isWorkspace,
  isWorkspaceRoot
}
