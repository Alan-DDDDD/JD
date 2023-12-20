$(async function(){
  var result = await fetch(url + "/api/EMPL/Page?user="+curruntid,{
    method : "Get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var object = await result.json();
  if(!object.Status){
    alert(object.error.ErrorMsg);
    open(fronturl + "/case.html","_self")
  }
})
getSelfData();
$(async function(){
  //初始化畫面
  $(`#mainpanel`).hide();
  $(`.toolbar`).attr("disabled","disabled");
  detailControl("close");
  //取得ddl資料
  let parames = ["BD","SS","CMD","CL","CS"];
  var carddl = await fetch(url+"/api/Code/getMultiddl",{
    method: "post",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
      "Content-Type": "application/json"
    }),
    body : JSON.stringify(parames)
  })
  var carddldata = await carddl.json();
  if(carddldata.Status){
    ddllist = carddldata.Data;
  }else{
    console.log("CODE資料取得失敗")
  }
  //圖檔瀏覽
  $(`.filebtn`).on(`click`,async function(){
    var input = document.getElementById($(this).data("id"));
      await readUrl(input);
  });
})



async function getSelfData(caseid){
  $(`#caselist`).empty();
  $(`#caselist`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
    var response = await fetch(url + "/api/OrderCase?user=" + localStorage.getItem(`currid`) + "&flag=A", {
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
          table.append(`<tr class="listdata" style="cursor:pointer;" id="${data.OrderCase.caseid}">
                            <td>${data.OrderCase.caseid}</td>
                            <td>採購</td>
                            <td>${data.EMPL.EMPNAME}</td>
                            <td>${data.Code}</td>
                            <td>${data.Car == null? "" : data.Car.carnumber}</td>
                            <td>${data.OrderCase.a_sysdt.substring(0,10)}</td>
                        </tr>`);
          if(caseid == data.OrderCase.caseid){
            listclick(caseid);
          }
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
  $("#caselist tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}

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
  detailControl("open");
  console.log($(this));
  clearPage();
  let caseid = $($(this).children()[0]).html();
  //設定table樣式
  $(`#listpanel tr`).removeClass("bg-secondary");
  $(`#listpanel tr`).css("color","");
  $(this).addClass("bg-secondary");
  $(this).css("color","white");
  listclick(caseid);
})
$(`#pass,#cancel`).on(`click`,async function(){
  let caseid = $(`#pass`).data("caseid");
  let flag = $(this).data("flag");
  SCASE(caseid,flag);
});

//CAR INSERT AND EDIT AND EVENT
function cardatabind(car){
  $(`#carbrand`).val(ddllist.BD.filter(x=>x.dataid == car.brand)[0].data);
  $(`#carseries`).val(ddllist.SS.filter(x=>x.dataid == car.series)[0].data);
  $(`#carmodel`).val(ddllist.CMD.filter(x=>x.dataid == car.model)[0].data);
  $(`#carcolor`).val(ddllist.CL.filter(x=>x.dataid == car.color)[0].data);
  $(`#carnumber`).val(car.carnumber);
  $(`#carkm`).val(car.km);
  $(`#cardate`).val(car.date);
  $(`#carstatus`).val(car.carstatus);
  $(`#carmemo`).val(car.memo);
}

//圖檔瀏覽
async function readUrl(input){
  let view = $(`#viewImg`);
  $(`#imgmainwait`).remove();
  view.parent().append(`<div class="spinner-border text-primary" role="status" id="imgmainwait">
      <span class="visually-hidden">Lodding....</span>
      </div>`);
  view.css("display","none");
  if(input.files && input.files[0]){
    var reader = new FileReader();
    reader.onload = function(e){
      view.attr("src",e.target.result);
    };
    view.css("max-heigth","100%");
    view.css("max-width","100%");
    view.css("object-fit","contain");
    reader.readAsDataURL(input.files[0]);
    $(`#imgmainwait`).remove();
    view.css("display","");
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
      $(`#imgmainwait`).remove();
      view.css("display","");
    }else{
      $(`#imgmainwait`).remove();
    }
  }
}

//詳細資料元素控制
function detailControl(action){
  switch (action){
    case "open":
      $(`.casepanel input,button,textarea`).removeAttr("disabled");
      //初始化畫面
      $(`.casefix`).attr("disabled","disabled");
      $(`#mainpanel`).hide();
      $(`.carinput`).attr("disabled","disabled");
      $(`.toolbar`).attr("disabled","disabled");
      break;
    case "close":
      $(`.casepanel input,button,textarea`).attr("disabled","disabled");
      $(`.filebtn`).removeAttr("disabled");
      //$(`#pass`).removeAttr("disabled");
      //$(`#cancel`).removeAttr("disabled");
      $(`#btnclose`).removeAttr("disabled");
      break;
  }
}


//案件異動(送審、作廢)
async function SCASE(caseid,flag){
  var response = await fetch(url + "/api/OrderCase/SCASE?user="+curruntid+"&caseid="+caseid+"&flag="+flag,{
    method : "Get",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var data = await response.json();
  if(data.Status){
    detailControl("close");
    getSelfData();
    $(`#mainpanel`).hide();
    $(`#listpanel`).slideToggle();
    alert(data.Data);
  }else{
    alert(data.error.ErrorMsg)
  }
}

function progress(status){
   let statuscount = ddllist.CS.length;
   let s = parseInt(status) + 1;
   let val = (s/statuscount)*100;
   let stateval = $(`#casestatusbar div`);
   stateval.css("width",`${val}%`);
   stateval.data("valuenow",val);
   if(status == "10"){
    stateval.removeClass("bg-primary");
    stateval.removeClass("bg-danger");
    stateval.addClass("bg-success");
   }else if(status == "99"){
    stateval.removeClass("bg-primary");
    stateval.removeClass("bg-success");
    stateval.addClass("bg-danger");
   }else{
    stateval.removeClass("bg-danger");
    stateval.removeClass("bg-success");
    stateval.addClass("bg-primary");
   }
}

function flash(element){

}

function listclick(caseid){
  //設定頁面元件
  $(`#pass`).data("caseid",caseid);
  $(`.toolbar`).removeAttr("disabled");
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
      if(value.Car) cardatabind(value.Car); 
      //綁定檔案路徑與顯示資料
      $(`#carkeyinput`).data("path",value.OrderCase.carkey);
      $(`#carpaper1input`).data("path",value.OrderCase.paper1);
      $(`#carpaper2input`).data("path",value.OrderCase.paper2);
      $(`#carpaper3input`).data("path",value.OrderCase.paper3);
      $(`#idcardFinput`).data("path",value.OrderCase.idcardf);
      $(`#idcardRinput`).data("path",value.OrderCase.idcardr);
      $(`#bankinput`).data("path",value.OrderCase.bank);
      $(`#carkeyinput`).parent().prev().html(value.OrderCase.carkey == null ? "❌  鑰匙":"✔️  鑰匙");
      $(`#carpaper1input`).parent().prev().html(value.OrderCase.paper1 == null ? "❌  行照":"✔️  行照");
      $(`#carpaper2input`).parent().prev().html(value.OrderCase.paper2 == null ? "❌  牌照登記書":"✔️ 牌照登記書");
      $(`#carpaper3input`).parent().prev().html(value.OrderCase.paper3 == null ? "❌  出廠證":"✔️  出廠證");
      $(`#idcardFinput`).parent().prev().html(value.OrderCase.idcardf == null ? "❌  身分證正面":"✔️  身分證正面");
      $(`#idcardRinput`).parent().prev().html(value.OrderCase.idcardr == null ? "❌  身分證反面":"✔️  身分證反面");
      $(`#bankinput`).parent().prev().html( value.OrderCase.bank == null ? "❌  銀行存摺":"✔️  銀行存摺");
      //根據資料修改畫面
      progress(value.OrderCase.status);
      let sendcase = $(`#sendcase`);
      let caredit = $(`.caredit`);
      let carinsert = $(`.carinsert`);
      let giveup = $(`#giveup`);
      
      if(value.OrderCase.sckdt != null){
        detailControl("close");
      }
      else{
      }
    }
  })
  //開啟頁面
  $(`#mainpanel`).show(300);
  $(`#listpanel`).slideToggle();
}