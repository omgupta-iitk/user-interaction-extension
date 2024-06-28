# Path fixxer

Npm package path fixer for chrome extensions

Path-fixxer reset virtaul-path("package name") to real path so that \
 chrome browser find this path.

## problem

When you try to add npm packages in chrome extension. \
chrome extension show error

> Import path must start with ./ or /

Path-fixxer fix this error

> ⚠️ Note
> Add --experimental-import-meta-resolve flag in package.json scripts

Example 1:
Get all npm packages with its real path in json file.\
Create path.js file. Add these lines

```js
import { pkgPathJson } from "path-fixxer";
pkgPathJson();
```

Run node path.js to create json file.

Example 2:
If you want to reset all npm packages' path in all files and directories.\
Add these lines

```js
import setAllPkgPath from "path-fixxer";
setAllPkgPath();
```

Example 3:
If you want to reset one npm package path in all files and directories.\
Add these lines

```js
import { realPath } from "path-fixxer";
setPkgPath("package_name");
```

# command line

> ⚠️ Note
> Bug : --experimental-import-meta-resolve flag issue

add this line inside scripts in your package.json

`"script name":"path-fixxer --option`

### available options

--copy copy npm package real path in clipboard"\
--real print npm package real path"\
--fix set real path of given npm package"\
--copy set real path of all npm package"

### example

`"copypath":"path-fixxer --copy`
`"pathjson":"path-fixxer --pathjson`

### Run this in terminal

npm run pathfix \
then enter one or more package name
e.g moment,dotenv,vue
