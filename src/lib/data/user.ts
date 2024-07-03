export interface GitHubData {
  id: number;
  name: string;
  accessToken: string;
}

export interface User {
  publicKey: string;
  github: GitHubData;
}
