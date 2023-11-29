var detailList;
getSelfData();
$(async function(){
  
})
async function getSelfData(){
  $(`#systbody`).empty();
  $(`#systbody`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
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
             data-bs-target="#modalCenter" data-id="${data.id}" data-pg="${data.parentgroup}">修改</button>
          </div>
        </td>
        </tr>`)
    })
  }else{
    console.log("SYS資料取得失敗")
  }
  $(`#mainwait`).remove();
}
//搜尋
function select(){
  let key = $(`#search`).val();
  $("#systbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}
//新增
//修改
$(`#systbody`).on(`click`,`.btne`,async function(){
  //設定畫面
  $(`#ddatetable`).before(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
  $(`#ddatetable`).css("display","none");
  $(`#parentgroup`).parent().parent().css("display","none");
  $(`#parentgroup`).html("");
  let id = $(this).data("id");
  let pg = $(this).data("pg");

  $.each(datalist,(index,data)=>{
    if(data.id == id){
      $(`#sysid`).html(data.dataid);
      $(`#sysname`).html(data.data);
    }
  });
  $(`#dataid`).val("");
  $(`#data`).val("");
  if(pg != null){
    let pd = await fetch(url +"/api/Code?datagroup=" + pg,{
      method : "get",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
      })
    })
    let datas = await pd.json();
    if(datas.Status){
      let pgele = $(`#parentgroup`);
      pgele.parent().parent().css("display","");
      $.each(datas.Data,(index,item)=>{
        pgele.append(`<option value="${item.dataid}">${item.data}</option>`);
      });
    }
  }
  //取得細節資料
  let tbody = $(`#ddatetable tbody`);
  tbody.empty();
  let response = await fetch(url+"/api/Code?datagroup=" + $(`#sysid`).html(),{
    method : "get",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    })
  })
  let datas = await response.json();
  if(datas.Status){
    $.each(datas.Data,(index,data)=>{
      tbody.append(`<tr>
      <td style="width:30%">${data.dataid}</td>
      <td style="width:40%">${data.data}</td>
      <td style="width:30%">
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">編輯</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">刪除</small>
      </td>
      </tr>`)
    });

  }
  if(pg != null){
    $(`#parentgroup`).change();
  }
  $(`#mainwait`).remove();
  $(`#ddatetable`).css("display","");
})
//確認送出
$(`#send`).on(`click`,async ()=>{
  let id = $(`#sysid`).html();
  let codetable = {//組物件
    datagroup : id,
    parentgroup : $(`#parentgroup option:selected`).val(),
    datas : []
  };
  //組資料
  $.each($(`#ddatetable tbody tr`),(index,data)=>{
    let item = {
      dataid : $($(data).children()[0]).html(),
      data : $($(data).children()[1]).html()
    }
    codetable.datas.push(item);
  });

  var response = await fetch(url + "/api/Code/updateTable?user=" + curruntid,{
    method : "POST",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
      "Content-Type":"application/json"
    }),
    body : JSON.stringify(codetable)
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
      <td style="width:30%">${dataid}</td>
      <td style="width:40%">${data}</td>
      <td style="width:30%">
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">編輯</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">刪除</small>
      </td>
      </tr>`);
    $(`#dataid`).removeAttr("disabled");
    $(`#dataid`).val("");
    $(`#data`).val("");
  }
})

$(`#ddatetable tbody`).on('click','.datadel',function(){
  $(this).parent().parent().remove();
});
$(`#ddatetable tbody`).on('click','.dataedit',function(){
  let thistd = $(this).parent();
  $(`#dataid`).val(thistd.prev().prev().html());
  $(`#dataid`).attr("disabled","disables");
  $(`#data`).val(thistd.prev().html());
  thistd.parent().remove();
});
$(`#parentgroup`).on(`change`,async function(){
  let pg = $(`#parentgroup option:selected`).val();
  let dg = $(`#sysid`).html();
  let tbody = $(`#ddatetable tbody`);
  tbody.empty();
  let response = await fetch(url+"/api/Code?datagroup=" + dg +"&parentgroup=" + pg,{
    method : "get",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    })
  })
  let datas = await response.json();
  if(datas.Status){
    $.each(datas.Data,(index,data)=>{
      tbody.append(`<tr>
      <td style="width:30%">${data.dataid}</td>
      <td style="width:40%">${data.data}</td>
      <td style="width:30%">
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">編輯</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">刪除</small>
      </td>
      </tr>`)
    });

  }
});