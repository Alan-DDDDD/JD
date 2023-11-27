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
  var emp = await fetch(url+"/EMPL/getAllEMPL?user=" + localStorage.getItem(`currid`),{
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
                            <td>${data.empname}</td>
                            <td>${data.budget.numberFormat(0,".",",")}</td>
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
$(`#empltbody`).on(`click`,`.btne`,function(){
  let id = $(this).data("id");
  $(`#empid`).attr("readonly","readonly");
  let current = $.grep(datalist,function(e){
    return e.EMPID == curruntid
  });
  $.each(datalist,(index,data)=>{
    if(data.EMPID == id){
      $(`#empid`).val(data.EMPID);
      $(`#empname`).val(data.EMPNAME);
      $(`#empphone`).val(data.PHONE);
      $(`#empmail`).val(data.EMAIL);
      $(`#emppw`).val(data.EMPPWD);
      $(`#empdate`).val(data.BIRTHDAY || "");
      $(`#send`).data("id",id);
      $(`#emplevel option`).removeAttr("selected").filter(`[value=${data.EMPLLEVEL}]`).attr("selected",true);
      if(current[0].EMPLLEVEL <= 10){
        $(`#emplevel`).attr('disabled', 'disabled');
      }
      let exists = $(`#empexists`);
      if(data.EXISTS == "Y"){
        exists.attr("checked",true);
      }else{
        exists.removeAttr("checked");
      }
    }
  });
})
//確認送出
$(`#send`).on(`click`,async ()=>{
  let id = $(`#send`).data("id") || $(`#emplist option:selected`).val();
  console.log(id)
  debugger;
  let budget = {//組物件
    empid : $(`#send`).data("id"),
    payment : $(`#status option:selected`).val(),
    amount : $(`#empbudget`).val(),
    memo :$(`#memo`).val(),
  };
  console.log(budget);
  let empid = $(`#send`).data("id");
  if(!empid){//新增
    var response = await fetch(url + "/api/Budget/create?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(empl)
    });
    var body = await response.json();
    console.log(body);
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        alert("新增成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }else{//修改
    var response = await fetch(url + "/api/Budget/edit?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(empl)
    });
    var body = await response.json();
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        alert("編輯成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }
  $(`.btn-close`).click();
})
