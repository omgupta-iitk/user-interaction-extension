import MagicString from "magic-string";
import { init, parse } from "es-module-lexer";
import { lstat, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { clr } from "./util.js";

/**
 *
 * @param {{[package]:realpath}} packages
 * @param {String} [pageDir]
 * @returns
 */
export async function updateAllFiles(packages, pageDir) {
	const getDirectories = async (dir) => {
		const dirents = await readdir(dir, { withFileTypes: true });

		for (const dirent of dirents)
			if (dirent.isDirectory())
				dirent.name !== "node_modules" && (await getDirectories(join(dir, dirent.name)));
			else if (dirent.name.endsWith(".js")) parseJSFile(join(dir, dirent.name), packages);
	};
	if (pageDir) {
		if (pageDir === "node_modules") return console.error(clr["red"], "provided cannot be node_modules");
		//TODO verify paths
		const dirPath = resolve(pageDir);
		const stat = await lstat(dirPath);
		if (stat.isFile())
			dirPath.endsWith(".js")
				? parseJSFile(dirPath, packages)
				: console.error(clr["red"], "given file is not js");
		else getDirectories(pageDir);
	} else getDirectories(process.env.INIT_CWD);
}

/**
 *
 * @param {String} jsFile
 * @param {{package:realpath}} packages
 * @returns
 */

async function parseJSFile(jsFile, packages) {
	await init;

	const source = await readFile(jsFile, { encoding: "utf-8" });
	const [imports, _] = parse(source);

	if (imports.length === 0) return;

	const pkgImports = imports.filter((el) => packages[el.n]);
	if (imports.length === 0) return;
	updateJSFile({ pkgImports, source, packages, jsFile });
}

async function updateJSFile({ pkgImports, source, packages, jsFile }) {
	const s = new MagicString(source);

	for (const importEl of pkgImports) s.update(importEl.s, importEl.e, packages[importEl.n]);
	writeFile(jsFile, s.toString());
}
