$(`#login`).on(`click`,async function (e){
    e.preventDefault();
    var formdata = new FormData(formAuthentication);
    formdata.append(`check`,null);
    var data = {
        EMPID:$(`#email`).val(),
        EMPPWD:$(`#password`).val()
    };
    var response = await fetch(`${url}/api/Login`,{
        method:"Post",
        headers: {
            "ngrok-skip-browser-warning": "true"
        },
        contentType: 'application/json',
        body:JSON.stringify(data)
    });
    var responseData = await response.json();
    console.log(responseData);
    if(responseData.status == 0){
        localStorage.setItem(`loginToken`,responseData.data);
        let url = localStorage.getItem(`backUrl`)
        if(url){
            localStorage.removeItem(`backUrl`); 
            open(url,"_self");
        }
    }
    else{
        if(responseData.status == 1){
            var formdata = new FormData(formAuthentication);
            formdata.append(`check`,confirm(responseData.msg));
            var response = await fetch(`${url}/api/Login`,{
                method:"Post",
                body:formdata
            });
            var responseData = await response.json();
            console.log(responseData);
            if(responseData.status == 0){
                localStorage.setItem(`loginToken`,responseData.data);
                let url = localStorage.getItem(`backUrl`)
                if(url){
                    localStorage.removeItem(`backUrl`); 
                    open(url,"_self");
                }
            }
        }
    }
})
