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

	async find(guildId, field) {
		await this.connect();
		try {
			const filteredDocs = await this.collection.find({ _id: guildId }).toArray();
			if (filteredDocs.length < 1) return 'empty arr';
			return filteredDocs[0][field];
		}
		catch (error) {
			if (error instanceof MongoServerError) {
				console.log(__filename, new Date(), `<MONGO> Error worth logging: ${error}`);
			}
			return error;
		}
	}
	async updateOne(discordId, recordToUpdateOrInsert) {
		await this.connect();
		try {
			await this.collection.insertOne({ _id: discordId, ...recordToUpdateOrInsert });
			return Promise.resolve();
		}
		catch (error) {
			if (error instanceof MongoServerError) {
				// Duplicate code so update exisiting record
				if (error.code == 11000) {
					await this.collection.updateOne({ _id: discordId }, { $set: recordToUpdateOrInsert });
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
	setRole: async (discordGuildId, roleId) => {
		const mongo = new MONGO();
		await mongo.updateOne(discordGuildId, { roleId: roleId });
		mongo.close();
		return;
	},
	getRole: async guildId => {
		const mongo = new MONGO();
		const roleId = await mongo.find(guildId, 'roleId');
		mongo.close();
		return roleId;
	},
	setChannel: async (discordGuildId, channelId) => {
		const mongo = new MONGO();
		await mongo.updateOne(discordGuildId, { channelId: channelId });
		mongo.close();
		return;
	},
	getChannel: async guildId => {
		const mongo = new MONGO();
		const channelId = await mongo.find(guildId, 'channelId');
		mongo.close();
		return channelId;
	},
};
