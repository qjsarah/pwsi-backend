const  {login, jwtAuth} = require("../services/services");

module.exports = function (app) {

    // User Login
    app.post('/login',function(req,res){
        login(req,res) 
        .then((val)=>{res.status(200).json(val)})
        .catch((err)=>{res.json(err)});
    })
  
    // Authentication Check
    app.post('/auth',function(req,res){ // this is to check if the access key stored in localstorage is valid or not
        jwtAuth(req,res) // exports.jwtAuth function inside 'services/user_service' is called
        .then((auth)=>{ // if all goes well data is returned (NOTE: This is the only way to get data of user other functions only return flags)
            res.json(auth);
        })
        .catch((err)=>{ // if any error, error is returned
            res.json(err);
        })
    })
};