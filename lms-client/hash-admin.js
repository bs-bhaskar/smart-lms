const bcrypt = require('bcryptjs');
bcrypt.hash('admin12345', 10).then(console.log);