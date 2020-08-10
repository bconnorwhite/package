import whichPM from "which-pm";
import { exists, getBase } from ".";
import { existsWorkspace } from "./structure";

export type PackageManagerName = "yarn" | "npm" | "pnpm";

const names: PackageManagerName[] = ["yarn", "npm", "pnpm"];

function isPMName(name: string): name is PackageManagerName {
  return names.includes(name as PackageManagerName);
}

export async function getPackageManagerName(): Promise<(PackageManagerName | undefined)> {
  const yarn = await exists("yarn.lock") || await existsWorkspace("yarn.lock");
  if(yarn) {
    return "yarn";
  } else {
    const npm = await exists("package-lock.json") || await existsWorkspace("package-lock.json");
    if(npm) {
      return "npm";
    } else {
      const pnpm = await exists("shrinkwrap.yaml") || await existsWorkspace("shrinkwrap.yaml");
      if(pnpm) {
        return "pnpm";
      } else {
        return whichPM(getBase()).then((pm) => {
          return isPMName(pm.name) ? pm.name : undefined;
        });
      }
    }
  }
}
