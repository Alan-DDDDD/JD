getSelfData();
$(async function(){
  //初始化畫面
  $(`.casefix`).attr("disabled","disabled");
  $(`#mainpanel`).hide();
  $(`.carinput`).attr("disabled","disabled");
  $(`.toolbar`).attr("disabled","disabled");
  //依據階段禁止修改資料
  //1.進件完成禁止修改客戶資料
  //2.報價後簽約後禁止修改成交價格、車輛資料
  //3.過戶後禁止修改過戶資料
  //4.撥款後禁止修改所有資料
  //$(`#casepanel input`).attr("disabled","disabled");
  //取得ddl資料
  var carddl = await fetch(url+"/api/Code/carddl",{
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var carddldata = await carddl.json();
  if(carddldata.Status){
    ddllist = carddldata.Data;
    let brand = $(`#modelbrand`);
    let color = $(`#modelcolor`);
    brand.append(`<option selected>請選擇</option>`);
    color.append(`<option selected>請選擇</option>`);
    $.each(ddllist.BD,(index,item)=>{
      brand.append(`
          <option value="${item.dataid}">${item.data}</option>
      `)
    })
    $.each(ddllist.CL,(index,item)=>{
      color.append(`
          <option value="${item.dataid}">${item.data}</option>
      `)
    })
  }else{
    console.log("CODE資料取得失敗")
  }
  //圖檔瀏覽
  $(`.filebtn`).on(`click`,async function(){
    var input = document.getElementById($(this).data("id"));
      await readUrl(input);
  });
})



async function getSelfData(){
  $(`#caselist`).empty();
  $(`#caselist`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
    var response = await fetch(url + "/api/OrderCase?user=" + localStorage.getItem(`currid`), {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
    var body = await response.json();
    console.log(body);
    var table = $(`#caselist`);
    if(body.Status){
      datalist = body.Data
      $.each(datalist,function(index,data){
          table.append(`<tr class="listdata" style="cursor:pointer;">
                            <td>${data.OrderCase.caseid}</td>
                            <td>採購</td>
                            <td>${data.EMPL.EMPNAME}</td>
                            <td>${data.Code}</td>
                            <td>${data.Car == null? "" : data.Car.carnumber}</td>
                            <td>${data.OrderCase.a_sysdt.substring(0,10)}</td>
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
  $("#budgettbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}

$(`#addcase`).on(`click`,()=>{
  clearPage();
  $(`#empid`).val(curruntid);
  $(`#empname`).val(curruntuser);
  $(`#casestatus`).val("進件中");
  $(`#casedate`).val(new Date());
  $(`#mainpanel`).show(300);
  if($(`#listpanel`).css("display") != "none"){
    $(`#listpanel`).slideToggle();
  }
})

//初始化事件
function clearPage(){//清除畫面
  let caseinput = $(`#mainpanel input,textarea`);
  let frominput = $(`#formtable input,textarea`);
  let formselect = $(`.modelselect`);
  let clearselect = $(`.clearselect option`);
  caseinput.val("");
  frominput.val("");
  formselect.empty().append(`<option selected>請選擇</option>`);
  clearselect.removeAttr("selected");
  $(`.casesave`).data("caseid","");
  $(`#addDeitail`).data("caseid","");
  $(`#addDeitail`).attr("disabled","disabled")
  $(`.caredit`).attr("disabled","disabled");
  $(`.carinsert`).removeAttr("disabled");
  $(`#send`).data('carid',"");
}
//list
$(`#listbar`).on(`click`,()=>{
  $(`#listpanel`).slideToggle();
});
//list tr click
$(`#caselist`).on(`click`,`.listdata`,function(){
  console.log($(this));
  clearPage();
  let caseid = $($(this).children()[0]).html();
  //設定table樣式
  $(`#listpanel tr`).removeClass("bg-secondary");
  $(`#listpanel tr`).css("color","");
  $(this).addClass("bg-secondary");
  $(this).css("color","white");
  //設定頁面元件
  $(`.casesave`).data("caseid",caseid);
  $(`#addDeitail`).data("caseid",caseid);
  $(`#addDeitail`).removeAttr("disabled");
  //綁定頁面
  $.each(datalist,(index,value)=>{
    if(value.OrderCase.caseid == caseid){
      $(`#empid`).val(value.OrderCase.emplid);
      $(`#empname`).val(value.EMPL.EMPNAME);
      $(`#casestatus`).val(value.Code);
      $(`#custname`).val(value.OrderCase.custname);
      $(`#custphone`).val(value.OrderCase.custphone);
      $(`#price`).val(value.OrderCase.price || "");
      $(`#dealprice`).val(value.OrderCase.dealprice || "");
      $(`#casedate`).val(value.OrderCase.a_sysdt.substring(0,10));
      //綁定檔案路徑與顯示資料
      $(`#carkeyinput`).data("path",value.OrderCase.carkey);
      $(`#carpaper1input`).data("path",value.OrderCase.paper1);
      $(`#carpaper2input`).data("path",value.OrderCase.paper2);
      $(`#carpaper3input`).data("path",value.OrderCase.paper3);
      $(`#idcardFinput`).data("path",value.OrderCase.idcardf);
      $(`#idcardRinput`).data("path",value.OrderCase.idcardr);
      $(`#bankinput`).data("path",value.OrderCase.bank);
      $(`#carkeyinput`).parent().prev().html(value.OrderCase.carkey == null ? "鑰匙 ❌":"鑰匙 ✔️");
      $(`#carpaper1input`).parent().prev().html(value.OrderCase.paper1 == null ? "行照 ❌":"行照 ✔️");
      $(`#carpaper2input`).parent().prev().html(value.OrderCase.paper2 == null ? "牌照登記書 ❌":"牌照登記書 ✔️");
      $(`#carpaper3input`).parent().prev().html(value.OrderCase.paper3 == null ? "出廠證 ❌":"出廠證 ✔️");
      $(`#idcardFinput`).parent().prev().html(value.OrderCase.idcardf == null ? "身分證正面 ❌":"身分證正面 ✔️");
      $(`#idcardRinput`).parent().prev().html(value.OrderCase.idcardr == null ? "身分證反面 ❌":"身分證反面 ✔️");
      $(`#bankinput`).parent().prev().html( value.OrderCase.bank == null ? "銀行存摺 ❌":"銀行存摺 ✔️");
      let caredit = $(`.caredit`);
      let carinsert = $(`.carinsert`);
      if(value.Car){
        caredit.removeAttr("disabled");
        carinsert.attr("disabled","disabled");
        cardatabind(value.Car); 
      }else{
        caredit.attr("disabled","disabled");
        carinsert.removeAttr("disabled");
      }
    }
  })
  //開啟頁面
  $(`#mainpanel`).show(300);
  $(`#listpanel`).slideToggle();
})




//CASE INSERT AND EDIT AND
$(`.casesave`).on('click',async function(){
  let caseid = $(this).data("caseid");
  let caseObject = {
    caseid : caseid,
    emplid : $(`#empid`).val(),
    custname : $(`#custname`).val(),
    custphone : $(`#custphone`).val(),
    carid : $(`#send`).data("carid"),
    price : $(`#price`).val() || 0,
    dealprice : $(`#dealprice`).val() || 0,
    status : $(`#casestatus`).val()
  }
  //案件基本資料API
  if(caseid){
    //修改
    var response = await fetch(url + "/api/OrderCase/edit?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(caseObject)
    });
    var body = await response.json();
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        alert("編輯成功!!");
        casefiles(caseid);
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }else{
    //新增
    var response = await fetch(url + "/api/OrderCase/create?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(caseObject)
    });
    var body = await response.json();
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        $(this).data("caseid",body.data);
        alert("新增成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }
});

//案件檔案傳送
async function casefiles(caseid){
  let files = [
    document.getElementById("carkeyinput").files[0],
    document.getElementById("carpaper1input").files[0],
    document.getElementById("carpaper2input").files[0],
    document.getElementById("carpaper3input").files[0],
    document.getElementById("idcardFinput").files[0],
    document.getElementById("idcardRinput").files[0],
    document.getElementById("bankinput").files[0]
  ]
  let fileName = [
    "carkey",
    "paper1",
    "paper2",
    "paper3",
    "idcardf",
    "idcardr",
    "bank"
  ]
  var form = new FormData();
  for(var i = 0;i<files.length;i++){
    form.append(`files`,files[i],fileName[i])
  }
  console.log(form);
  var response = await fetch(url + "/api/OrderCase/saveFile?user=" + curruntid + "&caseid=" + caseid,{
    method : "POST",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420"
    }),
    body : form
  });
  var body = await response.json();
}


//CAR INSERT AND EDIT AND EVENT
function cardatabind(car){
  $(`#send`).data('carid',car.carid);
  $(`#modelcarnumber`).val(car.carnumber);
  $(`#modelbrand option`).removeAttr('selected').filter(`[value=${car.brand}]`).attr("selected",true);
  $(`#modelbrand`).change();
  $(`#modelseries option`).removeAttr('selected').filter(`[value=${car.series}]`).attr("selected",true);
  $(`#modelseries`).change();
  $(`#modelmodel option`).removeAttr('selected').filter(`[value=${car.model}]`).attr("selected",true);
  $(`#modelcolor option`).removeAttr('selected').filter(`[value=${car.color}]`).attr("selected",true);
  $(`#modelkm`).val(car.km);
  $(`#modeldate`).val(car.date);
  $(`#modelstatus`).val(car.carstatus);
  $(`#modelmemo`).val(car.memo);
  $(`#carbrand`).val($(`#modelbrand option[value=${car.brand}]`).html());
  $(`#carseries`).val($(`#modelseries option[value=${car.series}]`).html());
  $(`#carmodel`).val($(`#modelmodel option[value=${car.model}]`).html());
  $(`#carcolor`).val($(`#modelcolor option[value=${car.color}]`).html());
  $(`#carnumber`).val($(`#modelcarnumber`).val());
  $(`#carkm`).val($(`#modelkm`).val());
  $(`#cardate`).val($(`#modeldate`).val());
  $(`#carstatus`).val($(`#modelstatus`).val());
  $(`#carmemo`).val($(`#modelmemo`).val());
}
$(`.carinsert`).on(`click`,function(){
});
$(`.caredit`).on(`click`,function(){
  let carid = $(this).data(`id`);//車輛(產品)編號
});
//車輛資料新增儲存
$(`#send`).on(`click`,async function(){
  let id = $(this).data(`carid`);
  let carObject={
    Carid : id,
    carnumber : $(`#modelcarnumber`).val(),
    Brand : $(`#modelbrand option:selected`).val(),
    Series : $(`#modelseries option:selected`).val(),
    Model : $(`#modelmodel option:selected`).val(),
    Color : $(`#modelcolor option:selected`).val(),
    Km : $(`#modelkm`).val(),
    Date : $(`#modeldate`).val(),
    carstatus : $(`#modelstatus`).val(),
    Memo : $(`#modelmemo`).val()
  }
  if(carObject.Carid){
    //寫修改
    var response = await fetch(url + "/api/Car/edit?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(carObject)
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
  }else{
    //寫新增
    var response = await fetch(url + "/api/Car/create?user=" + curruntid,{
      method : "POST",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(carObject)
    });
    var body = await response.json();
    if(body.status){
      if(body.error){//資料邏輯錯誤
        alert("");
      }else{
        $(this).data("carid",body.data);
        $(`.caredit`).removeAttr("disabled");
        $(`.carinsert`).attr("disabled","disabled");
        alert("新增成功!!");
        getSelfData();
      }
    }else{//系統錯誤
      alert(body.error.errorMsg);
    }
  }
  console.log(carObject);
  modelbindcar(carObject);
  $(`.btn-close`).click();
});

function modelbindcar(carObject){//儲存完綁資料回畫面
  $(`#carnumber`).val(carObject.carnumber);
  $(`#carbrand`).val($(`#modelbrand option:selected`).html());
  $(`#carseries`).val($(`#modelseries option:selected`).html());
  $(`#carmodel`).val($(`#modelmodel option:selected`).html());
  $(`#carcolor`).val($(`#modelcolor option:selected`).html());
  $(`#carkm`).val(carObject.Km);
  $(`#cardate`).val(carObject.Date);
  $(`#carstatus`).val(carObject.carstatus);
  $(`#carmemo`).val(carObject.Memo);
}

$(`#modelbrand`).on(`change`,function(){
  let value = $(`#modelbrand option:selected`).val();
  let SS = $(`#modelseries`);
  SS.empty();
  SS.append(`<option selected>請選擇</option>`)
  $.each(ddllist.SS,(index,item)=>{
    if(item.parentgroup == value){
      SS.append(`<option value="${item.dataid}">${item.data}</option>`);
    }
  })
});
$(`#modelseries`).on(`change`,function(){
  let value = $(`#modelseries option:selected`).val();
  let CMD = $(`#modelmodel`);
  CMD.empty();
  CMD.append(`<option selected>請選擇</option>`)
  $.each(ddllist.CMD,(index,item)=>{
    if(item.parentgroup == value){
      CMD.append(`<option value="${item.dataid}">${item.data}</option>`);
    }
  })
});


//圖檔瀏覽
async function readUrl(input){
  let view = $(`#viewImg`);
  if(input.files && input.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      view.attr("src",e.target.result);
    };
    view.css("max-heigth","100%");
    view.css("max-width","100%");
    view.css("object-fit","contain");
    reader.readAsDataURL(input.files[0]);
  }else if($(input).data("path")){
    let path = $(input).data("path");
    var response = await fetch(url + "/api/OrderCase/getFile?fileString="+path+"&user="+curruntid,{
      method : "Get",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    })
    var file = await response.json();
    console.log(file)
    if(file.Status){
      view.attr("src",file.Data);
      view.css("max-heigth","100%");
      view.css("max-width","100%");
      view.css("object-fit","contain");
    }
  }
}

$(`#addDeitail`).on(`click`,function(){
  $(`#logcaseid`).val($(this).data("caseid"));
})