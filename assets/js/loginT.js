localStorage.removeItem("currid");
localStorage.removeItem("curruser");
localStorage.removeItem("currlevel");

$(`#login`).on(`click`,async function (e){
    e.preventDefault();
    var data = {
        EMPID:$(`#email`).val(),
        EMPPWD:$(`#password`).val()
    };
    console.log(data);
    var response = await fetch(`${url}/Login`,{
        method:"Post",
        headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": 'application/json',
        },
        body:JSON.stringify(data),
    });
    var responseData = await response.json();
    console.log(responseData);
    if(responseData.Status){
        localStorage.setItem(`currid`,responseData.Data.EMPL.EMPID);
        localStorage.setItem(`curruser`,responseData.Data.EMPL.EMPNAME);
        localStorage.setItem(`currlevel`,responseData.Data.LVNAME);
        let url = localStorage.getItem(`backUrl`)
        if(url){
            localStorage.removeItem(`backUrl`); 
            open(url,"_self");
        }
    }
    else{
        alert(responseData.error.ErrorMsg);
        // if(responseData.status == 1){
        //     var formdata = new FormData(formAuthentication);
        //     formdata.append(`check`,confirm(responseData.msg));
        //     var response = await fetch(`${url}/api/Login`,{
        //         method:"Post",
        //         body:formdata
        //     });
        //     var responseData = await response.json();
        //     console.log(responseData);
        //     if(responseData.status == 0){
        //         localStorage.setItem(`loginToken`,responseData.data);
        //         let url = localStorage.getItem(`backUrl`)
        //         if(url){
        //             localStorage.removeItem(`backUrl`); 
        //             open(url,"_self");
        //         }
        //     }
        // }
    }
})
