// import Redis from 'ioredis';
//
// const redis = new Redis();
//
// async function setCache(key: string, value: any, expiration: number) {
//     await redis.set(key, JSON.stringify(value), 'EX', expiration);
// }
//
// async function getCache(key: string) {
//     const cachedValue = await redis.get(key);
//     return cachedValue ? JSON.parse(cachedValue) : null;
// }