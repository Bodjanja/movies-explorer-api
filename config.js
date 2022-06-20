const { PORT = 3001, MONGO_DB_ADRESS = 'mongodb://localhost:27017/moviesdb', JWT_SECRET = 'JWT_SECRET' } = process.env;
module.exports = {
  PORT,
  MONGO_DB_ADRESS,
  JWT_SECRET,
};
