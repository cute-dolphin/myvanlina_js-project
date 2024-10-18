import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

//functinon parts
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

const createButton=(content,id,callback)=>{
    const button=document.createElement("button");
    button.innerText=content;
    button.setAttribute("id",id);
    button.setAttribute("type","button");
    button.addEventListener("click",callback);
    return button;
}

const submitLogin=()=>{
    console.log("success login");
}


const main=document.getElementById("main");
main.appendChild(createLine("Email: ","input-email","email"));
main.appendChild(createLine("Password: ","input-password","password"));
main.appendChild(createButton("Submit: ","submit-button",submitLogin));

