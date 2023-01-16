var express = require('express');
var router = express.Router();

const mysql2 = require('mysql2');
const mysql = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_nodestock'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/product', (req, res) => {
  mysql.query('SELECT * FROM tb_product', (err, rs) => {
    if (err) {
        res.send(err);
    } else {
        res.render('product', { data: {}, products: rs });
    }
  })
})
router.post('/product', (req, res) => {
  mysql.query('INSERT INTO tb_product SET ?', req.body, (err, result) => {
    if(err) {
      res.send(err);
    } else {
      res.redirect('product');
    }
  })
})
router.get('/productDelete/:id', (req, res) => {
  var condition = [req.params.id];
  mysql.query('DELETE FROM tb_product WHERE id =?', condition, (err, rs) => {
    if (err){
      res.send(err);
    } else {
      res.redirect('/product');
    }
  });
})
router.get('/productEdit/:id', (req, res) => {
  var condition = [req.params.id];
  var sql = 'SELECT * FROM tb_product WHERE id = ?';

  mysql.query(sql, condition, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      sql = 'SELECT * FROM tb_product'

      mysql.query(sql, (err, products) => {
        if (err) {
          res.send(err);
        } else {
          res.render('product', { data: rs[0], products: products });
        }
      })
    }
  })
})
router.post('/productEdit/:id', (req, res) => {
  var params = [req.body.barcode, req.body.name, req.params.id];
  var sql = 'UPDATE tb_product SET barcode =?, name =? WHERE id =?';

  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
    }
  })
})

module.exports = router;
