const { MongoClient, MongoServerError } = require('mongodb');

// Database Name
const dbName = 'flabbys_discord_bot';

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
module.exports = {
	setChannel: async (discordId, channelId) => {
		// Connection URL
		const url = process.env.MONGODB_URL;
		const client = new MongoClient(url);

		if (process.argv.indexOf('-err')) console.log('set-channel requested with', discordId, channelId);

		main(client, discordId, channelId)
			// .then(console.log)
			.catch(console.error)
			.finally(() => client.close());
	},
};
