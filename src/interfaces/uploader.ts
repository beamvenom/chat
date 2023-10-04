export default interface Uploader {
    upload(fileName:string, text:string) : Promise<string>;
}