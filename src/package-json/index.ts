import { PackageJSON } from "./types";
import { define as defineRoot, defineFrom, File } from "../definition";

export const structure = defineRoot({
  packageJSON: {
    name: "package.json"
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
