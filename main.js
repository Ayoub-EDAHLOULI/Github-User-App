const apiURL = "https://api.github.com/users/";
const form = document.querySelector('form');
const searchInput = document.querySelector('#searchInput');
const target = document.querySelector('.container');
const cards = document.querySelector('.projects');
const templateLeft = document.querySelector('.left-side');
const templateRight = document.querySelector('.cards');
const searchClick = document.querySelector('#searchClick');



searchClick.addEventListener('click', async () => {
    const username = searchInput.value.trim();
    if (username !== "") {
        // Clear the previous user information
        templateLeft.innerHTML = "";
        templateRight.innerHTML = "";

        await displayInfo(username);
    } else {
        // Inform the user that the search input is empty
        console.log("Please enter a username.");
        alert("Please enter a username.")
    }
});


const getUser = async (username) => {
    try{
        const res = await fetch(`${apiURL}${username}`);
        const data = await res.json();
        
        const userPic = data.avatar_url;
        const userName = data.name;
        const bio = data.bio;
        const followers = data.followers;
        const following = data.following;

        // if(userName == undefined){
        //     alert("there is nothing like this name");
        // }
        
        return {
            userPic,
            userName,
            bio,
            followers,
            following
        };
    }
    catch(error){
        console.log("Error Fetching Users Info", error);
    }
}


const getRepo = async (username) => {
    try{
        const res = await fetch(`${apiURL}${username}/repos`);
        const data = await res.json();

        const reposNames = data.map(repoName => repoName.name);
        const reposURL = data.map(repoUrl => repoUrl.html_url);
        const reposPrivate = data.map(repoPrivate => repoPrivate.private);
        const reposLanguage = data.map(repoLang => repoLang.language);

        return {
            reposNames,
            reposURL,
            reposPrivate,
            reposLanguage
        }
    }
    catch(error){
        console.log("Error Fetching Repo Info", error)
    }
}


const displayInfo = async (username) => {
    try{
        const [userInfo, userRepos] = await Promise.all([getUser(username), getRepo(username)]);

        templateLeft.innerHTML = `
          <img src=${userInfo.userPic} alt="">
          <div class="body">
            <h2 class="name">${userInfo.userName}</h2>
            <p class="desc">${userInfo.bio}</p>
            <div class="follow">
              <i class="fa-solid fa-users"></i>
              <div class="followers">
                <span>${userInfo.followers}</span>
                <h4>followers</h4>
              </div>
              <div class="following">
                <span>${userInfo.following}</span>
                <h4>following</h4>
              </div>
            </div>
          </div>
        `
        target.append(templateLeft);

        const numRepos = Math.min(6, userRepos.reposNames.length);
        for(let i=0; i<numRepos; i++){

            const card = document.createElement('div');
            card.setAttribute('class', 'card');

            if(userRepos.reposPrivate[i] == true){
                userRepos.reposPrivate[i] = "private";
            }else{
                userRepos.reposPrivate[i] = "public";
            }

            card.innerHTML = `
                 <div class="projectInfo">
                   <i class="fa-regular fa-folder"></i>
                   <a href=${userRepos.reposURL[i]} target="_blank">${userRepos.reposNames[i]}</a>
                   <div class="private">
                     <h4>${userRepos.reposPrivate[i]}</h4>
                   </div>
                 </div>
                 <div class="tools">
                   <div class="shape"></div>
                   <h4>${userRepos.reposLanguage[i]}</h4>
                 </div>
         `
         templateRight.append(card);
        }
    }
    catch(err){
        console.log("Error Dsiplay Data", err)
    }
}



