

const errorThrow=(res)=>{
    const {error}= res;
    if(error){
        throw new Error(error);
    }
    return res;
};
//------login fetch------
export const login=(email,password)=>{
    return fetch('http://localhost:5005/auth/login',{
        method:"POST",
        body:JSON.stringify({
            email,
            password,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//-----regist fetch-----
export const regist=(email,password,name)=>{
    return fetch('http://localhost:5005/auth/register',{
        method:"POST",
        body:JSON.stringify({
            email,
            password,
            name,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//-----createThread-----