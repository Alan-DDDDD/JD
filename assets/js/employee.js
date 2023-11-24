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

$(`#empltbody`).on(`click`,`.btne`,(e)=>{
  let id = $(e).data("id");
  alert(id)
})