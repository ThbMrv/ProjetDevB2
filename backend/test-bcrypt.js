const bcrypt = require('bcrypt');

const hash = '$2b$10$71E4csFl4hzzCQpKQ4dckulqfvlUFk0vJu8SAXHMN38cGJNO8K3ta'; // depuis ta BDD
const plain = 'admin';

bcrypt.compare(plain, hash).then(res => {
  console.log('bcrypt.compare →', res);
});
