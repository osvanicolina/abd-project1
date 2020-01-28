const express = require('express');
const app = express();
const { dbConfig } = require('./db/oracledb'); 
const oracledb = require('oracledb');

// Se indica el directorio donde se almacenarán las plantillas 
app.set('views', './src/views');
// Se indica el motor del plantillas a utilizar
app.set('view engine', 'pug');


const port = process.env.PORT || 5000;

app.listen( port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/query1', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT index_name, table_name, column_name from user_ind_columns'
        );
        result.title = 'QUERY #1';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query2', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT  table_name, count(index_name) index_count from user_ind_columns GROUP BY table_name'
        );
        result.title = 'QUERY #2';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query3', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT  constraint_name, constraint_type, table_name  from user_constraints'
        );
        result.title = 'QUERY #3';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query4', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT trigger_name, trigger_type, status, table_name FROM user_triggers'
        );
        result.title = 'QUERY #4';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query5', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT table_name, column_name, data_length FROM  cols'
        );
        result.title = 'QUERY #5';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query6', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT table_name, SUM(data_length) as row_size FROM  cols GROUP BY table_name'
        );
        result.title = 'QUERY #6';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query7', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            `SELECT TNR.table_name, (TNR.num_rows*T.row_size)/8192 TABLE_BLOCK_SIZE
            FROM
                (select  table_name,  
                        to_number(extractvalue(xmltype(dbms_xmlgen.getxml('select count(*) c from '||table_name)),'/ROWSET/ROW/C')) NUM_ROWS
                from user_tables) TNR JOIN
               (SELECT table_name, SUM(data_length) as row_size FROM cols GROUP BY table_name) T ON TNR.table_name = T.table_name`
        );
        result.title = 'QUERY #7';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});


app.get('/query8', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            'SELECT object_name FROM user_procedures'
        );
        result.title = 'QUERY #8';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query9', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            `SELECT SUM(ceil(num_rows/(trunc((8192/row_size)))))*8192/(1024*1024) DB_SIZE
            FROM 
              (SELECT table_name, SUM(data_length) as row_size FROM cols GROUP BY table_name) TR
               JOIN
              (SELECT  table_name, to_number(extractvalue(xmltype(dbms_xmlgen.getxml('select count(*) c from '||table_name)),'/ROWSET/ROW/C')) NUM_ROWS
                FROM user_tables) NR
                ON TR.table_name = NR.table_name`
        );
        result.title = 'QUERY #9';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/query10', async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection({
            user: 'tryndamere',
            password: 'a1234',
            connectString: 'localhost:1521/orcl'
          });
        
        const result = await conn.execute(
            `SELECT table_name, trunc(8192/(SUM(data_length))) BLOCK_FACTOR FROM cols GROUP BY table_name
            UNION ALL
            SELECT index_name table_name, trunc(8192/(SUM(column_length)+8)) BLOCK_FACTOR FROM user_ind_columns GROUP BY index_name`
        );
        result.title = 'QUERY #10';
        res.render('consulta.pug', { params: result});
       
    }catch(err){
        res.status(500).send(err);
    }
});







