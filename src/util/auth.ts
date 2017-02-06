import { promisify } from 'bluebird';
import * as bcrypt from 'bcryptjs';

const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

const addBcryptType = (err: any) => {
  // Compensate for `bcrypt` not using identifiable error types
  err.type = 'bcryptError';
  throw err;
};

const createHash = async (plainText: string) => {
  try {
    const hash = await hashAsync(plainText, 10);
    return hash;
  } catch (error) {
    throw addBcryptType(error);
  }
};

const compareHash = async (plainText: string, hash: string) => {
  try {
    const isValid = await compareAsync(plainText, hash);
    return isValid;
  } catch (error) {
    throw addBcryptType(error);
  }
};

export default {
  createHash,
  compareHash,
};
