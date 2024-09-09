import { Connection, createConnection, getConnection } from 'typeorm';

export const changeUpperEntities = (connection: Connection) => {
  if (connection.options.type === 'oracle') {
    for (let i = 0; i < connection.entityMetadatas.length; i++) {
      connection.entityMetadatas[i].tableMetadataArgs.name = connection.entityMetadatas[i].tableMetadataArgs.name
        ? connection.entityMetadatas[i].tableMetadataArgs.name.toUpperCase()
        : connection.entityMetadatas[i].tableMetadataArgs.name;
      connection.entityMetadatas[i].givenTableName = connection.entityMetadatas[i].givenTableName
        ? connection.entityMetadatas[i].givenTableName.toUpperCase()
        : connection.entityMetadatas[i].givenTableName;
      connection.entityMetadatas[i].tableNameWithoutPrefix = connection.entityMetadatas[i].tableNameWithoutPrefix
        ? connection.entityMetadatas[i].tableNameWithoutPrefix.toUpperCase()
        : connection.entityMetadatas[i].tableNameWithoutPrefix;
      connection.entityMetadatas[i].tableName = connection.entityMetadatas[i].tableName
        ? connection.entityMetadatas[i].tableName.toUpperCase()
        : connection.entityMetadatas[i].tableName;
      connection.entityMetadatas[i].tablePath = connection.entityMetadatas[i].tablePath
        ? connection.entityMetadatas[i].tablePath.toUpperCase()
        : connection.entityMetadatas[i].tablePath;

      for (let j = 0; j < connection.entityMetadatas[i].ownColumns.length; j++) {
        connection.entityMetadatas[i].ownColumns[j].givenDatabaseName = connection.entityMetadatas[i].ownColumns[j]
          .givenDatabaseName
          ? connection.entityMetadatas[i].ownColumns[j].givenDatabaseName.toUpperCase()
          : connection.entityMetadatas[i].ownColumns[j].givenDatabaseName;
        connection.entityMetadatas[i].ownColumns[j].databaseName = connection.entityMetadatas[i].ownColumns[j]
          .databaseName
          ? connection.entityMetadatas[i].ownColumns[j].databaseName.toUpperCase()
          : connection.entityMetadatas[i].ownColumns[j].databaseName;
        connection.entityMetadatas[i].ownColumns[j].databasePath = connection.entityMetadatas[i].ownColumns[j]
          .databasePath
          ? connection.entityMetadatas[i].ownColumns[j].databasePath.toUpperCase()
          : connection.entityMetadatas[i].ownColumns[j].databasePath;
        connection.entityMetadatas[i].ownColumns[j].databaseNameWithoutPrefixes = connection.entityMetadatas[i]
          .ownColumns[j].databaseNameWithoutPrefixes
          ? connection.entityMetadatas[i].ownColumns[j].databaseNameWithoutPrefixes.toUpperCase()
          : connection.entityMetadatas[i].ownColumns[j].databaseNameWithoutPrefixes;
      }
    }
  }

  return connection;
};
let claimConn = null;
export async function getClaimConn(): Promise<Connection> {
  try {
    claimConn = getConnection('claimConn');
  } catch (e) {}

  if (!claimConn) {
    claimConn = await createConnection({
      type: 'mysql',
      database: 'pos-app',
      name: 'root',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      logging: true,
      entities: [__dirname + '/models/*{.ts,.js}'],
    });

    claimConn = changeUpperEntities(claimConn);
  }

  return claimConn;
}
