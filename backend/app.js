const connectToMongo = require('./database/index');
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const {app_port} = require('./config/index');
const cors = require("cors");
app.use(cors());

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



app.use('/user', userRouter);
app.use('/admin', adminRouter);


app.listen(app_port || '8000', () => {
    console.log(`Server listening at ${app_port}`)
})

connectToMongo();
