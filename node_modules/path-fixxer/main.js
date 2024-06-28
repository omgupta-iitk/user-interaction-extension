//@ts-check
import { clr } from "./util.js";
import { platform } from "node:os";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execute = promisify(exec);
const os = platform();

const copyCmd = {
	windows: (path) => `echo "${path}" | clip`,
	darwin: (path) => `echo "${path}" | pbcopy`,
	linux: (path) => `echo "${path}" | xclip -sel clip -r`,
};

/**
 *
 * @param {String} npmPkg
 * @returns
 */
//Find package real path and copy real path in clipboard
export async function copyPath(npmPkg) {
	if (typeof npmPkg !== "string") throw new Error("package name must be string");
	await checkPkgExist(npmPkg);

	const path = await getPkgPath(npmPkg);
	//BUG same issue in xclip
	const { stdout, stderr } = await execute(copyCmd[os](path));
	if (stderr) throw new Error(stderr);

	console.log("module path copied. Paste anywhere");
}

//check package exist in package.json dependencies
async function checkPkgExist(npmPkg) {
	const pkgJson = (await import(process.env.INIT_CWD + "/package.json", { assert: { type: "json" } })).default;
	if (!pkgJson.dependencies) throw new Error("project has no dependencies");
	if (!pkgJson.dependencies[npmPkg]) throw new Error(npmPkg + " doesn't exist in dependencies list");
	return true;
}

/**
 *
 * @param {String} npmPkg
 * @returns {Promise<String>} realpath
 */
async function getPkgPath(npmPkg) {
	//find module path
	let fullPath;
	if (import.meta.resolve) {
		try {
			const fullPath = await import.meta.resolve(npmPkg);
			return fullPath?.match(/(\/node_modules.*)/)[0];
		} catch (error) {
			throw new Error(npmPkg + " package not found in node_modules");
		}
	} else console.error(clr["red"], "add --experimental-import-meta-resolve flag in package.json scripts");
}

/**
 *
 * @param {String} npmPkg
 * @returns {Promise<String>} realPath
 */
export async function realPath(npmPkg) {
	if (typeof npmPkg !== "string") throw new Error("package name must be string");
	await checkPkgExist(npmPkg);

	const path = await getPkgPath(npmPkg);
	console.log(path);
	return path;
}

/**
 *
 * @param {String} npmPkg
 * @returns
 */
export async function setPkgPath(npmPkg) {
	if (typeof npmPkg !== "string") throw new Error("package name must be string");
	await checkPkgExist(npmPkg);

	const path = await getPkgPath(npmPkg);

	const { updateAllFiles } = await import("./update.js");
	await updateAllFiles({ [npmPkg]: path });

	console.log(clr["cyan"], npmPkg + " package path updated");
}

/**
 *
 * @returns {Promise<Object>} pkgPaths
 */
async function getPackagesPaths() {
	const pkgJson = (await import(process.env.INIT_CWD + "/package.json", { assert: { type: "json" } })).default;

	const dependencies = Object.keys(pkgJson.dependencies);
	// for (const key of dependencies) dependencies[key] = await getPkgPath(key);
	let promises = [];
	for (const key of dependencies) promises.push(getPkgPath(key));
	const results = await Promise.all(promises);
	const pkgPaths = {};
	let count = dependencies.length;
	for (let i = 0; i < count; i++) pkgPaths[dependencies[i]] = results[i];

	return pkgPaths;
}
/**
 *
 * @param {String} [pageDir]
 */
export const setAllPkgPath = async (pageDir) => {
	const pkgPaths = await getPackagesPaths();
	const { updateAllFiles } = await import("./update.js");
	//TODO check pageDir is directory
	await updateAllFiles(pkgPaths, pageDir);
	console.log(clr["cyan"], "all package path updated");
};

/**
 *
 */
export const pkgPathJson = async () => {
	const pkgPaths = await getPackagesPaths();
	const { writeFile } = await import("node:fs/promises");
	await writeFile("pkg-path.json", JSON.stringify(pkgPaths));

	console.log(clr["magenta"], " packages path json generated");
};

export default setAllPkgPath;
