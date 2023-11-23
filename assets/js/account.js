getSelfData();
async function getSelfData(){
    //const userid = "F111111111";
    const userid = "F128933062";
    var response = await fetch(url + "/api/Account/", {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          "authorization":localStorage.getItem("loginToken")
        }),
      });
    var body = await response.json();
    console.log(body);
    var table = $(`#AccountList tbody`);
    if(body.status == 0){
        $.each(body.data,function(index,data){
            if(data.visable == 1 && data.able == 1){ //改寫在後端
              appendData(data);
            }
        });
    }
    else{
      openLogin();
    }
}

function　getQR(code,account){
  var data = prompt("請問輸入收款金額");
  var money = Number(data);
  console.log(money);
  let url = "";
  console.log(code,account);
  if(data != null){
    if(money == 0 || money == "NaN"){
      url = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=TWQRP%3A%2F%2F${code}NTTransfer%2F158%2F02%2FV1%3FD6%3D${account}%26D5%3D${code}%26D10%3D901`;
    }
    else{
      url = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=TWQRP%3A%2F%2F${code}NTTransfer%2F158%2F02%2FV1%3FD6%3D${account}%26D5%3D${code}%26D1%3D${money*100}%26D10%3D901`;
    }
    console.log(url);
    open(url,"_block");
  }
}

function appendData(data){
  let code = data.bankCode || data.currency;
  let name = data.accountName;
  let account = data.bankAccount || "x";
  let amount = data.amount.toString();
  let type = data.currency;
  var model = `
                  <div class="card mb-4" style="background-color: rgba(154, 154, 164, 0.26);box-shadow: 5px 5px 10px 5px gray;">
                    <div class="card-body">
                      <div style="display: flex;margin-bottom: 0.875rem;">
                        <img src="../assets/img/icons/account/${code}.jpg" style="width:5%;border-radius: 10%;"/>
                        <h5 class="card-title" style="margin-left: 2%;">${name}</h5>
                      </div>`
      model += account == "x" ?  `<div class="card-subtitle mb-3">(${code})</div>` : `<div class="card-subtitle mb-3">(${code})${account}</div>`
      model += `<p class="card-text">
                <h5>餘額:${amount}</h5>
                 </p>
                 <div style="display: flex;">
                <a href="javascript:void(0)" style="margin: 0 auto;color:#566a7f;" class="tf-icons bx bx-coin">交易</a>
                <a href="javascript:void(0)" style="margin: 0 auto;color:#566a7f;" class="tf-icons bx bx-refresh">轉帳</a>
                <a href="javascript:void(0)" style="margin: 0 auto;color:#566a7f;" class="tf-icons bx bx-comment-detail">細節</a>
                `
      if(account != "x"){
        model +=`<a href="javascript:getQR('${code}','${account}')" style="margin: 0 auto;color:#566a7f;" class="tf-icons bx bx-qr">QRcode</a>`
      }
      model+=` </div></div></div> `
        $(`#dataList`).append(model);
}