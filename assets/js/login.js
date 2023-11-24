
$(function (){
    curruntid = localStorage.getItem("currid");
    curruntuser = localStorage.getItem("curruser");
    curruntlevel = localStorage.getItem("currlevel");

    if(!curruntid){
        openLogin();
    }
})

function openLogin(){
    let loginUrl = fronturl + "/login.html";
    localStorage.setItem("backUrl",location.href);
    open(loginUrl,"_self");
}

function logout(){
    
}