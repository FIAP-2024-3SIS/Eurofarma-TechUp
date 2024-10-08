

const dataEmail = document.getElementById("email")
const dataPassword = document.getElementById("senha")
const submitButton = document.querySelector("#loginButton");

const loginData = {
    email: "",
    password: ""
}

const login = async () => {

    const options = {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
            "Content-Type": "application/json"
        }
    }
    const url = "http://localhost:8080/api-eurofarma/auth/v1/login"
    try {
        const connection = await fetch(url, options)
        const response = connection.status

        if (response == 200) {
            const log = await connection.json();

            const accessToken = log.accessToken;
            const refreshToken = log.refreshToken;
            const userPermission = log.userType;
            const email = log.email;
            const userName = getFormattedName(log.email);

            document.cookie = `accessToken=${accessToken}; path=/; SameSite=Strict`;
            document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Strict`;
            document.cookie = `userName=${userName}; path=/; SameSite=Strict`;
            document.cookie = `email=${email}; path=/; SameSite=Strict`;


            if (userPermission == "User") {
                window.location.href = "http://127.0.0.1:5500/html/traininguser.html"
            } else
                window.location.href = "http://127.0.0.1:5500/html/trainingadmin.html"
        } else if (response == 403) {
            alert("Login failed. Please check your username and password.")
        }

    } catch (error) {
        console.log(error)
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form")

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        loginData.email = dataEmail.value
        loginData.password = dataPassword.value

        login()
    })
})

function getFormattedName(email) {
    let name = email.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}