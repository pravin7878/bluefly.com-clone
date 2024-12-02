require("dotenv").config();
const express = require("express");
const connectToDB = require("./src/config/db");
const userRouter = require("./src/routes/user.route");
const app = express()
const port = process.env.PORT || 3000

app.get("/" , (req,res)=>{
    res.send("wellcome to server")
})
app.use(express.json())
app.use("/user" , userRouter)

app.listen(port , async()=>{
console.log(`server is runing on http://localhost:${port}`);
try {
    await connectToDB()
    console.log("DB Connected Success");
} catch (error) {
    console.log("DB connection failld",error);
}
})