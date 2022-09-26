export class User {
  constructor(
    public username: string,
    private token: string // public id: string,
  ) // private _tokenExpirationDate: Date
  {}

  get token_() {
    // if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
    //   return null;
    // }

    return this.token;
  }
}
