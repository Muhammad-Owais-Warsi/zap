use curl::easy::Easy;

enum Method {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    HEAD,
    OPTIONS,
}

struct Headers {
    key: String,
    value: String,
    enabled: boolean,
}

struct Params {
    key: String,
    value: String,
    enabled: boolean,
}

struct Payload {
    method: Method,
    url: string,
    headers: Vec<Headers>,
    params: Vec<Params>,
}

// fn make_request(payload) {

// }
