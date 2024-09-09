import { connections } from 'src/main';
import { Tmduser } from 'src/models/tmduser';
import { DataSource } from 'typeorm';

export async function getAuth(id: number): Promise<Auth> {
  const conn = new DataSource({
    type: 'mysql',
    // options: { useUTC: true },
    // requestTimeout: 300000,
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'pos-app',
    entities: [Tmduser],
  });

  await conn.initialize();
  const userData: UserData = await conn.manager
    .getRepository(Tmduser)
    .createQueryBuilder('tmduser')
    .where('tmduser.userId = :id', { id })
    .getOne();

  connections.set(conn.name, conn);
  return new Auth(conn, userData);
}

export class Auth {
  conn: DataSource;
  userData: UserData;

  constructor(conn: DataSource, userData: UserData) {
    this.conn = conn;
    this.userData = userData;
  }
}

export class UserData {
  username: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
  role: number;
  userId: number;
}
