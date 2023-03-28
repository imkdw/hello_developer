export interface JwtConfig {
  jwtSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}
