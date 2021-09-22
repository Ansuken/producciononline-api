require('dotenv').config();
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;
const discordUsers = require('./api/discord/discord.router');
const members = require('./api/members/members.router');
const {checkIfUsersIsNotMembers} = require('./api/discord/discord.controller');

const PORT = process.env.PORT || 3050;
const app = express();

// Cron AT MIDNIGHT MONDAY '00 00 00 * * 1'
const job = new CronJob('00 00 00 * * 1', function() {
    console.log('Job triggered', new Date());
    checkIfUsersIsNotMembers();
});

app.use(bodyParser.json());
app.use(cors());
app.use('/api/discord-users', discordUsers);
app.use('/api/members', members);

app.listen(PORT, () => {
    job.start();
    console.log(`Server running on port ${PORT}`);
});