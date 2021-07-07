const { rejects } = require('assert');
const express = require('express')
const upload = require('express-fileupload')
const fs = require("fs");
const { resolve } = require('path');
const path = require("path");

const app=express();
let cache ={};
app.use(upload());


app.get('/',(req, res) =>
{res.sendFile(__dirname +'/index.html')
})
app.post('/',(req, res) =>{
if(req.files){
    console.log(req.files)
    var file = req.files.file
    var filename = file.name
    const fileContent = file.data;
    //apply cache in the works
    //use promise instead of just move
    cache[filename] = write(filename, fileContent).then(read);
    console.log(cache)
    res.redirect("/");
   /*file.mv('uploads/'+filename, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.redirect("/")}
    })*/
}
else{console.log("select a file")}
}
)
app.get("/download/:id",(req,res)=>{
  if(cache[req.params.id]){
    console.log("downloading from Cache")
    cache[req.params.id].then((body)=>{
      res.send(body);
      console.log("download completed");
    });
  }else{
    cache[req.params.id]= read(`${req.params.id}`);
  }

}
)
app.get("/delete/:id",(req,res)=>{
    console.log("Deleted item")
    fs.unlink(`uploads/${req.params.id}`, function (err) {
      if (err) {
          res.send(err)
      } else {
          res.redirect("/")}
  })
  }
)
app.get("/update",(req,res) => {
  const fileList = new Promise((resolve, reject)=>{
    fs.readdir("./uploads",(err, files) =>{
      if (err) {
        reject(err);
      }
        resolve(files);
      });
    });
  fileList.then((data)=>{
    res.send(data);
  })
})
const read = (filename) => {
  return new Promise((resolve, reject) =>{
  fs.readFile(__dirname + path.sep + "uploads" + path.sep + filename,
  (err, fileBuffer)=>{
    if(err){
      rejects(err);
    }else{
      resolve(fileBuffer);
    }
    }
  )
}
  )
}

const write = (filename, content) => {
  return new Promise((resolve, reject) =>{
    fs.writeFile(__dirname + path.sep + "uploads" + path.sep + filename,content,
    (err)=>{
      if(err){
        rejects(err);
      }else{
        resolve(filename);
      }
      }
    )
  }
    )
  }
 // const dir = 'uploads'
 // const files = fs.readdirSync(dir)
  
 /* for (const file of files) {
    console.log(file)
  }
  */
  /*document.getElementById("fileItems").innerHTML = file;

  const display = (data) =>{
    var table = document.getElementById('fileItems')
    var row = fs.readdir(__dirname + path.sep + "uploads" ,function(err, list){
      console.log(list)
      table.innerHTML += row
    })
  }*/



app.listen(8000, () => {
    console.log("Application listening to port 8000");
  })  