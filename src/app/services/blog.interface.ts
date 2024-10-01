export interface IBlog {
  "id": string;
  "content": string;
  "createdAt": string;
  "likes": string;
  "user": IUser;
  "comments": IComment[];
}

export interface IComment {
  "id": string;
  "content": string;
  "createdAt": string;
  "likes": string;
  "user": IUser;
}

export interface IUser {
  email: string;
  password: string;
  image?: { [index:string]: string };
  username?: string;
}
