const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./App');
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

app.listen(process.env.PORT || 8000, () => {
  console.log(`App is Listing On Port 8000 `);
});
