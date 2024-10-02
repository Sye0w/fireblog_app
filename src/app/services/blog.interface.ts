export interface IBlog {
  "id"?: string;
  "content": string;
  "createdAt": string;
  "likes": string;
  "user": IUser;
  "authorId": string;
  "comments": IComment[];
}

export interface IComment {
  "id"?: string;
  "content": string;
  "createdAt": string;
  "likes": string;
  "user": IUser;
}

export interface IUser {
  email: string;
  password: string;
  image?: | string
  username?: string;
  uid: any
}
