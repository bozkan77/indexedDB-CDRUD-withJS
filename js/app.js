const db = new Dexie('productDB');
db.version(1).stores({
  products: `++id, name, seller, price`,
});

db.open();

const userid = document.querySelector('#userid');
const proname = document.querySelector('#proname');
const seller = document.querySelector('#seller');
const price = document.querySelector('#price');

const btnCreate = document.querySelector('#btn-create');
const btnRead = document.querySelector('#btn-read');
const btnUpdate = document.querySelector('#btn-update');
const btnDelete = document.querySelector('#btn-delete');

btnCreate.onclick = (e) => {
  let flag = bulkcreate(db.products, {
    name: proname.value,
    seller: seller.value,
    price: price.value,
  });

  proname.value = seller.value = price.value = '';
  getData(db.products, (data) => {
    userid.value = data.id + 1 || 1;
  });
};

const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log('veri yükleme işlemi başarılı ...');
  } else {
    console.log('Lütfen tüm alanları doldurarak veri girişi yapınız ...');
  }
  return flag;
};

const empty = (object) => {
  let flag = false;

  for (const value in object) {
    if (object[value] != '' && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }

  return flag;
};

// verileri getir

const getData = (dbtable, fn) => {
  let index = 0;
  let obj = {};
  dbtable.count((count) => {
    if (count) {
      dbtable.each((table) => {
        obj = Sortobj(table);
        fn(obj, index++);
      });
    } else {
      fn(0);
    }
  });
};

const Sortobj = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    name: sortobj.name,
    seller: sortobj.seller,
    price: sortobj.price,
  };
  return obj;
};

// verileri oku

btnRead.onclick = table;

function table() {
  const tbody = document.querySelector('#tbody');

  getData(db.products, (data) => {
    if (data) {
      createElem('tr', tbody, (tr) => {
        for (const value in data) {
          createElem('td', tr, (td) => {
            td.textContent = data[value];
          });
        }
      });
    }
  });
}

const createElem = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};
