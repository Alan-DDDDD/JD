getSelfData();
$(async function(){
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
    })
  }else{
    console.log("EMP資料取得失敗")
  }
})
async function getSelfData(){
  $(`#budgettbody`).empty();
    var response = await fetch(url + "/api/Budget?user=" + localStorage.getItem(`currid`), {
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
                            <td onclick="detail('${data.empid}');" style="cursor:pointer;">${data.empname}</td>
                            <td>${data.budget.numberFormat(0,".",",")}</td>
                            <td></td>
                            <td></td>
                            <td>
                              <div class="dropdown">
                                <button type="button" class="btn btn-primary btne"
                                 data-bs-toggle="modal"
                                 data-bs-target="#modalCenter" data-id="${data.empid}">修改</button>
                              </div>
                            </td>
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
  $(`.modal input`).val("");
  $(`#send`).data("id","");
  $(`#emplist option`).removeAttr("selected");
  $(`#status option`).removeAttr("selected");
  $(`#status option[value=P]`).attr("selected","selected");
  $(`#emplist`).removeAttr("disabled");
  $(`#status`).parent().css("display","none");
  $(`#memo`).val("初次設定");
  $(`#memo`).parent().css("display","none");
})
//修改
$(`#budgettbody`).on(`click`,`.btne`,function(){
  let id = $(this).data("id");
  $(`#empid`).attr("readonly","readonly");
  let current = $.grep(datalist,function(e){
    return e.EMPID == curruntid
  });
  $(`#memo`).parent().css("display","");
  $(`#status`).parent().css("display","");
  $(`#status option`).removeAttr("selected");
  $(`#emplist option`).removeAttr("selected").filter(`[value=${id}]`).attr("selected",true);
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

function detail(empid){
  localStorage.setItem("amountparame",empid);
  open(fronturl + "/amount.html","_self");
}