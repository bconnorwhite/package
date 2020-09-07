import { define as defineRoot, defineFrom, File, Directory } from "../structure";
import { PackageJSON } from "./types";

export const structure = defineRoot({
  packageJSON: {
    name: "package.json",
    type: "json"
  },
  nodeModules: {
    name: "node_modules",
    files: {}
  }
});

export const define = defineFrom(structure);

export function getPackageJSON() {
  return structure.files().packageJSON as File<PackageJSON>;
}

export function getNodeModules() {
  return structure.files().nodeModules as Directory;
}

const pkg = getPackageJSON().readSync();

export default pkg;

export {
  defineFrom,
  PackageJSON
}
