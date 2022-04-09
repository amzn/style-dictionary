# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.3](https://github.com/amzn/style-dictionary/compare/v3.0.2...v3.0.3) (2021-10-15)


### Bug Fixes

* **types:** `className` optional parameter ([#683](https://github.com/amzn/style-dictionary/issues/683)) ([639d7da](https://github.com/amzn/style-dictionary/commit/639d7daa49fccdf569ec39a14953e366df1d7908)), closes [/github.com/amzn/style-dictionary/blob/main/examples/basic/config.json#L100](https://github.com/amzn//github.com/amzn/style-dictionary/blob/main/examples/basic/config.json/issues/L100)
* **types:** added `name` to format, and export `Named` ([#714](https://github.com/amzn/style-dictionary/issues/714)) ([9ca0f6f](https://github.com/amzn/style-dictionary/commit/9ca0f6fc5d01706bf6864a2ea0fababb191f30f4))

### [3.0.2](https://github.com/amzn/style-dictionary/compare/v3.0.1...v3.0.2) (2021-08-19)


### Bug Fixes

* **format:** 'typescript/es6-declarations' return type ([#681](https://github.com/amzn/style-dictionary/issues/681)) ([0cf6c52](https://github.com/amzn/style-dictionary/commit/0cf6c52a3f85a91e5763dc31e0fb6efe2a531e25))
* **lib:** fix `createFormatArgs` positional args ([#655](https://github.com/amzn/style-dictionary/issues/655)) ([29e511d](https://github.com/amzn/style-dictionary/commit/29e511d07e7991430f6f892879aeb0ade0c6a289)), closes [#652](https://github.com/amzn/style-dictionary/issues/652)
* **references:** check if object value is a string before replacement ([#682](https://github.com/amzn/style-dictionary/issues/682)) ([bfc204c](https://github.com/amzn/style-dictionary/commit/bfc204c50e7addde2b98dc5703b9be31b5b44823))
* **types:** format config expects formatter function ([#650](https://github.com/amzn/style-dictionary/issues/650)) ([b12c4b1](https://github.com/amzn/style-dictionary/commit/b12c4b1c6a94c62c757cd1675d216d9638f8d6e0))

### [3.0.1](https://github.com/amzn/style-dictionary/compare/v3.0.0...v3.0.1) (2021-06-07)


### Bug Fixes

* **swift:** add missing space after UIColor's alpha property ([#648](https://github.com/amzn/style-dictionary/issues/648)) ([7c65733](https://github.com/amzn/style-dictionary/commit/7c65733c05a82b99960e6dca25124fce91fbda32))
* **types:** directly export Named type to avoid ambiguity with TS --isolatedModules option ([8295b0d](https://github.com/amzn/style-dictionary/commit/8295b0dffc28a5dda934fb32a26f32ffcc241ffb))
* **types:** directly export Named type to avoid ambiguity with TS --isolatedModules option ([3ed31be](https://github.com/amzn/style-dictionary/commit/3ed31be5b09312df88c66e9274672303a8609acc))

## [3.0.0](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.10...v3.0.0) (2021-05-25)

## [3.0.0-rc.10](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.9...v3.0.0-rc.10) (2021-05-24)


### Features

* **formats:** add typescript declarations formats ([#557](https://github.com/amzn/style-dictionary/issues/557)) ([f517bcf](https://github.com/amzn/style-dictionary/commit/f517bcfa219bddc5a10b5443ccb85c4869711064)), closes [#425](https://github.com/amzn/style-dictionary/issues/425)
* **types:** cleaning up our type definitions ([#632](https://github.com/amzn/style-dictionary/issues/632)) ([db6269b](https://github.com/amzn/style-dictionary/commit/db6269b636264cc0849f595c0f15a34c977c1398))


### Bug Fixes

* **references:** value object references now work ([#623](https://github.com/amzn/style-dictionary/issues/623)) ([23de306](https://github.com/amzn/style-dictionary/commit/23de3062c464a70d9e6492a380e1052e9500ea2d)), closes [#615](https://github.com/amzn/style-dictionary/issues/615)
* **template:** remove blank lines in scss/map-deep and scss/map-flat templates ([#588](https://github.com/amzn/style-dictionary/issues/588)) ([a88e622](https://github.com/amzn/style-dictionary/commit/a88e622bcc06a98972dddb2b11903828ba3dab2b))

### [2.10.3](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.5...v2.10.3) (2021-03-09)


### Bug Fixes

* **extend:** remove prototype pollution ([#560](https://github.com/amzn/style-dictionary/issues/560)) ([89ee39a](https://github.com/amzn/style-dictionary/commit/89ee39a7953c1825ea4578d43f129e23b4ed5da8))

## [3.0.0-rc.9](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.8...v3.0.0-rc.9) (2021-05-04)


### Features

* **compose:** Add Jetpack Compose format ([#599](https://github.com/amzn/style-dictionary/issues/599)) ([8a53858](https://github.com/amzn/style-dictionary/commit/8a53858dc35f4b4565abe9a6500c78814e3e6eae)), closes [#478](https://github.com/amzn/style-dictionary/issues/478)


### Bug Fixes

* **formats:** bringing mapName back to scss formats ([#611](https://github.com/amzn/style-dictionary/issues/611)) ([7a28f40](https://github.com/amzn/style-dictionary/commit/7a28f40b7f44b37e565b1360683b60268d044e9e))
* **formats:** fixing formatting options in fileHeader ([#614](https://github.com/amzn/style-dictionary/issues/614)) ([3f7fe96](https://github.com/amzn/style-dictionary/commit/3f7fe9674c0cb1f228e0415ce468d18a48e4a7f0)), closes [#612](https://github.com/amzn/style-dictionary/issues/612)
* **references:** fixing circular reference errors ([#607](https://github.com/amzn/style-dictionary/issues/607)) ([9af17f4](https://github.com/amzn/style-dictionary/commit/9af17f420c2a11c64f77041f5c2439c093f9c035)), closes [#608](https://github.com/amzn/style-dictionary/issues/608)
* **references:** flushing the filtered reference warnings ([#598](https://github.com/amzn/style-dictionary/issues/598)) ([d3b5135](https://github.com/amzn/style-dictionary/commit/d3b51352f33cb15765cb152605acd3c44e6fbf69))

## [3.0.0-rc.8](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.7...v3.0.0-rc.8) (2021-04-05)


### Features

* **formats:** add an optional selector to css/variables format ([#582](https://github.com/amzn/style-dictionary/issues/582)) ([34922a8](https://github.com/amzn/style-dictionary/commit/34922a8572b7cefc6ca579cca9f73b16bfc4efc0))
* **formats:** output references handles interpoloated references ([#590](https://github.com/amzn/style-dictionary/issues/590)) ([cc595ca](https://github.com/amzn/style-dictionary/commit/cc595ca0683cc757dfae562a8688eb0b8d121cbe)), closes [#589](https://github.com/amzn/style-dictionary/issues/589)


### Bug Fixes

* **combine:** filePath was missing for falsey values ([#583](https://github.com/amzn/style-dictionary/issues/583)) ([8c405e6](https://github.com/amzn/style-dictionary/commit/8c405e6765367aff7eb94fda1a0a235f1c422c9c))
* **formats:** update output references in formats to handle nested references ([#587](https://github.com/amzn/style-dictionary/issues/587)) ([9ce0311](https://github.com/amzn/style-dictionary/commit/9ce031108979493c7f5d0df34e3546322694feb6))

## [3.0.0-rc.7](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.6...v3.0.0-rc.7) (2021-03-24)


### Features

* **formats:** adding custom file headers ([#572](https://github.com/amzn/style-dictionary/issues/572)) ([2a29502](https://github.com/amzn/style-dictionary/commit/2a29502f762c8694dd541dc9c0a0e0aa32e4dec9)), closes [#566](https://github.com/amzn/style-dictionary/issues/566)


### Bug Fixes

* **references:** use unfiltered dictionary for reference resolution in formats ([#553](https://github.com/amzn/style-dictionary/issues/553)) ([62c8fb8](https://github.com/amzn/style-dictionary/commit/62c8fb8ddaccb94dc2eee3b4504f38c264689b77))

## [3.0.0-rc.6](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.5...v3.0.0-rc.6) (2021-03-09)


### Bug Fixes

* **extend:** remove prototype pollution ([#554](https://github.com/amzn/style-dictionary/issues/554)) ([b99710a](https://github.com/amzn/style-dictionary/commit/b99710a23abf7d49be28f4ce33dbe99a8af5923f))

## [3.0.0-rc.5](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.4...v3.0.0-rc.5) (2021-02-27)


### Bug Fixes

* **types:** introduce parser, update config, optional transform options ([#546](https://github.com/amzn/style-dictionary/issues/546)) ([0042354](https://github.com/amzn/style-dictionary/commit/0042354b4ccb43ef26ddb13adab82b73f25dbf4f)), closes [#545](https://github.com/amzn/style-dictionary/issues/545)

## [3.0.0-rc.4](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.3...v3.0.0-rc.4) (2021-02-16)


### Features

* **formats:** add stylus/variables format ([#527](https://github.com/amzn/style-dictionary/issues/527)) ([8c56752](https://github.com/amzn/style-dictionary/commit/8c56752d43616884fe6b1f4f7a77994396ce2c3f)), closes [#526](https://github.com/amzn/style-dictionary/issues/526)

## [3.0.0-rc.3](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.2...v3.0.0-rc.3) (2021-02-06)


### Features

* **build-file:** do not generate file if properties is empty ([#494](https://github.com/amzn/style-dictionary/issues/494)) ([8945c46](https://github.com/amzn/style-dictionary/commit/8945c46f26a08ff6ffac3a5aa0e84a0f330efdb4))
* **format:** output references ([#504](https://github.com/amzn/style-dictionary/issues/504)) ([7e7889a](https://github.com/amzn/style-dictionary/commit/7e7889a41c79c58a04297762a31550c9bd7c2ee0))
* **format:** use named parameters in formatter functions ([#533](https://github.com/amzn/style-dictionary/issues/533)) ([32bd40d](https://github.com/amzn/style-dictionary/commit/32bd40d3a94dd3be49ea795e3dbcc70e149bd6eb))
* react-native support ([#512](https://github.com/amzn/style-dictionary/issues/512)) ([bd61cd2](https://github.com/amzn/style-dictionary/commit/bd61cd294afccd5299a7103fd2ea6177203e9994))


### Bug Fixes

* **examples:** little typo ([#518](https://github.com/amzn/style-dictionary/issues/518)) ([33271b6](https://github.com/amzn/style-dictionary/commit/33271b62b2a0c100a2be8c08f7cd89815e287327))
* **export platform:** fixing infinite loop when there are reference errors ([#531](https://github.com/amzn/style-dictionary/issues/531)) ([6078c80](https://github.com/amzn/style-dictionary/commit/6078c8041286589eef7515945f771240bf73c8ef))
* **property setup:** original property being mutated if the value is an object ([#534](https://github.com/amzn/style-dictionary/issues/534)) ([0b13ae2](https://github.com/amzn/style-dictionary/commit/0b13ae212023ba003ab71cc30eadb20ad10ebc0c))
* **types:** add transitive to value transform type ([#536](https://github.com/amzn/style-dictionary/issues/536)) ([695eed6](https://github.com/amzn/style-dictionary/commit/695eed60f9f56c30542bbec8d0c1622a6a6959df))
* **types:** Change transforms to transform in Core ([#530](https://github.com/amzn/style-dictionary/issues/530)) ([40a2601](https://github.com/amzn/style-dictionary/commit/40a2601724ed947aa141ff53e874c14c317992df))

## [3.0.0-rc.2](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.1...v3.0.0-rc.2) (2021-01-12)


### Features

* **format:** adding android/resources format ([e43aafd](https://github.com/amzn/style-dictionary/commit/e43aafd0e4c5f34158ea0cdc222833b79b35ab16))
* **transforms:** add 'px to rem' transform ([#491](https://github.com/amzn/style-dictionary/issues/491)) ([75f0ba3](https://github.com/amzn/style-dictionary/commit/75f0ba36e1211edf955c7b6bd6c58cbd9fc6524c))


### Bug Fixes

* **extend:** use given file path for token data ([#499](https://github.com/amzn/style-dictionary/issues/499)) ([0b23c9d](https://github.com/amzn/style-dictionary/commit/0b23c9d77e367b2080e4b624fcb294773b2aefcb))
* **parsers:** fixed an error where parsers weren't running ([#511](https://github.com/amzn/style-dictionary/issues/511)) ([b0077c3](https://github.com/amzn/style-dictionary/commit/b0077c3d06caf5b7fcacd7378aab7827cdaa3961))
* **types:** fix transform options type [#502](https://github.com/amzn/style-dictionary/issues/502) ([32787f8](https://github.com/amzn/style-dictionary/commit/32787f8a133a61f6132cef4bb88922f72951b804))

## [3.0.0-rc.1](https://github.com/amzn/style-dictionary/compare/v3.0.0-rc.0...v3.0.0-rc.1) (2020-12-04)

## [3.0.0-rc.0](https://github.com/amzn/style-dictionary/compare/v2.10.2...v3.0.0-rc.0) (2020-12-03)


### Features

* **examples:** add custom filters example ([c9bfcbc](https://github.com/amzn/style-dictionary/commit/c9bfcbcb07fec4435f2368c66d0db793d676a06e))
* **examples:** add custom filters example ([f95c420](https://github.com/amzn/style-dictionary/commit/f95c4202e93dcc00b47e595c4910f435a57d1987))
* **examples:** add matching build files example ([#481](https://github.com/amzn/style-dictionary/issues/481)) ([5a80ef6](https://github.com/amzn/style-dictionary/commit/5a80ef626bacb6b487f2543793e7ed6451e81498)), closes [#251](https://github.com/amzn/style-dictionary/issues/251)
* add support for !default in SCSS variables format ([#359](https://github.com/amzn/style-dictionary/issues/359)) ([fa82002](https://github.com/amzn/style-dictionary/commit/fa8200221477a7bf0d9fcb031a54dc61ba2e3f72)), closes [#307](https://github.com/amzn/style-dictionary/issues/307)
* add TypeScript typings ([#410](https://github.com/amzn/style-dictionary/issues/410)) ([a8bb832](https://github.com/amzn/style-dictionary/commit/a8bb83278fa5bf7b1796d7f466f21a7beef0da84))
* **core:** add new entries on property object ([#356](https://github.com/amzn/style-dictionary/issues/356)) ([fd254a5](https://github.com/amzn/style-dictionary/commit/fd254a5e9f78b9888cf59770e61800357421d934))
* **formats:** add file object to formatter method ([#439](https://github.com/amzn/style-dictionary/issues/439)) ([1481c46](https://github.com/amzn/style-dictionary/commit/1481c46647808d95dc26ff6c08a0906df09d0316))
* **formats:** javascript/module-flat format ([#457](https://github.com/amzn/style-dictionary/issues/457)) ([37b06e8](https://github.com/amzn/style-dictionary/commit/37b06e86ba77576fb0619372fd73e16673c6440d))
* **parser:** adding custom parser support ([#429](https://github.com/amzn/style-dictionary/issues/429)) ([887a837](https://github.com/amzn/style-dictionary/commit/887a837a72f15cb4e2550f883e6d4479e1fa9d42))
* **transforms:** Make transitive transforms & resolves possible ([#371](https://github.com/amzn/style-dictionary/issues/371)) ([3edbb17](https://github.com/amzn/style-dictionary/commit/3edbb178d53f9e5af2328b7c26271fe436af86d3)), closes [#208](https://github.com/amzn/style-dictionary/issues/208)

### Bug Fixes

* **cli:** update clean config path logic ([#454](https://github.com/amzn/style-dictionary/issues/454)) ([dc3cfa5](https://github.com/amzn/style-dictionary/commit/dc3cfa58aa7cc78a6359a8bb269e6f32ba50b110))
* **formats:** fix max call stack issue on json/nested format ([#465](https://github.com/amzn/style-dictionary/issues/465)) ([67fb361](https://github.com/amzn/style-dictionary/commit/67fb361fb2448f9b91a1a125ee61d6bbe2f77732))
* **transforms:** fix transitive transforms ([#476](https://github.com/amzn/style-dictionary/issues/476)) ([ac0c515](https://github.com/amzn/style-dictionary/commit/ac0c515c8b4593b91eb352b1f744895796e3ab49))

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
