import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import {login} from './dataProvider.js'
import {regist,createThread,getThreads,getThreadDetail,editThread,deleteThread,likeThread} from './dataProvider.js'
import { AUTH } from './constants.js';
//functinon parts
//------------login------------
//create a line, include label and input
const createLine=(content,id,type,value="")=>{
    const div1=document.createElement("div");
    const label=document.createElement("label");
    const input=document.createElement("input");
    input.setAttribute("id",id);
    label.innerText=content;
    input.type=type;
    if(type==="text"){
        input.placeholder=value;
    }else if (type==="checkbox"){
        input.checked=value;
    }
    div1.appendChild(label);
    div1.appendChild(input);
    return div1;
}

//create a button, and add relative eventlisener
const createButton=(content,id,callback)=>{
    const button=document.createElement("button");
    button.innerText=content;
    button.setAttribute("id",id);
    button.setAttribute("type","button");
    button.addEventListener("click",callback);
    return button;
}

//remove element by id 
const removeElement=(id)=>{
    const ele=document.getElementById(id);
    if(ele){
        ele.remove();
        console.log("success remove:"+id);
    }
}

//the login-submit button's react function
const submitLogin=()=>{
    console.log("success login");
    const emailInput=document.getElementById("input-email").value;
    const passwordInput=document.getElementById("input-password").value;
    login(emailInput,passwordInput)
    .then(({token,userId})=>{
        console.log('success collect token:'+token);
        console.log('success collect userid:'+userId);
        localStorage.setItem(AUTH.TOKEN_KEY,token);
        localStorage.setItem(AUTH.USER_ID_key,userId);
        removeElement("loginForm");
        const header = document.getElementById("header");
        header.appendChild(createDashboard());
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
    })
    .catch((error)=>{
        console.error(error);
        window.alert(error);
    })
}

//create a login form page
const createLoginForm=()=>{
    const loginForm=document.createElement("form");
    loginForm.setAttribute("id","loginForm");
    loginForm.appendChild(createLine("Email: ","input-email","email"));
    loginForm.appendChild(createLine("Password: ","input-password","password"));
    loginForm.appendChild(createButton("Submit: ","submit-button",submitLogin));
    loginForm.appendChild(createButton("Regist: ","regist-button",registLogin));
    return loginForm;
}
//-------registion---------
//create regist form
const createRegistForm=()=>{
    const registForm=document.createElement("form");
    registForm.setAttribute("id","registForm");
    registForm.appendChild(createLine("Email: ","reg-email","email"));
    registForm.appendChild(createLine("Name: ","reg-name","text"));
    registForm.appendChild(createLine("Password: ","reg-password","password"));
    registForm.appendChild(createLine("Confirm-Password: ","confirm-password","password"));
    registForm.appendChild(createButton("Submit: ","regsubmit-button",submitRegist));
    return registForm;
}
//click regist button in login page   1.remove login form 2.create new registion form
const registLogin=()=>{
    console.log("regist start");
    removeElement("loginForm");
    const main=document.getElementById("main");
    main.appendChild(createRegistForm());
}
//the Registion page's button function
const submitRegist=()=>{
    console.log("success regist");
    const emailREG=document.getElementById("reg-email").value;
    const nameREG=document.getElementById("reg-name").value;
    const passwordREG=document.getElementById("reg-password").value;
    const confirmPassword=document.getElementById("confirm-password").value;
    if(confirmPassword!==passwordREG){
        window.alert("confirm-password is not same with the password!");
    }else{
        regist(emailREG,passwordREG,nameREG)
        .then(({token,userId})=>{
        console.log('success collect token:'+token);
        console.log('success collect userid:'+userId);
        localStorage.setItem(AUTH.TOKEN_KEY,token);
        localStorage.setItem(AUTH.USER_ID_key,userId);
        console.log("regist complete.");
        removeElement("registForm");
        const header = document.getElementById("header");
        header.appendChild(createDashboard());
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
        })
        .catch((error)=>{
            console.error(error);
            window.alert(error);
        })
    }
}

//logout callback----1.remove logout in header 2.remove tokens--localstorage.clear() 3.back to login page--createlogin
const logoutCallback=()=>{
    console.log("this is logout callback function");
    removeElement("headerButtons");
    removeElement("showThreads");
    localStorage.clear();
    const main=document.getElementById("main");
    main.appendChild(createLoginForm());
    console.log("success back to login form");
}

//after login or register, should in dashboard, create dashboard
const createDashboard=()=>{
    const headerButtons=document.createElement("div");
    headerButtons.setAttribute("id","headerButtons");
    const logout=createButton("Logout","logout",logoutCallback);
    const createthread=createButton("Create-thread","createthread",createthreadCallback);
    headerButtons.appendChild(logout);
    headerButtons.appendChild(createthread);
    return headerButtons;
}

//-----2.2.1-----
//------createThread------
//1.add a createThread button on dashboard 
//2.after press this button, remove current page and build create thread page
//3.press the submit button in create thread page, send data to server, receive respones
//2.2.1 add a button on createDashboard()
//2.2.1.1 createthreadCallback
const createthreadCallback=()=>{
    console.log("let's move to create-new-Thread page!");
    const header = document.getElementById("header");
    header.style.display = "none";
    const main=document.getElementById("main");
    main.appendChild(createThreadPage());
    window.history.pushState({ page: "createThread" }, "Create Thread", "/create-thread");
}

//2.2.1.2 create thread page
const createThreadPage=()=>{
    const createthreadpage=document.createElement("form");
    createthreadpage.setAttribute("id","create-thread-form");
    createthreadpage.className='create-thread-form';
    const title=createLine("Title","new-thread-title","text");
    const isPublic=createLine("Is public ","new-thread-public","checkbox");
    const content=createLine("Content ","new-thread-content","text");
    const submitButton=createButton("Create","submit-create-newthread",submitCreateNewThreadCallback);
    createthreadpage.appendChild(title);
    createthreadpage.appendChild(isPublic);
    createthreadpage.appendChild(content);
    createthreadpage.appendChild(submitButton);
    console.log("create new thread page complete!");
    return createthreadpage;
}

//2.2.1.3
const submitCreateNewThreadCallback=()=>{
    console.log("create a new thread.");
    const title=document.getElementById("new-thread-title").value;
    const isPublic=document.getElementById("new-thread-public").checked;
    const content=document.getElementById("new-thread-content").value;
    createThread(title,isPublic,content)
    .then((res)=>{
        console.log(res);
        console.log("success send data and get respone");
        removeElement("create-thread-form");
        const header=document.getElementById("header");
        header.style.display = "block";
    })
}

//2.2.2-----show All Threads list
//1. create a new page,use api get data
//2. show data in page
//3. add a more button
//2.2.2.1
let start=0;
const showAllThreads=()=>{
    const alreadyexist=document.getElementById("showThreads");
    if(alreadyexist){
        removeElement("showThreads");
    }
    const showThreads=document.createElement("div");
    showThreads.setAttribute("id","showThreads");
    getThreads(start)
    .then((threads)=>{
        console.log(threads);
        threads.forEach(id => {
            getThreadDetail(id)
            .then((threadDetail)=>{
                console.log(threadDetail);
                showThreads.appendChild(showThreadsDetails(threadDetail));
            })
        });
        //if threads.length=5, means their may have more threads ,add a more button
        if(threads.length===5){
            const moreButton=createButton("More","moreThreadsButton",()=>{
                start=start+5;
                const main=document.getElementById("main");
                main.appendChild(showAllThreads())
            })
            showThreads.appendChild(moreButton);
        }
        //need a "<" button to look at the previous threads
        if(start>0){
            const previousButton=createButton("Previous","previousThreadsButton",()=>{
                start=start-5;
                const main=document.getElementById("main");
                main.appendChild(showAllThreads())
            })
            showThreads.appendChild(previousButton);
        }
    })
    return showThreads;
}

//2.2.2.2 show threads details
const showThreadsDetails=(thread)=>{
    const singleThreads = document.createElement("ul");
    const singleThreadsAuthor = document.createElement("li");
    const singleThreadsLikes = document.createElement("li");
    const singleThreadsDate = document.createElement("li");
    const singleThreadsTitle = document.createElement("li");

    singleThreadsAuthor.innerText=thread.creatorId;
    singleThreadsLikes.innerText=thread.likes.length;
    singleThreadsDate.innerText=formatDate(thread.createdAt);
    singleThreadsTitle.innerText=thread.title;

    singleThreads.appendChild(singleThreadsTitle);
    singleThreads.appendChild(singleThreadsDate);
    singleThreads.appendChild(singleThreadsAuthor);
    singleThreads.appendChild(singleThreadsLikes);
    //2.2.3 set attribute to store the thread's id
    singleThreads.setAttribute("singleThread-id",thread.id);
    //add event listener, click singleThreads, create page
    singleThreads.onclick=()=>{
        const singleThreadid=singleThreads.getAttribute("singleThread-id");
        console.log(singleThreadid);
        const main=document.getElementById("main");
        main.appendChild(showSingleThreads(singleThreadid));
    }
    return singleThreads;
}

//-----2.2.3 single thread details-----
//basic thought:each singleThreads(order list) add a eventlistener, callback is create a new single threads detail page on the right
//callback of crerate page of single threads details
const showSingleThreads=(id)=>{
    removeElement("singleThreadsDetails");
    const page = document.createElement("div");
    page.setAttribute("id","singleThreadsDetails");
    //2.3.1 add a button in single thread page
    const editButton=createButton("Edit","edit-thread-button",()=>editThreadCallback(id));
    page.appendChild(editButton);
    //2.3.2 add delete button in individual Thread page
    const deleteButton=createButton("Delete","delete-thread-button",()=>deleteThreadCallback(id));
    page.appendChild(deleteButton);
    getThreadDetail(id)
    .then((detail)=>{
        //2.3.1.4 only author could modify threads
        const ThreadAuthor=detail.creatorId;
        const currentUser=localStorage.getItem(AUTH.USER_ID_key);
        if(String(ThreadAuthor) !== String(currentUser)){
            editButton.style.display="none";
            deleteButton.style.display="none";
        }
        //2.3.3 like threads---1.make sure threads are not locked
        if(!detail.lock){
            const hasliked=detail.likes.includes(parseInt(currentUser));
            console.log(hasliked);
            //make sure the content of button
            const likeButtonInnertext=hasliked?"not like":"like";
            const likeButton=createButton(likeButtonInnertext,"like-thread-button",()=>likeThreadCallback(id));
            page.appendChild(likeButton);
        }
        const singleDetail = document.createElement("ul");
        const singleThreadsLikes = document.createElement("li");
        const singleThreadsContent = document.createElement("li");
        const singleThreadsTitle = document.createElement("li");

        singleThreadsLikes.innerText=detail.likes.length;
        singleThreadsContent.innerText=detail.content;
        singleThreadsTitle.innerText=detail.title;

        singleDetail.appendChild(singleThreadsTitle);
        singleDetail.appendChild(singleThreadsContent);
        singleDetail.appendChild(singleThreadsLikes);
        page.appendChild(singleDetail);
        
    })
    return page;
}

//2.3.1 Editing a thread
//1. add a 'edit' button on single thread page
//2. the callback function of Edit button
//(create a new edit page,input field for title, content,  whether or not the thread is private, and whether or not a thread is locked. )
//3. in edit thread page, a submit button,the button should using API to fetch server. 
//2.3.1.2 editThreadCallback 1.remove two parts 2.create a new edit page
const editThreadCallback=(id)=>{
    console.log(id);
    removeElement("showThreads");
    removeElement("singleThreadsDetails");
    const main=document.getElementById("main");
    main.appendChild(createEditPage(id));
}

//2.3.1.2 createEditPage
const createEditPage=(id)=>{
    console.log("this is current single threads id:"+id);
    const page=document.createElement("div");
    page.setAttribute("id","edit-thread-page");
    getThreadDetail(id)
    .then((detail)=>{
        const editThreadTitle=createLine("Title","editThreadTitle","text",detail.title);
        const editThreadContent=createLine("Content","editThreadContent","text",detail.content);
        const editThreadIsPbulic=createLine("IsPbulic","editThreadIsPbulic","checkbox",detail.isPublic);
        const editThreadLock=createLine("Lock","editThreadLock","checkbox",detail.lock);
        const editSaveButton=createButton("Save","editThread-save-button",()=>editThreadSubmit(detail));
        page.appendChild(editThreadTitle);
        page.appendChild(editThreadContent);
        page.appendChild(editThreadIsPbulic);
        page.appendChild(editThreadLock);
        page.appendChild(editSaveButton);
    })
    return page;
}

//2.3.1.3 a submit button,the button should using API to fetch server.
const editThreadSubmit=(detail)=>{
    console.log("this is edit save button")
    const editThreadTitle=document.getElementById("editThreadTitle").value;
    const editThreadContent=document.getElementById("editThreadContent").value;
    const editThreadIsPbulic=document.getElementById("editThreadIsPbulic").checked;
    const editThreadLock=document.getElementById("editThreadLock").checked;
    editThread(detail.id,editThreadTitle,editThreadIsPbulic,editThreadLock,editThreadContent)
    .then((res)=>{
        console.log("submit successful");
        //save complete, remove current page
        removeElement("edit-thread-page");
        //back to (create) thread page
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
    })
}

//2.3.2 delete threads(only by author)
//1. like edit, add a button, only could view by author
//2. add callback function on delete button, use API
const deleteThreadCallback=(id)=>{
    console.log("this is delete single thread button");
    deleteThread(id)
    .then((res)=>{
        console.log("successful delete thread");
        //after success delete the threads,remove current page and direct(create) new page
        removeElement("singleThreadsDetails");
        removeElement("showThreads");
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
    })
}

//2.3.3 like button
//button innertext should different(like/don't like) according to current user records
//1.check the thread locked or not
//2.if not locked, collect record from details--to make sure user liked or not
//3.create button
//4.write callback function--using API
const likeThreadCallback=(id)=>{
    console.log("this is like button");
    let content=document.getElementById("like-thread-button").innerText;
    let turnon;
    //already like, click button means like before, not like threads now
    if(content==="not like"){
        turnon=false;
    }else{
        turnon=true;
    }
    likeThread(id,turnon)
    .then((res)=>{
        console.log("like button success");
        //fresh page
        removeElement("singleThreadsDetails");
        removeElement("showThreads");
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
        main.appendChild(showSingleThreads(id));
    })
}

//format function----format-date  
const formatDate=(datestr)=>{
    const date = new Date(datestr);
    const option={
        year:'numeric',
        month:'long',
        day:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        hour12:true
    };
    return new Intl.DateTimeFormat('default',option).format(date);
}


//------main thread------
const hash = window.location.hash;
const userId=localStorage.getItem(AUTH.USER_ID_key);
const token = localStorage.getItem(AUTH.TOKEN_KEY);
if(hash==""||!userId||!token){
    localStorage.clear();
    const main=document.getElementById("main");
    main.appendChild(createLoginForm());
}


