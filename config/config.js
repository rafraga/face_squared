module.exports = {
   "development": {
     "username": process.env.DB_USER,
     "password": process.env.DB_PASS,
     "database": "face_recognitionDB",
     "host": "127.0.0.1",
     "dialect": "mysql"
   },
  "test": {
    "username": "root",
    "password": "rafa",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.JAWS_USER,
    "password": process.env.JAWS_PASSWORD,
    "database": process.env.JAWS_DB,
    "host": process.env.DB_HOST,
    "port": "3306",
    "dialect": "mysql"
  }
}
