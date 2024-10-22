const AUTH={
    TOKEN_KEY:"token",
    USER_ID_key:"userId",
};

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
export const createThread=(title,isPublic,content)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch('http://localhost:5005/thread',{
        method:"POST",
        body:JSON.stringify({
            title,
            isPublic,
            content,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//-----getALLthreads-----
export const getThreads=(startIndex)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:5005/threads?start=${startIndex}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//-----get Threads detail information-----
export const getThreadDetail=(threadId)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:5005/thread?id=${threadId}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}
//-----edit threads -----
export const editThread=(id,title,isPublic,lock,content)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch('http://localhost:5005/thread',{
        method:"PUT",
        body:JSON.stringify({
            id,
            title,
            isPublic,
            lock,
            content,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//delete threads 
export const deleteThread=(id)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch('http://localhost:5005/thread',{
        method:"DELETE",
        body:JSON.stringify({
            id,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//like thread
export const likeThread=(id,turnon)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch('http://localhost:5005/thread/like',{
        method:"PUT",
        body:JSON.stringify({
            id,
            turnon,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}
//watch thread
export const watchThread=(id,turnon)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch('http://localhost:5005/thread/watch',{
        method:"PUT",
        body:JSON.stringify({
            id,
            turnon,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//get one threads' comments detail
export const getCommentDetail=(threadId)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:5005/comments?threadId=${threadId}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}

//create new comment 
export const createNewComment=(content,threadId,parentCommentId)=>{
    const token=localStorage.getItem(AUTH.TOKEN_KEY);
    return fetch(`http://localhost:5005/comment`,{
        method:"POST",
        body:JSON.stringify({
            content,
            threadId,
            parentCommentId,
        }),
        headers:{
            "Content-type":"application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response)=>response.json())
    .then(errorThrow)
}