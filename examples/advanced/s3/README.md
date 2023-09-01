## Connect Style Dictionary with an Amazon S3 bucket

This example shows how to set up a style dictionary to build files for different platforms (web, iOS, Android) and upload those build artifacts, together with a group of assets, to an S3 bucket.

The platforms can then pull these files down during their build process.

#### Running the example

If you only want to see which files are generated, run the command `npm run build` in your local CLI environment.

If instead you want to see the full process, run the command `npm start`: this will start the style dictionary build process, save the output files and copy the assets into the `build` directory, then it will upload everything from the build directory into an S3 bucket.

Important: in this case you need to make sure you have you computer set up to upload to your aws account, see [https://github.com/awslabs/aws-nodejs-sample](https://github.com/awslabs/aws-nodejs-sample) for a sample setup.

#### The "copy" step

The asset files are copied into the folder `build` thanks to the action `copy_assets` declared in the `config.js` file. This action expects a folder specifically called `assets` in the root of the project.

#### The "upload" step

The upload to the S3 container in this example is done via a custom script, `upload.js`, which is not part of the standad Style Dictionary package. If you want you can adapt this script to your needs, or create a new custom script that will work with your specific storage solution.
