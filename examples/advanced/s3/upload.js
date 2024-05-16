import AWS from 'aws-sdk';
import fs from 'fs-extra';

// Create an S3 client
const s3 = new AWS.S3();

// Enter your bucket name here
const bucketName = 'style-dictionary-test';

// Change working directory to ./build
process.chdir('build');
const files = fs.walkSync('./');

s3.createBucket({ Bucket: bucketName }, function () {
  files.forEach(function (file) {
    const options = {
      Bucket: bucketName,
      Key: file,
      Body: fs.readFileSync(file),
    };
    s3.putObject(options, function (err) {
      if (err) console.log(err);
      else console.log('Successfully uploaded data to ' + bucketName + '/' + file);
    });
  });
});
