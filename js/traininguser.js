
const email = getCookieValue("email");
const userName = getCookieValue("userName");
const treinamentos = document.querySelectorAll(".treinamento");
let accessToken = "";
let refreshToken = "";

const getAllUserTrainings = async () => {
    accessToken = getCookieValue("accessToken");
    refreshToken = getCookieValue("refreshToken");

    const url = "http://localhost:8080/api-eurofarma/userTraining/v1/all";
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    }
    try {
        const connection = await fetch(url, options)
        const response = connection.status

        if (response == 200) {
            const log = await connection.json();
            console.log( log);

            setName();

        } else if (response == 403) {
            alert("Login failed. Please check your username and password.")
        } else if (response == 500) {
            await refreshAccessToken(email, refreshToken);
        }

    } catch (error) {
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getAllUserTrainings()
})

const refreshAccessToken = async () => {
    const refreshOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`
        }
    };

    const refreshUrl = `http://localhost:8080/api-eurofarma/auth/v1/refresh/${email}`;
    console.log(refreshUrl);
    try {
        const refreshResponse = await fetch(refreshUrl, refreshOptions);

        if (refreshResponse.status == 200) {
            const data = await refreshResponse.json();

            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;

            deleteCookie("accessToken");
            deleteCookie("refreshToken");

            document.cookie = `accessToken=${accessToken}; path=/; SameSite=Strict`;
            document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Strict`;

            await getAllUserTrainings();
        } else if (refreshResponse.status == 500) {
            console.error("Failed to refresh token.");
            alert("Session timeout");
            window.location.href = "http://127.0.0.1:5500/html/registerpage.html"; // Redireciona para a página de login

        }
    } catch (error) {
        console.error("Error refreshing token:", error);
    }
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

function getCookieValue(name) {
    const cookieArr = document.cookie.split(";");
    for (let cookie of cookieArr) {
        let trimmedCookie = cookie.trim();

        if (trimmedCookie.startsWith(name + "=")) {
            return trimmedCookie.substring((name.length + 1), trimmedCookie.length);
        }
    }
    return null;
}

function setName() {
    document.getElementById("userName").textContent = userName;
}


function setDateTime(date, time) {
    const newDate = date.split("-")[2] + "/" + date.split("-")[1];
    const newTime = time.slice(0, 5);
    const dateTime = `${newDate} às ${newTime}`

    return dateTime;
}