module.exports = class API {
    static #version = 2;
    static #https = true;
    static #base = String('://fini.dev/api');

    static #URL = () => {
        return String(`${API.#https ? 'https' : 'http'}${API.#base}/v${API.#version}`);
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "apikey": String(process.argv[2]).split('=')[1],
                    "identifiers": [
                        {
                            "type": "discord",
                            "value": "149190022694830080"
                        }
                    ]
                })
            }
        ).then(res => res.json())
        console.log(req)
        console.log(req['success'])
        return String('API :: indentities() ?? ') + String(req.statusText.toString() + String(req));
    }
}