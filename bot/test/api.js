//! Test fini.ac api response / flabby's "fivem identity"

class api {
    url;
    //body;

    constructor(
        params,
        //body
    ){
        this.url = `https:/fini.dev/api/v2${params}&apikey=${process.env.apikey}`;
        //this.body = body.toString();
    };
};

const make = new api(
    '/identities/match?uid=1029384765',
    //Object.create()
);

const request_api = await fetch(URL.createObjectURL(make.url));

const response_match_this; //! Fill in !//

return request_api === response_match_this;