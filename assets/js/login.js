// checkToken();
// async function checkToken(){
//     let token = localStorage.getItem(`loginToken`);
//     if(token){
//         var response = await fetch(`https://8643-61-222-180-215.ngrok-free.app/api/Login/` + token, {
//             method: "get",
//             headers: new Headers({
//               "ngrok-skip-browser-warning": "69420",
//             }),
//           });
//         var responseData = await response.json();
//         if(responseData.status != 0){
//             openLogin();
//         }
//     }
//     else{
//         openLogin();
//     }
// }

function openLogin(){
    let loginUrl = "https://alan-ddddd.github.io/NewProject/html/auth-login-basic.html";
    localStorage.setItem("backUrl",location.href);
    open(loginUrl,"_self");
}