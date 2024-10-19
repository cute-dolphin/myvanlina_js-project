import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import {login} from './dataProvider.js'
import {regist,createThread} from './dataProvider.js'
import { AUTH } from './constants.js';
//functinon parts
//------------login------------
//create a line, include label and input
const createLine=(content,id,type)=>{
    const div1=document.createElement("div");
    const label=document.createElement("label");
    const input=document.createElement("input");
    input.setAttribute("id",id);
    label.innerText=content;
    input.type=type;
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

//-----2.2.1-----
//------createThread------
//1.add a createThread button on dashboard 
//2.after press this button, remove current page and build create thread page
//3.press the submit button in create thread page, send data to server, receive respones
//2.2.1 add a button on createDashboard()


//------main thread------
const hash = window.location.hash;
const userId=localStorage.getItem(AUTH.USER_ID_key);
const token = localStorage.getItem(AUTH.TOKEN_KEY);
if(hash==""||!userId||!token){
    localStorage.clear();
    const main=document.getElementById("main");
    main.appendChild(createLoginForm());
}


