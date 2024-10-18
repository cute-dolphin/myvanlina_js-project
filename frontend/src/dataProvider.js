const errorThrow=(res)=>{
    const {error}= res;
    if(error){
        throw new Error(error);
    }
    return res;
};

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