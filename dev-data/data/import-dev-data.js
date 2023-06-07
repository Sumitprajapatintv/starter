const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourmodel');
const fs = require('fs');

dotenv.config({ path: './config.env' });

//const app = require('./App');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABSE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db connection Successful'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importdata = async () => {
  try {
    await Tour.create(tours);
    console.log('Data SuccessFully Loaded');
  } catch (err) {
    console.log(err);
  }
};

const DeleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data SuccessFully Delete');
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importdata();
} else if (process.argv[2] === '--delete') {
  DeleteData();
}
