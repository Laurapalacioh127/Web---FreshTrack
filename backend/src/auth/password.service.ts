import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordService {
  private derive(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, { N: 16384, r: 8, p: 5 }, (error, key) => {
        if (error) reject(error);
        else resolve(key);
      });
    });
  }

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const key = await this.derive(password, salt);
    return `scrypt$${salt}$${key.toString('hex')}`;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const [algorithm, salt, encoded, extra] = hash.split('$');
    if (
      algorithm !== 'scrypt' ||
      !/^[a-f0-9]{32}$/.test(salt ?? '') ||
      !/^[a-f0-9]{128}$/.test(encoded ?? '') ||
      extra !== undefined
    )
      return false;
    const key = await this.derive(password, salt);
    return timingSafeEqual(key, Buffer.from(encoded, 'hex'));
  }
}
