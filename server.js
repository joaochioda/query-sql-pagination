const pg = require("pg");
const express = require("express");

const PORT = process.env.PORT || 5000;
const app = express();

const config = {
  user: "postgres",
  database: "querySql",
  password: "postgres",
  port: 5432, //Default port, change it if needed
};

app.use(express.json());

const pool = new pg.Pool(config);

app.get("/", (req, res) => {
  const pageSize = 3;
  const params = req.query.page - 1;
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Can not connect to the DB" + err);
    }
    client.query(
      `SELECT * FROM users order by age limit ${pageSize} offset ${
        pageSize * params
      }`,
      function (err, result) {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }
        res.status(200).send(result.rows);
      }
    );
  });
});

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`));
