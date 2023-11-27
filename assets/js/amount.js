getSelfData();
var parame = "";
$(async function(){
  //取得amount參數
  parame = localStorage.getItem("amountparame");
  //取得BS資料
  var BS = await fetch(url+"/api/Code/BS",{
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var BSdata = await BS.json();
  if(BSdata.Status){
    let status = $(`#status`);
    status.append(`<option selected>請選擇</option>`)
    $.each(BSdata.Data,(index,item)=>{
      status.append(`
          <option value="${item.dataid}">${item.data}</option>
      `)
    })
  }else{
    console.log("BS資料取得失敗")
  }
  //取得EMP資料
  var emp = await fetch(url+"/EMPL/getAllEMPL?user=" + localStorage.getItem(`currid`) + "&flag=Y",{
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var empdata = await emp.json();
  if(empdata.Status){
    let emplist = $(`#emplist`);
    emplist.append(`<option selected>請選擇</option>`)
    $.each(empdata.Data,(index,item)=>{
      emplist.append(`
          <option value="${item.EMPID}">${item.EMPID}  ${item.EMPNAME}</option>
      `)
      //設定個人統計資料
      if(item.EMPID == parame){
        $(`#empid`).html(item.EMPID);
        $(`#empname`).html(item.EMPNAME);
      }
    })
  }else{
    console.log("EMP資料取得失敗")
  }
  //設定個人統計

})
async function getSelfData(){
  $(`#budgettbody`).empty();
    var response = await fetch(url + "/api/Amount_D?user=" + localStorage.getItem(`currid`) 
                + "&empid=" + localStorage.getItem("amountparame"), {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
    var body = await response.json();
    console.log(body);
    var table = $(`#budgettbody`);
    if(body.Status){
      datalist = body.Data
      $.each(datalist,function(index,data){
          table.append(`<tr>
                            ${data.payment == "新增" ? `<td style="color:green">`:`<td style="color:red">`}${data.payment}</td>
                            <td>${data.amount.numberFormat(0,".",",")}</td>
                            <td>${data.memo}</td>
                            <td>${data.u_sysdt}</td>
                            <td>${data.u_user}</td>
                        </tr>`);
      });
    }
    else{
      //openLogin();
    }
}
//搜尋
function select(){
  let key = $(`#search`).val();
  $("#budgettbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}
//新增
$(`.btni`).on(`click`,function(){
  // $(`.modal input`).val("");
  // $(`#send`).data("id","");
  // $(`#emplist option`).removeAttr("selected");
  // $(`#status option`).removeAttr("selected");
  // $(`#status option[value=P]`).attr("selected","selected");
  // $(`#emplist`).removeAttr("disabled");
  // $(`#status`).parent().css("display","none");
  // $(`#memo`).val("初次設定");
  // $(`#memo`).parent().css("display","none");
  $(`#memo`).parent().css("display","");
  $(`#status`).parent().css("display","");
  $(`#status option`).removeAttr("selected");
  $(`#emplist option`).removeAttr("selected").filter(`[value=${parame}]`).attr("selected",true);
  $(`#emplist`).attr("disabled","disabled");
  $(`#empbudget`).val("");
  $(`#memo`).val("");
})
//修改
$(`#budgettbody`).on(`click`,`.btne`,function(){
  $(`#memo`).parent().css("display","");
  $(`#status`).parent().css("display","");
  $(`#status option`).removeAttr("selected");
  $(`#emplist option`).removeAttr("selected").filter(`[value=${parame}]`).attr("selected",true);
  $(`#emplist`).attr("disabled","disabled");
  $(`#empbudget`).val("");
  $(`#memo`).val("");
})
//確認送出
$(`#send`).on(`click`,async ()=>{
  let id = $(`#send`).data("id") || $(`#emplist option:selected`).val();
  let budget = {//組物件
    empid : id,
    payment : $(`#status option:selected`).val(),
    amount : $(`#empbudget`).val(),
    memo :$(`#memo`).val(),
  };
  let empid = $(`#send`).data("id");
  if(!empid){//新增
    var response = await fetch(url + "/api/Amount_D/create?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(budget)
    });
    var body = await response.json();
    console.log(body);
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        alert("設定成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.ErrorMsg);
    }
  }else{//修改
    // var response = await fetch(url + "/api/Budget/edit?user=" + curruntid,{
    //   method : "POST",
    //   headers : new Headers({
    //     "ngrok-skip-browser-warning": "69420",
    //     "Content-Type":"application/json"
    //   }),
    //   body : JSON.stringify(empl)
    // });
    // var body = await response.json();
    // if(body.status){
    //   if(body.error){//資料邏輯錯誤
    //     alert("");
    //   }else{
    //     alert("編輯成功!!");
    //     getSelfData();
    //   }
    // }else{//系統錯誤
    //   alert(body.error.errorMsg);
    // }
  }
  $(`.btn-close`).click();
})

$(`#back`).on('click',()=>{
  localStorage.removeItem("amountparame");
  open(fronturl + "/budget.html","_self");
})