getSelfData();
async function getSelfData(){
    //const userid = "F111111111";
    const userid = "F128933062";
    //var apis = ["getAccount","getMonthReport","getYearReport"];
    var apis = ["Account"];
    $.each(apis,async function(index,item){
        await api(item);
    });
    
}

async function api(api){
    let apiDetail = `/api/${api}/`;
    let token = localStorage.getItem("loginToken");
    switch (api){
        case "getAccount":
            apiDetail += `token=${token}`;
            break;
        case "getMonthReport":
            apiDetail += `token=${token}&month=${month}&year=${year}`;
            break;
        case "getYearReport":
            apiDetail += `token=${token}&year=${year}`;
            break;
    }
    var response = await fetch(url + apiDetail, {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
          "authorization":token
        }),
      });
    var body = await response.json();
    console.log(body);
    var table = $(`#AccountList tbody`);
    if(body.status == 0){
        $.each(body.data,function(index,data){
            switch (api){
                case "Account":
                    appendData(data);
                    break;
                case "getMonthReport":
                    appendMonthData();
                    break;
                case "getYearReport":
                    appendYearData();
                    break;
            }
        });
    }
    else{
      openLogin();
    }
}

function appendData(data){
    $(`#acash`).append(`<tr>
                            <td class="align-middle">${data.accountName}</td>
                            <td class="py-3">
                              <p class="mb-0">${data.amount}</p>
                            </td>
                       </tr>
    `);
    var old = $(`#Allcash`).text().split(`:`)[1].trim();
    var cul = old == "" ? data.amount : Number(old) + data.amount;

    $(`#Allcash`).text(`現金帳戶 : ${cul}`);
}

function appendMonthData(data){
    $(`#month`)
}

function appendYearData(data){
    $(`#year`)
}