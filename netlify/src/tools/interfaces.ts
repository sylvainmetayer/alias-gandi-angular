interface ResponseInterface {
  statusCode: number;
  body: string;
}

interface RequestHeaders {
  [name: string]: string;
}

interface JSONWebTokenData {
  provider: string;
  logged: boolean;
  iat: number;
  exp: number;
}

export { ResponseInterface, RequestHeaders, JSONWebTokenData };
