import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';
import {login} from './dataProvider.js'
import {regist,createThread,getThreads,getThreadDetail,editThread,deleteThread,
    likeThread,watchThread,getCommentDetail,createNewComment,updateComment,deleteComment,likeComment,getUserDetail,updateUser,whetherAdmin} from './dataProvider.js'
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

//2.2.2.2 show threads details-------these detail in threadsList
const showThreadsDetails=(thread)=>{
    const singleThreads = document.createElement("ul");
    const singleThreadsAuthor = document.createElement("li");
    const singleThreadsLikes = document.createElement("li");
    const singleThreadsDate = document.createElement("li");
    const singleThreadsTitle = document.createElement("li");
    const singleThreadsComments = document.createElement("li");
    //------------------------------------------------------------------------need count comments
    getCommentDetail(thread.id)
    .then((comments)=>{
        const commentsNumber=comments.length;
        singleThreadsComments.innerText=commentsNumber;
    })
    
    singleThreadsAuthor.innerText=thread.creatorId;
    singleThreadsLikes.innerText=thread.likes.length;
    singleThreadsDate.innerText=formatDate(thread.createdAt);
    singleThreadsTitle.innerText=thread.title;

    singleThreads.appendChild(singleThreadsTitle);
    singleThreads.appendChild(singleThreadsDate);
    singleThreads.appendChild(singleThreadsAuthor);
    singleThreads.appendChild(singleThreadsLikes);
    singleThreads.appendChild(singleThreadsComments);
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

//-------------------------------------------------------------------------------2.2.3 single thread details--------------------------------------------------------------
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
            console.log("has liked: "+hasliked);
            //make sure the content of button
            const likeButtonInnertext=hasliked?"not like":"like";
            const likeButton=createButton(likeButtonInnertext,"like-thread-button",()=>likeThreadCallback(id));
            page.appendChild(likeButton);
        }
        //2.3.4 make sure this thread whether watched by user
        const haswatched=detail.watchees.includes(parseInt(currentUser));
        console.log("has watched: "+haswatched);
        //2.3.4 make sure the content of button
        const watchButtonInnertext=haswatched?"unwatch":"watch";
        const watchButton=createButton(watchButtonInnertext,"watch-thread-button",()=>watchThreadCallback(id));
        page.appendChild(watchButton);
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
        //2.4.1 1.check current threads already exist comment
        getCommentDetail(id)
        .then((comment)=>{
            console.log("this is a test of get comment detail API");
            console.log(comment);
            if(comment.length===0){
                //if there is not any exist comment, add a create comment page 
                console.log("need add a create comment page");
                //only not locked threads could be comment
                if(!detail.lock){
                    page.appendChild(createNewCommentPage(id));
                }
            }else{
                //if there already exist comment ,add a new page to show comment
                console.log("need show the comment");
                const commentShowPage=showCommentPage(comment);
                page.appendChild(commentShowPage);
                //only not locked threads could be comment
                if(!detail.lock){
                    //still need to add create comment area,but at the bottom of comments
                    page.appendChild(createNewCommentPage(id));
                }
            }
            
        })
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
        main.appendChild(showSingleThreads(detail.id));
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

//2.3.4--watch thread--like 2.3.3
//1.check the thread whether watched by user to makesure button innertext--watch/unwatched
//2.after make sure the button innertxt, create button
//3.write watchThread callback function of the button, fetch API, fresh page
const watchThreadCallback=(id)=>{
    console.log("this is watch button");
    let content=document.getElementById("watch-thread-button").innerText;
    let turnon;
    //already like, click button means like before, not like threads now
    if(content==="unwatch"){
        turnon=false;
    }else{
        turnon=true;
    }
    watchThread(id,turnon)
    .then((res)=>{
        console.log("watch button success");
        //fresh page
        removeElement("singleThreadsDetails");
        removeElement("showThreads");
        const main=document.getElementById("main");
        main.appendChild(showAllThreads());
        main.appendChild(showSingleThreads(id));
    })
}

//2.4 basic throughts
//in individual threads page, use getcommets detail API----show-Single-Thread.append(comment page)
//1.if current threads don't have any comment,the comment page has an input and a button,click button,create new comment.
//2.if already exist comment, show
//3.add button on comment page----edit and like, throughts like 2.3

//show page still need time display and order by time
const showCommentPage=(comment)=>{
    const commentList=document.createElement("ul");
    //the first turn, show all of the comment under this threads
    comment.forEach(comment=>{
        const singleComment=showSingleComment(comment);
        //---------------------------------------------------------there is single comment id---------------------------------------------------------
        singleComment.id=`comment-${comment.id}`
        commentList.appendChild(singleComment);
    })
    //the second turn, check the parentsid, move each comment under their parents comments
    comment.forEach(comment=>{
        if(comment.parentCommentId){
            //find parent
            const parent=commentList.querySelector(`#comment-${comment.parentCommentId}`);
            const commentItem=commentList.querySelector(`#comment-${comment.id}`);
            const childComment=document.createElement("ul");
            childComment.appendChild(commentItem);
            parent.appendChild(childComment);
        }
    })
    return commentList;
}

//--------------------------------------------------------------------------single Comment page--------------------------------------------------------
const showSingleComment=(comment)=>{
    //singleComment.id=`comment-${comment.id}`
    const singleComment=document.createElement("li");
    //each single comment need to add a reply button
    const replyComment=createButton("Reply",`reply-${comment.id}-comment`,()=>replyCommentCallback(comment));
    //2.4.3 edit comment button
    //only creater could edit,if user != creator, edit disappear
    const commentAuthor=comment.creatorId;
    const currentUser=localStorage.getItem(AUTH.USER_ID_key);
    const editCommentButton=createButton("Edit",`edit-${comment.id}-comment`,()=>editCommentCallback(comment));
    if(String(commentAuthor) !== String(currentUser)){
        editCommentButton.style.display="none";
    }
    //like comment function
    const hasliked=comment.likes.includes(parseInt(currentUser));
    //make sure the content of button
    const likeButtonInnertext=hasliked?"unlike":"like";
    const likeButton=createButton(likeButtonInnertext,`like-comment-${comment.id}-button`,()=>likeCommentCallback(comment));
    const profileImage=document.createElement("img");
    //need to change realize picture
    profileImage.src="later to realize";
    profileImage.alt="user Img";
    //2.5 click image, display user Information
    profileImage.onclick=()=>{
        removeElement("showThreads");
        removeElement("singleThreadsDetails");
        const main=document.getElementById("main");
        main.appendChild(showUserDetail(comment));
    }

    const commentContent=document.createElement("div");
    commentContent.innerText=comment.content;
    singleComment.appendChild(profileImage);
    singleComment.appendChild(commentContent);
    singleComment.appendChild(replyComment);
    singleComment.appendChild(editCommentButton);
    singleComment.appendChild(likeButton);
    //only unlocked threads could be reply
    getThreadDetail(comment.threadId)
    .then((detail)=>{
        if(detail.lock){
            replyComment.style.display="none";
        }
    })
    return singleComment;
}

const showUserDetail=(comment)=>{
    const page=document.createElement("ul");
    page.setAttribute("id","userDetailPage");
    console.log("click user img react");
    getUserDetail(comment.creatorId)
    .then((userDetail)=>{
        const userEmail=document.createElement("li");
        const userName=document.createElement("li");
        const userImage=document.createElement("li");
        const userAdmin=document.createElement("li");
        userEmail.innerText=userDetail.email;
        userName.innerText=userDetail.name;
        userImage.innerText=userDetail.image;
        userAdmin.innerText=userDetail.admin;
        page.appendChild(userEmail);
        page.appendChild(userName);
        page.appendChild(userImage);
        page.appendChild(userAdmin);
        const backToThread=createButton("Back","backToThreadButton",()=>backToThreadCallback(comment));
        page.appendChild(showAllUserThreads(comment));
        page.appendChild(backToThread);
    })
    return page;
}

//show all thread created by this user
//1.select all thread --while--when start+5!=content.lengh,stop  from all threads array,use threadDetail,for each, use getThreadsDetail,creator = user, add in page
const showAllUserThreads = (comment) => {
    const showThreads = document.createElement("div");
    showThreads.setAttribute("id", "showAllUserThreads");
    let userstart = 0;
    let allThreads = [];
    let userthreadArray = [];
    // collect threads
    const collectThreads = () => {
        getThreads(userstart)
            .then((threads) => {
                if (threads.length === 0) {
                    // already collect all threads,start select and deal with
                    allThreads.forEach(detail => {
                        if (detail.creatorId === comment.creatorId) {
                            userthreadArray.push(detail);
                        }
                    });

                    userthreadArray.forEach(userThreadsDetail => {
                        console.log(userThreadsDetail);
                        showThreads.appendChild(showThreadsDetails(userThreadsDetail));
                    });
                } else {
                    // collect all threads
                    let detailsCollected = 0; 
                    threads.forEach(id => {
                        getThreadDetail(id)
                            .then((threadDetail) => {
                                allThreads.push(threadDetail);
                                detailsCollected++;
                                if (detailsCollected === threads.length) {
                                    userstart += 5;
                                    collectThreads(); 
                                }
                            });
                    });
                }
            });
    };
    //start collectThreads function
    collectThreads();
    return showThreads;
};

//backToThreadCallback
const backToThreadCallback=(comment)=>{
    removeElement("userDetailPage")
    const main=document.getElementById("main");
    main.appendChild(showAllThreads());
    main.appendChild(showSingleThreads(comment.threadId));
}

//like comment callback function
const likeCommentCallback=(comment)=>{
    let content=document.getElementById(`like-comment-${comment.id}-button`).innerText;
    let turnon;
    //already like, click button means like before, not like threads now
    if(content==="unlike"){
        turnon=false;
    }else{
        turnon=true;
    }
    likeComment(comment.id,turnon)
    .then((res)=>{
        //fresh page
        removeElement("singleThreadsDetails");
        const main=document.getElementById("main");
        main.appendChild(showSingleThreads(comment.threadId));
    })
}

//edit Comment button Callback function
const editCommentCallback=(comment)=>{
    removeElement(`edit-${comment.id}-comment`);
    const singleCommnetEditPage=document.getElementById(`comment-${comment.id}`);
    singleCommnetEditPage.appendChild(createEditCommentPage(comment));
}

//createEditCommentPage
const createEditCommentPage=(comment)=>{
    const page=document.createElement("div");
    page.setAttribute("id",`edit-${comment.id}-comment-page`);
    // a innertext, a Submit-Your-Comment
    const editCommentInput=createLine("Edit Comment Input: ",`edit-${comment.id}-comment-input`,"text",comment.content);
    const editUpdateButton=createButton("comment",`edit-${comment.id}-comment-submit`,()=>editCommentSubmit(comment));
    page.appendChild(editCommentInput);
    page.appendChild(editUpdateButton);
    return page;
}

//a submit button,the button should using API to fetch server.
const editCommentSubmit=(comment)=>{
    const editCommentInput=document.getElementById(`edit-${comment.id}-comment-input`).value;
    updateComment(comment.id,editCommentInput)
    .then((res)=>{
        console.log(`edit-${comment.id}-success`);
        removeElement("singleThreadsDetails");
        const main=document.getElementById("main");
        main.appendChild(showSingleThreads(comment.threadId));
    })
}

//add a callback function on reply button
const replyCommentCallback=(comment)=>{
    console.log("this part need to write reply function");
    const page = document.createElement("div");
    page.setAttribute("id",`reply-${comment.id}`);
    const replyLine=createLine("Reply: ",`reply-${comment.id}-content`,"text");
    const createReplyButton=createButton("Submit-Reply",`reply-${comment.id}-button`,()=>createReplyCallbcak(comment));
    page.appendChild(replyLine);
    page.appendChild(createReplyButton);
    const singleComment=document.getElementById(`comment-${comment.id}`);
    singleComment.appendChild(page);
}

//createReplyCallbcak
const createReplyCallbcak=(comment)=>{
    console.log("press this button,create new reply");
    const content=document.getElementById(`reply-${comment.id}-content`).value;
    createNewComment(content,comment.threadId,comment.id)
    .then((res)=>{
        console.log(res);
        console.log("success create new reply");
        //---------------------------------------------------------------------after success create comment, remove current page and display commments--()
        removeElement("singleThreadsDetails");
        const main=document.getElementById("main");
        main.appendChild(showSingleThreads(comment.threadId));
    })
}

//2.4.2. Making a comment
//if there is not comments, should have a input and a 'Comment' button
const createNewCommentPage=(ThreadId)=>{
    const page = document.createElement("div");
    page.setAttribute("id","createNewCommentPage");
    const commentLine=createLine("Comment: ","create-comment-line","text");
    const createCommentButton=createButton("Comment","create-comment-button",()=>createCommentCallbcak(ThreadId));
    page.appendChild(commentLine);
    page.appendChild(createCommentButton);
    return page;
}

//createCommentCallbcak
const createCommentCallbcak=(ThreadId,parentCommentId=null)=>{
    console.log("press this button,create new comment");
    const content=document.getElementById("create-comment-line").value;
    createNewComment(content,ThreadId,parentCommentId)
    .then((res)=>{
        console.log(res);
        console.log("success create new comment");
        //after success create comment, remove current page and display commments--()
        removeElement("singleThreadsDetails");
        const main=document.getElementById("main");
        main.appendChild(showSingleThreads(ThreadId));
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


