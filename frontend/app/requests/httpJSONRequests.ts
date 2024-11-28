export async function postJSON(request_url : string, header_data : object , data : object){
    return fetch(request_url , {
        method : "POST",
        credentials: 'include',
        headers : {"Content-Type" : "application/json", ...header_data},
        body : JSON.stringify(data) 
    })
}


export async function getJSON(request_url : string, header_data : object){
    return fetch(request_url , {
        method : "GET",
        credentials: 'include',
        headers : {"accept" : "application/json", ...header_data},
    })
}