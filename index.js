const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');
const fileUpload = require('express-fileupload');
const app = express();

app.use('*', cors());
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true, //localhost:8080/file/profile-picture/1/abc.png
    debug: true,
    limits: {
        fileSize: 5 * 1024 * 1024 //5 MB
    }
}))

app.get('/', (req, res) => {
    res.send("API is up and running.")
})

app.put('/user/profile-picture', (req, res) => {
    try {
        const files = req.files;
        if (files) {
            const originalFileName = files.profile.name;
            const originalFileNameArr = originalFileName.split('.');
            const fileExt = originalFileNameArr[originalFileNameArr.length - 1];
            const fileName = `${uniqid()}.${fileExt}`;

            const uid = uniqid();
            const folderPath = __dirname + `/profile-picture/${uid}`;
            const fileUploadPath = `${folderPath}/${fileName}`;

            files.profile.mv(fileUploadPath, function (error) {
                if (error) {
                    res.send({ result: null, error: error.message });
                } else {
                    res.send({ result: 'success', error: null });
                }
            })
        }

    } catch (error) {
        res.send({ result: null, error: error.message });
    }

})

app.listen(8080, () => {
    console.log('API is up and running');
})