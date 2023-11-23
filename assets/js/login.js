function openLogin(){
    let loginUrl = fronturl + "/auth-login-basic.html";
    localStorage.setItem("backUrl",location.href);
    open(loginUrl,"_self");
}

function logout(){
    
}