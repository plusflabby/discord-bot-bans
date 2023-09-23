const { MongoClient, MongoServerError } = require('mongodb');

class MONGO {
	#databaseName = 'flabbys_discord_bot';
	#client;
	#collection;
	#connected = false;

	constructor() {
		this.client = new MongoClient(process.env.MONGODB_URL);
	}

	async connect() {
		if (this.connected) return true;
		await this.client.connect();
		this.collection = this.client.db(this.databaseName).collection('channels');
		this.connected = true;
		return true;
	}

	async find(guildId) {
		await this.connect();
		try {
			const filteredDocs = await this.collection.find({ _id: guildId }).toArray();
			if (filteredDocs.length < 1) return 'empty arr';
			return filteredDocs[0].channelId;
		}
		catch (error) {
			if (error instanceof MongoServerError) {
				console.log(__filename, new Date(), `<MONGO> Error worth logging: ${error}`);
			}
			return error;
		}
	}
	async updateOne(discordId, channelId) {
		await this.connect();
		try {
			await this.collection.insertOne({ _id: discordId, channelId: String(channelId) });
			return Promise.resolve();
		}
		catch (error) {
			if (error instanceof MongoServerError) {
				// Duplicate code so update exisiting record
				if (error.code == 11000) {
					await this.collection.updateOne({ _id: discordId }, { $set: { channelId: channelId } });
					return Promise.resolve();
				}
				else {
					console.log(__filename, new Date(), `Error worth logging: ${error}`);
				}
			}
			return error;
		}
	}

	close() {
		this.client.close();
	}
}

module.exports = {
	setChannel: async (discordId, channelId) => {
		const mongo = new MONGO();
		await mongo.updateOne(discordId, channelId);
		mongo.close();
		return;

	},
	getChannel: async guildId => {
		const mongo = new MONGO();
		const channelId = await mongo.find(guildId);
		mongo.close();
		return channelId;
	},
};
