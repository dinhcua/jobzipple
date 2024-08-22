export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}
