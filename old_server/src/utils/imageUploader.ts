import config from "../config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * AWS S3 이미지 업로더
 * @param {string} key - 이미지 이름
 * @param {buffer} body - multer에서 받은 image buffer
 * @returns {string} - S3에 업로드된 이미지의 URL
 */
export const imageUploader = async (key: string, body: Buffer): Promise<string> => {
  const s3Client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: config.aws.accessKey,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: "hellodeveloper",
    Key: "user_profile/" + key,
    Body: body,
    ACL: "public-read",
  });

  try {
    await s3Client.send(command);
    return `https://hellodeveloper.s3.ap-northeast-1.amazonaws.com/user_profile/${key}`;
  } catch (err: any) {
    throw err;
  }
};
