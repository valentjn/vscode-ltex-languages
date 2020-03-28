"use strict";
const util = require('util');
const Gradle = require('./gradle.js');

const outputDir = './staging/';
const gradle = Gradle(outputDir)
const fs = require('fs');

// https://stackoverflow.com/a/3561711/1072626
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function templateReplace(find, replace, text) {
    return text.replace(new RegExp(RegExp.escape('${' + find + '}'), 'g'), replace)
}

/** If this returned a randomized (which it returned) packages could be build in parallel. */
async function writeGradleBuild(packageName) {
    const text = await util.promisify(fs.readFile)('./src/resources/template.gradle', 'utf8');
    return util.promisify(fs.writeFile)(outputDir + 'build.gradle', templateReplace('package', packageName, text), 'utf8')
}

async function readAllJars() {
    return util.promisify(fs.readdir)(`${outputDir}build/install/${outputDir}lib/`)
}

async function getCoreFiles() {
    await writeGradleBuild("org.languagetool:languagetool-core:4.9");

    await gradle.exec('installDist');

    return readAllJars();
}

async function writeIcon(shortCode) {
    const exec = util.promisify(require('child_process').exec);
    const iconSvg = `${outputDir}/img/LTeX-${shortCode}-icon.svg`;
    const iconPng = `${outputDir}/img/LTeX-${shortCode}-icon.png`;
    const label = ((shortCode == 'de-DE-x-simple-language') ? 'S. DE' : shortCode.toUpperCase());
    await exec(`mkdir -p ${outputDir}/img`);
    await exec(`rm -f ${outputDir}/img/LTeX-*-icon.{svg,png}`);
    await exec(`cp img/LTeX-language-icon.svg "${iconSvg}"`);
    await exec(`sed -i 's/\${short code}/${label}/g' "${iconSvg}"`);
    await exec('inkscape -z --export-area-page --export-width=128px --export-height=128px ' +
            `"${iconSvg}" "--export-png=${iconPng}"`);
}

async function writeVscodeignore(coreFiles, shortCode) {
    const currentFiles = await util.promisify(fs.readdir)(`${outputDir}build/install/${outputDir}lib/`)

    const difference = (arr1, arr2) => arr1.filter(x => arr2.indexOf(x) == -1);

    const filesToInclude = difference(currentFiles, coreFiles)

    const excludeEverything = "*\n" + "*/**\n"

    await util.promisify(fs.writeFile)(outputDir + '.vscodeignore',
        ["*", "*/**", "!ACKNOWLEDGMENTS.md", "!CHANGELOG.md", "!LICENSE.txt", "!README.md", "!package.json", `!img/LTeX-${shortCode}-icon.png`]
            .concat(filesToInclude.map(s => '!lib/' + s)).join('\n'))
}

function getLanguageShortCode(packageName) {
    const re = /language-(.*):/
    return re.exec(packageName)[1]
}

async function main() {
    const { createVSIX } = require('vsce')

    await writeGradleBuild("org.languagetool:language-all:4.9");
    const packages = await gradle.firstLevelDependencies();
    const coreFiles = await getCoreFiles();

    const json = JSON.parse(await util.promisify(fs.readFile)('package.json', 'utf8'))
    const version = json.version

    for (const packageName of packages) {
        const shortCode = getLanguageShortCode(packageName)
        await writeGradleBuild(packageName)
        await writeIcon(shortCode)
        await gradle.exec('installDist')
        await writeVscodeignore(coreFiles, shortCode)
        await gradle.exec('run')
        console.log(shortCode)

        // Temporary see https://github.com/Microsoft/vscode-vsce/issues/177
        const exec = util.promisify(require('child_process').exec);
        await exec(`rm -Rf ${outputDir}lib`)
        await exec(`cp -R ${outputDir}build/install/${outputDir}lib ${outputDir}`)

        await createVSIX({ cwd: outputDir, packagePath: `vscode-ltex-${shortCode}-${version}.vsix` })
    }
}


if (require.main === module) {
    main();
}

module.exports.templateReplace = templateReplace;
module.exports.gradle = gradle;
module.exports.writeGradleBuild = writeGradleBuild;
module.exports.writeVscodeignore = getCoreFiles;
module.exports.main = main;
module.exports.outputDir = outputDir;
