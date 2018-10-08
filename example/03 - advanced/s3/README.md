##Connect Style Dictionary with an s3 bucket

This example shows how to set up a style dictionary to build files for different platforms (web, iOS, Android) and upload those build artifacts, together with a group of assets, to an s3 bucket. 

The platforms can then pull these files down during their build process.

#### Running the example

If you just want to see which files are generated, run the command `npm run build` in your local CLI environment.

If instead you want to see the full process, run the command `npm start`: this will start the style dictionary build process, save the output files and copy the assets into the `build` directory, then it will upload everything from the build directory into an s3 bucket. 

Important: in this case you need to make sure you have you computer set up to upload to your aws account, see [https://github.com/awslabs/aws-nodejs-sample](https://github.com/awslabs/aws-nodejs-sample) for a sample setup.
