import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "hackathon",
  password: "harsh123",
  port: 5432,
});
db.connect();

app.get("/", async (req, res) => {
  res.render("start.ejs");
});
app.get("/home", async (req, res) => {
  res.render("home.ejs");
});
app.get("/login", async (req, res) => {
  res.render("login.ejs");
});
app.get("/register" , async(req,res) =>{
  res.render("register.ejs");
});
app.get("/message", async(req,res) =>{
  res.render("message.ejs")
});
app.post("/submitmessage",(req,res)=> {
  var name1=req.body["name"];
  var email1=req.body["email"];
  var content1=req.body["tweet"];
  res.render("message.ejs",{
      name:name1,
      email:email1,
      content:content1,
  });
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.post("/login", async (req, res) => {
  const email=req.body.username;
  const password=req.body.password;
  try{
    const result= await db.query('SELECT password from users WHERE email= $1',[email]);
    console.log(result.rows[0].password);
    console.log(password);
    if(result.rows[0].password==password){
      console.log("successfull");
      res.render("paid.ejs");
    }else{
      res.send("user doesnot exist");
    }
  } catch {
    console.log("user doesnot exist");
    res.redirect("/");
  }
});

app.get("/free" ,(req,res) => {
  res.render("free.ejs");
});
app.get("/payment" ,(req,res) => {
  res.render("payment.ejs");
});

app.get("/message", async (req, res) => {
  // Retrieve messages here (explained later)
  res.render("message.ejs", { messages: [] }); // Pass empty messages array for now
});
app.get("/register", async (req,res)=> {
  res.render("register.ejs");
});
app.post("/register", async(req,res) => {
  const values=[req.body.name,req.body.username,req.body.password,req.body.subscription,req.body.age];
  console.log(req.body.subscription);
  try{
    await db.query("INSERT INTO users(name,email,password,subscription,age) VALUES($1,$2,$3,$4,$5)",values);
    if(req.body.subscription!="free"){
      res.render("payment.ejs");
    }else{
      res.render("free.ejs");
    }
  } catch(error){
    if (error.code === '23505') { // Assuming unique email constraint violation code
      res.send("Email already registered. Please choose a different email address.");
    } else {
      console.error(error); // Log the error for debugging
      res.send("An unexpected error occurred. Please try again later.");
    }
  }
});

app.get("/paid" ,(req,res) =>{
  res.render("paid.ejs");
})



