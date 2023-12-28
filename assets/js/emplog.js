
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
  }else{
    console.log("CODE資料取得失敗")
  }

  //取得PersonalData資料
  var response = await fetch(url+"/api/Statistic/getEmpLog?user="+curruntid,{
    method: "get",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
  var result = await response.json();
  if(result.Status){
    let datalist = result.Data;
    let emplist = $(`#emplist`);
    emplist.empty();
    $.each(datalist,(index,value)=>{
      emplist.append(`<tr class="emplist" data-id="${value.empid}" style="cursor:pointer">
                          <td>${value.empname}</td>
                          <td>${value.action.numberFormat(0,".",",")}</td>
                          <td>${value.done.numberFormat(0,".",",")}</td>
                          <td>${value.giveup.numberFormat(0,".",",")}</td>
                          <td>${value.turn}</td>
                        </tr>`);
    });
  }else{
    console.log("資料取得失敗")
  }
})
//getSelfData();
async function getSelfData(){
  
}
//搜尋
function select(){
  let key = $(`#search`).val();
  $("#budgettbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
}

//table事件
$(`#emplist`).on(`click`,`.emplist`,function(){
  let tr = $(this);
  console.log(tr);
  let empid = tr.data(`id`);
  open(fronturl + "/personallog.html?empid=" + empid,"_self");
});

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
    position: 'none'
  });
  chart.intervalSymmetric()
    .position('action*value')
    .color('action', ['#072D57', '#284668', '#104e96', '#366192', '#156dd1'])
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