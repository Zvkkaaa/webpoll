/*
 * Purpose:
 * Author:
 * Created at:
 */
const dotenv = require("dotenv");
// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./src/config/config.env" });

const fileupload = require("express-fileupload");
const webServer = require("./src/services/web-server");
const database = require("./src/services/database");

async function startup() {
  try {
    await webServer.initialize();
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
// fileupload();
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
