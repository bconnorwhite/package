/**
Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
*/
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
  | bigint;
  
/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.
Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.
This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.
 */
export type LiteralUnion<
	LiteralType extends BaseType,
	BaseType extends Primitive
> = LiteralType | (BaseType & {_?: never});

declare namespace PackageJSON {
	/**
	A person who has been involved in creating or maintaining the package.
	*/
	export type Person =
		| string
		| {
			name: string;
			url?: string;
			email?: string;
		};

	export type BugsLocation =
		| string
		| {
			/**
			The URL to the package's issue tracker.
			*/
			url?: string;

			/**
			The email address to which issues should be reported.
			*/
			email?: string;
		};

	export interface DirectoryLocations {
		[directoryType: string]: unknown;

		/**
		Location for executable scripts. Sugar to generate entries in the `bin` property by walking the folder.
		*/
		bin?: string;

		/**
		Location for Markdown files.
		*/
		doc?: string;

		/**
		Location for example scripts.
		*/
		example?: string;

		/**
		Location for the bulk of the library.
		*/
		lib?: string;

		/**
		Location for man pages. Sugar to generate a `man` array by walking the folder.
		*/
		man?: string;

		/**
		Location for test files.
		*/
		test?: string;
	}

	export type Scripts = {
		/**
		Run **before** the package is published (Also run on local `npm install` without any arguments).
		*/
		prepublish?: string;

		/**
		Run both **before** the package is packed and published, and on local `npm install` without any arguments. This is run **after** `prepublish`, but **before** `prepublishOnly`.
		*/
		prepare?: string;

		/**
		Run **before** the package is prepared and packed, **only** on `npm publish`.
		*/
		prepublishOnly?: string;

		/**
		Run **before** a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).
		*/
		prepack?: string;

		/**
		Run **after** the tarball has been generated and moved to its final destination.
		*/
		postpack?: string;

		/**
		Run **after** the package is published.
		*/
		publish?: string;

		/**
		Run **after** the package is published.
		*/
		postpublish?: string;

		/**
		Run **before** the package is installed.
		*/
		preinstall?: string;

		/**
		Run **after** the package is installed.
		*/
		install?: string;

		/**
		Run **after** the package is installed and after `install`.
		*/
		postinstall?: string;

		/**
		Run **before** the package is uninstalled and before `uninstall`.
		*/
		preuninstall?: string;

		/**
		Run **before** the package is uninstalled.
		*/
		uninstall?: string;

		/**
		Run **after** the package is uninstalled.
		*/
		postuninstall?: string;

		/**
		Run **before** bump the package version and before `version`.
		*/
		preversion?: string;

		/**
		Run **before** bump the package version.
		*/
		version?: string;

		/**
		Run **after** bump the package version.
		*/
		postversion?: string;

		/**
		Run with the `npm test` command, before `test`.
		*/
		pretest?: string;

		/**
		Run with the `npm test` command.
		*/
		test?: string;

		/**
		Run with the `npm test` command, after `test`.
		*/
		posttest?: string;

		/**
		Run with the `npm stop` command, before `stop`.
		*/
		prestop?: string;

		/**
		Run with the `npm stop` command.
		*/
		stop?: string;

		/**
		Run with the `npm stop` command, after `stop`.
		*/
		poststop?: string;

		/**
		Run with the `npm start` command, before `start`.
		*/
		prestart?: string;

		/**
		Run with the `npm start` command.
		*/
		start?: string;

		/**
		Run with the `npm start` command, after `start`.
		*/
		poststart?: string;

		/**
		Run with the `npm restart` command, before `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		prerestart?: string;

		/**
		Run with the `npm restart` command. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		restart?: string;

		/**
		Run with the `npm restart` command, after `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		postrestart?: string;
	} & {
		[scriptName: string]: string;
	};

	/**
	Dependencies of the package. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or Git URL.
	*/
	export interface Dependency {
		[packageName: string]: string;
	}

	export interface NonStandardEntryPoints {
		/**
		An ECMAScript module ID that is the primary entry point to the program.
		*/
		module?: string;

		/**
		A module ID with untranspiled code that is the primary entry point to the program.
		*/
		esnext?:
		| string
		| {
			[moduleName: string]: string | undefined;
			main?: string;
			browser?: string;
		};

		/**
		A hint to JavaScript bundlers or component tools when packaging modules for client side use.
		*/
		browser?:
		| string
		| {
			[moduleName: string]: string | false;
		};

		/**
		Denote which files in your project are "pure" and therefore safe for Webpack to prune if unused.
		[Read more.](https://webpack.js.org/guides/tree-shaking/)
		*/
		sideEffects?: boolean | string[];
	}

	export interface TypeScriptConfiguration {
		/**
		Location of the bundled TypeScript declaration file.
		*/
		types?: string;

		/**
		Location of the bundled TypeScript declaration file. Alias of `types`.
		*/
		typings?: string;
	}

	/**
	An alternative configuration for Yarn workspaces.
	*/
	export interface WorkspaceConfig {
		/**
		An array of workspace pattern strings which contain the workspace packages.
		*/
		packages?: WorkspacePattern[];

		/**
		Designed to solve the problem of packages which break when their `node_modules` are moved to the root workspace directory - a process known as hoisting. For these packages, both within your workspace, and also some that have been installed via `node_modules`, it is important to have a mechanism for preventing the default Yarn workspace behavior. By adding workspace pattern strings here, Yarn will resume non-workspace behavior for any package which matches the defined patterns.
		[Read more](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
		*/
		nohoist?: WorkspacePattern[];
	}

	/**
	A workspace pattern points to a directory or group of directories which contain packages that should be included in the workspace installation process.
	The patterns are handled with [minimatch](https://github.com/isaacs/minimatch).
	@example
	`docs` → Include the docs directory and install its dependencies.
	`packages/*` → Include all nested directories within the packages directory, like `packages/cli` and `packages/core`.
	*/
	type WorkspacePattern = string;

	export interface YarnConfiguration {
		/**
		Used to configure [Yarn workspaces](https://classic.yarnpkg.com/docs/workspaces/).
		Workspaces allow you to manage multiple packages within the same repository in such a way that you only need to run `yarn install` once to install all of them in a single pass.
		Please note that the top-level `private` property of `package.json` **must** be set to `true` in order to use workspaces.
		*/
		workspaces?: WorkspacePattern[] | WorkspaceConfig;

		/**
		If your package only allows one version of a given dependency, and you’d like to enforce the same behavior as `yarn install --flat` on the command-line, set this to `true`.
		Note that if your `package.json` contains `"flat": true` and other packages depend on yours (e.g. you are building a library rather than an app), those other packages will also need `"flat": true` in their `package.json` or be installed with `yarn install --flat` on the command-line.
		*/
		flat?: boolean;

		/**
		Selective version resolutions. Allows the definition of custom package versions inside dependencies without manual edits in the `yarn.lock` file.
		*/
		resolutions?: Dependency;
	}

	export interface JSPMConfiguration {
		/**
		JSPM configuration.
		*/
		jspm?: PackageJSON;
	}
}

/**
Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Also includes types for fields used by other popular projects, like TypeScript and Yarn.
*/
export type PackageJSON = {
	/**
	The name of the package.
	*/
	name?: string;

	/**
	Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
	*/
	version?: string;

	/**
	Package description, listed in `npm search`.
	*/
	description?: string;

	/**
	Keywords associated with package, listed in `npm search`.
	*/
	keywords?: string[];

	/**
	The URL to the package's homepage.
	*/
	homepage?: LiteralUnion<'.', string>;

	/**
	The URL to the package's issue tracker and/or the email address to which issues should be reported.
	*/
	bugs?: PackageJSON.BugsLocation;

	/**
	The license for the package.
	*/
	license?: string;

	/**
	The licenses for the package.
	*/
	licenses?: Array<{
		type?: string;
		url?: string;
	}>;

	author?: PackageJSON.Person;

	/**
	A list of people who contributed to the package.
	*/
	contributors?: PackageJSON.Person[];

	/**
	A list of people who maintain the package.
	*/
	maintainers?: PackageJSON.Person[];

	/**
	The files included in the package.
	*/
	files?: string[];

	/**
	The module ID that is the primary entry point to the program.
	*/
	main?: string;

	/**
	The executable files that should be installed into the `PATH`.
	*/
	bin?:
	| string
	| {
		[binary: string]: string;
	};

	/**
	Filenames to put in place for the `man` program to find.
	*/
	man?: string | string[];

	/**
	Indicates the structure of the package.
	*/
	directories?: PackageJSON.DirectoryLocations;

	/**
	Location for the code repository.
	*/
	repository?:
	| string
	| {
		type: string;
		url: string;

		/**
		Relative path to package.json if it is placed in non-root directory (for example if it is part of a monorepo).
		[Read more.](https://github.com/npm/rfcs/blob/latest/implemented/0010-monorepo-subdirectory-declaration.md)
		*/
		directory?: string;
	};

	/**
	Script commands that are run at various times in the lifecycle of the package. The key is the lifecycle event, and the value is the command to run at that point.
	*/
	scripts?: PackageJSON.Scripts;

	/**
	Is used to set configuration parameters used in package scripts that persist across upgrades.
	*/
	config?: {
		[configKey: string]: unknown;
	};

	/**
	The dependencies of the package.
	*/
	dependencies?: PackageJSON.Dependency;

	/**
	Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.
	*/
	devDependencies?: PackageJSON.Dependency;

	/**
	Dependencies that are skipped if they fail to install.
	*/
	optionalDependencies?: PackageJSON.Dependency;

	/**
	Dependencies that will usually be required by the package user directly or via another dependency.
	*/
	peerDependencies?: PackageJSON.Dependency;

	/**
	Indicate peer dependencies that are optional.
	*/
	peerDependenciesMeta?: {
		[packageName: string]: {
			optional: true;
		};
	};

	/**
	Package names that are bundled when the package is published.
	*/
	bundledDependencies?: string[];

	/**
	Alias of `bundledDependencies`.
	*/
	bundleDependencies?: string[];

	/**
	Engines that this package runs on.
	*/
	engines?: {
		[EngineName in 'npm' | 'node' | string]: string;
	};

	/**
	@deprecated
	*/
	engineStrict?: boolean;

	/**
	Operating systems the module runs on.
	*/
	os?: Array<LiteralUnion<
		| 'aix'
		| 'darwin'
		| 'freebsd'
		| 'linux'
		| 'openbsd'
		| 'sunos'
		| 'win32'
		| '!aix'
		| '!darwin'
		| '!freebsd'
		| '!linux'
		| '!openbsd'
		| '!sunos'
		| '!win32',
		string
	>>;

	/**
	CPU architectures the module runs on.
	*/
	cpu?: Array<LiteralUnion<
		| 'arm'
		| 'arm64'
		| 'ia32'
		| 'mips'
		| 'mipsel'
		| 'ppc'
		| 'ppc64'
		| 's390'
		| 's390x'
		| 'x32'
		| 'x64'
		| '!arm'
		| '!arm64'
		| '!ia32'
		| '!mips'
		| '!mipsel'
		| '!ppc'
		| '!ppc64'
		| '!s390'
		| '!s390x'
		| '!x32'
		| '!x64',
		string
	>>;

	/**
	If set to `true`, a warning will be shown if package is installed locally. Useful if the package is primarily a command-line application that should be installed globally.
	@deprecated
	*/
	preferGlobal?: boolean;

	/**
	If set to `true`, then npm will refuse to publish it.
	*/
	private?: boolean;

	/**
	A set of config values that will be used at publish-time. It's especially handy to set the tag, registry or access, to ensure that a given package is not tagged with 'latest', published to the global public registry or that a scoped module is private by default.
	*/
	publishConfig?: {
		[config: string]: unknown;
	};

	/**
	Describes and notifies consumers of a package's monetary support information.
	[Read more.](https://github.com/npm/rfcs/blob/latest/accepted/0017-add-funding-support.md)
	*/
	funding?: string | {
		/**
		The type of funding.
		*/
		type?: LiteralUnion<
			| 'github'
			| 'opencollective'
			| 'patreon'
			| 'individual'
			| 'foundation'
			| 'corporation',
			string
		>;
		/**
		The URL to the funding page.
		*/
		url: string;
	};
} &
PackageJSON.NonStandardEntryPoints &
PackageJSON.TypeScriptConfiguration &
PackageJSON.YarnConfiguration &
PackageJSON.JSPMConfiguration & {
	[key: string]: unknown;
};
