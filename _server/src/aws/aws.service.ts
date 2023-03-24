import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}

  async imageUploadToS3(fileName: string, body: Buffer) {
    const s3Client = new S3Client({
      region: 'ap-northeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });

    const command = new PutObjectCommand({
      Bucket: 'hellodeveloper',
      Key: 'user_profile/' + fileName,
      Body: body,
      ACL: 'public-read',
    });

    try {
      await s3Client.send(command);
      return `https://hellodeveloper.s3.ap-northeast-1.amazonaws.com/user_profile/${fileName}`;
    } catch (err: any) {
      throw err;
    }
  }
}
