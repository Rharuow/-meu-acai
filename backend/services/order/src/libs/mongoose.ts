import mongoose from "mongoose";

//  methods to make connection to MongoDB
async function connection() {
  try {
    mongoose.set("strictQuery", true);
    return await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${
        process.env.MONGODB_PASSWORD
      }@cluster0.d43yt8b.mongodb.net/${
        process.env.NODE_ENV === "test" ||
        process.env.NODE_ENV === "development"
          ? process.env.MONGODB_DB_TEST
          : process.env.MONGODB_DB
      }?retryWrites=true&w=majority`
    );
  } catch (error: any) {
    throw new Error(`error to connect mongoose : ${error.message}`);
  }
}

export { connection };
