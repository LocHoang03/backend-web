const connectDb = require('./configs/configdb');
const fs = require('fs');
const path = require('path');
const User = require('./models/user');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

connectDb();

const user = JSON.parse(
  fs.readFileSync(path.join(__dirname, './assets/user.json')),
);
console.log(user);

const ImportData = async () => {
  try {
    for (let i = 0; i < user.length; i++) {
      await User.create({
        firstName: user[i].firstName,
        lastName: user[i].lastName,
        email: user[i].email,
        phoneNumber: user[i].phoneNumber,
        sex: user[i].sex,
        password: user[i].password,
        role: user[i].role,
        createAt: Date.now(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// const Import = async () => {
//   try {
//     await Category.create(category);
//   } catch (error) {
//     console.log(error);
//   }
// };

if (process.argv[2] === '-i') {
  ImportData();
  console.log('Data imported');
}
if (process.argv[2] === '-d') {
  DeleteData();
  console.log('Data deleted');
}
