var AWS = require('aws-sdk'),
    fs = require('fs-extra');

// Create an S3 client
var s3 = new AWS.S3();

// Enter your bucket name here
var bucketName = 'style-dictionary-test';

// Change working directory to ./build
process.chdir('build');
var files = fs.walkSync('./');

s3.createBucket({Bucket: bucketName}, function() {
  files.forEach(function(file) {
    var options = {
      Bucket: bucketName,
      Key: file,
      Body: fs.readFileSync(file)
    };
    s3.putObject(options, function(err, data) {
      if (err)
        console.log(err);
      else
        console.log("Successfully uploaded data to " + bucketName + "/" + file);
    });
  });
});
