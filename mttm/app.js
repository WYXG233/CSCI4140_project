const express = require('express')
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000
const multer = require('multer');
const upload = multer({ dest: 'images/upload_content/' });
const cwd = path.join(__dirname, 'Pix2SeqV2-Pytorch-master/infer/');

function copyFolder(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  const files = fs.readdirSync(sourceDir);

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else if (stats.isDirectory()) {
      copyFolder(sourcePath, targetPath);
    }
  });
}
app.use(bodyParser.urlencoded({extended: false}));
// set header
app.all("*", function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/upload_content', upload.single('image'), (req, res) => {
  console.log("recive upload.");
  if (!req.file) {
    return res.status(400).send('No image selected! Please try again.');
  }

  const image = req.file;
  const savePath = './images/upload_content/';
  const newFilename = '1.jpg';
  const targetPath = path.join(savePath, newFilename);
  fs.renameSync(image.path, targetPath);
  copyFolder('images', '../html/images');
  res.status(200).send(JSON.stringify({valid: 0, message: 'upload success', filename: newFilename}));
});

app.post('/upload_style', upload.single('image'), (req, res) => {
  console.log("recive upload.");
  if (!req.file) {
    return res.status(400).send('No image selected! Please try again.');
  }

  const image = req.file;
  const savePath = './images/upload_style/';
  const newFilename = '1.jpg';
  const targetPath = path.join(savePath, newFilename);
  fs.renameSync(image.path, targetPath);
  copyFolder('images', '../html/images');
  res.status(200).send(JSON.stringify({valid: 0, message: 'upload success', filename: newFilename}));
});

app.get('/object_detection', (req, res) =>{
  var object_name=req.query.object_name;
  console.log('get object: ' + object_name);

  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["infer_single_image_object_detection.py", '--image', '../../images/editing/1.jpg'], {cwd});
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at object_detection1:${code}`);
      res.send(JSON.stringify({valid: 1, message: 'detected error'}));
    } else {
      console.log('detected success');
      fs.readFile('Pix2SeqV2-Pytorch-master/infer/result.txt', 'utf8', (err, data) => {
        if (err) {
          console.error("file read: "+ err);
          res.send(JSON.stringify({valid: 1, message: 'read result file error'}));
          return;
        }
        const regex = new RegExp(`^${object_name}$`, 'gm');
        const matchCount = (data.match(regex) || []).length;

        const lines = data.split('\r\n');
        const uniqueLines = [...new Set(lines)];

        if (matchCount > 0) {
          console.log(matchCount)
          copyFolder('images', '../html/images');
          res.send(JSON.stringify({valid: 0, message: 'read success', isexist: matchCount, uniqueContent: uniqueLines}));
        } else {
          console.log(matchCount)
          copyFolder('images', '../html/images');
          res.send(JSON.stringify({valid: 0, message: 'read success', isexist: 0, uniqueContent: uniqueLines}));
        }
      });
    }
  });
});

app.get('/search_content', (req, res) =>{
  var keyword=req.query.keyword;
  var method=req.query.method;
  console.log('get keyword: ' + keyword + ' and method: ' + method);
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["code/search_image.py", keyword, method]);
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at search content ${code}`);
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 1, message: 'search error'}));
    } else {
      console.log('search success');
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 0, message: 'search success'}));
    }
  });
});

app.get('/move_edit', (req, res) =>{
  var img=req.query.original;
  console.log('get selected img:' + img);
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["code/transfer_image.py", img]);
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at move_edit:${code}`);
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 1, message: 'move error'}));
    } else {
      console.log('move file success');
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 0, message: 'move success'}));
    }
  });
  
});

app.get('/style_transfer', (req, res) =>{
  var img=req.query.style;
  console.log('get selected style img:' + img);
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["code/style_transfer.py", 'images/' +img, 'images/editing/1.jpg', 'tmp']);
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at style_transfer:${code}`);
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 1, message: 'transfer error. Maybe the image type is not support. Please try another jpg image.'}));
    } else {
      console.log('transfer success');
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 0, message: 'transfer success'}));
    }
  });
});

app.get('/object_transfer', (req, res) =>{
  var style=req.query.style;
  var content=req.query.content;
  console.log('get selected style img: ' + style + ' and content: ' + content);
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["code/style_transfer.py", 'images/' +style, 'images/' + content, 'tmp_o']);
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at object_transfer:${code}`);
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 1, message: 'transfer error'}));
    } else {
      console.log('transfer success');
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 0, message: 'transfer success'}));
    }
  });
  
});

app.get('/combine_object', (req, res) =>{
  var target=req.query.target;
  var bg=req.query.bg;
  var file_name=req.query.original;
  console.log('get modified bg img: ' + bg + ' and content: ' + target + 'and filename: ' + file_name);
  const spawn = require('child_process').spawn;
  const pythonProcess = spawn('python',["code/combine_image.py", 'images/' +target, 'images/' + bg, file_name]);
  pythonProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`error at combine_object:${code}`);
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 1, message: 'combine error'}));
    } else {
      console.log('combine success');
      copyFolder('images', '../html/images');
      res.send(JSON.stringify({valid: 0, message: 'combine success'}));
    }
  });
});

app.post('/img_save', upload.single('canvasImage'), (req, res) =>{
  const image = req.file;
  const savePath = './images/tmp_c/';
  const newFilename = '1.jpg';
  const targetPath = path.join(savePath, newFilename);
  fs.renameSync(image.path, targetPath);
  copyFolder('images', '../html/images');
  res.status(200).send(JSON.stringify({valid: 0, message: 'combine success', filename: newFilename}));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
