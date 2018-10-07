## s3 Style Dictionary

One way to use the style dictionary framework is to build files for each platform and upload those build artifacts to an s3 bucket. The platforms can pull these files down during their build process.

### Running the example

```
$ npm install
```

```
$ npm start
```

This will run style dictionary build process and output files into the build/ directory, then it will upload everything from the build directory into an s3 bucket. Make sure you have you computer set up to upload to your aws account, see https://github.com/awslabs/aws-nodejs-sample for a sample setup.
