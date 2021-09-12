const { Router } = require('express');
const router = Router();

const {
    getMembershipByEmail
} = require('./members.controller');

router.get('/:email', getMembershipByEmail);

module.exports = router;
