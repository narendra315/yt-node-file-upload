const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

app.use('*', cors());
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true,
    debug: true,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    },
}));

app.get('/', (req, res) => {
    res.send("API is up and running.")
})

app.put('/user/profile-picture', (req, res) => {
    try {
        const files = req.files;
        if (files) {

            const originalFileName = files.profile.name;
            const originalFileNameArr = originalFileName.split('.');
            const fileExtension = originalFileNameArr[originalFileNameArr.length - 1];
            const fileName = `${uniqid()}.${fileExtension}`;

            const model = {
                fileName, originalFileName
            }
            const uid = uniqid();
            let staticFolderPath = __dirname + `/profile-picture/${uid}`;
            
            // if (!fs.existsSync(staticFolderPath)) {
            //     fs.mkdirSync(staticFolderPath, { recursive: true });
            // }

            const attachFile = files.profile;
            const folderPath = `${staticFolderPath}/${fileName}`;
            attachFile.mv(folderPath, function (error) {
                if (error) {
                    res.send({ result: null, error: error.message })
                } else {
                    res.send({ result: "success", error: null })
                }
            });


        } else {
            res.send({ result: "failed", error: "File not found" })
        }
    } catch (err) {
        res.send({ result: null, error: err.message })
    }
})

app.listen(8080, () => {
    console.log('API is up and running');
})