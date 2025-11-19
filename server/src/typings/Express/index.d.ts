declare namespace Express {
  export interface User {
    _id: string;
    role: string;
    name?: string;
    email?: string;
  }

  export interface Request {
    user?: User;
  }
}
