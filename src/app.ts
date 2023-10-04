import express from 'express';
import bodyParser from 'body-parser'
import TextUploader from './services/text-uploader';
import AWS from 'aws-sdk';
import cors from 'cors';
import awscred from '../awscred'


const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
const port = 3000;

const awscredentials = awscred();
AWS.config.credentials = new AWS.Credentials(awscredentials[0], awscredentials[1]);
AWS.config.update({region: 'eu-north-1'});
var dynamo:AWS.DynamoDB;
dynamo = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var uploader:TextUploader;

app.get('/', (req, res) => {
    res.send('Hello World2!');
  });

app.get('/test', (req, res) => {
    uploader = new TextUploader(awscredentials[0], awscredentials[1]);
    try{
        var response = uploader.upload("my-text.txt","hello");
        
        res.send(response);
    }catch{
        res.send('test!');
    }
});

app.get('/chat', (req,res) => {
    const params: AWS.DynamoDB.QueryInput = {
        TableName: "chat-room",
        KeyConditionExpression: "#roomId = :roomId",
        ExpressionAttributeNames: {
            "#roomId": "roomId"
        },
        ExpressionAttributeValues: {
            ':roomId': {N:'0'},
            
        }
    };
    const result = dynamo.query(params, function(err, data){
        if (err) {
          console.log("Error", err);
        } else {
            data.Items.forEach((item) => console.log(item));
            return res.status(200).json({
                message: data
            });
        }
      });
    
});
app.post('/chat', (req,res) => {
    console.log(req)
    let roomId: string = req.body.roomId ?? null;
    let user: string = req.body.user ?? null;
    let message: string = req.body.message ?? null;
    const params: AWS.DynamoDB.PutItemInput = {
        TableName: "chat-room",
        Item: {
            'roomId': {N: roomId},
            'dateUtc': {N: Date.now().toString()},
            'user': {S: user},
            'message': {S: message},

        }
    };
    const result = dynamo.putItem(params, function(err, data){
        if (err) {
            console.log("Error", err);
        } else {
            return res.status(200).json({
                message: data
            });
        }
      });
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
})