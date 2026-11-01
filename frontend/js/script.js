// ============================================================
// LOAD LANGUAGE INTO ANALYZER
// ============================================================

function loadLanguage(
    language,
    code
) {

    localStorage.setItem(
        "selectedLanguage",
        language
    );


    localStorage.setItem(
        "selectedCode",
        code
    );


    window.location.href =
        "analyzer.html";

}


// ============================================================
// LOAD SAVED LANGUAGE/CODE IN ANALYZER
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const languageSelect =
            document.getElementById(
                "lang-select"
            );


        const codeEntry =
            document.getElementById(
                "code-entry"
            );


        if (
            languageSelect &&
            codeEntry
        ) {


            const selectedLanguage =
                localStorage.getItem(
                    "selectedLanguage"
                );


            const selectedCode =
                localStorage.getItem(
                    "selectedCode"
                );


            if (selectedLanguage) {

                languageSelect.value =
                    selectedLanguage;

            }


            if (selectedCode) {

                codeEntry.value =
                    selectedCode;

            }

        }

    }
);


// ============================================================
// RUN CODE ANALYSIS
// ============================================================

async function runAnalysis() {


    const languageSelect =
        document.getElementById(
            "lang-select"
        );


    const codeEntry =
        document.getElementById(
            "code-entry"
        );


    const errorText =
        document.getElementById(
            "err-text"
        );


    const solutionText =
        document.getElementById(
            "sol-text"
        );


    if (
        !languageSelect ||
        !codeEntry
    ) {

        return;

    }


    const language =
        languageSelect.value;


    const code =
        codeEntry.value.trim();


    if (!code) {


        errorText.textContent =
            "No code provided.";


        solutionText.textContent =
            "Please enter code before running the diagnostic check.";


        return;

    }


    errorText.textContent =
        "Analyzing code...";


    solutionText.textContent =
        "Please wait...";


    try {


        const response =
            await fetch(
                "/api/analyze",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            language:
                                language,

                            code:
                                code

                        })

                }
            );


        const data =
            await response.json();


        if (!data.success) {


            errorText.textContent =
                data.message ||
                "Analysis failed.";


            solutionText.textContent =
                "Please try again.";


            return;

        }


        errorText.textContent = data.error;

solutionText.innerHTML = formatSolution(data.solution);


    }
    catch (error) {


        console.error(error);


        errorText.textContent =
            "Unable to connect to analyzer.";


        solutionText.textContent =
            "Make sure the Flask server is running.";

    }

}

// ============================================================
// FORMAT ANALYSIS SOLUTION
// ============================================================

// ============================================================
// FORMAT RECOMMENDED SOLUTION
// ============================================================

function formatSolution(solution) {

    if (!solution) {
        return `
            <div class="solution-empty">
                No recommended solution available.
            </div>
        `;
    }

    const text = String(solution);

    let line = "";
    let cause = "";
    let suggestion = "";
    let exampleCode = "";
    let fixedCode = "";

    // ----------------------------
    // Extract Line
    // ----------------------------

    const lineMatch =
        text.match(/Check line\s+([^.:]+)\.?/i);

    if (lineMatch) {
        line = lineMatch[1].trim();
    }


    // ----------------------------
    // Extract Cause
    // ----------------------------

    const causeMatch =
        text.match(
            /Cause:\s*(.*?)(?=\s*Suggestion:|\s*Example Code:|\s*Fixed Code:|$)/is
        );

    if (causeMatch) {
        cause = causeMatch[1].trim();
    }


    // ----------------------------
    // Extract Suggestion
    // ----------------------------

    const suggestionMatch =
        text.match(
            /Suggestion:\s*(.*?)(?=\s*Example Code:|\s*Fixed Code:|$)/is
        );

    if (suggestionMatch) {
        suggestion = suggestionMatch[1].trim();
    }


    // ----------------------------
    // Extract Example Code
    // ----------------------------

    const exampleMatch =
        text.match(
            /Example Code:\s*(.*?)(?=\s*Fixed Code:|$)/is
        );

    if (exampleMatch) {
        exampleCode = exampleMatch[1].trim();
    }


    // ----------------------------
    // Extract Fixed Code
    // ----------------------------

    const fixedMatch =
        text.match(
            /Fixed Code:\s*(.*)$/is
        );

    if (fixedMatch) {
        fixedCode = fixedMatch[1].trim();
    }


    // ----------------------------
    // Build Professional Result
    // ----------------------------

    let html = "";


    if (line) {

        html += `
            <div class="solution-info-box">

                <span class="solution-label">
                    Error Location
                </span>

                <span class="solution-value">
                    Line ${escapeHtml(line)}
                </span>

            </div>
        `;
    }


    if (cause) {

        html += `
            <div class="solution-block">

                <div class="solution-heading">
                    Cause
                </div>

                <div class="solution-description">
                    ${escapeHtml(cause)}
                </div>

            </div>
        `;
    }


    if (suggestion) {

        html += `
            <div class="solution-block">

                <div class="solution-heading">
                    Suggested Fix
                </div>

                <div class="solution-description">
                    ${escapeHtml(suggestion)}
                </div>

            </div>
        `;
    }


    if (exampleCode) {

        html += `
            <div class="solution-block">

                <div class="solution-heading">
                    Example Code
                </div>

                <pre class="analysis-code">${escapeHtml(exampleCode)}</pre>

            </div>
        `;
    }


    if (fixedCode) {

        html += `
            <div class="solution-block">

                <div class="solution-heading">
                    Fixed Code
                </div>

                <pre class="analysis-code fixed-code">${escapeHtml(fixedCode)}</pre>

            </div>
        `;
    }


    // If the backend format is different,
    // show the original solution instead of losing it.

    if (!html) {

        html = `
            <div class="solution-description">
                ${escapeHtml(text)}
            </div>
        `;
    }


    return `
        <div class="formatted-solution">
            ${html}
        </div>
    `;
}

// ============================================================
// ADD TEMPLATE
// ============================================================

async function addTemplate(event) {

    event.preventDefault();


    const title =
        document
        .getElementById(
            "templateTitle"
        )
        .value
        .trim();


    const language =
        document
        .getElementById(
            "templateLang"
        )
        .value;


    const body =
        document
        .getElementById(
            "templateBody"
        )
        .value
        .trim();


    const message =
        document.getElementById(
            "templateMessage"
        );


    message.textContent =
        "Saving template...";


    message.style.color =
        "#2563eb";


    try {


        const response =
            await fetch(
                "/api/templates",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            title:
                                title,

                            language:
                                language,

                            body:
                                body

                        })

                }
            );


        const data =
            await response.json();


        if (data.success) {


            message.textContent =
                "Template saved successfully.";


            message.style.color =
                "#16a34a";


            document
                .getElementById(
                    "templateForm"
                )
                .reset();


            loadTemplates();


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
            "Unable to save template.";


        message.style.color =
            "#dc2626";

    }

}


// ============================================================
// LOAD TEMPLATES
// ============================================================

async function loadTemplates() {


    const container =
        document.getElementById(
            "templates"
        );


    if (!container) {

        return;

    }


    try {


        const response =
            await fetch(
                "/api/templates"
            );


        const data =
            await response.json();


        if (!data.success) {


            container.innerHTML = `
                <div class="empty-message">
                    ${data.message}
                </div>
            `;


            return;

        }


        if (
            !data.templates ||
            data.templates.length === 0
        ) {


            container.innerHTML = `
                <div class="empty-message">
                    No saved templates yet.
                </div>
            `;


            return;

        }


        container.innerHTML = "";


        data.templates.forEach(
            function (template) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "template-card";

                card.style.cursor = "pointer";

                


                card.innerHTML = `

                    <div class="template-header">

                        <h3>
                            ${escapeHtml(
                                template.title
                            )}
                        </h3>

                        <span>
                            ${escapeHtml(
                                template.language
                            )}
                        </span>

                    </div>


                    <pre>
${escapeHtml(template.body)}
                    </pre>

                `;

               card.onclick = function () {
        openTemplate(template);
    };  

                container.appendChild(
                    card
                );

            }
        );


    }
    catch (error) {


        console.error(error);


        container.innerHTML = `
            <div class="empty-message">
                Unable to load templates.
            </div>
        `;

    }

}


function openTemplate(template) {

    const popup = document.createElement("div");

    popup.className = "template-popup";

    popup.innerHTML = `

        <div class="template-popup-box">

            <div class="template-popup-header">

                <div>

                    <h2>
                        Edit Template
                    </h2>

                </div>

                <button
                    class="template-popup-close"
                    type="button">
                    ×
                </button>

            </div>


            <label>
                Template Title
            </label>

            <input
                type="text"
                id="editTemplateTitle"
                value="${escapeHtml(template.title)}"
            >


            <label>
                Language
            </label>

            <select id="editTemplateLanguage">

                <option value="Python">
                    Python
                </option>

                <option value="C++">
                    C++
                </option>

                <option value="C">
                    C
                </option>

                <option value="Java">
                    Java
                </option>

            </select>


            <label>
                Saved Code
            </label>

            <textarea
                id="editTemplateCode"
                class="template-edit-code"
            >${escapeHtml(template.body)}</textarea>


            <p
                id="editTemplateMessage"
                class="message">
            </p>


            <button
                type="button"
                class="btn-action"
                id="saveTemplateChanges">
                Save Changes
            </button>


            <button
                type="button"
                class="template-popup-close-btn">
                Cancel
            </button>

        </div>
    `;

    document.body.appendChild(popup);


    // Set current language
    document.getElementById(
        "editTemplateLanguage"
    ).value = template.language;


    // Close X
    popup
        .querySelector(".template-popup-close")
        .onclick = function () {

            popup.remove();

        };


    // Cancel
    popup
        .querySelector(".template-popup-close-btn")
        .onclick = function () {

            popup.remove();

        };


    // Save Changes
    document
        .getElementById("saveTemplateChanges")
        .onclick = async function () {

            const title =
                document
                    .getElementById("editTemplateTitle")
                    .value
                    .trim();

            const language =
                document
                    .getElementById("editTemplateLanguage")
                    .value;

            const body =
                document
                    .getElementById("editTemplateCode")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("editTemplateMessage");


            if (!title || !body) {

                message.textContent =
                    "Title and code are required.";

                message.style.color =
                    "#dc2626";

                return;
            }


            message.textContent =
                "Saving changes...";

            message.style.color =
                "#2563eb";


            try {

                const response =
                    await fetch(
                        `/api/templates/${template.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                title: title,

                                language: language,

                                body: body

                            })
                        }
                    );


                const data =
                    await response.json();


                if (data.success) {

                    message.textContent =
                        "Template updated successfully.";

                    message.style.color =
                        "#16a34a";


                    setTimeout(function () {

                        popup.remove();

                        loadTemplates();

                    }, 700);

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
                    "Unable to update template.";

                message.style.color =
                    "#dc2626";
            }

        };

}

// ============================================================
// LOAD HISTORY
// ============================================================

// ============================================================
// LOAD DIAGNOSTIC HISTORY
// ============================================================

async function loadHistory() {

    const historyBody =
        document.getElementById("historyBody");

    if (!historyBody) {
        return;
    }

    try {

        const response =
            await fetch("/api/history");

        const data =
            await response.json();

        if (!data.success) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        ${escapeHtml(
                            data.message ||
                            "Unable to load diagnostic history."
                        )}
                    </td>
                </tr>
            `;

            return;
        }


        if (
            !data.history ||
            data.history.length === 0
        ) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No diagnostic history found.
                    </td>
                </tr>
            `;

            return;
        }


        historyBody.innerHTML = "";


        data.history.forEach(function (item) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formatHistoryDate(item.created_at)}
                </td>

                <td>
                    <span class="history-language">
                        ${escapeHtml(item.language)}
                    </span>
                </td>

                <td>
                    <pre class="history-code">${escapeHtml(
                        item.code_input
                    )}</pre>
                </td>

                <td>
                    <div class="history-error">
                        ${escapeHtml(
                            item.detected_error
                        )}
                    </div>
                </td>

                <td>
                    <div class="history-solution">
                        ${escapeHtml(
                            item.solution
                        )}
                    </div>
                </td>

            `;


            historyBody.appendChild(row);

        });

    }
    catch (error) {

        console.error(
            "Diagnostic history error:",
            error
        );

        historyBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load diagnostic history.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// FORMAT HISTORY DATE
// ============================================================

function formatHistoryDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return escapeHtml(dateValue);
    }

    return date.toLocaleString();
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}