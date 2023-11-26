var url = "https://9719-1-162-48-103.ngrok-free.app";
//var url = "https://localhost:7226";
var fronturl = "https://alan-ddddd.github.io/JD/html";
var datalist;
var curruntuser;
var curruntid;
var curruntlevel;

function response(result){
    if(result.Status){
        if(result.error){//資料邏輯錯誤
          alert("");
        }else{
          alert("新增成功!!");
          return true;
        }
      }else{//系統錯誤
        alert("連線失敗!!");
      }
}

async function ajax(controller,data,method){
    var response = await fetch(url + controller + curruntid,{
        method : method,
        headers : new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
        body : JSON.stringify(data)
      });
      var body = await response.json();
      return body;
}