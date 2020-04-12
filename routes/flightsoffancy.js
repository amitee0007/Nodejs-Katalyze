const express = require('express');
let router = express.Router();
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'katalyze_new'
  })
  con.connect((err) => {
    if (err) throw err;
    console.log("db is connected at app.js");
  })

router.get('/', (req, res) => {
    con.query('select first_name,last_name,age,DATE_FORMAT(date_of_post,"%M,%Y") AS date_of_post,photo,text_to_post,text_to_post AS detail_text from student_master INNER JOIN post_text ON student_master.id = post_text.student_id where category = "sentence"', function (err, sentence_data) {
      if (err) throw err;
      con.query('select * from student_master INNER JOIN post_text ON student_master.id = post_text.student_id where category = "story"', function (err, flipbook_data) {
        if (err) throw err;
        con.query('SELECT * FROM newsletter', function (err, newsletter_data) {
          if (err) throw err;
          let search_data = JSON.stringify(flipbook_data);
          res.render('flightsoffancy', {
            "input": sentence_data,
            "flip_data": flipbook_data,
            "news_data": newsletter_data
          })
        })
      })
    })
  })
  // router.get('/details/:First_Name', function (req, res, next) {
  //   con.query('select * from student_master INNER JOIN post_text ON student_master.id = post_text.student_id where category = "sentence" and First_Name = ?', req.params.First_Name, function (err, rows, fields) {
  //     if (err) throw err;
  //     con.query('select * from student_master INNER JOIN post_text ON student_master.id = post_text.student_id where category = "story"', function (err, flipbook_data) {
  //       if (err) throw err;
  //       res.render('details', {
  //         "input": rows[0],
  //         "flip_data": flipbook_data
  //       });
  //     });
  //   });
  // });
  module.exports =router;