const { MongoClient, MongoServerError } = require('mongodb');

// Database Name
const dbName = 'flabbys_discord_bot';
// Connection URL
const url = process.env.MONGODB_URL;

async function main(client, discordId, channelId) {
	await client.connect();
	// console.log('Connected successfully to server');
	const db = client.db(dbName);

	const collection = db.collection('channels');

	try {
		await collection.insertOne({ _id: discordId, channelId: String(channelId) });
	}
	catch (error) {
		if (error instanceof MongoServerError) {
			// DUplicate error code so update exisiting record
			if (error.code == 11000) {
				await collection.updateOne({ _id: discordId }, { $set: { channelId: channelId } });
				return 'done.';
			}
			else {
				console.log(`Error worth logging: ${error}`);
			}
		}
		throw error;
	}

	return 'done.';
}

async function secondary(client, guildId) {
	await client.connect();
	const db = client.db(dbName);
	const collection = db.collection('channels');

	try {
		const filteredDocs = await collection.find({ _id: guildId }).toArray();
		if (filteredDocs.length < 1) return 'empty arr';
		return filteredDocs[0].channelId;
	}
	catch (error) {
		if (error instanceof MongoServerError) {
			console.log(`Error worth logging: ${error}`);
		}
		throw error;
	}
}

module.exports = {
	setChannel: async (discordId, channelId) => {
		const client = new MongoClient(url);

		if (process.argv.indexOf('-err')) console.log('set-channel requested with', discordId, channelId);

		main(client, discordId, channelId)
			.catch(console.error)
			.finally(() => client.close());
	},
	getChannel: async guildId => {
		const client = new MongoClient(url);

		try {
			const att = await secondary(client, guildId);
			client.close();
			return att;
		}
		catch (error) {
			console.log(error);
			client.close();
		}
	},
};
