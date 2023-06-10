class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

const SESSION_TTL = 60 * 60 * 24;
const mapSession = ([username, socketID]) => {
  return { username, socketID };
};

export class RedisSessionStore extends SessionStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveSession(id, session) {
    this.redisClient
      .multi()
      .hmset(`session:${id}`, session)
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, "username", "socketID")
      .then(mapSession);
  }

  async findAllSessions() {
    const allSessionsKeys = [];
    let nextCursor = 0;
    do {
      const [cursor, keys] = await this.redisClient.scan(
        nextCursor,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );

      nextCursor = parseInt(cursor, 10);
      keys.forEach((key) => allSessionsKeys.push(key));
    } while (nextCursor !== 0);

    const allSessions = allSessionsKeys.map((sessionKey) => {
      return this.redisClient
        .hmget(sessionKey, "username", "socketID")
        .then(mapSession);
    });

    return Promise.all(allSessions);
  }

  deleteSession(id) {
    return this.redisClient.hdel(`session:${id}`, "username", "socketID");
  }
}

export default RedisSessionStore;
