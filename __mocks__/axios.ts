export default {
  get: jest.fn().mockResolvedValue(),
  post: jest.fn().mockResolvedValue(),
  patch: jest.fn().mockResolvedValue(),
  delete: jest.fn().mockResolvedValue(),
  defaults: {}
};