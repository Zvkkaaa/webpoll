/*
 * Purpose:
 * Author:
 * Created at:
 */
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/config.env" });

const express = require('express');
const app = express();
const path = require('path');
const fileupload = require("express-fileupload");
const webServer = require("./src/services/web-server");
const database = require("./src/services/database");

app.use('/upload', express.static('src/upload'));

async function startup() {
  try {
    await webServer.initialize(app);
    console.log("Вэб серверийг амжилттай асаалаа...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  try {
    await database.initialize();
    console.log("Өгөгдлийн сантай амжилттай холбогдлоо...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startup();

async function shutdown(e) {
  let err = e;

  try {
    console.log("Вэб серверийг унтраалаа...");
    await webServer.close();
  } catch (e) {
    console.error(e);
    err = err || e;
  }

  try {
    console.log("Өгөгдлийн сангийн холболт саллаа...");
    await database.close();
  } catch (e) {
    console.error(e);
    err = err || e;
  }

  console.log("Exiting process");

  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  shutdown();
});
process.on("SIGINT", () => {
  console.log("Received SIGINT");
  shutdown();
});
process.on("uncaughtException", (err) => {
  console.log("Алдаа гарлаа: " + err);
  shutdown(err);
});
