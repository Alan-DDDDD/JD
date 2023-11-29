var detailList;
getSelfData();
$(async function(){
  
  //取得EMP資料
  // var emp = await fetch(url+"/EMPL/getAllEMPL?user=" + localStorage.getItem(`currid`) + "&flag=Y",{
  //   method: "get",
  //   headers: new Headers({
  //     "ngrok-skip-browser-warning": "69420",
  //   }),
  // })
  // var empdata = await emp.json();
  // if(empdata.Status){
  // }else{
  //   console.log("EMP資料取得失敗")
  // }
})
async function getSelfData(){
  $(`#systbody`).empty();
    //取得CODE->SYS資料
  var sys = await fetch(url+"/api/Code?datagroup=SYS",{
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var sysdata = await sys.json();
  if(sysdata.Status){
    let tbody = $(`#systbody`);
    datalist = sysdata.Data
    $.each(datalist,(index,data)=>{
      tbody.append(`<tr>
        <td>金帝國際</td>
        <td>SYS</td>
        <td>${data.dataid}</td>
        <td>${data.data}</td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn btn-primary btne"
             data-bs-toggle="modal"
             data-bs-target="#modalCenter" data-id="${data.id}">修改</button>
          </div>
        </td>
        </tr>`)
    })
  }else{
    console.log("SYS資料取得失敗")
  }
}
//搜尋
function select(){
  let key = $(`#search`).val();
  $("#systbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}
//新增
// $(`.btni`).on(`click`,function(){
//   $(`.modal input`).val("");
//   $(`#send`).data("id","");
//   $(`#emplist option`).removeAttr("selected");
//   $(`#status option`).removeAttr("selected").filter(`[value=P]`).attr("selected",true);
//   $(`#emplist`).removeAttr("disabled");
//   $(`#status`).attr("disabled","disabled");
//   $(`#memo`).val("初次設定");
//   $(`#memo`).parent().css("display","none");
// })
//修改
$(`#systbody`).on(`click`,`.btne`,async function(){
  let id = $(this).data("id")
  $.each(datalist,(index,data)=>{
    if(data.id == id){
      $(`#sysid`).html(data.dataid);
      $(`#sysname`).html(data.data);
    }
  });
  let tbody = $(`#ddatetable tbody`);
  tbody.empty();
  let response = await fetch(url+"/api/Code?datagroup=" + $(`#sysid`).val(),{
    method : "get",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    })
  })
  let datas = await response.json();
  if(datas.Status){
    $.each(datas.Data,(index,data)=>{
      tbody.append(`<tr>
      <td style="width:40%">${data.dataid}</td>
      <td style="width:40%">${data.data}</td>
      <td style="width:20%"><small class="badge bg-label-danger datadel">刪除</small></td>
      </tr>`)
    });
  }
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
  }
  $(`.btn-close`).click();
})

$(`#syssend`).on('click',async function(){
  let dataid = $(`#sysdataid`).val();
  let value = $(`#sysvalue`).val();
  if(dataid != "" && value != ""){
    let data = {
      compid : "JD",
      datagroup : "SYS",
      dataid : $(`#sysdataid`).val() || "",
      data : $(`#sysvalue`).val() || ""
    }
    let response = await fetch(url+"/api/Code/Create?user=" + curruntid,{
      method : "post",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(data)
    });
    let result = await response.json();
    if(result.status){
      getSelfData();
      $(`#sysdataid`).val("");
      $(`#sysvalue`).val("");
      $(`#syscode`).removeClass("show");
    }else{
      alert(result.error.errorMsg);
    }
  }else{
    alert("請輸入資料!!")
  }
})

$(`#dbtn`).on('click',()=>{
  let dataid = $(`#dataid`).val() || "";
  let data = $(`#data`).val() || "";
  if(dataid != "" && data != ""){
    let tbody = $(`#ddatetable tbody`);
    tbody.prepend(`<tr>
      <td style="width:40%">${dataid}</td>
      <td style="width:40%">${data}</td>
      <td style="width:20%"><small class="badge bg-label-danger datadel">刪除</small></td>
      </tr>`)
    $(`#dataid`).val("");
    $(`#data`).val("");
  }
})

$(`#ddatetable tbody`).on('click','.datadel',function(){
  $(this).parent().parent().remove();
});