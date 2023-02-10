import app from "./app";

const startApp = async () => {
  try {
    console.log("TypeORM initialize Complete");

    app.listen(app.get("port"), () => {
      console.log("Server Listening on 5000");
    });
  } catch (err: any) {
    console.error("Typeorm Error : ", err.message);
  }
};

startApp();
