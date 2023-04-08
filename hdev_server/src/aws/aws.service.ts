import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectAclCommand,
  PutObjectAclCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  s3Client: S3Client;
  bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
    this.bucketName = 'hellodeveloper';
  }

  async imageUploadToS3(fileName: string, file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
    return `https://hellodeveloper.s3.ap-northeast-1.amazonaws.com/${fileName}`;
  }

  async changeFolderName(oldPath: string, newPath: string) {
    // 변경해야되는 폴더 내의 모든 데이터를 가져오기
    const listParams = {
      Bucket: this.bucketName,
      Prefix: oldPath,
    };
    const listCommand = new ListObjectsV2Command(listParams);
    const listObject = await this.s3Client.send(listCommand);

    // 기존 폴더에 데이터가 없으면 폴더면 변경 취소
    if (!listObject) {
      return;
    }

    // 가져온 데이터를 새로운 경로로 복사하고, 기존 데이터는 삭제처리진행
    const contents = listObject.Contents || [];
    for (const object of contents) {
      const oldKey = object.Key;
      const newKey = newPath + oldKey.slice(oldPath.length);
      const copyParams = {
        Bucket: this.bucketName,
        CopySource: encodeURIComponent(this.bucketName + '/' + oldKey),
        Key: newKey,
      };
      const copyCommand = new CopyObjectCommand(copyParams);

      // 폴더 권한 설정복사
      const getObjectAclParams = {
        Bucket: this.bucketName,
        Key: oldKey,
      };
      const getObjectAclCommand = new GetObjectAclCommand(getObjectAclParams);
      const aclObject = await this.s3Client.send(getObjectAclCommand);

      // ACL 설정
      const putObjectAclParams = {
        Bucket: this.bucketName,
        Key: newKey,
        AccessControlPolicy: aclObject,
      };
      const putObjectAclCommand = new PutObjectAclCommand(putObjectAclParams);

      await this.s3Client.send(copyCommand);
      await this.s3Client.send(putObjectAclCommand);

      // 기존 객체는 삭제처리
      const deleteParams = {
        Bucket: this.bucketName,
        Key: oldKey,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(deleteCommand);
    }
  }
}
