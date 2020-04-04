import { verify, decode, sign } from 'jsonwebtoken';
import { JSONWebTokenData } from './interfaces';
import { loadEnv } from './functions';

loadEnv();

const getSecret = (): string => {
  return process.env.JWT_SECRET as string;
};

export class TokenFactory {
  static create(logged: boolean, providerName: string, expireIn: string = '1h') {
    const token = sign({ logged, provider: providerName }, getSecret(), { expiresIn: expireIn });
    return new Token(token);
  }
}

export class Token {
  constructor(value: string) {
    this.value = value;

    try {
      this.data = decode(this.value as string) as JSONWebTokenData;
    } catch (err) {
      this.data = {
        exp: 0,
        iat: 0,
        logged: false,
        provider: 'none'
      };
      console.error(err);
    }
  }

  private value: string | null;
  private data: JSONWebTokenData;

  isValid(): boolean {
    if (this.value === null) {
      return false;
    }
    try {
      verify(this.value, getSecret());
    } catch (errors) {
      console.error(errors);
      return false;
    }
    return true;
  }

  getProviderName(): string | null {
    if (!this.isValid()) {
      return null;
    }
    return this.data.provider;
  }

  toJWT(): string {
    return JSON.stringify({
      access_token: this.value,
      token_type: 'JWT',
      expires_in: this.data.exp - this.data.iat
    });
  }

}
