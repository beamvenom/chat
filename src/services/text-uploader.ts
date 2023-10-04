import Uploader from '../interfaces/uploader'
import AWS from 'aws-sdk'

export default class TextUploader implements Uploader{
    private s3 : AWS.S3;

    constructor(aws_access_key : string, aws_secret_key : string){
        AWS.config.credentials = new AWS.Credentials(aws_access_key,aws_secret_key);
        this.s3 = new AWS.S3();
    }

    async upload(fileName :string, text: string): Promise<string> {
        var response = await this.s3.putObject({
            Bucket: "notification-chat",
            Key: fileName,
            Body: text
        }).promise();
        console.log(response);
        return "success";
    }
}