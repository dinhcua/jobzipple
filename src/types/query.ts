import mongoose from 'mongoose';

export type TQuery = {
  pageSize: number;
  current: number;
  sort: string;
  populate?: string;
  fields?: string;
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

export interface TResumeQuery extends TQuery {}

export interface TPermissionQuery extends TQuery {
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

export interface TRoleQuery extends TQuery {
  name: string;
}

export interface TSubscriberQuery extends TQuery {
  email: string;
}
