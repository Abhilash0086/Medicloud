var express = require("express")
let alert = require('alert')
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const logger = require("morgan")


const app = express()

const port = process.env.port || 3000;

app.use(logger('dev'))
app.use(bodyParser.json())
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

//database connection
mongoose.connect('mongodb+srv://Abhinesh:Abhinesh2002@medicloud.6drwnmj.mongodb.net/Medicloud',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))





// start of signup form data insertion
app.post("/register_doc",async(req,res)=>{

        var organizationname = req.body.organizationname;
        var email = req.body.email;
        var password = req.body.password;
        var cpassword = req.body.cpassword;
        var _id = Date.now().toString();
        
    

    if(password === cpassword){
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var data = {
            "_id": "MDH-"+_id,
            "Organization name": organizationname,
            "Email" : email,
            "Password" : hashedPassword,
        }
    
        db.collection('RegisterHospital').insertOne(data,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Record Inserted Successfully");
        });
        alert("You are Successfully joined our community!!")
        return res.redirect('register_doc')
    }
    else{
        alert("You are seeing me because your password is not matching. Check them to avoid my visit !!")
        
        
    }
    

})
//end of signup form data insertion

//start of add patient
app.post("/add_patient",async(req,res)=>{

  var name = req.body.name;     
  var age = req.body.age;
  var gender = req.body.gender;
  var phone = req.body.phone;
  var email = req.body.email;
  var address = req.body.address;
  var _id = Date.now().toString();
  



  var patientdata = {
      "_id": "MDP-"+_id,
      "Patient Name": name,
      "Age": age,
      "Gender": gender,
      "Phone": phone,
      "Email" : email,
      "Address" : address,
  }

  db.collection('PatientDetails').insertOne(patientdata,(err,collection)=>{
      if(err){
          alert("Error in adding patient details !! Please try again")
          throw err;
        }
      console.log("Record Inserted Successfully");
      alert("Patient added successfully")
  });
  
  return res.redirect('hospital_dashboard')


})
//end of add patient



//start of login check
app.post("/login_doc",async(req,res)=>{
  try {
      const logindocemail = req.body.logindocemail;
      const logindocpassword = req.body.logindocpassword;

      const docmail = await db.collection('RegisterHospital').findOne({Email: logindocemail});
      const cryptpass = await bcrypt.compare(logindocpassword, docmail.Password);

      if(cryptpass){
        res.status(201).redirect("hospital_dashboard")
      }else{
        res.send("Sorry, password you entered is wrong")
      }


  } catch (error) {
    res.status(400).send("Sorry, Your mail id is not stored in our databse. Try with any other mail id")
  }
})
//end of login check



//start of render files
app.get('/', function(req, res){
    res.render('index');
  });

app.get("/register_doc", function(req, res){
    res.render("register_doc");
  });

app.get("/login_patient", function(req, res){
    res.render("login_patient");
  });  

app.get("/hospital_dashboard", function(req, res){
    res.render("hospital_dashboard");
  });  

app.use((req, res, next) => {
    res.status(404).render("404")
  })
  
app.use((req, res, next) => {
    res.status(11000).render("404")
  })  
//end of render files  


//start of server
app.listen(port)  
console.log("Listening on PORT 3000");
//end of server





