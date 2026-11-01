// ============================================================
// LOGIN
// ============================================================

async function loginUser(event) {

    event.preventDefault();


    const username =
        document
        .getElementById(
            "loginUsername"
        )
        .value
        .trim();


    const password =
        document
        .getElementById(
            "loginPassword"
        )
        .value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    message.textContent =
        "Checking login...";


    message.style.color =
        "#2563eb";


    try {


        const response =
            await fetch(
                "/api/login",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            username:
                                username,

                            password:
                                password

                        })

                }
            );


        const data =
            await response.json();


        if (data.success) {


            message.textContent =
                "Login successful. Opening Studio...";


            message.style.color =
                "#16a34a";


            localStorage.setItem(
                "neuroPromptUser",
                data.username
            );


            setTimeout(
                function () {

                    window.location.href =
                        "application.html";

                },
                700
            );


        }
        else {


            message.textContent =
                data.message;


            message.style.color =
                "#dc2626";

        }


    }
    catch (error) {


        console.error(error);


        message.textContent =
            "Unable to connect to server.";


        message.style.color =
            "#dc2626";

    }

}


// ============================================================
// REGISTER
// ============================================================

async function registerUser(event) {

    event.preventDefault();


    const username =
        document
        .getElementById(
            "registerUsername"
        )
        .value
        .trim();


    const password =
        document
        .getElementById(
            "registerPassword"
        )
        .value;


    const confirmPassword =
        document
        .getElementById(
            "registerConfirmPassword"
        )
        .value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    message.textContent =
        "Creating account...";


    message.style.color =
        "#2563eb";


    try {


        const response =
            await fetch(
                "/api/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            username:
                                username,

                            password:
                                password,

                            confirm_password:
                                confirmPassword

                        })

                }
            );


        const data =
            await response.json();


        if (data.success) {


            message.textContent =
                "Account created successfully.";


            message.style.color =
                "#16a34a";


            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1000
            );


        }
        else {


            message.textContent =
                data.message;


            message.style.color =
                "#dc2626";

        }


    }
    catch (error) {


        console.error(error);


        message.textContent =
            "Unable to connect to server.";


        message.style.color =
            "#dc2626";

    }

}