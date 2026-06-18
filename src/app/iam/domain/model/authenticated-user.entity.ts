export class AuthenticatedUser {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly fullName: string,
    public readonly token: string
  ) {}
}
