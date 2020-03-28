import { readFile } from "fs";
import { join } from "path";
import { getRootDir } from "./structure";
import { PackageJson as PackageJSON } from "type-fest";

export {
  PackageJSON
}

export default (): Promise<PackageJSON> => {
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
