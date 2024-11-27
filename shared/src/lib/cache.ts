import { createClient, RedisClientType } from 'redis';

export class CacheClient {
  private static instance: CacheClient;
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        port: 6379,
        host: 'redis',
      },
    });
  }

  public static getInstance(): CacheClient {
    if (!CacheClient.instance) {
      CacheClient.instance = new CacheClient();
    }
    return CacheClient.instance;
  }

  public async closeClient() {
    await this.client.quit();
  }

  public async startClient() {
    this.client.on('connect', (err) => {
      if (err) {
        console.log('Error while connecting to redis', err);
      } else {
        console.info('Redis successfully connected.');
      }
    });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    try {
      if (this.client.isOpen) return;
      await this.client.connect();
    } catch (e) {
      console.error('Failed to connect to redis', e);
    }
  }

  public async setObject(
    key: string,
    data: object | boolean | number
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(data));
  }

  public async destroyObject(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async getObject<T = any>(key: string): Promise<T | undefined> {
    const json = await this.client.get(key);
    if (json) {
      const data: T = JSON.parse(json);
      return data;
    }
    return undefined;
  }

  public async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) == 1;
  }
}
