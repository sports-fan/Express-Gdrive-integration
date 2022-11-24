const stream = require('stream');
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config()

const uploadRouter = express.Router();
const upload = multer();

//intialize auth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
)

//setting our auth credentials
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN })

//initialize google drive
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
})

//file path for out file
const filePath = path.join(__dirname, 'filename.format')

//function to upload the file
async function uploadFile(fileObject) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  try{
    const response = await drive.files.create({
      requestBody: {
          name: fileObject.originalname,
          mimeType: fileObject.mimeType,
      },
      media: {
          mimeType: fileObject.mimeType,
          body: bufferStream,
      },
    })
  } catch (error) {
      //report the error message
    console.log(error.message);
  }
}  

// const uploadFile = async (fileObject) => {
//   const bufferStream = new stream.PassThrough();
//   bufferStream.end(fileObject.buffer);
//   const { data } = await google.drive({ version: 'v3' }).files.create({
//     media: {
//       mimeType: fileObject.mimeType,
//       body: bufferStream,
//     },
//     requestBody: {
//       name: fileObject.originalname,
//       parents: ['DRIVE_FOLDER_ID'],
//     },
//     fields: 'id,name',
//   });
//   console.log(`Uploaded file ${data.name} ${data.id}`);
// };

uploadRouter.post('/upload', upload.any(), async (req, res) => {
  try {
    const { body, files } = req;

    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f]);
    }

    res.status(200).send('Form Submitted');
  } catch (f) {
    res.send(f.message);
  }
});

module.exports = uploadRouter;
