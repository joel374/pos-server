import { connections } from 'src/main';
import { Tdtransaction } from 'src/models/tdtransaction';
import { Tdtransactiondetail } from 'src/models/tdtransactiondetail';
import { Tmdproduct } from 'src/models/tmdproduct';
import { Tmduser } from 'src/models/tmduser';
import { Connection } from 'typeorm';

export async function getAuth(id: number): Promise<Auth> {
  const conn = new Connection({
    type: 'mysql',
    // options: { useUTC: true },
    // requestTimeout: 300000,
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'pos-app',
    entities: [Tmduser, Tmdproduct, Tdtransaction, Tdtransactiondetail],
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
  conn: Connection;
  userData: UserData;

  constructor(conn: Connection, userData: UserData) {
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
