require('./config/config');
require('./models/db');
const rtsIndex = require('./routes/index.routes');
/* const manageEvents = require("./manageEvents"); */
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

const mongoose = require('mongoose'),
      express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors');

var app = express();

const connection = mongoose.connection;
let gfs

connection.once('open', () => {
/*   gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads'); */
  console.log('MongoDB database connection established successfully!');
});

/* const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage }).single('file');

app.post('/upload', upload, (req, res, err) => {
  console.log('req', req.body)
  return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
});
 */
/* manageEvents(); */

app.use(cors());

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', rtsIndex);

//error handler
app.use((err, req, res, next) => {
  if (err.name == 'ValidationError'){
    var valErrors = [];
    Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
    res.status(422).send(valErrors)
  }
});

app.listen(process.env.PORT, ()=> console.log(`Server started at port: ${process.env.PORT}`));
