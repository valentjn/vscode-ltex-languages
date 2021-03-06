"use strict";

const chai = require('chai');
chai.use(require("chai-as-promised"));
const assert = chai.assert;
const {promisify} = require('util');

const app = require('../../src/js/app.js');

describe('templateReplace', function () {
  it('should replace the found string', function () {
    assert.equal(app.templateReplace('package', 'com.whatever', "compile '${package}'"), "compile 'com.whatever'"
    )
  })
})

describe('writeGradleBuild', function () {
  it('should write the file correctly', async function () {
      const fs = require('fs');

      await app.writeGradleBuild('com.whatever')

      assert((await promisify(fs.stat)(app.outputDir + 'build.gradle')).isFile(), 'file should exist')

      assert.match(await promisify(fs.readFile)(app.outputDir + 'build.gradle'), /com\.whatever/)

      return promisify(fs.unlink)(app.outputDir + 'build.gradle')
  })

    it('should overwrite existing files', async function () {
      const fs = require('fs');

      await app.writeGradleBuild('com.whatever')
      await app.writeGradleBuild('completely.different')
      assert.match(await promisify(fs.readFile)(app.outputDir + 'build.gradle'), /completely\.different/)

      return promisify(fs.unlink)(app.outputDir + 'build.gradle')
  })
})