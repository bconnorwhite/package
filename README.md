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
```ts
type PackageDir = {
  path: string;
  relative: string;
  name: string;
}

getDir(
  getParentDir: (relative: string) => string,
  name: string,
  relative: string = ""
) => PackageDir

getRootDir(relative: string = "") => PackageDir

getPackage() => Promise<PackageJSON>
```
```js
import { getPackage, getDir, getRootDir } from "@bconnorwhite/package";
```
