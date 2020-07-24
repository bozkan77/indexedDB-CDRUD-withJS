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

// verileri güncelle

btnUpdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    db.products
      .update(id, {
        name: proname.value,
        seller: seller.value,
        price: price.value,
      })
      .then((updated) => {
        let get = updated ? `Veri güncellendi` : `Veri güncellenemedi`;
        console.log(get);
      });
  }
};

/////

// tüm verileri sil

btnDelete.onclick = () => {
  db.delete();
  db.version(1).stores({
    products: `++id, name, seller, price`,
  });

  db.open();
  table();
};

// window onload

window.onload = () => {
  textId(userid);
};

const textId = (textboxid) => {
  getData(db.products, (data) => {
    textboxid.value = data.id + 1 || 1;
  });
};

function table() {
  const tbody = document.querySelector('#tbody');

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
  getData(db.products, (data) => {
    if (data) {
      createElem('tr', tbody, (tr) => {
        for (const value in data) {
          createElem('td', tr, (td) => {
            td.textContent =
              data.price === data[value] ? `${data[value]} TL` : data[value];
          });
        }
        createElem('td', tr, (td) => {
          createElem('i', td, (i) => {
            i.className += 'fas fa-edit btnedit';
            i.setAttribute(`data-id`, data.id);

            i.onclick = editBtn;
          });
        });
        createElem('td', tr, (td) => {
          createElem('i', td, (i) => {
            i.className += 'fas fa-trash-alt btndelete';
            i.setAttribute(`data-id`, data.id);
            i.onclick = deleteBtn;
          });
        });
      });
    }
  });
}

const createElem = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

const editBtn = (e) => {
  console.log(e.target.dataset.id);
  let id = parseInt(e.target.dataset.id);
  db.products.get(id, (data) => {
    userid.value = data.id || 0;
    proname.value = data.name || '';
    seller.value = data.seller || '';
    price.value = data.price || '';
  });
};

const deleteBtn = (e) => {
  let id = parseInt(e.target.dataset.id);
  db.products.delete(id);
  table();
};
