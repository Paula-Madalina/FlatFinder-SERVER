const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./database/db");
const authMiddleware = require("./middlewares/authMiddleware")
const {errorHandler} = require("./services/globalErrorHandler")
const cors = require('cors');


// Routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/UserRoutes");
const flatRoutes = require("./routes/FlatRoutes");
const messagesRoutes = require("./routes/MessagesRoutes")


const PORT = process.env.PORT || 3030;
const ENVIROMENT = process.env.NODE_ENV || "DEV"

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
//unproctected routes
app.use("/auth", authRoutes);
app.use("/flats", flatRoutes);
app.use("/messages", messagesRoutes);


//protected routes
app.use("/users", authMiddleware.verifyAuthentication,userRoutes);
// app.use("/users", userRoutes);

//Global error handler
app.use(errorHandler )


const startServer = async () => {
    console.log(`==================================`);
    console.log(`FlatFinder app ${ENVIROMENT} MODE`);
    console.log(`server is running on port ${PORT}`);
    console.log(`==================================`);
    console.log('CONFIGURATION:');
    console.log('-PORT:', PORT);
    console.log('-ENVIROMENT:', ENVIROMENT);
    console.log('-MONGO URI:', process.env.MONGO_USER);
    try{
        await connectDB();
        app.listen(PORT, () => {
           

        })
    }catch(error) {
        console.log(error.message)

    }
}

app.get("/test", (req,res) => {
    res.send("hello world")
})

startServer();