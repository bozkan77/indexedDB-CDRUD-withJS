// database oluştur - create database

const productDB = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1)
    .stores({ table })
    // const db = new Dexie('productDB');
    // db.version(1).stores(
    //   {
    //     friends: `name, age`,
    //   },
    //   console.log('ASD'),
    //   console.log(db)
    // );

    .db.open();
};

export default productDB;
