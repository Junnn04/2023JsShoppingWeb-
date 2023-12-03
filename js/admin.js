// api網址路徑代入
const api_path = "junapi";
const token = "uga6OPRiHIbBpv3p9oqWARtDW3U2";

//DOM
const orderlist = document.querySelector(".orderlist");
let orderData =[];

//初始化
function init(){
  getOrderList();
}
init();

// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      orderData = response.data.orders;
      renderOrderList();
    })
}

//renderC3
function renderC3(){
   // console.log(orderData)
   let total = {};
    orderData.forEach(function(item){
      item.products.forEach(function(productItem){
      if(total[productItem.category]==undefined){
   total[productItem.category]=productItem.price*productItem.quantity
      }else{
        total[productItem.category] += productItem.price*productItem.quantity
      }
    })
  })
  //console.log(total)

  let categoryAry = Object.keys(total);
      let newData =[];
      categoryAry.forEach(function(item){
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
      })
    //  console.log(newData);

          // C3.js
  let chart = c3.generate({
      bindto: '#chart', // HTML 元素綁定
      data: {
          type: "pie",
          columns: newData,
          colors:{
              "床架":"#DACBFF",
              "窗簾":"#9D7FEA",
              "收納": "#5434A7",
              "其他": "#301E5F",
          }
      },
  });
}

function renderOrderList(){
  let str="";
  orderData.forEach(function(item){
    //訂購日期時間字串
    let timeStamp = new Date(item.createdAt*1000);
    const orderTime =`${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`
    // console.log(orderTime);

    //訂購產品字串
    let productStr = "";
     item.products.forEach(function(productItem){
     productStr += `<p>${productItem.title}*${productItem.quantity}</p>`
   })
    //判斷訂單處理狀態
    let orderStatus ="";
    if(item.paid==true){
      orderStatus = "已處理"
    }else{
      orderStatus = "未處理"
    }
    //訂單table字串
    str += `<tr>
                <td>${item.createdAt}</td>
                 <td>
                      <p>${item.user.name}</p>
                      <p>${item.user.tel}</p>
                    </td>
                    <td>${item.user.address}</td>
                    <td>${item.user.email}</td>
                    <td>
                      <p>${productStr}</p>
                    </td>
                    <td>${orderTime}</td>
                    <td class="orderStatus">
                      <a href="#" class="orderStatus-Btn" data-orderId="${item.id}" data-Status="${item.paid}">${orderStatus}</a>
                    </td>
                    <td>
                      <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
                    </td>
                </tr>`
  })
   orderlist.innerHTML = str;
   renderC3();
}

//訂單操作

orderlist.addEventListener('click', function (e) {
    e.preventDefault();
    let targetClass = e.target.getAttribute('Class');
   // console.log(targetClass);
    if (targetClass == "delSingleOrder-Btn") {
       let orderId = e.target.getAttribute("data-id");
       deleteOrderItem(orderId);//訂單操作刪除特定訂單
       return;
    }
    
    if (targetClass == "orderStatus-Btn") {
        //console.log(e.target.getAttribute("data-Status"));
        let orderStatus = e.target.getAttribute("data-Status");
        let orderStatusId = e.target.getAttribute("data-orderId");
        editOrderList(orderStatus,orderStatusId);
       return;
    }
  })
  
  //訂單處理狀態
  function editOrderList(orderStatus,orderStatusId) {
   // console.log(orderStatus,orderStatusId)
    let newStatus;
    if (orderStatus == true){
      newStatus=false
    }else{
      newStatus=true
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        "data": {
          "id": orderStatusId,
          "paid": newStatus
        }
      },
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        alert("訂單已處理！")
        getOrderList();
      })
  }
  
  //訂單操作刪除特定訂單
  function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
         alert("刪除單筆購物車成功！");
         getOrderList();
      })
  }
  
  // 刪除全部訂單
  const discardAllBtn = document.querySelector('.discardAllBtn');
  function deleteAllOrderList() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(function (response) {
        alert("訂單已清空，請勿重複點擊！")
      })
  }
  
  discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    deleteAllOrderList();
    getOrderList();
  })