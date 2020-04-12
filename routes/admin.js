const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const upload = multer({ dest: './public/images/student_pic' });

//Create connection to mySql DATABASE
const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'katalyze_new'
})
con.connect(function(err){
    if (err) throw err;
    console.log("admin Connected!");
})

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.

router.use((req, res, next) => {
    if (req.cookies.user_admin && !req.session.user) {
        res.clearCookie('user_admin');        
    } 
    next();
});

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_admin) {
        res.redirect('/admin/add');
    } else {
        next();
    }    
};
// render admin page----
router.get('/',sessionChecker, function(req, res,next) {
		res.render('admin/admin',{       
        });
    });

//Posting login details----    
router.post('/', function(req, res,next) {
    var username_ = req.body.username;
    var password_ = req.body.password;
    if (username_ && password_) {
        con.query('SELECT id,username , password FROM admin_login WHERE username = ? AND password = ?', [username_, password_], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.user = results[0];
                req.flash('success', 'You are now logged in');
                res.redirect('/admin/add');
            } else {
                req.flash('Incorrect Username and/or Password!');
                res.redirect('/admin');
            }			
        });
    } else {
        req.flash('Please enter Username and Password!');
        res.redirect('/admin');
    }
});

// Render ADD POST page-----
router.get('/add', function(req, res,next) {
    if (req.session.user && req.cookies.user_admin) {
        con.query('SELECT * FROM student_master',function(err,search_data){
            let search_ = JSON.stringify(search_data);
            res.render('admin/add',{
                "search_data":search_,
                "show_data":search_data
            });
        })
    } else {
        res.redirect('/admin');
    }
});

router.get('/addpost/:id', function(req, res,next) {
    if (req.session.user && req.cookies.user_admin) {
        con.query('SELECT * FROM student_master WHERE id=?',req.params.id,function(err,fill_data){
            if(err) throw err;
            con.query('SELECT * FROM student_master',function(err,search_data){
            if(err) throw err;
            let search_ = JSON.stringify(search_data);
            res.render('admin/addpost',{
                "search_data":search_,
                "show_data":search_data,
                "fill_data":fill_data
            });
        });
    });
    } else {
        res.redirect('/admin');
    }
});
// Storing FORM_DATA to database
 router.post('/addpost/:id', function(req,res,next) {
    if (req.session.user && req.cookies.user_admin) {
    // Get Form Values
    var student_id = req.body.id;
    var date_of_post = req.body.date_of_post;
    var category = req.body.category;
    var text_to_post = req.body.text_to_post;
    var post_title = req.body.post_title;
    // Form Validation
   req.checkBody('id','Select student Name').notEmpty();  
   req.checkBody('date_of_post','Date is mandetory').notEmpty();
   req.checkBody('text_to_post','Text is mandetory').notEmpty();
   req.checkBody('category','Category is mandetory').notEmpty();  

    //   Check Errors
    var errors = req.validationErrors();

      if(errors){
        if (req.session.user && req.cookies.user_admin) {
            con.query('SELECT * FROM student_master WHERE id= ?',req.body.id,function(err,fill_data){
                if(err) throw err;
                con.query('SELECT * FROM student_master',function(err,search_data){
                if(err) throw err;
                let search_ = JSON.stringify(search_data);
                res.render('admin/addpost',{
                    "search_data":search_,
                    "show_data":search_data,
                    "errors": errors,
                    "fill_data":fill_data
                });
            });
        });
        } else {
            res.redirect('/admin');
        }

      } else {
          var addpost_new = {
              student_id: student_id,
              category: category,
              date_of_post:date_of_post,
              text_to_post:text_to_post,
              post_title:post_title
          }
            var query = con.query('INSERT INTO post_text SET ?', addpost_new, function(err, result){
                if(err) throw err;
                console.log('Success: '+result);
               });
         
            //    req.flash('success', 'Project Added');
               res.redirect('/admin/add');
      }
    } else {
        res.redirect('/admin');
    }
  });

  router.get('/newstudent', function(req,res,next) {
    if (req.session.user && req.cookies.user_admin) {
        res.render('admin/newstudent',{});
    } else {
        res.redirect('/admin');
    }

});

  router.post('/newstudent', upload.single('photo'), function(req, res,next) {
    if (req.session.user && req.cookies.user_admin) {
    // Get Form Values
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var age = req.body.age;

    // Check Image Upload
    if(req.file){
        var photo = req.file.filename
    } else {
        var photo = 'noimage.jpg';
    }
  
    // Form Validation
   req.checkBody('first_name','First Name field is required').notEmpty();
   req.checkBody('last_name','Last Name field is required').notEmpty();
   req.checkBody('age','Age field is required').notEmpty();
  
    //   Check Errors
    var errors = req.validationErrors();
  
      if(errors){
          res.render('admin/newstudent',{
              errors: errors
          });
      } else {
          var student_data = {
              first_name: first_name,
              last_name: last_name,
              age:age,
              photo:photo
          }
            var query = con.query('INSERT INTO student_data SET ?', student_data, function(err, result){
                console.log('Error: '+err);
                console.log('Success: '+result);
               });
         
            //    req.flash('success_msg', 'Details Added');         
               res.redirect('/admin/newstudent');
      }
    } else {
        res.redirect('/admin');
    }
  });

router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_admin) {
        res.clearCookie('user_admin');
        res.redirect('/admin');
    } else {
        res.redirect('/admin');
    }
});

module.exports = router;