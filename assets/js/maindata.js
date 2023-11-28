var url = "https://f070-61-230-137-57.ngrok-free.app";
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
          "Content-Type":"application/json"
        }),
        body : JSON.stringify(data)
      });
      var body = await response.json();
      return body;
}

Number.prototype.numberFormat = function(c, d, t){
  var n = this, 
      c = isNaN(c = Math.abs(c)) ? 2 : c, 
      d = d == undefined ? "." : d, 
      t = t == undefined ? "," : t, 
      s = n < 0 ? "-" : "", 
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
      j = (j = i.length) > 3 ? j % 3 : 0;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};