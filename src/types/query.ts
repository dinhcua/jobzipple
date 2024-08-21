import mongoose from 'mongoose';

export type TQuery = {
  pageSize: number;
  current: number;
  sort: string;
};

export interface TCompanyQuery extends TQuery {
  name: string;
  address: string;
}

export interface TUserQuery extends TQuery {
  name: string;
  address: string;
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  email: string;
  role: string;
}

export interface TJobQuery extends TQuery {}

export interface TResumeQuery extends TQuery {
  populate?: string;
}
