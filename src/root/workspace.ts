import { join, relative } from "path";
import pathExists from "path-exists";
import findWorkspaceRoot from "find-workspace-root";
import exec, { flagsToArgs } from "@bconnorwhite/exec";
import { getBase} from ".";

export async function getWorkspaceBase() {
  return findWorkspaceRoot().then((result) => {
    return result ?? undefined;
  });
}

export async function getWorkspacePath(name: string) {
  return getWorkspaceBase().then((base) => {
    if(base) {
      return join(base, name);
    } else {
      return undefined;
    }
  });
}

export async function getWorkspaceRelative(path: string) {
  return getWorkspaceBase().then((base) => {
    if(base) {
      return relative(base, path);
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

export async function isWorkspace() {
  return getWorkspaceBase().then((result) => Boolean(result));
}

export async function isWorkspaceRoot() {
  return getWorkspaceBase().then((result) => {
    return result === getBase();
  });
}

export type WorkspacePackages = {
  [name: string]: WorkspacePackage;
}

export type WorkspacePackage = {
  location: string;
  workspaceDependencies: string[];
  mismatchedWorkspaceDependencies: string[];
}

export async function getWorkspacePackages() {
  return isWorkspaceRoot().then((result) => {
    if(result) {
      return exec({
        command: "yarn",
        args: flagsToArgs({ silent: true }).concat(["workspaces", "info"]),
        silent: true
      }).then(({ jsonOutput }) => jsonOutput() as WorkspacePackages);
    }
  });
}
