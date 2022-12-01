function changeSorting(button) {
    const icon = button.getElementsByTagName("use")[0];
    if (button.value === "asc") {
        button.value = "desc";
        icon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#s-desc');
    } else {
        button.value = "asc";
        icon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#s-asc');
    }
}

let selectedTags = 0
let maxTags = 3
const tagsHeader = document.getElementById("tagsHeader")

function selectTag(button) {
    if ($(button).hasClass('active')) {
        $(button).toggleClass('btn-secondary').toggleClass('btn-light');
        $(button).toggleClass('active');
        selectedTags -= 1;
    } else if (selectedTags < maxTags) {
        $(button).toggleClass('btn-secondary').toggleClass('btn-light');
        $(button).toggleClass('active');
        selectedTags += 1;
    }

    tagsHeader.innerHTML = "Tags (" + selectedTags.toString() + "/" + maxTags.toString() + "):";
}

async function likeScenario(id, button) {
    const likeData = {}
    const userLikeData = {}

    let scenarios_url = "http://localhost:3000/scenarios"
    let response = await fetch(`${scenarios_url}?id=${id}`, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`
        }
    })

    let responseJson = await response.json()

    let currentLikes = responseJson[0].likes

    let users_url = "http://localhost:3000/users"
    let user_id = JSON.parse(getUser()).id

    response = await fetch(`${users_url}?id=${user_id}`, {
        headers: {
            "Authorization": `Bearer ${getAuthToken()}`
        }
    })

    responseJson = await response.json()

    let likes = responseJson[0].likes

    if (button.classList.contains('active')) {
        currentLikes += 1
        likes.push(id)
    }
    else {
        currentLikes -= 1
        let index = likes.indexOf(id);
        likes.splice(index, 1);
    }

    userLikeData['likes'] = likes
    likeData['likes'] = currentLikes

    scenarios_url = `${scenarios_url}/${id}`
    await fetch(scenarios_url, {
        method: "PATCH", body: JSON.stringify(likeData), headers: {
            'Content-Type': 'application/json'
        }
    })

    users_url = `${users_url}/${user_id}`
    await fetch(users_url, {
        method: "PATCH", body: JSON.stringify(userLikeData), headers: {
            'Content-Type': 'application/json'
        }
    })

    localStorage.user.likes = likes

    button.textContent = currentLikes
}

function checkAuthUser() {
    let user = getUser()

    if (user !== null) {
        return
    }

    const hiddenElements =  document.querySelectorAll(".visible-login-only")

    hiddenElements.forEach((element) => {
        element.classList.add('d-none');
    });
}

document.addEventListener('DOMContentLoaded', () => checkAuthUser())
