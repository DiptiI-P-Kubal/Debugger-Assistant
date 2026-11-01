// ============================================================
// NEUROPROMPT SIDEBAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createSidebar();

        loadCurrentUser();

        setupLogout();

    }
);


// ============================================================
// CREATE SIDEBAR
// ============================================================

function createSidebar() {

    const navbar =
        document.getElementById("navbar");


    if (!navbar) {

        return;

    }


    navbar.className =
        "app-sidebar";


    navbar.innerHTML = `

        <div class="sidebar-brand">

            <div class="brand-badge">
                N
            </div>

            <span>
                NeuroPrompt
            </span>

        </div>


        <div class="sidebar-subtitle">
            Smart Prompt Studio
        </div>


        <nav class="sidebar-nav">


            <a
                href="application.html"
                class="sidebar-link"
                data-page="application.html">

                🏠

                <span>
                    Home
                </span>

            </a>


            <a
                href="languages.html"
                class="sidebar-link"
                data-page="languages.html">

                💻

                <span>
                    Language Cards
                </span>

            </a>


            <a
                href="library.html"
                class="sidebar-link"
                data-page="library.html">

                📁

                <span>
                    Prompt Library
                </span>

            </a>


            <a
                href="analyzer.html"
                class="sidebar-link"
                data-page="analyzer.html">

                ⚡

                <span>
                    Code Analyzer
                </span>

            </a>


            <a
                href="history.html"
                class="sidebar-link"
                data-page="history.html">

                📊

                <span>
                    User History Log
                </span>

            </a>


        </nav>

    `;


    // ========================================================
    // ACTIVE SIDEBAR LINK
    // ========================================================

    let currentPage =
        window.location.pathname
        .split("/")
        .pop();


    if (
        currentPage === "" ||
        currentPage === "index.html"
    ) {

        currentPage =
            "application.html";

    }


    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(
        function (link) {

            const page =
                link.getAttribute(
                    "data-page"
                );


            if (page === currentPage) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


// ============================================================
// LOAD CURRENT USER
// ============================================================

async function loadCurrentUser() {

    try {

        const response =
            await fetch(
                "/api/current-user"
            );


        const data =
            await response.json();


        if (!data.logged_in) {

            window.location.href =
                "login.html";

            return;

        }


        const username =
            data.username;


        const topUsername =
            document.getElementById(
                "topUsername"
            );


        if (topUsername) {

            topUsername.textContent =
                username;

        }


        const firstLetter =
            username
            .charAt(0)
            .toUpperCase();


        const avatars =
            document.querySelectorAll(
                ".top-user-icon"
            );


        avatars.forEach(
            function (avatar) {

                avatar.textContent =
                    firstLetter;

            }

        );


    }
    catch (error) {

        console.error(
            "Session error:",
            error
        );


        window.location.href =
            "login.html";

    }

}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    document.addEventListener(
        "click",
        async function (event) {


            if (
                event.target.id ===
                "topLogout"
            ) {


                try {

                    await fetch(
                        "/api/logout",
                        {
                            method: "POST"
                        }
                    );

                }
                catch (error) {

                    console.error(error);

                }


                localStorage.removeItem(
                    "neuroPromptUser"
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}