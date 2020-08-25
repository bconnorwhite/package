import { define as defineRoot, defineFrom, File } from "../structure";
import { PackageJSON } from "./types";

export const structure = defineRoot({
  packageJSON: {
    name: "package.json",
    type: "json"
  }
});

export const define = defineFrom(structure);

export function getPackageJSON() {
  return structure.files().packageJSON as File<PackageJSON>;
}

const pkg = getPackageJSON().readSync();

export default pkg;

export {
  defineFrom,
  PackageJSON
}
