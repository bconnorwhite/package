import { readFileSync } from "fs";
import { join } from "path";
import { getRootDir, getBase, getDir } from "./structure";
import { PackageJSON } from "./types";

const root = getRootDir();
const pkg: PackageJSON = JSON.parse(readFileSync(join(root.path, "package.json"), "utf8"));

export function getMainDir() {
  if(pkg.main) {
    return getDir(getBase, "", pkg.main)
  }
}

export function getVersion() {
  return pkg.version;
}

function getPackage() {
  return pkg;
}

export default getPackage;

export {
  PackageJSON
}
