const express = require("express");
const mysql = require("mysql");
const uuidv4 = require("uuid/v4");
const { DateTime } = require("luxon");

const app = express();
app.use(express.json());
//mySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "contact_list_app",
  port: "8889",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database = ", err);
    return;
  }
  console.log("MySQL successfully connected");
});

const apiKey = "43c3520b-126f-4489-98ce-47072a1db5b3";
const apiSecret = "26e40abd-7531-44bc-82ca-f1a6c7548494";

//Autorization
function authorization(key, secret, res) {
  if (key != apiKey || secret != apiSecret) {
    throw res.send({ message: "Invalid authorization" });
  }
}

//Create
app.post("/create/contact", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const { groupId, firstName, lastName, birthDate, phone } = req.body;
  const contactId = uuidv4();

  try {
    connection.query(
      `INSERT INTO contact_list( contactId, groupId, firstName, lastName, birthDate, phone) VALUES( ?,?,?,?,?,? )`,
      [contactId, groupId, firstName, lastName, birthDate, phone],
      (err) => {
        if (err) {
          console.log("Error while inserting a contact into the database", err);
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New contact successfully created!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.post("/create/group", async (req, res) => {
  const { groupId, groupName } = req.body;
  const { key, secret } = req.headers;
  authorization(key, secret, res);

  try {
    connection.query(
      `INSERT INTO group_list( groupId, groupName ) VALUES( ?,? )`,
      [groupId, groupName],
      (err) => {
        if (err) {
          console.log("Error while inserting a user into the database", err);
          return res.status(400).send();
        }
        return res.status(201).json({
          message: `New group named '${groupName}' successfully created!`,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//Inquiry
app.get("/inquiry/contact", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);

  try {
    connection.query("SELECT * FROM contact_list", (err, results) => {
      if (err) {
        console.log("Error while reading contacts from the database", err);
        return res.status(400).send();
      }
      //Convert birthDate format
      results.forEach(
        (result) =>
          (result.birthDate = DateTime.fromISO(
            result.birthDate.toISOString()
          ).toFormat("yyyy-MM-dd"))
      );
      return res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/inquiry/contact/bycontactid/:contactId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const contactId = req.params.contactId;

  try {
    connection.query(
      `SELECT * FROM contact_list WHERE contactId = '${contactId}'`,
      (err, results) => {
        if (err) {
          console.log("Error while reading a contact from the database", err);
          return res.status(400).send();
        }
        //Convert borthDate format
        const bd = new Date(results[0].birthDate).toISOString();
        results[0].birthDate = DateTime.fromISO(bd).toFormat("yyyy-MM-dd");
        return res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/inquiry/contact/bygroupid/:groupId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const groupId = req.params.groupId;

  try {
    connection.query(
      `SELECT * FROM contact_list WHERE groupId = '${groupId}'`,
      (err, results) => {
        if (err) {
          console.log("Error while reading a contact from the database", err);
          return res.status(400).send();
        }
        return res.status(200).json(results);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/inquiry/group", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);

  try {
    connection.query(`SELECT * FROM group_list`, (err, results) => {
      if (err) {
        console.log("Error while reading groups from the database", err);
        return res.status(400).send();
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//Update
app.put("/update/contact/:contactId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const { groupId, firstName, lastName, birthDate, phone } = req.body;
  const contactId = req.params.contactId;

  try {
    connection.query(
      `UPDATE contact_list SET groupId = ?, firstName = ?, lastName = ?, birthDate = ?, phone = ? WHERE contactId = ?`,
      [groupId, firstName, lastName, birthDate, phone, contactId],
      (err) => {
        if (err) {
          console.log("Error while updating a contact in the database", err);
          return res.status(400).send();
        }
        return res.status(200).json({ message: "Successfully updated!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.put("/update/group/:groupId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const { groupName } = req.body;
  const groupId = req.params.groupId;

  try {
    connection.query(
      `UPDATE group_list SET groupName = ? WHERE groupId = ?`,
      [groupName, groupId],
      (err) => {
        if (err) {
          console.log("Error while updating a group in the database", err);
          return res.status(400).send();
        }
        return res.status(200).json({ message: "Successfully updated!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//Delete
app.delete("/delete/contact/:contactId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const contactId = req.params.contactId;

  try {
    connection.query(
      `DELETE FROM contact_list WHERE contactId = ?`,
      [contactId],
      (err, results) => {
        if (err) {
          console.log("Error while deleting a contact in the database", err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: `There's no contactId '${contactId}' in the database. Nothing has been deleted` });
        }
        return res
          .status(200)
          .json({ message: `Contact ID '${contactId}' has been deleted!` });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.delete("/delete/group/:groupId", async (req, res) => {
  const { key, secret } = req.headers;
  authorization(key, secret, res);
  const groupId = req.params.groupId;

  try {
    connection.query(
      `DELETE FROM group_list WHERE groupId = ?`,
      [groupId],
      (err, results) => {
        if (err) {
          console.log("Error while deleting a group in the database", err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: `There's no groupId '${groupId}'' in the database. Nothing has been deleted` });
        }
        return res
          .status(200)
          .json({ message: `group ID '${groupId}' has been deleted!` });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.listen(8000, () => console.log("Server is running on port 8000"));
