const axios = require('axios');

async function postReq(identifiers) {
	const req_start = new Date();
	const req = await axios.post('https:/fini.dev/api/v2/identities/match', {
		apikey: process.env.apikey,
		identifiers,
	});
	if (process.argv.indexOf('-err') > -1) console.log(__filename, new Date(), `--- API request for id: ${identifiers[0].value} took ${parseFloat((new Date() - req_start) / 1000)}ms ---`);

	if (req.status != 200) throw 'Request to api failed';
	if (typeof req.data != 'object') throw 'API response failed to return object';
	if (req.data.success == false) throw `API request returned ${req.data.code}`;

	return req;
}

async function getReq(identifier) {
	const req_start = new Date();
	const req = await axios.get(`https:/fini.dev/api/v2/ban?uid=${identifier}&apikey=${process.env.apikey}`);
	if (process.argv.indexOf('-err') > -1) console.log(__filename, new Date(), `--- API request for id: ${identifier} took ${parseFloat((new Date() - req_start) / 1000)}ms ---`);

	if (req.status != 200) throw 'Request to api failed';
	if (typeof req.data != 'object') throw 'API response failed to return object';
	if (req.data.success == false) throw `API request returned ${req.data.code}`;

	return req;
}

module.exports = {
	discord_join: async (discordId) => {
		const api_req = await postReq([{ type:'discord', value: discordId }]);
		if (typeof api_req.data.matches[0] == 'undefined') return { isBanned: false, player_uid: 'not-linked', id: -1 };
		else return { isBanned: api_req.data.matches[0].global_banned, player_uid: api_req.data.matches[0].player_uid, id: api_req.data.matches[0].id };
	},
	alt_accounts: async id => {
		const api_req = await postReq([{ type:'player', value: id }]);
		if (typeof api_req.data.matches[0] == 'undefined') return [];
		return api_req.data.matches;
	},
	check_if_banned: async player_uid => {
		const api_req = await getReq(player_uid);
		return api_req.data;
	},
};