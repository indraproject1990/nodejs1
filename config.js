// module.exports = {
//     'secret': 1234567
// };

var express = require('express');
var router = express.Router();

router.set('secret',1234567);

module.exports = router;