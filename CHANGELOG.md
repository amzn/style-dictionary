# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.10.3](https://github.com/amzn/style-dictionary/compare/v2.10.2...v2.10.3) (2021-03-09)


### Bug Fixes

* **extend:** remove prototype pollution ([#560](https://github.com/amzn/style-dictionary/issues/560)) ([89ee39a](https://github.com/amzn/style-dictionary/commit/89ee39a7953c1825ea4578d43f129e23b4ed5da8))

### [2.10.2](https://github.com/amzn/style-dictionary/compare/v2.10.1...v2.10.2) (2020-10-08)


### Bug Fixes

* **cli:** update clean config path logic ([#454](https://github.com/amzn/style-dictionary/issues/454)) ([3cc3d4e](https://github.com/amzn/style-dictionary/commit/3cc3d4e04f2ee4d0ac8b1f90b725e80f6b53beb4))
* **formats:** fix max call stack issue on json/nested format ([#465](https://github.com/amzn/style-dictionary/issues/465)) ([4064e6a](https://github.com/amzn/style-dictionary/commit/4064e6add00ca3380d9a2c9ef9862f73ef051de9))

### [2.10.1](https://github.com/amzn/style-dictionary/compare/v2.10.0...v2.10.1) (2020-07-09)


### Bug Fixes

* **filter:** fix conditional to ensure we catch properties with a falsy value ([#423](https://github.com/amzn/style-dictionary/issues/423)) ([1ec4e74](https://github.com/amzn/style-dictionary/commit/1ec4e74b9b717208f7d64aa33d43774ae8023a23)), closes [#406](https://github.com/amzn/style-dictionary/issues/406)
* **formats:** align scss/map-* with scss/variables on asset category ([9d867ef](https://github.com/amzn/style-dictionary/commit/9d867ef3ad72cf68557434ce1a28ba996a5ac467))

## [2.10.0](https://github.com/amzn/style-dictionary/compare/v2.9.0...v2.10.0) (2020-05-05)


### Features

* adding color/hsl and color/hsl-4 transforms ([#383](https://github.com/amzn/style-dictionary/issues/383)) ([b777cfb](https://github.com/amzn/style-dictionary/commit/b777cfb11e5edc32e61df2dd33909c37a7efe2e5))
* flutter support ([#320](https://github.com/amzn/style-dictionary/issues/320)) ([8a5f645](https://github.com/amzn/style-dictionary/commit/8a5f645cc9e73fea9bbb8b6b38c5baa1d23149c8)), closes [#255](https://github.com/amzn/style-dictionary/issues/255) [#288](https://github.com/amzn/style-dictionary/issues/288)

<a name="2.9.0"></a>
# [2.9.0](https://github.com/amzn/style-dictionary/compare/v2.8.3...v2.9.0) (2020-04-21)


### Bug Fixes

* **transforms:** add NaN check to all size transforms ([#413](https://github.com/amzn/style-dictionary/issues/413)) ([d353795](https://github.com/amzn/style-dictionary/commit/d353795))
* **transforms:** add specificity so color for hex values is correct ([#412](https://github.com/amzn/style-dictionary/issues/412)) ([01cc11c](https://github.com/amzn/style-dictionary/commit/01cc11c)), closes [#407](https://github.com/amzn/style-dictionary/issues/407)
* clean require cache before loading file content ([#405](https://github.com/amzn/style-dictionary/issues/405)) ([18a50d0](https://github.com/amzn/style-dictionary/commit/18a50d0)), closes [#404](https://github.com/amzn/style-dictionary/issues/404)
* parseFloat() has only one argument ([#417](https://github.com/amzn/style-dictionary/issues/417)) ([16c3040](https://github.com/amzn/style-dictionary/commit/16c3040)), closes [#416](https://github.com/amzn/style-dictionary/issues/416)


### Features

* **attribute/cti:** attribute/cti should respect manually set attributes ([#415](https://github.com/amzn/style-dictionary/issues/415)) ([fb3e393](https://github.com/amzn/style-dictionary/commit/fb3e393)), closes [#414](https://github.com/amzn/style-dictionary/issues/414)



<a name="2.8.3"></a>
## [2.8.3](https://github.com/amzn/style-dictionary/compare/v2.8.2...v2.8.3) (2019-10-30)


### Bug Fixes

* **format:** minor css format output fix ([#323](https://github.com/amzn/style-dictionary/issues/323)) ([adb94e1](https://github.com/amzn/style-dictionary/commit/adb94e1)), closes [#322](https://github.com/amzn/style-dictionary/issues/322)
* **utils:** handle 0 values ([#325](https://github.com/amzn/style-dictionary/issues/325)) ([189d61b](https://github.com/amzn/style-dictionary/commit/189d61b)), closes [#324](https://github.com/amzn/style-dictionary/issues/324)



<a name="2.8.2"></a>
## [2.8.2](https://github.com/amzn/style-dictionary/compare/v2.8.1...v2.8.2) (2019-09-04)


### Bug Fixes

* **format:** issue [#295](https://github.com/amzn/style-dictionary/issues/295) ([c654648](https://github.com/amzn/style-dictionary/commit/c654648))
* **format:** issue [#295](https://github.com/amzn/style-dictionary/issues/295) ([#316](https://github.com/amzn/style-dictionary/issues/316)) ([030175e](https://github.com/amzn/style-dictionary/commit/030175e))
* **formats:** change less and scss comments to short version ([#306](https://github.com/amzn/style-dictionary/issues/306)) ([4f13f57](https://github.com/amzn/style-dictionary/commit/4f13f57)), closes [#305](https://github.com/amzn/style-dictionary/issues/305)
* **transform:** increase uicolor to 3 decimals to retain 8bit precision ([#314](https://github.com/amzn/style-dictionary/issues/314)) ([a3bde96](https://github.com/amzn/style-dictionary/commit/a3bde96))



<a name="2.8.1"></a>
## [2.8.1](https://github.com/amzn/style-dictionary/compare/v2.8.0...v2.8.1) (2019-07-02)


### Bug Fixes

* **format:** adding configurable name to sass map name ([#291](https://github.com/amzn/style-dictionary/issues/291)) ([cfa2422](https://github.com/amzn/style-dictionary/commit/cfa2422)), closes [#290](https://github.com/amzn/style-dictionary/issues/290)
* **sketch:** fix sketch palette format to use new filters ([#287](https://github.com/amzn/style-dictionary/issues/287)) ([374012c](https://github.com/amzn/style-dictionary/commit/374012c)), closes [#285](https://github.com/amzn/style-dictionary/issues/285)



<a name="2.8.0"></a>
# [2.8.0](https://github.com/amzn/style-dictionary/compare/v2.7.0...v2.8.0) (2019-05-28)


### Bug Fixes

* **cleanfile:** add file check and log for non-existent file ([#277](https://github.com/amzn/style-dictionary/issues/277)) ([6375133](https://github.com/amzn/style-dictionary/commit/6375133))
* **docs/examples:** 404 errors and typos ([#269](https://github.com/amzn/style-dictionary/issues/269)) ([da369da](https://github.com/amzn/style-dictionary/commit/da369da))
* **error-messaging:** add better error messaging when a transform or transformGroup does not exist ([#264](https://github.com/amzn/style-dictionary/issues/264)) ([d5c0583](https://github.com/amzn/style-dictionary/commit/d5c0583))
* **extend:** multiple extensions properly deep merge ([#276](https://github.com/amzn/style-dictionary/issues/276)) ([f1d6bb0](https://github.com/amzn/style-dictionary/commit/f1d6bb0)), closes [#274](https://github.com/amzn/style-dictionary/issues/274)
* accidentally generating test output in root directory ([4994553](https://github.com/amzn/style-dictionary/commit/4994553))


### Features

* **config:** use config.js if config.json is not found ([#249](https://github.com/amzn/style-dictionary/issues/249)) ([09fc43f](https://github.com/amzn/style-dictionary/commit/09fc43f)), closes [#238](https://github.com/amzn/style-dictionary/issues/238) [#238](https://github.com/amzn/style-dictionary/issues/238) [#247](https://github.com/amzn/style-dictionary/issues/247)
* add automatic changelog generation ([#225](https://github.com/amzn/style-dictionary/issues/225)) ([b062008](https://github.com/amzn/style-dictionary/commit/b062008))
* **docs:** adding PR and download badges; fixing code coverage badge ([#270](https://github.com/amzn/style-dictionary/issues/270)) ([2307a44](https://github.com/amzn/style-dictionary/commit/2307a44)), closes [#265](https://github.com/amzn/style-dictionary/issues/265)
* **ios-swift:** adding common transforms for Swift in iOS ([#255](https://github.com/amzn/style-dictionary/issues/255)) ([749db69](https://github.com/amzn/style-dictionary/commit/749db69)), closes [#161](https://github.com/amzn/style-dictionary/issues/161)
* **transforms:** Add UIColor transform for swift ([#250](https://github.com/amzn/style-dictionary/issues/250)) ([a62d880](https://github.com/amzn/style-dictionary/commit/a62d880)), closes [#161](https://github.com/amzn/style-dictionary/issues/161)
* **warning:** catch property name collisions during file output ([#273](https://github.com/amzn/style-dictionary/issues/273)) ([9a40407](https://github.com/amzn/style-dictionary/commit/9a40407))
