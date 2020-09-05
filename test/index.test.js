const { structure, getRootDir, getMain } = require("../build/index.js");

test("getRootDir", () => {
  const root = getRootDir();
  expect(root.name).toBe("");
});

test("getMain", () => {
  const main = getMain();
  expect(main.name).toBe("build/index.js");
});

test("structure name", () => {
  expect(structure.files().packageJSON.name).toBe("package.json");
});

test("structure relative", () => {
  expect(structure.files().main.relative).toBe("build/index.js");
});
