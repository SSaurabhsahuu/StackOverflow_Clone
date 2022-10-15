export class User {
  constructor(
    public username: string,
    public token: string,
    public tokenExpirationDate: Number // public id: string,
  ) {}

  get token_() {
    // if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
    //   return null;
    // }

    return this.token;
  }
}
