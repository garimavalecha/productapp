var express=require("express");
var app=express();
var methodOverride=require("method-override");
var bp=require("body-parser");
var mon=require("mongoose");

mon.connect("mongodb://localhost/productapp");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose model config
var productSchema=new mon.Schema({
    name:String,
    image:String,
    price:String, 
    details:String
});
var product=mon.model("product",productSchema );

//restful routes

//index route
app.get("/",function(req,res){
    res.redirect("/products");
});
app.get("/products",function(req,res){
    product.find({},function(err,products)
    {
        if(err)
           console.log(err);
        else
            res.render("index.ejs",{products:products});
    })
});

//new route
app.get("/products/new",function(req,res)
{
    res.render("new.ejs");
});

//create route
app.post("/products",function(req,res)
{   
    product.create(req.body.product,function(err,newproduct){
        if(err)
           res.render("new.ejs");
        else
           res.redirect("/products");
            
    })
});


//show route
app.get("/products/:id", function(req,res){
     product.findById(req.params.id,function(err,foundproduct){
         if(err)
          res.redirect("/products");
         else 
         {
           res.render("show",{product:foundproduct});
}
}); 
});


//edit route
app.get("/products/:id/edit",function(req,res)
{   product.findById(req.params.id,function(err,foundproduct){
         if(err)
          res.redirect("/products");
         else 
         {
           res.render("edit.ejs",{product:foundproduct});
}
})
});


//update route
app.put("/products/:id",function(req,res)
{    
    product.findByIdAndUpdate(req.params.id,req.body.product,function(err,updatedproduct){
        if(err)
            res.redirect("/products");
        else
            res.redirect("/products/"+req.params.id);
    })
});


//delete route
app.delete("/products/:id",function(req,res){
   product.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/products");
        else
            res.redirect("/products");
       
   }) 
});



app.listen(process.env.PORT ,process.env.IP,function(){
    console.log("server has started");
});
