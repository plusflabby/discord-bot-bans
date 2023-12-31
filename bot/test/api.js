export default class API {
    static #version = 2;
    static #https = true;
    static #base = String('://fini.dev/api');

    static async online() {
        var url = String(`${API.#https ? 'https' : 'http'}${API.#base}/${API.#version}`);
        var test = await fetch(url);
        console.log(this.name, 111, test.statusText);
        console.log(this.name, 222, test.statusText.toString() === String('Forbidden'));
        return test.statusText.toString() === String('Forbidden');
    }
}