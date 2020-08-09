import whichPM from "which-pm";
import { exists, getBase } from ".";

export type PackageManagerName = "yarn" | "npm" | "pnpm";

const names: PackageManagerName[] = ["yarn", "npm", "pnpm"];

function isPMName(name: string): name is PackageManagerName {
  return names.includes(name as PackageManagerName);
}

export async function getPackageManagerName(): Promise<(PackageManagerName | undefined)> {
  return exists("yarn.lock").then((yarn) => {
    if(yarn) {
      return "yarn";
    } else {
      return exists("package-lock.json").then((npm) => {
        if(npm) {
          return "npm";
        } else {
          return exists("shrinkwrap.yaml").then((pnpm) => {
            if(pnpm) {
              return "pnpm";
            } else {
              return whichPM(getBase()).then((pm) => {
                return isPMName(pm.name) ? pm.name : undefined;
              });
            }
          });
        }
      });
    }
  });
}
