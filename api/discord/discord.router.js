const { Router } = require('express');
const router = Router();

const { 
    connectAPI,
    getInactiveDiscordUsers,
    getDeletedDiscordUsers,
    deleteUserByEmail,
    getDiscordUsers,
    getDiscordUserByID,
    getDiscordUserByEmail,
    createDiscordUser,
    updateDiscordUser,
    deleteDiscordUser
} = require('./discord.controller');

router.get('/health', connectAPI);
router.get('/inactive', getInactiveDiscordUsers);
router.get('/deleted', getDeletedDiscordUsers);
router.get('/delete/:email', deleteUserByEmail);
router.get('/', getDiscordUsers);
router.get('/:id', getDiscordUserByID);
router.get('/email/:email', getDiscordUserByEmail);
router.post('/', createDiscordUser);
router.put('/:id', updateDiscordUser);
router.delete('/:id', deleteDiscordUser);

module.exports = router;
