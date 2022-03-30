const connectToMongo = require('./database/index');
const express = require('express')
const app = express();
const {app_port} = require('./config/index');
let cors = require("cors");
app.use(cors());

// app.head('Access-Control-Allow-Origin: *');

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/user', userRouter);
app.use('/admin', adminRouter);


app.listen(app_port, () => {
    console.log(`Server listening at ${app_port}`)
})

connectToMongo();