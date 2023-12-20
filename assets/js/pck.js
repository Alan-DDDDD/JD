getSelfData();
$(async function(){
  //初始化畫面
  $(`#mainpanel`).hide();
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
    // let brand = $(`#modelbrand`);
    // let color = $(`#modelcolor`);
    // brand.append(`<option selected>請選擇</option>`);
    // color.append(`<option selected>請選擇</option>`);
    // $.each(ddllist.BD,(index,item)=>{
    //   brand.append(`
    //       <option value="${item.dataid}">${item.data}</option>
    //   `)
    // })
    // $.each(ddllist.CL,(index,item)=>{
    //   color.append(`
    //       <option value="${item.dataid}">${item.data}</option>
    //   `)
    // })
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

// $(`#addcase`).on(`click`,()=>{
//   detailControl("open");
//   clearPage();
//   $(`#casesave`).removeAttr("disabled");
//   $(`#empid`).val(curruntid);
//   $(`#empname`).val(curruntuser);
//   $(`#casestatus`).val("進件中");
//   $(`#casedate`).val(new Date());
//   $(`#mainpanel`).show(300);
//   if($(`#listpanel`).css("display") != "none"){
//     $(`#listpanel`).slideToggle();
//   }
// })

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
//ToolBar btn event
// $(`#sendcase`).on(`click`,async function(){
//   let caseid = $(`.casesave`).data(`caseid`);
//   SCASE(caseid,"spaper");
// });

// $(`#giveup`).on(`click`,function(){
//   let caseid = $(`.casesave`).data(`caseid`);
//   SCASE(caseid,"gu");
// });

//CASE INSERT AND EDIT AND
// $(`.casesave`).on('click',async function(){
//   let caseid = $(this).data("caseid");
//   let caseObject = {
//     caseid : caseid,
//     emplid : $(`#empid`).val(),
//     custname : $(`#custname`).val(),
//     custphone : $(`#custphone`).val(),
//     carid : $(`#send`).data("carid"),
//     price : $(`#price`).val() || 0,
//     dealprice : $(`#dealprice`).val() || 0,
//     status : $(`#casestatus`).val()
//   }
//   let files = [
//     document.getElementById("carkeyinput").files[0],
//     document.getElementById("carpaper1input").files[0],
//     document.getElementById("carpaper2input").files[0],
//     document.getElementById("carpaper3input").files[0],
//     document.getElementById("idcardFinput").files[0],
//     document.getElementById("idcardRinput").files[0],
//     document.getElementById("bankinput").files[0]
//   ]
//   let fileName = [
//     "carkey",
//     "paper1",
//     "paper2",
//     "paper3",
//     "idcardf",
//     "idcardr",
//     "bank"
//   ]
//   var form = new FormData();
//   for(var i = 0;i<files.length;i++){
//     if(files[i]){
//       form.append(`files`,files[i],fileName[i])
//     }
//   }
//   form.append(`orderCase`,JSON.stringify(caseObject));
//   //案件基本資料API
//   if(caseid){
//     //修改
//     var response = await fetch(url + "/api/OrderCase/edit?user=" + curruntid,{
//       method : "POST",
//       headers : new Headers({
//         "ngrok-skip-browser-warning": "69420",
//       }),
//       body : form
//     });
//     var body = await response.json();
//     if(body.status){
//       if(body.error){//資料邏輯錯誤
//         alert("");
//       }else{
//         getSelfData(caseid);
//         alert("編輯成功!!");
//       }
//     }else{//系統錯誤
//       alert(body.error.errorMsg);
//     }
//   }else{
//     //新增
//     var response = await fetch(url + "/api/OrderCase/create?user=" + curruntid,{
//       method : "POST",
//       headers : new Headers({
//         "ngrok-skip-browser-warning": "69420",
//       }),
//       body : form
//     });
//     var body = await response.json();
//     if(body.status){
//       if(body.error){//資料邏輯錯誤
//         alert("");
//       }else{
//         $(this).data("caseid",body.data);
//         getSelfData(body.data);
//         alert("新增成功!!");
//       }
//     }else{//系統錯誤
//       alert(body.error.errorMsg);
//     }
//   }
//   $(`#mainpanel`).hide(300);
//   $(`#listpanel`).slideToggle();
// });


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
// $(`.carinsert`).on(`click`,function(){
// });
// $(`.caredit`).on(`click`,function(){
//   let carid = $(this).data(`id`);//車輛(產品)編號
// });
//車輛資料新增儲存
// $(`#send`).on(`click`,async function(){
//   let id = $(this).data(`carid`);
//   let carObject={
//     Carid : id,
//     carnumber : $(`#modelcarnumber`).val(),
//     Brand : $(`#modelbrand option:selected`).val(),
//     Series : $(`#modelseries option:selected`).val(),
//     Model : $(`#modelmodel option:selected`).val(),
//     Color : $(`#modelcolor option:selected`).val(),
//     Km : $(`#modelkm`).val(),
//     Date : $(`#modeldate`).val(),
//     carstatus : $(`#modelstatus`).val(),
//     Memo : $(`#modelmemo`).val()
//   }
//   if(carObject.Carid){
//     //寫修改
//     var response = await fetch(url + "/api/Car/edit?user=" + curruntid,{
//       method : "POST",
//       headers : new Headers({
//         "ngrok-skip-browser-warning": "69420",
//         "Content-Type":"application/json"
//       }),
//       body : JSON.stringify(carObject)
//     });
//     var body = await response.json();
//     if(body.status){
//       if(body.error){//資料邏輯錯誤
//         alert("");
//       }else{
//         alert("編輯成功!!");
//         getSelfData();
//       }
//     }else{//系統錯誤
//       alert(body.error.errorMsg);
//     }
//   }else{
//     //寫新增
//     var response = await fetch(url + "/api/Car/create?user=" + curruntid,{
//       method : "POST",
//       headers : new Headers({
//         "ngrok-skip-browser-warning": "69420",
//         "Content-Type":"application/json"
//       }),
//       body : JSON.stringify(carObject)
//     });
//     var body = await response.json();
//     if(body.status){
//       if(body.error){//資料邏輯錯誤
//         alert("");
//       }else{
//         $(this).data("carid",body.data);
//         $(`.caredit`).removeAttr("disabled");
//         $(`.carinsert`).attr("disabled","disabled");
//         alert("新增成功!!");
//         getSelfData();
//       }
//     }else{//系統錯誤
//       alert(body.error.errorMsg);
//     }
//   }
//   //console.log(carObject);
//   modelbindcar(carObject);
//   $(`.btn-close`).click();
// });
// var contactlist;
// //聯絡紀錄新增修改
// $(`#sendlog`).on('click',async function(){
//   let caseid = $(`.casesave`).data("caseid");
//   let contact = {
//     caseid : caseid,
//     contactid : $(`#logcaseid`).val(),
//     contmemo : $(`#logmemo`).val()
//   }
//   if(caseid){
//     var response = await fetch(url+ "/api/Contact/Data?user="+curruntid,{
//       method : "Post",
//       headers : new Headers({
//         "ngrok-skip-browser-warning": "69420",
//         "Content-Type":"application/json"
//       }),
//       body : JSON.stringify(contact)
//     })
//     var data = await response.json();
//     if(data.Status){
//       getContact($(`#addDeitail`).data("caseid"));//刷新畫面
//       alert(data.Data);
//     }else{
//       alert(data.error.ErrorMsg);
//     }
//   }
// })

// function modelbindcar(carObject){//儲存完綁資料回畫面
//   $(`#carnumber`).val(carObject.carnumber);
//   $(`#carbrand`).val($(`#modelbrand option:selected`).html());
//   $(`#carseries`).val($(`#modelseries option:selected`).html());
//   $(`#carmodel`).val($(`#modelmodel option:selected`).html());
//   $(`#carcolor`).val($(`#modelcolor option:selected`).html());
//   $(`#carkm`).val(carObject.Km);
//   $(`#cardate`).val(carObject.Date);
//   $(`#carstatus`).val(carObject.carstatus);
//   $(`#carmemo`).val(carObject.Memo);
// }

// $(`#modelbrand`).on(`change`,function(){//廠牌下拉選單更變
//   let value = $(`#modelbrand option:selected`).val();
//   let SS = $(`#modelseries`);
//   SS.empty();
//   SS.append(`<option selected>請選擇</option>`)
//   $.each(ddllist.SS,(index,item)=>{
//     if(item.parentgroup == value){
//       SS.append(`<option value="${item.dataid}">${item.data}</option>`);
//     }
//   })
// });
// $(`#modelseries`).on(`change`,function(){//系列下拉選單更變
//   let value = $(`#modelseries option:selected`).val();
//   let CMD = $(`#modelmodel`);
//   CMD.empty();
//   CMD.append(`<option selected>請選擇</option>`)
//   $.each(ddllist.CMD,(index,item)=>{
//     if(item.parentgroup == value){
//       CMD.append(`<option value="${item.dataid}">${item.data}</option>`);
//     }
//   })
// });


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
      $(`#pass`).removeAttr("disabled");
      $(`#cancel`).removeAttr("disabled");
      $(`#btnclose`).removeAttr("disabled");
      break;
  }
}

// $(`#addDeitail`).on(`click`,function(){
//   let caseid = $(this).data("caseid");
//   $(`#contacttable tbody`).empty();
//   getContact(caseid)
// })
// $(`#contacttable tbody`).on('click','.dataedit',function(){
//   let thistd = $(this).parent();
//   $(`#logcaseid`).val(thistd.parent().data("id"));
//   $(`#logcaseid`).attr("disabled","disables");
//   $(`#logmemo`).val(thistd.prev().html());
//   //thistd.parent().remove();
// });
// async function getContact(caseid){
//   $(`#logcaseid`).val("");
//   $(`#logmemo`).val("");
//   var response = await fetch(url + "/api/Contact/getAll?user=" + curruntid + "&caseid=" + caseid,{
//     method : "Get",
//     headers : new Headers({
//       "ngrok-skip-browser-warning": "69420",
//     })
//   })
//   var data = await response.json();
//   if(data.Status){
//     contactlist = data.Data;
//     let table = $(`#contacttable tbody`);
//     table.empty();
//     $.each(contactlist,(index,value)=>{
//       table.append(`<tr data-id="${value.contactid}">
//       <td style="width:35%">${value.a_sysdt.substring(0,10)}</td>
//       <td style="width:50%;max-width:300px;word-wrap:break-word">${value.contmemo}</td>
//       <td style="width:15%">
//         <small class="badge bg-label-warning dataedit" style="cursor:pointer;">編輯</small>
//       </td>
//       </tr>`);
//     })
//   }
// }

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
    $(`#bankinput`).removeAttr("disabled");
    $(`#bankbtn`).removeAttr("disabled");
    switch (flag){
      case "spaper":
        break;
      case "gu":
        $(`#bankinput`).attr("disabled","disabled");
        $(`#casesave`).attr("disabled","disabled");
        break;
    }
    getSelfData();
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
  // $(`#casesave`).removeAttr("disabled");
  // $(`.casesave`).data("caseid",caseid);
  // $(`#addDeitail`).data("caseid",caseid);
  // $(`#addDeitail`).removeAttr("disabled");
  $(`#pass`).data("caseid",caseid);
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
        //$(`#bankinput`).removeAttr("disabled");
        //$(`#bankbtn`).removeAttr("disabled");
      }
      else{
        // detailControl("open");
        // giveup.removeAttr("disabled");
        // if(value.Car){
        //   caredit.removeAttr("disabled");
        //   carinsert.attr("disabled","disabled");
        // }else{
        //   caredit.attr("disabled","disabled");
        //   carinsert.removeAttr("disabled");
        // }
        // if(value.OrderCase.status >= "05"){
        //   sendcase.removeAttr("disabled");
        // }else{
        //   sendcase.attr("disabled","disabled");
        // }
      }
      // if(value.OrderCase.status == "99"){
      //   detailControl("close");
      //   $(`#casesave`).attr("disabled","disabled");
      // }
    }
  })
  //開啟頁面
  $(`#mainpanel`).show(300);
  $(`#listpanel`).slideToggle();
}