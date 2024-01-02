module.exports = class API {
    static #version = 2;
    static #https = true;
    static #base = String('://fini.dev/api');

    static #URL = () => {
        return String(`${API.#https ? 'https' : 'http'}${API.#base}/${API.#version}`);
    }

    static async online() {
        var test = await fetch(this.#URL());
        return String('API :: online() ?? ') + String(test.statusText.toString() === String('Forbidden'));
    }

    static async indentities() {
        var req = await fetch(
            `${this.#URL()}/identities/match`,
            {
                method: 'POST',
                body: {
                    "apikey": process.argv.apikey,
                    "identifiers": [
                        {
                            "type": "discord",
                            "value": "149190022694830080"
                        }
                    ]
                }
            }
        )
        return String('API :: indentities() ?? ') + String(req.statusText.toString() + String(req.body));
    }
}