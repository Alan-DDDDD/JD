var url = "https://2b55-124-218-106-67.ngrok-free.app";
//var url = "https://localhost:5002";
var fronturl = "https://alan-ddddd.github.io/JD/html";
var datalist;
var ddllist;
var curruntuser;
var curruntid;
var curruntlevel;



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