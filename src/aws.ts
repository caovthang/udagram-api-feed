import AWS = require('aws-sdk');
import {config} from './config/config';


// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({profile: config.aws_profile});
config.access_key_id='AKIAT3RQY5MCKKL4ZQPP';
config.secret_access_key='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';
AWS.config.credentials = credentials;
 

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,   
  params: {Bucket: config.aws_media_bucket},
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;
  
  var params = {Bucket:config.aws_media_bucket};
  console.log('param bucket:' + params.Bucket);
  s3.getBucketLocation(params,function(err,data){
      if(err) console.log(err,err.stack);
      else  console.log('s3 bucket location:'+data);
  });

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl( key: string ): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
