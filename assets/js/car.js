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
    brand.append(`<option selected>請選擇</option>`);
    //color.append(`<option selected>請選擇</option>`);
    $.each(ddllist.BD,(index,item)=>{
      brand.append(`
          <option value="${item.dataid}">${item.data}</option>
      `)
    })
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
    var response = await fetch(url + "/api/Car?user=" + localStorage.getItem(`currid`), {
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
                            <td>${data.brand}</td>
                            <td>${data.series}</td>
                            <td>${data.model}</td>
                            <td>${data.color}</td>
                            <td>${data.km}</td>
                            <td>${data.date}</td>
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
  var response = await fetch(url + "/api/Car?BD=" + BD + "&SS=" + SS + "&CMD=" + CMD + "&user=" + curruntid,{
    method : "Get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var data = await response.json();
  if(data.Status){
    let table = $(`#cartbody`);
    $.each(data.Data,(index,value)=>{
      table.append(`<tr>
                        <td>${value.brand}</td>
                        <td>${value.series}</td>
                        <td>${value.model}</td>
                        <td>${value.color}</td>
                        <td>${value.km}</td>
                        <td>${value.date}</td>
                    </tr>`);
    });
  }
})