import { defineFrom, defineDirectory, Definitions, Directory, File, JSONFile, JSONObject, PathFields } from "./definition";

export const structure = defineDirectory({
  name: "",
  files: {}
});

export const define = defineFrom(structure);

export {
  defineFrom,
  Definitions,
  Directory,
  File,
  JSONFile,
  JSONObject,
  PathFields
}
