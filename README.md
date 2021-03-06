# Language Support Extensions for vscode-ltex

**This repository is obsolete. Since version 5.0.0, LT<sub>E</sub>X doesn't need language support extensions anymore.**

Code for generating Visual Studio Code extension packages for every LanguageTool Language. For use with the [LT<sub>E</sub>X Extension for Visual Studio Code](https://github.com/valentjn/vscode-ltex).

## Tests

```sh
npm install
./gradlew -p test/resources installDist # Helps prevent timeout
npm test
```

## Usage

```sh
npm install
npm start
```

## Version Changes

Currently version information both of these packages and dependencies are stored in more places than they should. To update a version, do a text search to find the values to change.

## Requirements

* Node.js 8.0 or newer is required.
* Java 8+ is required.
* Inkscape and the Ubuntu font are required to convert the icons to PNG.
