const { S3Client } = require('@aws-sdk/client-s3')
const crypto = require('crypto')
require('dotenv').config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

const randomImageName = (bytes = 32, extension) => {
    const randomHex = crypto.randomBytes(bytes).toString('hex');
    return `${randomHex}.${extension}`;
};

module.exports = { s3, bucketName, randomImageName };