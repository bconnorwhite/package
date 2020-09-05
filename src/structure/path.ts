import { getBase, getPath, getRelative, existsContextual } from "../root";
import { defineFile, File, FileDefinition } from "./file";
import { defineDirectory, Directory, DirectoryDefinition } from "./directory";

export type PathDefinition = FileDefinition | DirectoryDefinition;

export type PathDefinitions = {
  [key: string]: PathDefinition;
}

type Path = File<any> | Directory;

export type Paths = {
  [key: string]: Path;
}

export type PathFields = {
  name: string;
  path: string;
  relative: string;
  exists: () => Promise<boolean | undefined>;
}

function isDirectoryDefinition(definition: PathDefinition): definition is DirectoryDefinition {
  return (definition as DirectoryDefinition).files !== undefined;
}

export function definePaths(definitions: PathDefinitions, parent: string = getBase()): Paths {
  return Object.keys(definitions).reduce((retval, key) => {
    const definition = definitions[key];
    if(isDirectoryDefinition(definition)) {
      return {
        ...retval,
        [key]: defineDirectory({
          name: key,
          ...definition
        }, parent)
      }
    } else {
      return {
        ...retval,
        [key]: defineFile({
          name: key,
          ...definition
        }, parent)
      }
    }
  }, {});
}

export function getPathFields({ name = "" }: FileDefinition, parent: string): PathFields {
  const path = getPath(parent, name);
  const relative = getRelative(path);
  return {
    name,
    path,
    relative,
    exists: () => existsContextual(relative)
  }
}
