getSelfData();
async function getSelfData(){
  $(`#empltbody`).empty();
  $(`#empltbody`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
    var response = await fetch(url + "/EMPL/getAllEMPL?user=" + localStorage.getItem(`currid`), {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
    var body = await response.json();
    console.log(body);
    var table = $(`#empltbody`);
    if(body.Status){
      datalist = body.Data
      $.each(datalist,function(index,data){
          table.append(`${data.EXISTS == 'Y' ? '<tr>':'<tr class="table-secondary">'}
                            <td>${data.EMPNAME}</td>
                            <td>${data.PHONE}</td>
                            <td>${data.EMAIL}</td>
                            <td>${data.ELNAME}</td>
                            <td>
                              <div class="dropdown">
                                <button type="button" class="btn btn-primary btne" 
                                 data-bs-toggle="modal"
                                 data-bs-target="#modalCenter" data-id="${data.EMPID}">修改</button>
                              </div>
                            </td>
                        </tr>`);
      });
    }
    else{
      //openLogin();
    }
    $(`#mainwait`).remove();
}
//搜尋
function select(){
  let key = $(`#search`).val();
  $("#empltbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}
//新增
$(`.btni`).on(`click`,function(){
  $(`.modal input`).val("");
  $(`#empid`).removeAttr("readonly");
  $(`#send`).data("id","");
  $(`#empexists`).attr("checked",true);
  $(`#emplevel option`).removeAttr("selected");
  $(`#emplevel`).removeAttr("disabled");
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
  let empl = {//組物件
    EMPID : $(`#send`).data("id"),
    EMPNAME : $(`#empname`).val(),
    PHONE : $(`#empphone`).val(),
    EMPLLEVEL :$(`#emplevel option:selected`).val(),
    EMAIL : $(`#empmail`).val(),
    EMPPWD : $(`#emppw`).val(),
    BIRTHDAY : $(`#empdate`).val(),
    EMPEXISTS : $(`#empexists`).is(":checked")? "Y":"N",
  };
  let empid = $(`#empid`).val();
  if(!empid){//新增
    var response = await fetch(url + "/EMPL/create?user=" + curruntid,{
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
        alert("新增成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }else{//修改
    var response = await fetch(url + "/EMPL/edit?user=" + curruntid,{
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
