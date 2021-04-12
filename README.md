# @bconnorwhite/package
![dependencies](https://img.shields.io/david/bconnorwhite/package)
![minzipped size](https://img.shields.io/bundlephobia/minzip/@bconnorwhite/package)
![typescript](https://img.shields.io/github/languages/top/bconnorwhite/package)
![npm](https://img.shields.io/npm/v/@bconnorwhite/package)

A utility for reading package.json of the root project, and forming paths relative to it.

```
yarn add @bconnorwhite/package
```

## API
### package.json
###### Example usage:
```ts
import { pkg, PackageJSON } from "@bconnorwhite/package";

console.log(pkg.name); // "name" field from package.json
console.log(pkg.version); // "version" field from package.json
...
```
### Structure
Package structure can be defined to make reading, writing, and finding files and directories easier. Definitions will be added on top of the default structure, which tracks `package.json` and the file marked by `main` in packge.json.
###### Example usage:
```ts
import { define, defineFrom, Directory, File } from "@bconnorwhite/package";

const structure = define({
  source: {
    name: "src",
    files: {
      index: {
        name: "index.ts"
      }
    }
  },
  build: {
    files: {}
  },
  gitignore: {
    name: ".gitignore"
  }
});

export function getSourceDir() {
  return structure.files().source as Directory;
}

export function getBuildDir() {
  return structure.files().build as Directory;
}

export function getGitIgnore() {
  return structure.files().gitignore as File<string>;
}
```
###### Types
```ts
type File<T> = {
  name: string;
  path: string;
  relative: string;
  exists: () => Promise<boolean | undefined>;
  read: () => Promise<T | undefined>;
  readSync: () => T | undefined;
  write: (content?: T) => Promise<void>;
  writeSync: (content?: T) => void;
};

type JSONFile<T extends JSONObject> = File<T> & {
  merge: (content: T = {}) => Promise<void>;
  mergeSync: (content: T = {}) => void;
};

type Directory = {
  name: string;
  path: string;
  relative: string;
  files: ((...args: any) => Paths);
  exists: () => Promise<boolean | undefined>;
  read: () => Promise<string[]>;
  write: () => Promise<boolean>;
  writeSync: () => boolean;
};
```
### Default Structure Functions
###### Types:
```js
import {
  getRootDir,
  getMain,
  getPackageJSON
} from "@bconnorwhite/package";

getRootDir() => Directory;
// project root directory

getPackageJSON() => File<PackageJSON>;
// package.json file

getMain() => File<string>;
// file for "main" in package.json
```
### Package Functions
```ts
import {
  getBase,
  getPath,
  getRelative,
  exists,
  WorkspacePackage
}

getBase() => string;// process.env.PWD
// working directory process was started from

getPath(parent: string, name: string) => string;
// absolute path

getRelative(path: string) => string;
// path relative to getBase()

exists(relative: string) => Promise<boolean>;
// check if path exists relative to root of the package

```
### Yarn Workspaces
###### Types:
```ts
import {
  isWorkspace,
  isWorkspaceRoot,
  getWorkspacePackages,
  existsWorkspace,
  WorkspacePackages,
  WorkspacePackage
}

isWorkspace() => Promise<string | undefined>;
// will return true for any package in a yarn workspace

getWorkspacePath(name: string) => Promise<string | undefined>;
// absolute workspace path

getWorkspaceRelative(relative: string) => Promise<string | undefined>;
// path relative to workspace root

existsWorkspace(relative: string) => Promise<boolean | undefined>;
// check if path exists relative to workspace root

isWorkspaceRoot() => Promise<boolean>;
// will return true if run from the root of a yarn workspace

getWorkspacePackages() => Promise<WorkspacePackages | undefined>;
// list all packages in a workspace

type WorkspacePackages = {
  [name: string]: WorkspacePackage;
}

type WorkspacePackage = {
  location: string;
  workspaceDependencies: string[];
  mismatchedWorkspaceDependencies: string[];
}
```
