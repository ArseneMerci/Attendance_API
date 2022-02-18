import { hash, genSalt, compareSync } from 'bcrypt';

export const generate = async (password) => hash(password, await (0, genSalt)(10));
export const check = (hashedPassword, password) => compareSync(password, hashedPassword);
