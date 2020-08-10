import { join, relative } from "path";
import pathExists from "path-exists";
import findWorkspaceRoot from "find-workspace-root";
import { getDir, getBase } from ".";

export async function getWorkspaceBase() {
  return findWorkspaceRoot().then((result) => {
    return result ?? undefined;
  });
}

export async function getWorkspaceRelative(path: string) {
  return getWorkspaceBase().then((workspaceBase) => {
    if(workspaceBase) {
      return relative(getBase(), join(workspaceBase, path));
    } else {
      return undefined;
    }
  });
}

export async function getWorkspaceRootDir(relative: string = "") {
  return getWorkspaceBase().then((workspaceBase) => {
    if(workspaceBase) {
      return getDir(() => workspaceBase, "", relative);
    } else {
      return undefined;
    }
  });
}

export async function existsWorkspace(relative: string = "") {
  return getWorkspaceRelative(relative).then((path) => {
    if(path) {
      return pathExists(path);
    } else {
      return undefined;
    }
  });
}
