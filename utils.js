async function getUsername(passedAccessToken){
    const results = await fetch(`https://discordapp.com/api/users/@me`,{
        headers:{
            Authorization: `Bearer ${passedAccessToken}`
        }
    })
    const data = await results.json();
    return {username: data.username, id: data.id};


}


function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

exports.getUsername=getUsername
exports.wait = wait
