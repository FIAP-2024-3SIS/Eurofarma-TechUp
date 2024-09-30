const email = getCookieValue("email");
const userName = getCookieValue("userName");
const treinamentos = document.querySelectorAll(".treinamento");
let accessToken = "";
let refreshToken = "";
const trainingData = {
    name: "",
    department: {
        id: "",
        name: ""
    },
    duration: "",
    date: "",
    time: "",
    description: "",
    modality: "",
    local: ""
}
const createTraining = async () => {
    accessToken = getCookieValue("accessToken");
    refreshToken = getCookieValue("refreshToken");

    const url = "http://localhost:8080/api-eurofarma/training/v1/create";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(trainingData)
    }
    try {
        const connection = await fetch(url, options)
        const response = connection.status

        if (response == 200) {
            const log = await connection.json();
            console.log(log);
            alert("Treinamento criado");

        } else if (response == 403) {
            alert("Login failed. Please check your username and password.")
        } else if (response == 500) {
            await refreshAccessToken(email, refreshToken);
        }

    } catch (error) {
        console.log(error)
    }
}


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

            await getAllTrainings();
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

// function setTrainings(json) {

//     treinamentos.forEach((treinamentos, aux) => {
//         if (aux <= 7) {
//             const nomeDepartamento = treinamentos.querySelector(".nomeDepartamento");
//             const nomeTreinamento = treinamentos.querySelector(".nomeTreinamento");
//             const dataHorario = treinamentos.querySelector(".dataHorario");
//             const duracao = treinamentos.querySelector(".duracao");
//             const modalidade = treinamentos.querySelector(".modalidade");

//             nomeDepartamento.textContent = json[aux].department.name;
//             nomeTreinamento.textContent = json[aux].name;
//             dataHorario.textContent = setDateTime(json[aux].date, json[aux].time);
//             duracao.textContent = json[aux].duration;
//             modalidade.textContent = json[aux].modality;
//         }
//         aux++;
//     })
// }

function setDateTime(date, time) {
    const newDate = date.split("-")[2] + "/" + date.split("-")[1];
    const newTime = time.slice(0, 5);
    const dateTime = `${newDate} às ${newTime}`

    return dateTime;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form")
    form.addEventListener('submit', (event) => {
        event.preventDefault()
    const dateTime = document.getElementById("training-date").value;
    const dateTimeFormatted = setDateTime(dateTime);
    const department = document.getElementById('optionsDepartamento').value;
    const departmentFormatted = getDepartment(department);


    const name = document.getElementById("training-name");
    const departmentId = departmentFormatted[0];
    const departmentName = departmentFormatted[1];
    const duration = document.getElementById("training-duration");
    const date = dateTimeFormatted[0];
    const time = dateTimeFormatted[1];
    const description = document.getElementById("training-description");
    const modality = document.getElementById('optionsModalidade');
    const local = document.getElementById("training-location");


        trainingData.name = name.value;
        trainingData.department.id = departmentId;
        trainingData.department.name = departmentName;
        trainingData.duration = duration.value;
        trainingData.date = date;
        trainingData.time = time;
        trainingData.description = description.value;
        trainingData.modality = modality.value;
        trainingData.local = local.value;
        createTraining();
    })
})

function setDateTime(dateTime) {
    const originalDate = dateTime.split("T")[0];
    const newTime = dateTime.split("T")[1];
    const dateTimeArr = [originalDate, newTime];
    
    console.log(dateTimeArr);
    return dateTimeArr;
}

function getDepartment(department) {
    const departmentId = department.split("-")[0];
    const departmentName = department.split("-")[1];
    const departmentObj = [departmentId, departmentName];
    return departmentObj;
}