$(async function(){
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
    let brand = $(`#BD`);
    //let color = $(`#modelcolor`);
    brand.append(`<option value="" selected>請選擇</option>`);
    //color.append(`<option selected>請選擇</option>`);
    $.each(ddllist.BD,(index,item)=>{
      brand.append(`
          <option value="${item.dataid}">${item.data}</option>
      `)
    })
    $(`#SS`).append(`<option value="" selected>請選擇</option>`);
    $(`#CMD`).append(`<option value="" selected>請選擇</option>`);
    // $.each(ddllist.CL,(index,item)=>{
    //   color.append(`
    //       <option value="${item.dataid}">${item.data}</option>
    //   `)
    // })
  }else{
    console.log("CODE資料取得失敗")
  }
})
getSelfData();
async function getSelfData(){
  $(`#cartbody`).empty();
  $(`#cartbody`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
    var response = await fetch(url + "/api/Car?user=" + localStorage.getItem(`currid`) + "&flag=A", {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });
    var body = await response.json();
    var table = $(`#cartbody`);
    if(body.Status){
      datalist = body.Data
      $.each(datalist,function(index,data){
          table.append(`<tr>
                            <td>${data.model}</td>
                            <td>${data.color}</td>
                            <td>${data.km.numberFormat(0,".",",")}</td>
                            <td>${data.date}</td>
                            <td>${data.years}</td>
                            <td style="max-width:300px;white-space: pre-wrap;">${data.carstatus}</td>
                            <td>${data.price.numberFormat(0,".",",")}</td>
                            <td>${data.dealprice.numberFormat(0,".",",")}</td>
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
  $("#cartbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}

//event
$(`#BD,#SS`).on(`change`,function(){
  let parentid = $(this).data(`id`);
  let sonid = parentid == "BD" ? "SS":"CMD";
  let parentValue = $(`#${parentid} option:selected`).val();
  let son = $(`#${sonid}`);
  son.empty();
  son.append(`<option value="">請選擇</option>`);
  let datalist = sonid == "SS" ? ddllist.SS : ddllist.CMD;
  $.each(datalist,(index,data)=>{
    if(data.parentgroup == parentValue){
      son.append(`<option value="${data.dataid}">${data.data}</option>`);
    }
  });
});

$(`#carsearch`).on(`click`,async function(){
  let BD = $(`#BD option:selected`).val();
  let SS = $(`#SS option:selected`).val();
  let CMD = $(`#CMD option:selected`).val();
  var response = await fetch(url + "/api/Car?BD=" + BD + "&SS=" + SS + "&CMD=" + CMD + "&user=" + curruntid + "&flag=A",{
    method : "Get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var data = await response.json();
  if(data.Status){
    let table = $(`#cartbody`);
    table.empty();
    $.each(data.Data,(index,value)=>{
      table.append(`<tr>
                        <td>${value.model}</td>
                        <td>${value.color}</td>
                        <td>${value.km.numberFormat(0,".",",")}</td>
                        <td>${value.date}</td>
                        <td>${value.years}</td>
                        <td style="max-width:300px;white-space: pre-wrap;">${value.carstatus}</td>
                        <td>${value.price.numberFormat(0,".",",")}</td>
                        <td>${value.dealprice.numberFormat(0,".",",")}</td>
                    </tr>`);
    });
  }
})

$(`#cartbody`).on(`click`,`.btne`,async function(){
  let carid = $(this).data(`id`);
  var response = await fetch(url + "/api/Car/sold?user=" + curruntid + "&carid=" + carid,{
    method : "Get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var result = await response.json()
  if(result.Status){
    alert(carid + result.Data)
  }else{
    alert(result.error.ErrorMsg);
  }
  getSelfData();
});