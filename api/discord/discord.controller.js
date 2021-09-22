const { response } = require('express');
const connection = require('../../config/database');
const {getMembershipByID} = require('../members/members.controller');

const getIfUserIsMember = async (params) => {
    console.log(new Date(), ' ***************** Check ' + params.email + ' has Subscription');
    const product = await getMembershipByID(params.id);
    return product;
}

const setUserToInactive = (email, end_date) => {
    const sql = `UPDATE discord_users SET active='0', membership_enddate = '${end_date}' WHERE email='${email}'`;
    connection.query(sql);
}

const serUserToActive = (email) => {
    const sql = `UPDATE discord_users SET active='1', membership_enddate = ${null} WHERE email='${email}'`;
    connection.query(sql);
}

module.exports = {
    // Routes
    connectAPI: (req, res) => {
        res.json('Status OK');
    },
    checkIfUsersIsNotMembers: () => {
        const sql = 'SELECT * FROM discord_users WHERE deleted = 0';
        connection.query(sql, (err, results) => {
            let interval;
            let cont = 0;
            let total;
            if ( results.length > 0 ) {
                total = results.length;
                interval = setInterval(function() {
                    const user = results[cont];
                    const params = { id: user.website_id, email: user.email };
                    cont++;
                    getIfUserIsMember(params).then((result) => {
                        if ( result.length === 0 || ( result.length > 0 && result[0].status === 'cancelled' && user.active === 1 ) ) {
                            setUserToInactive(user.email, result[0] ? result[0].end_date : new Date().toISOString().slice(0, 19).replace('T', ' '));
                        } else if ( result.length > 0 && user.active === 0 && result[0].status === 'active' ) {
                            serUserToActive(user.email);
                        }
                    });
                    if ( cont === total ) {
                        clearInterval(interval);
                    }
                }, 5000);
            }
        });
    },
    getInactiveDiscordUsers: (req, res) => {
        const sql = 'SELECT * FROM discord_users WHERE active = 0 AND deleted = 0';
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    getDeletedDiscordUsers: (req, res) => {
        const sql = 'SELECT * FROM discord_users WHERE deleted = 1';
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    deleteUserByEmail: (req, res) => {
        const {email} = req.params;
        const sql = `UPDATE discord_users SET deleted='1' WHERE email='${email}' AND active = 0`;
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    getDiscordUsers: (req, res) => {
        const sql = 'SELECT * FROM discord_users';
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    getDiscordUserByID: (req, res)=> {
        const {id} = req.params;
        const sql = 'SELECT * FROM discord_users WHERE id = ' + id;
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    getDiscordUserByEmail: (req, res)=> {
        const {email} = req.params;
        const sql = 'SELECT * FROM discord_users WHERE email = "' + email + '" AND active = 1';
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    createDiscordUser: (req, res)=> {
        const sql = 'INSERT INTO discord_users SET ?';
        const userObj = {
            discord_username: req.body.discord_username,
            discord_id: req.body.discord_id,
            website_id: req.body.website_id,
            email: req.body.email,
            signup_discord_date: new Date(),
            membership_startdate: req.body.membership_startdate,
            active: req.body.active,
            deleted: req.body.deleted
        }
        connection.query(sql, userObj, (err, results) => {
            if ( err ) throw err;
            res.json({
                status: 'OK'
            });
        });
    },
    updateDiscordUser: (req, res)=> {
        const {id} = req.params;
        const {username, email, active} = req.body;
        const sql = `UPDATE discord_users SET discord_username='${username}', email='${email}', active='${active}' WHERE id=${id}`;
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    },
    deleteDiscordUser: (req, res) => {
        const {id} = req.params;
        const sql = `DELETE FROM discord_users WHERE id=${id}`;
        connection.query(sql, (err, results) => {
            if ( err ) throw err;
            res.json(results);
        });
    }
}