import { join, relative } from "path";

export type PackageDir = {
  path: string;
  relative: string;
  name: string;
}

export function getBase() {
  if(process.env.PWD === undefined) {
    throw Error("process.env.PWD is not set");
  } else if(typeof process.env.PWD !== "string") {
    throw Error("process.env.PWD is invalid");
  } else {
    return process.env.PWD as string;
  }
}

export function getRelative(path: string) {
  const base = getBase();
  return relative(base, path);
}

export function getDir(
  getParentDir: (relative: string) => string | { path: string },
  name: string,
  relative: string = ""
): PackageDir {
  const base = getParentDir(name);
  const path = join(typeof base === "string" ? base : base.path, relative);
  return {
    path,
    relative: getRelative(path),
    name
  };
}

export function getRootDir(relative: string = "") {
  return getDir(getBase, "", relative);
}
