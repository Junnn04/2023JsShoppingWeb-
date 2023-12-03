// 請代入api網址路徑
const api_path = "junapi";
const token = "uga6OPRiHIbBpv3p9oqWARtDW3U2";

// 取得產品列表
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
let productData = [];

const cartList = document.querySelector('.shoppingCart-tableList');
let cardData = [];

//初始化
function init(){
  getProductList();
  getCartList();
}
init();

function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      productData = response.data.products;
      renderProductList();
    })
}

function renderProductList(){
  let str = "";
  productData.forEach(function(item){
    str+=`<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
  })
  productWrap.innerHTML = str;
}

//篩選器
productSelect.addEventListener('change',function(e){
  let category = e.target.value;
  if(category=="全部"){
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == category ){
      str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
                </li>`;
    }
  })
  productWrap.innerHTML = str;
})

productWrap.addEventListener('click',function(e){
  e.preventDefault();
  console.log( e.target.getAttribute("data-id"))
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !=="addCardBtn"){
    return;
  }
  let productId = e.target.getAttribute("data-id");
  addCartItem(productId);
})

// 加入購物車
function addCartItem(id){
  let numCheck = 1;
  cartData.forEach(function(item){
    if (item.product.id === id) {
      numCheck = item.quantity += 1;
    }
  })
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    data: {
      "productId": id,
      "quantity": numCheck
    }
  }).
    then(function (response) {
      alert("加入購物車成功");
      getCartList();
    })
}

// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${ api_path }/carts`).
    then(function (response) {
      cartData = response.data.carts;
      
      let str = "";
      cartData.forEach(function(item){
        str += `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.product.price * item.quantity}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${item.id}" data-product="${item.product.title}">
                            clear
                        </a>
                    </td>
                </tr>`
      })
      cartList.innerHTML = str;
    })
}

// 刪除購物車內特定產品
cartList.addEventListener('click', function (e) {
  e.preventDefault();
  let cartId = e.target.getAttribute('data-id');
  if (cartId == null) {
    return;
  }
  deleteCartItem(cartId);
})

function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
  .then(function (response) {
    alert("刪除單筆購物車成功！");
    getCartList();
  }) 
}

// 清除購物車內全部產品
const discardAllBtn = document.querySelector('.discardAllBtn');
function deleteAllCartList(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response) {
      alert("刪除全部購物車成功！");
      getCartList();
  })
  .catch(function (response) {
    alert("購物車已清空，請勿重複點擊！")
  })
}
discardAllBtn.addEventListener('click',function(e){
  e.preventDefault();
  deleteAllCartList();
})


// 送出購買訂單
const sendOrderBtn = document.querySelector('.orderInfo-btn');
sendOrderBtn.addEventListener('click',function(e){
  e.preventDefault();
  let carthLength = document.querySelectorAll(".shoppingCart-tableList tr").length;
  if (carthLength==0){
    alert("請加入至少一個購物車品項！");
    return;
  }
  let orderName = document.querySelector('.orderName').value;
  let orderTel = document.querySelector('.orderTel').value;
  let orderEmail = document.querySelector('.orderEmail').value;
  let orderAddress = document.querySelector('.orderAddress').value;
  let orderPayment = document.querySelector('.orderPayment').value;
  if (orderName == "" || orderTel == "" || orderEmail == "" || orderAddress==""){
    alert("請輸入訂單資訊！");
    return;
  }
  let data = {
    name: orderName,
    tel: orderTel,
    Email: orderEmail,
    address: orderAddress,
    payment: orderPayment
  }
  createOrder(data);
})
function createOrder(item){
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": item.name,
          "tel": item.tel,
          "email": item.Email,
          "address": item.address,
          "payment": item.payment
        }
      }
    }
  ).then(function (response) {
      alert("訂單建立成功!");
      document.querySelector('.orderName').value="";
      document.querySelector('.orderTel').value="";
      document.querySelector('.orderEmail').value="";
      document.querySelector('.orderAddress').value="";
      document.querySelector('.orderPayment').value="ATM";
      getCartList();
    })
}
