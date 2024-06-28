#! /usr/bin/env node
import { copyPath, realPath, setPkgPath, setAllPkgPath } from "../main.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { clr } from "../util.js";

const commandFn = {
	"--copy": async (npmPkg) => copyPath(npmPkg),
	"--real": async (npmPkg) => realPath(npmPkg),
	"--fix": async (npmPkg) => setPkgPath(npmPkg),
	"--fixAll": async () => setAllPkgPath(npmPkg),
	"--pathjson": async () => pkgPathJson(npmPkg),
};

const arg = process.argv[2];
if (!commandFn[arg]) throw new Error("invalid options. available options: --real,--copy,--fix,--fixAll");

if (arg === "--fixAll" || arg === "--pathjson") commandFn[arg];
else {
	const rl = readline.createInterface({ input, output });
	const npmPkgs = await rl.question("Enter npm pkg name:  ");
	if (npmPkgs) for (const npmPkg of npmPkgs.split(",")) commandFn[cmd](npmPkg);
	else console.error(clr["red"], "npm package name cannot be empty.");
	console.log(clr["yellow"], "use --fixAll or --pathjson options for all npm packages");
	rl.close();
}
