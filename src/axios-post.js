const axios = require('axios');

async function postReq(identifiers) {
	const req = await axios.post('https:/fini.dev/api/v2/identities/match', {
		apikey: process.env.apikey,
		identifiers,
	});

	if (req.status != 200) throw 'Request to api failed';
	if (typeof req.data != 'object') throw 'API response failed to return object';
	if (req.data.success == false) throw `API request returned ${req.data.code}`;

	return req;
}

async function getReq(identifier) {
	const req = await axios.get(`https:/fini.dev/api/v2/ban?uid=${identifier}&apikey=${process.env.apikey}`);

	if (req.status != 200) throw 'Request to api failed';
	if (typeof req.data != 'object') throw 'API response failed to return object';
	if (req.data.success == false) throw `API request returned ${req.data.code}`;

	return req;
}

module.exports = {
	// discord_join: async (discordId) => {
	// 	let hasBannedAccount = false;
	// 	const dId = discordId;

	// 	// api reqs
	// 	const first_request = await postReq([{ type:'discord', value: dId }]);
	// 	if (typeof first_request.data.matches[0] == 'undefined') return [false, [], 'not-linked'];
	// 	// Found discord match so moving on, search for player accounts
	// 	const second_request = await postReq([{ type:'player', value: first_request.data.matches[0].id }]);
	// 	if (typeof second_request.data.matches[0] == 'undefined') return [false, [], first_request.data.matches[0].player_uid];
	// 	const player_matches = second_request.data.matches;
	// 	for (let i = 0; i < player_matches.length; i++) {
	// 		const player_uid = player_matches[i].player_uid;
	// 		try {
	// 			const next_request = await getReq(player_uid);
	// 			if (next_request.data.banned == true) hasBannedAccount = true;
	// 			continue;
	// 		}
	// 		// eslint-disable-next-line no-empty
	// 		catch (error) {
	// 			console.log(__filename, new Date(), error);
	// 			continue;
	// 		}
	// 	}
	// 	return [hasBannedAccount, second_request.data.matches, first_request.data.matches[0].player_uid];
	// },
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