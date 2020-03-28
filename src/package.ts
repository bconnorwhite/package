import { readFile } from "fs";
import { join } from "path";
import { getRootDir, getBase, getDir } from "./structure";
import { PackageJSON } from "./types";

export {
  PackageJSON
}

export async function getMainDir() {
  return getPackage().then((pkg) => {
    if(pkg.main) {
      return getDir(getBase, "", pkg.main);
    }
  });
}

const getPackage = (): Promise<PackageJSON> => {
  const root = getRootDir();
  return new Promise((resolve) => {
    readFile(join(root.path, "package.json"), (err, data) => {
      if(err) {
        console.error(err);
      }
      resolve(JSON.parse(data.toString()) as PackageJSON);
    })
  });
}

export default getPackage;
