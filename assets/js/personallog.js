
$(async function(){
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var empid = url.searchParams.get(`empid`);

  if(empid){
    //取得PersonalData資料
    var response = await fetch(url+"/api/Statistic/getPerOne?user="+curruntid+"&empid="+empid,{
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    })
    var result = await response.json();
    if(result.Status){
      let datalist = result.Data;
      $(`#empid`).html(datalist.empid);
      $(`#empname`).html(datalist.empname);
      $(`#monthtotal`).html(datalist.monthtotal);
      $(`#yeartotal`).html(datalist.yeartotal);
      $(`#ablecoda`).html(datalist.ablecode);
      Chart(datalist.ChartData);
      let CulTable = $(`#CulTable`);
      let DeitailTable = $(`#DeitailTable`);
      CulTable.empty();
      DeitailTable.empty();
      $.each(datalist.Cul,(index,value)=>{
        CulTable.append();
      });
      $.each(datalisty.Deitail,(index,value)=>{
        DeitailTable.append();
      })
    }else{
      console.log("資料取得失敗")
    }
  }
  //取得EMP資料
  // var emp = await fetch(url+"/EMPL/getAllEMPL?user=" + localStorage.getItem(`currid`) + "&flag=Y",{
  //   method: "get",
  //   headers: new Headers({
  //     "ngrok-skip-browser-warning": "69420",
  //   }),
  // })
  // var empdata = await emp.json();
  // if(empdata.Status){
  //   let emplist = $(`#emplist`);
  //   emplist.append(`<option selected>請選擇</option>`)
  //   $.each(empdata.Data,(index,item)=>{
  //     emplist.append(`
  //         <option value="${item.EMPID}">${item.EMPID}  ${item.EMPNAME}</option>
  //     `)
  //   })
  // }else{
  //   console.log("EMP資料取得失敗")
  // }
})
//getSelfData();
async function getSelfData(){
  $(`#budgettbody`).empty();
  $(`#budgettbody`).append(`<div class="spinner-border text-primary" role="status" id="mainwait">
    <span class="visually-hidden">Lodding....</span>
  </div>`);
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
                            <td onclick="detail('${data.empid}');" style="cursor:pointer;">${data.empname}</td>
                            <td>${data.pb.balance.numberFormat(0,".",",")}</td>
                            <td>${data.pb.keep.numberFormat(0,".",",")}</td>
                            <td>${data.pb.total.numberFormat(0,".",",")}</td>
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
    $(`#mainwait`).remove();
}
//搜尋
function select(){
  // let key = $(`#search`).val();
  // $("#budgettbody tr").filter(function() {
  //   $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  // });
}

// function detail(empid){
//   localStorage.setItem("amountparame",empid);
//   open(fronturl + "/amount.html","_self");
// }

function Chart(data){
  // var data = [
  //   {"action": "Website visits", "value": 5654},
  //   {"action": "Downloads", "value": 4064},
  //   {"action": "Requested price list", "value": 1987},
  //   {"action": "Invoice sent", "value": 976},
  //   {"action": "Finalized", "value": 484}
  // ];
  var chart = new G2.Chart({
    id: 'c1',
    //forceFit: true,
    width:300,
    height: 300,
    plotCfg: {
     //margin: 80
    }
  });
  chart.source(data);
  chart.coord('rect').transpose().scale(1,-1);
  chart.axis(false);
  chart.legend('action', {
    position: 'bottom'
  });
  chart.intervalSymmetric()
    .position('action*value')
    .color('action', ['#C82B3D', '#EB4456', '#F9815C', '#F8AB60', '#EDCC72'])
    .shape('funnel')
    .label('', {offset: 10, label: {fontSize: 14}}).animate({
    appear:{
      animation:'zoomIn'
    },
    leave:{
      animation:'fadeIn',
      easing:'easeInQuart'
    }
  });
  chart.render();
}