use curl::easy::{Easy, HttpVersion, List, SslVersion};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub enum Method {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    HEAD,
    OPTIONS,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "config")]
pub enum Auth {
    #[serde(rename = "no-auth")]
    None,
    #[serde(rename = "basic")]
    Basic(BasicAuthConfig),
    #[serde(rename = "bearer")]
    Bearer(BearerAuthConfig),
    #[serde(rename = "api-key")]
    ApiKey(ApiKeyAuthConfig),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BasicAuthConfig {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BearerAuthConfig {
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiKeyAuthConfig {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "content")]
pub enum Body {
    #[serde(rename = "none")]
    None,

    #[serde(rename = "raw")]
    Raw(String),

    #[serde(rename = "form-data")]
    FormData(Vec<KeyValuePair>),

    #[serde(rename = "x-www-form-urlencoded")]
    FormUrlEncodedData(Vec<KeyValuePair>),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct KeyValuePair {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkConfig {
    pub key: String,
    pub value: Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Headers {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Params {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum CookiesSameSite {
    Lax,
    Strict,
    None,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Cookie {
    pub key: String,
    pub value: String,
    pub domain: String,
    pub path: String,
    pub expires: Option<String>,
    pub secure: bool,
    #[serde(rename = "httpOnly")]
    pub http_only: bool,
    #[serde(rename = "sameSite")]
    pub same_site: CookiesSameSite,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Payload {
    pub method: Method,
    pub url: String,
    pub headers: Vec<Headers>,
    pub params: Vec<Params>,
    pub cookies: Vec<Cookie>,
    pub auth: Auth,
    pub body: Body,

    #[serde(rename = "networkConfig")]
    pub network_config: Vec<NetworkConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseHeader {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseCookie {
    pub name: String,
    pub value: String,
    pub domain: Option<String>,
    pub path: Option<String>,
    pub expires: Option<String>,
    pub max_age: Option<i64>,
    pub secure: bool,
    pub http_only: bool,
    pub same_site: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseTiming {
    pub total: f64,
    pub dns_lookup: f64,
    pub tcp_connect: f64,
    pub tls_handshake: f64,
    pub first_byte: f64,
    pub transfer: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HttpResponse {
    pub status_code: u32,
    pub status_text: String,
    pub headers: Vec<ResponseHeader>,
    pub cookies: Vec<ResponseCookie>,
    pub body: String,
    pub size: ResponseSize,
    pub timing: ResponseTiming,
    pub url: String,
    pub redirected: bool,
    pub redirect_count: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseSize {
    pub body: usize,
    pub headers: usize,
    pub total: usize,
}

#[tauri::command]
pub fn make_request(payload: Payload) -> Result<HttpResponse, String> {
    let start_time = Instant::now();
    let mut easy = Easy::new();

    println!("{:?}", payload);

    let mut url = payload.url.clone();

    if !payload.params.is_empty() {
        let qs: String = payload
            .params
            .iter()
            .map(|q| format!("{}={}", q.key, q.value))
            .collect::<Vec<String>>()
            .join("&");

        if url.contains("?") {
            url.push_str(&format!("&{}", qs));
        } else {
            url.push_str(&format!("?{}", qs));
        }
    }

    easy.url(&url).map_err(|e| e.to_string())?;

    easy.accept_encoding("gzip, deflate")
        .map_err(|e| e.to_string())?;

    match payload.method {
        Method::GET => {}
        Method::POST => {
            easy.post(true).map_err(|e| e.to_string())?;
        }
        Method::PUT => {
            easy.put(true).map_err(|e| e.to_string())?;
        }
        Method::PATCH => {
            easy.custom_request("PATCH").map_err(|e| e.to_string())?;
        }
        Method::DELETE => {
            easy.custom_request("DELETE").map_err(|e| e.to_string())?;
        }
        Method::OPTIONS => {
            easy.custom_request("OPTIONS").map_err(|e| e.to_string())?;
        }
        Method::HEAD => {
            easy.custom_request("HEAD").map_err(|e| e.to_string())?;
        }
    }

    let mut headers = List::new();
    for h in payload.headers {
        headers
            .append(&format!("{}: {}", h.key, h.value))
            .map_err(|e| e.to_string())?;
    }

    let cookie_string = payload
        .cookies
        .iter()
        .map(|c| format!("{}={}", c.key, c.value))
        .collect::<Vec<String>>()
        .join("; ");

    if !cookie_string.is_empty() {
        headers
            .append(&format!("Cookie: {}", cookie_string))
            .map_err(|e| e.to_string())?;
    }
    easy.http_headers(headers).map_err(|e| e.to_string())?;

    match payload.body {
        Body::None => {}
        Body::Raw(data) => {
            easy.post_fields_copy(data.as_bytes())
                .map_err(|e| e.to_string())?;
        }
        Body::FormData(data) => {
            let fd = data
                .iter()
                .map(|f| format!("{}={}", f.key, f.value))
                .collect::<Vec<String>>()
                .join("&");
            easy.post_fields_copy(fd.as_bytes())
                .map_err(|e| e.to_string())?;
        }
        Body::FormUrlEncodedData(data) => {
            let fud = data
                .iter()
                .map(|fu| format!("{}={}", fu.key, fu.value))
                .collect::<Vec<String>>()
                .join("&");
            easy.post_fields_copy(fud.as_bytes())
                .map_err(|e| e.to_string())?;
        }
    }

    match payload.auth {
        Auth::None => {}
        Auth::Basic(data) => {
            easy.username(&data.username).map_err(|e| e.to_string())?;
            easy.password(&data.password).map_err(|e| e.to_string())?;
        }
        Auth::Bearer(cfg) => {
            let mut auth_headers = List::new();
            auth_headers
                .append(&format!("Authorization: Bearer {}", cfg.token))
                .map_err(|e| e.to_string())?;
            easy.http_headers(auth_headers).map_err(|e| e.to_string())?;
        }
        Auth::ApiKey(cfg) => {
            let mut auth_headers = List::new();
            auth_headers
                .append(&format!("{}: {}", cfg.key, cfg.value))
                .map_err(|e| e.to_string())?;
            easy.http_headers(auth_headers).map_err(|e| e.to_string())?;
        }
    }

    for net in &payload.network_config {
        match net.key.as_str() {
            "httpVersion" => {
                if let Some(version) = net.value.as_str() {
                    match version {
                        "1.0" => {
                            easy.http_version(HttpVersion::V10)
                                .map_err(|e| e.to_string())?;
                        }
                        "1.1" => {
                            easy.http_version(HttpVersion::V11)
                                .map_err(|e| e.to_string())?;
                        }
                        "2.0" => {
                            easy.http_version(HttpVersion::V2)
                                .map_err(|e| e.to_string())?;
                        }
                        _ => {}
                    }
                }
            }
            "sslVerify" => {
                if let Some(verify) = net.value.as_bool() {
                    easy.ssl_verify_host(verify).map_err(|e| e.to_string())?;
                    easy.ssl_verify_peer(verify).map_err(|e| e.to_string())?;
                }
            }
            "sslVersion" => {
                if let Some(version) = net.value.as_str() {
                    match version {
                        "TLSv1.0" => {
                            easy.ssl_version(SslVersion::Tlsv1)
                                .map_err(|e| e.to_string())?;
                        }
                        "TLSv1.1" => {
                            easy.ssl_version(SslVersion::Tlsv11)
                                .map_err(|e| e.to_string())?;
                        }
                        "TLSv1.2" => {
                            easy.ssl_version(SslVersion::Tlsv12)
                                .map_err(|e| e.to_string())?;
                        }
                        "TLSv1.3" => {
                            easy.ssl_version(SslVersion::Tlsv13)
                                .map_err(|e| e.to_string())?;
                        }
                        _ => {}
                    }
                }
            }
            "followRedirects" => {
                if let Some(follow) = net.value.as_bool() {
                    easy.follow_location(follow).map_err(|e| e.to_string())?;
                }
            }
            "maxRedirects" => {
                if let Some(max) = net.value.as_i64() {
                    easy.max_redirections(max as u32)
                        .map_err(|e| e.to_string())?;
                }
            }
            "followAuthHeader" => {
                if let Some(follow_auth) = net.value.as_bool() {
                    easy.unrestricted_auth(follow_auth)
                        .map_err(|e| e.to_string())?;
                }
            }
            "strictHttpParser" => {
                if let Some(strict) = net.value.as_bool() {
                    easy.http_09_allowed(!strict).map_err(|e| e.to_string())?;
                }
            }
            _ => {}
        }
    }

    let mut response_data = Vec::new();
    let mut response_headers = Vec::new();

    {
        let mut transfer = easy.transfer();

        transfer
            .write_function(|data| {
                response_data.extend_from_slice(data);
                Ok(data.len())
            })
            .map_err(|e| e.to_string())?;

        transfer
            .header_function(|header| {
                if let Ok(header_str) = std::str::from_utf8(header) {
                    response_headers.push(header_str.trim().to_string());
                }
                true
            })
            .map_err(|e| e.to_string())?;

        transfer.perform().map_err(|e| e.to_string())?;
    }

    let total_time = start_time.elapsed();

    let status_code = easy.response_code().map_err(|e| e.to_string())?;
    let final_url = easy
        .effective_url()
        .map_err(|e| e.to_string())?
        .unwrap_or(&url)
        .to_string();
    let redirect_count = easy.redirect_count().map_err(|e| e.to_string())?;

    let body = String::from_utf8_lossy(&response_data).to_string();

    let parsed_headers = parse_response_headers(&response_headers);
    let parsed_cookies = parse_response_cookies(&response_headers);

    let status_text = match status_code {
        200 => "OK",
        201 => "Created",
        204 => "No Content",
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        500 => "Internal Server Error",
        _ => "Unknown",
    }
    .to_string();

    let timing = ResponseTiming {
        total: total_time.as_secs_f64() * 1000.0,
        dns_lookup: easy
            .namelookup_time()
            .map_err(|e| e.to_string())?
            .as_secs_f64()
            * 1000.0,
        tcp_connect: easy
            .connect_time()
            .map_err(|e| e.to_string())?
            .as_secs_f64()
            * 1000.0,
        tls_handshake: easy
            .appconnect_time()
            .map_err(|e| e.to_string())?
            .as_secs_f64()
            * 1000.0,
        first_byte: easy
            .starttransfer_time()
            .map_err(|e| e.to_string())?
            .as_secs_f64()
            * 1000.0,
        transfer: (total_time.as_secs_f64()
            - easy
                .starttransfer_time()
                .map_err(|e| e.to_string())?
                .as_secs_f64())
            * 1000.0,
    };

    let header_size = response_headers.iter().map(|h| h.len()).sum::<usize>();

    let response = HttpResponse {
        status_code,
        status_text,
        headers: parsed_headers,
        cookies: parsed_cookies,
        body,
        size: ResponseSize {
            body: response_data.len(),
            headers: header_size,
            total: response_data.len() + header_size,
        },
        timing,
        url: final_url,
        redirected: redirect_count > 0,
        redirect_count,
    };

    println!("=== RESPONSE COMPLETE ===");
    println!("{:#?}", response);

    Ok(response)
}

fn parse_response_headers(raw_headers: &[String]) -> Vec<ResponseHeader> {
    let mut headers = Vec::new();

    for header_line in raw_headers {
        if header_line.contains(":") && !header_line.starts_with("HTTP/") {
            if let Some((key, value)) = header_line.split_once(":") {
                headers.push(ResponseHeader {
                    key: key.trim().to_string(),
                    value: value.trim().to_string(),
                });
            }
        }
    }

    headers
}

fn parse_response_cookies(raw_headers: &[String]) -> Vec<ResponseCookie> {
    let mut cookies = Vec::new();

    for header_line in raw_headers {
        if header_line.to_lowercase().starts_with("set-cookie:") {
            if let Some(cookie_value) = header_line.split_once(":") {
                let cookie_str = cookie_value.1.trim();
                let cookie = parse_single_cookie(cookie_str);
                cookies.push(cookie);
            }
        }
    }

    cookies
}

fn parse_single_cookie(cookie_str: &str) -> ResponseCookie {
    let parts: Vec<&str> = cookie_str.split(';').collect();
    let mut cookie = ResponseCookie {
        name: String::new(),
        value: String::new(),
        domain: None,
        path: None,
        expires: None,
        max_age: None,
        secure: false,
        http_only: false,
        same_site: None,
    };

    for (i, part) in parts.iter().enumerate() {
        let part = part.trim();
        if i == 0 {
            if let Some((name, value)) = part.split_once('=') {
                cookie.name = name.trim().to_string();
                cookie.value = value.trim().to_string();
            }
        } else {
            let lower_part = part.to_lowercase();
            if lower_part == "secure" {
                cookie.secure = true;
            } else if lower_part == "httponly" {
                cookie.http_only = true;
            } else if let Some((key, value)) = part.split_once('=') {
                let key = key.trim().to_lowercase();
                let value = value.trim();
                match key.as_str() {
                    "domain" => cookie.domain = Some(value.to_string()),
                    "path" => cookie.path = Some(value.to_string()),
                    "expires" => cookie.expires = Some(value.to_string()),
                    "max-age" => cookie.max_age = value.parse().ok(),
                    "samesite" => cookie.same_site = Some(value.to_string()),
                    _ => {}
                }
            }
        }
    }

    cookie
}
