# ${Language} Support for the LT<sub>E</sub>X Extension

**NOTICE: The main [LT<sub>E</sub>X Extension for Visual Studio Code][ltex-ext] is not included and must be installed separately.**

___

Provides language support for ${Language} when using the [LT<sub>E</sub>X Extension for Visual Studio Code][ltex-ext]. This enables you to do offline grammar checking of ${Language} in L<sup>A</sup>T<sub>E</sub>X documents in Visual Studio Code.

## Usage

Set `ltex.language` to one of the following values to configure the checking language as ${Language}.

${all variants as Markdown list}

Use a specific language short code like `en-US` or `de-DE` instead of the generic language short code like `en` or `de` to obtain spelling corrections (in addition to grammar corrections).

You can install as many language support extensions as you like and change between them using this configuration.

You can set language-specific settings such as user dictionary or specific rules to enable/disable. The available configuration settings are listed in the description of the [LT<sub>E</sub>X extension][ltex-ext].

## Features

See [LT<sub>E</sub>X Extension for Visual Studio Code][ltex-ext].

## Requirements

* A compatible version of the [LT<sub>E</sub>X Extension for Visual Studio Code][ltex-ext] must be installed.
  * This package is based on LanguageTool 4.7, so you will need **version 4.7.x** of _LanguageTool for Visual Studio Code_.
* Java 8+ is required.

## Versioning

The LT<sub>E</sub>X extension has adopted the versioning of its LanguageTool dependency. For example, if this extension has version 4.7.0, it is powered by LanguageTool 4.7. LT<sub>E</sub>X 4.7.1 would also use LanguageTool 4.7. LT<sub>E</sub>X 4.8.0 would use LanguageTool 4.8. **The LanguageTool version of this language support extension must match the LanguageTool version of your installed LT<sub>E</sub>X extension.** The easiest way to ensure compatibility is to always update all LT<sub>E</sub>X-related extensions when updating. We will never have incompatible versions published at the same time.

## Known Issues

Please report issues or submit pull requests on [GitHub](https://github.com/valentjn/vscode-ltex).

## Acknowledgments

See [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md).

[ltex-ext]: https://marketplace.visualstudio.com/items?itemName=valentjn.vscode-ltex
