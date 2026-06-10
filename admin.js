import {
    db,
    auth
}
from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const content =
    document.getElementById("content");

const tabs =
    document.querySelectorAll(".tab");

let currentFilter = "todos";

/* =========================================
   LOGIN FIREBASE
========================================= */

const loginScreen =
    document.getElementById(
        "loginScreen"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginEmail =
    document.getElementById(
        "loginEmail"
    );

const loginSenha =
    document.getElementById(
        "loginSenha"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

if(loginButton){

    loginButton.addEventListener(
        "click",
        async () => {

            try{

                await signInWithEmailAndPassword(

                    auth,

                    loginEmail.value,

                    loginSenha.value

                );

            }
            catch(error){

                console.error(error);

                loginError.textContent =
                    "Email ou senha inválidos";

            }

        }
    );

}

onAuthStateChanged(

    auth,

    (user) => {

        if(user){

            loginScreen.style.display =
                "none";

            adminPanel.style.display =
                "block";

            loadSection(
                "inscricoes"
            );

        }
        else{

            loginScreen.style.display =
                "flex";

            adminPanel.style.display =
                "none";

        }

    }

);

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if(logoutButton){

    logoutButton.addEventListener(
        "click",
        async () => {

            await signOut(auth);

        }
    );

}

/* =========================================
   EVENTOS DAS ABAS
========================================= */

tabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        tabs.forEach((button) => {
            button.classList.remove("active");
        });

        tab.classList.add("active");

        const section =
            tab.dataset.tab;

        loadSection(section);

    });

});

const statusFilter =
    document.getElementById(
        "statusFilter"
    );

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        () => {

            currentFilter =
                statusFilter.value;

            const activeTab =
                document.querySelector(
                    ".tab.active"
                );

            loadSection(
                activeTab.dataset.tab
            );

        }
    );

}

/* =========================================
   INICIAL
========================================= */

window.updateStatus = async (
    collectionName,
    documentId,
    status
) => {

    try {

        await updateDoc(
            doc(
                db,
                collectionName,
                documentId
            ),
            {
                status
            }
        );

    }
    catch (erro) {

        console.error(
            "Erro ao atualizar status:",
            erro
        );

        alert(
            "Erro ao atualizar status."
        );
    }

};


/* =========================================
   CARREGAR SEÇÃO
========================================= */

function createStatusSelect(
    section,
    documentId,
    currentStatus = "novo"
) {

    let options = [];

    if (section === "inscricoes") {

        options = [
            "novo",
            "analise",
            "aprovado",
            "recusado"
        ];
    }

    if (
        section === "sugestoes"
        ||
        section === "bugs"
    ) {

        options = [
            "novo",
            "analise",
            "desenvolvimento",
            "concluido",
            "recusado"
        ];
    }

    const htmlOptions =
        options.map(status => `

            <div
                class="status-option"
                data-status="${status}"
                data-section="${section}"
                data-id="${documentId}"
            >

                ${status}

            </div>

        `).join("");

    return `

        <div
            class="
            custom-status
            status-${currentStatus}
            "
        >

            <button
                class="status-button"
            >

                <span class="status-label">
    ${currentStatus}
</span>

                <span>
                    ▼
                </span>

            </button>

            <div
                class="status-dropdown"
            >

                ${htmlOptions}

            </div>

        </div>

    `;
}

async function loadSection(section) {

    content.innerHTML =
        "<p>Carregando...</p>";

    try {

        const q = query(
            collection(db, section),
            orderBy("criadoEm", "desc")
        );

        const snapshot =
            await getDocs(q);

        if (snapshot.empty) {

            content.innerHTML =
    "<p>Nenhum registro encontrado.</p>";

content.classList.remove(
    "content-transition"
);

void content.offsetWidth;

content.classList.add(
    "content-transition"
);

            return;
        }

        let html = "";

        snapshot.forEach((doc) => {

            const data =
                doc.data();

if (

    currentFilter !== "todos"

    &&

    (data.status || "novo")
    !== currentFilter

) {

    return;
}

            const dataHora =
                data.criadoEm?.toDate();

            const dataFormatada =
                dataHora
                ? dataHora.toLocaleDateString("pt-BR")
                : "-";

            const horaFormatada =
                dataHora
                ? dataHora.toLocaleTimeString("pt-BR")
                : "-";

            /* =====================
               INSCRIÇÕES
            ===================== */

            if (section === "inscricoes") {

                html += `
                <div class="card">

                    <p>
                        <strong>Nome:</strong>
                        ${data.nome || "-"}
                    </p>

                    <p>
                        <strong>Canal:</strong>
                        ${data.canal || "-"}
                    </p>

                    <p>
                        <strong>Plataforma:</strong>
                        ${data.plataforma || "-"}
                    </p>

                    <p>
                        <strong>Link do Canal:</strong>
                        ${data.linkCanal || "-"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${data.email || "-"}
                    </p>

                    <p>
                        <strong>Discord:</strong>
                        ${data.discord || "-"}
                    </p>

                    <p>
                        <strong>Mensagem:</strong>
                        ${data.mensagem || "-"}
                    </p>

${createStatusSelect(
    section,
    doc.id,
    data.status || "novo"
)}

                    <div class="card-footer">

                        <span>
                            ${dataFormatada}
                        </span>

                        <span>
                            ${horaFormatada}
                        </span>

                    </div>

                </div>
                `;
            }

            /* =====================
               APOIOS
            ===================== */

            if (section === "apoios") {

console.log("APOIO:", data);

    html += `
    <div class="card">

        <p>
            <strong>Nome:</strong>
            ${data.nome || "Não informado"}
        </p>

        <p>
            <strong>Mensagem:</strong>
            ${data.mensagem || "Não informada"}
        </p>

        ${
    data.comprovante
    ? `
    <div class="admin-image-box">

        <strong>Comprovante:</strong>

        <img
            src="${data.comprovante}"
            alt="Comprovante enviado"
            class="admin-image"
        >

    </div>
    `
    : ""
}

        <div class="card-footer">

            <span>${dataFormatada}</span>

            <span>${horaFormatada}</span>

        </div>

    </div>
    `;
}

            /* =====================
               SUGESTÕES
            ===================== */

            if (section === "sugestoes") {

    html += `
    <div class="card">

        <p>
            <strong>Nome:</strong>
            ${data.nome || "Não informado"}
        </p>

        <p>
            <strong>Sugestão:</strong>
            ${data.mensagem || "-"}
        </p>

        ${
    data.comprovante
    ? `
    <div class="admin-image-box">

        <strong>Comprovante:</strong>

        <img
            src="${data.comprovante}"
            alt="Comprovante enviado"
            class="admin-image"
        >

    </div>
    `
    : ""
}

${createStatusSelect(
    section,
    doc.id,
    data.status || "novo"
)}

        <div class="card-footer">

            <span>${dataFormatada}</span>

            <span>${horaFormatada}</span>

        </div>

    </div>
    `;
}

            /* =====================
               BUGS
            ===================== */

            if (section === "bugs") {

    html += `
    <div class="card">

        <p>
            <strong>Tipo:</strong>
            ${data.tipo || "-"}
        </p>

        <p>
            <strong>Nome:</strong>
            ${data.nome || "-"}
        </p>

        <p>
            <strong>Relatório:</strong>
            ${data.mensagem || "-"}
        </p>

        ${
    data.arquivo
    ? `
    <div class="admin-image-box">

        <strong>Arquivo:</strong>

        <img
            src="${data.arquivo}"
            alt="Arquivo enviado"
            class="admin-image"
        >

    </div>
    `
    : ""
}

${createStatusSelect(
    section,
    doc.id,
    data.status || "novo"
)}

        <div class="card-footer">

            <span>${dataFormatada}</span>

            <span>${horaFormatada}</span>

        </div>

    </div>
    `;
}

        });

        content.classList.remove(
    "content-transition"
);

content.innerHTML = html;

void content.offsetWidth;

content.classList.add(
    "content-transition"
);

    }
    catch (erro) {

        console.error(erro);

        content.innerHTML =
    "<p>Erro ao carregar dados.</p>";

content.classList.remove(
    "content-transition"
);

void content.offsetWidth;

content.classList.add(
    "content-transition"
);
    }
}

/* =========================================
   FILTRO CUSTOM
========================================= */

const filter =
    document.querySelector(".customFilter");

const filterButton =
    document.getElementById("filterButton");

const dropdown =
    document.getElementById("filterDropdown");

const selectedFilter =
    document.getElementById("selectedFilter");

const options =
    document.querySelectorAll(".filterOption");

if(filterButton){

    filterButton.addEventListener(
        "click",
        () => {

            filter.classList.toggle("active");

        }
    );

    options.forEach(option => {

        option.addEventListener(
    "click",
    () => {

        selectedFilter.textContent =
            option.textContent;

        currentFilter =
            option.dataset.value;

        filter.classList.remove("active");

        const activeTab =
            document.querySelector(
                ".tab.active"
            );

        loadSection(
            activeTab.dataset.tab
        );

    }
);

    });

    document.addEventListener(
        "click",
        (e) => {

            if(
                !filter.contains(e.target)
            ){
                filter.classList.remove("active");
            }

        }
    );

}

document.addEventListener(
    "click",
    async (e) => {

        const button =
            e.target.closest(
                ".status-button"
            );

        if(button){

            const status =
                button.parentElement;

            document
                .querySelectorAll(
                    ".custom-status"
                )
                .forEach(item => {

                    if(item !== status){

                        item.classList.remove(
                            "active"
                        );

                    }

                });

            status.classList.toggle(
                "active"
            );

            return;
        }

        const option =
            e.target.closest(
                ".status-option"
            );

        if(option){

            const statusBox =
                option.closest(
                    ".custom-status"
                );

            const newStatus =
                option.dataset.status;

            const section =
                option.dataset.section;

            const documentId =
                option.dataset.id;

            await updateStatus(
                section,
                documentId,
                newStatus
            );

            statusBox.className =
                `custom-status status-${newStatus}`;

            statusBox.querySelector(
    ".status-button .status-label"
).textContent =
    newStatus;

            statusBox.classList.remove(
                "active"
            );

            return;
        }

        document
            .querySelectorAll(
                ".custom-status"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );

            });

    }
);