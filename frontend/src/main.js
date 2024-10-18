import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import {login} from './dataProvider.js'
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
        removeElement("loginForm");
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
//click regist button   1.remove login form 2.create new registion form
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
}

const main=document.getElementById("main");
main.appendChild(createLoginForm());

