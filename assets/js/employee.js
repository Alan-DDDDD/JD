getSelfData();
async function getSelfData(){
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
          table.append(`<tr>
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
}
//新增
$(`.btni`).on(`click`,function(){
  $(`.modal input`).val("");
  $(`#empid`).removeAttr("readonly");
  $(`#send`).data("id","");
  $(`#empexists`).attr("checked",true);
  $(`#emplevel option`).removeAttr("selected");
})
//修改
$(`#empltbody`).on(`click`,`.btne`,function(){
  let id = $(this).data("id");
  $(`#empid`).attr("readonly","readonly");
  $.each(datalist,(index,data)=>{
    if(data.EMPID == id){
      $(`#empid`).val(data.EMPID);
      $(`#empname`).val(data.EMPNAME);
      $(`#empphone`).val(data.PHONE);
      $(`#empmail`).val(data.EMAIL);
      $(`#emppw`).val(data.EMPPWD);
      let daystring = "";
      if(data.BIRTHDAY){
        daystring = data.BIRTHDAY.substring(0,3) + '-' + data.BIRTHDAY.substring(4,5) + '-' + data.BIRTHDAY.substring(6,7);
      }
      $(`#empdate`).val(daystring || "");
      $(`#send`).data("id",id);
      $(`#emplevel option`).removeAttr("selected").filter(`[value=${data.EMPLLEVEL}]`).attr("selected",true);
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
    empname : $(`#empname`).val(),
    empphone : $(`#empphone`).val(),
    emplevel :$(`#emplevel option:selected`).val(),
    empmail : $(`#empmail`).val(),
    emppw : $(`#emppw`).val(),
    empdate : $(`#empdate`).val(),
    empexists : $(`#empexists checked`),
  };
  let empid = $(`#empid`).val();
  if(empid){//新增
    // var response = await fetch(url + "/EMPL/create?user=" + curruntid,{
    //   method : "POST",
    //   headers : new Headers({
    //     "ngrok-skip-browser-warning": "69420",
    //   }),
    //   body : JSON.stringify(empl)
    // });
    // var body = await response.json();
    var body = ajax("/EMPL/create?user=",empl,"POST")
    response(body);
  }else{//修改
    var response = await fetch(url + "/EMPL/edit?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
      body : JSON.stringify(empl)
    });
    var body = await response.json();
    response(body);
  }
})