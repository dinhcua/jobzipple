import mongoose from 'mongoose';

export const INIT_PERMISSIONS = [
  // Users module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/users',
    method: 'GET',
    module: 'USERS',
    name: 'Get all users',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/users',
    method: 'POST',
    module: 'USERS',
    name: 'Create a user',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/users/:id',
    method: 'GET',
    module: 'USERS',
    name: 'Get a user',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/users/:id',
    method: 'PUT',
    module: 'USERS',
    name: 'Update a user',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/users/:id',
    method: 'DELETE',
    module: 'USERS',
    name: 'Delete a user',
  },
  // Companies module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/companies',
    method: 'GET',
    module: 'COMPANIES',
    name: 'Get all companies',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/companies',
    method: 'POST',
    module: 'COMPANIES',
    name: 'Create a company',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/companies/:id',
    method: 'GET',
    module: 'COMPANIES',
    name: 'Get a company',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/companies/:id',
    method: 'PUT',
    module: 'COMPANIES',
    name: 'Update a company',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/companies/:id',
    method: 'DELETE',
    module: 'COMPANIES',
    name: 'Delete a company',
  },
  // Jobs module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/jobs',
    method: 'GET',
    module: 'JOBS',
    name: 'Get all jobs',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/jobs',
    method: 'POST',
    module: 'JOBS',
    name: 'Create a job',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/jobs/:id',
    method: 'GET',
    module: 'JOBS',
    name: 'Get a job',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/jobs/:id',
    method: 'PUT',
    module: 'JOBS',
    name: 'Update a job',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/jobs/:id',
    method: 'DELETE',
    module: 'JOBS',
    name: 'Delete a job',
  },
  // Resumes module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/resumes',
    method: 'GET',
    module: 'RESUMES',
    name: 'Get all resumes',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/resumes',
    method: 'POST',
    module: 'RESUMES',
    name: 'Create a resume',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/resumes/:id',
    method: 'GET',
    module: 'RESUMES',
    name: 'Get a resume',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/resumes/:id',
    method: 'PUT',
    module: 'RESUMES',
    name: 'Update a resume',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/resumes/:id',
    method: 'DELETE',
    module: 'RESUMES',
    name: 'Delete a resume',
  },
  // Roles module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/roles',
    method: 'GET',
    module: 'ROLES',
    name: 'Get all roles',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/roles',
    method: 'POST',
    module: 'ROLES',
    name: 'Create a role',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/roles/:id',
    method: 'GET',
    module: 'ROLES',
    name: 'Get a role',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/roles/:id',
    method: 'PUT',
    module: 'ROLES',
    name: 'Update a role',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/roles/:id',
    method: 'DELETE',
    module: 'ROLES',
    name: 'Delete a role',
  },
  // Permissions module
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/permissions',
    method: 'GET',
    module: 'PERMISSIONS',
    name: 'Get all permissions',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/permissions',
    method: 'POST',
    module: 'PERMISSIONS',
    name: 'Create a permission',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/permissions/:id',
    method: 'GET',
    module: 'PERMISSIONS',
    name: 'Get a permission',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/permissions/:id',
    method: 'PUT',
    module: 'PERMISSIONS',
    name: 'Update a permission',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    apiPath: '/api/v1/permissions/:id',
    method: 'DELETE',
    module: 'PERMISSIONS',
    name: 'Delete a permission',
  },
];

export const ADMIN_ROLE = 'SUPER ADMIN';
export const USER_ROLE = 'NORMAL USER';
