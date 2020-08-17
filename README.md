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
###### Example usage:
```js
import {
  pkg,
  getRootDir,
  getMain,
  getPackageJSON
} from "@bconnorwhite/package";
```
###### Types:
```ts
type File<T> = {
  name: string;
  path: string;
  relative: string;
  read: () => Promise<T>;
  readSync: () => T;
};

type Directory = {
  name: string;
  path: string;
  relative: string;
  files: ((...args: any) => File<any> | Directory);
  read: () => Promise<string[]>;
};

getRootDir() => Directory;
// path to root of the project

getPackageJSON() => File<PackageJSON>;
// package.json object

getMain() => File<any>;
// path to 'main' in package.json

pkg: PackageJSON;
// version in package.json
```
