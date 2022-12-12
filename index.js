
import Get from './Get.js'

$(document).ready(() => {
  loadTable(); 
  update(url,1); 
  $('#btn-buy-items').on('click', () => buyItems())
});

const url = 'https://amazon24.p.rapidapi.com/api/product';
const buffer = new SharedArrayBuffer(1024);
const view = new Int32Array(buffer);
const numWorkers = 30;
let workers = [];

initBuffer();

async function initBuffer() {
  let get = new Get()
  let data = await get.getDados(url, 1);

  let i;

  data.forEach((el, i) => {
    let j = (i*2)
    view[j] = el.id
    view[j+1] = el.quantity
  });
  
  for (i = 0; i < numWorkers; i++) {
      workers[i] = new Worker('worker.js');
      workers[i].postMessage(view);
      workers[i].onmessage( (event) => {

      })
  }
}

function next(initOffset, finalOffset) {
  let page = finalOffset / (finalOffset - initOffset + 1);
  update(url, page+1);
}

function previous(initOffset, finalOffset) {
  let page = finalOffset / (finalOffset - initOffset + 1);
  update(url, page-1);
}

function loadTable() {
  $("#table-1").DataTable({
    paging: false,
    searching: false,
    info: false,
    sorting: false,
    columns: [
      {data: "id"},
      {data: "title"},
      {data: "price"},
      {data: "quantity"},
    ],
    data: []
  });


  $("#table-2").DataTable({
    paging: false,
    searching: false,
    info: false,
    dom: 'Bfrtip',
    select: true,
    sorting: false,
    columns: [
      {data: "id"},
      {data: "title"},
      {data: "price"},
      {data: "quantity"},
    ],
    data: []
  });
}

function buyItems() {
  let table = $('#table-1').DataTable();
  let cartTable = $('#table-2').DataTable();

  let selected = table.rows({ selected: true });

  if (selected.length) {
    selected[0].forEach((el, i) => {
      let data = table.row(el).data();

      if (data && data.quantity > 0) {
        data.quantity = data.quantity - 1;
        table.row(el).data(data);
        
        let cart = JSON.parse(JSON.stringify(data));
        let cartItems = cartTable.rows();
        let exist = false;

        if (cartItems.length) {
          cartItems[0].forEach((el, i) => {
            let cartItem = cartTable.row(el).data();
            if (cartItem && cartItem.id == data.id) {
              exist = true;
              cartItem.quantity = cartItem.quantity + 1;
              cartTable.row(el).data(cartItem).draw();
            }
          });
        }

        if (!exist) {
          cart.quantity = 1;
          cartTable.row.add(cart).draw();
        }
      }
    });

    table.draw();
  }
}

//Atualiza as tabela com dados da REST
async function update(url, page = 1){
  let table = $("#table-1").DataTable();
  if (url) {
    let get = new Get()
    let data = await get.getDados(url, page);

    table.destroy();

    $("#table-1").DataTable({
      paging: false,
      searching: false,
      info: false,
      dom: 'Bfrtip',
      select: true,
      sorting: false,
      columns: [
        {data: "id"},
        {data: "title"},
        {data: "price"},
        {data: "quantity"},
      ],
      data: data
    });

    let btnPrevious = $('#btn-previous');
    let btnNext = $('#btn-next');
    let reserve = $('#btn-addcart');

    reserve.on('click', () => addToCart(table));
    btnNext.removeClass('disabled');
    btnNext.on('click', () => update(url, page+1));
  
    if (page == 1) {
      btnPrevious.addClass('disabled');
    } else {
      btnPrevious.removeClass('disabled');
    }
  }
}