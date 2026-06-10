import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ACCORDION
    ========================================= */

    const accordionButtons =
        document.querySelectorAll(".accordion-header");

    accordionButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const currentCard =
                button.parentElement;

            const isActive =
                currentCard.classList.contains("active");

            document
                .querySelectorAll(".accordion-card")
                .forEach(card => {
                    card.classList.remove("active");
                });

            if (!isActive) {
                currentCard.classList.add("active");
            }

        });

    });


/* =========================================
   VIDEO DEMONSTRAÇÃO
========================================= */

const videoButton =
    document.getElementById("videoToggle");

const videoContent =
    document.getElementById("videoContent");

const demoVideo =
    document.getElementById("demoVideo");

const videoIcon =
    document.querySelector(".video-play-icon");

if (
    videoButton &&
    videoContent &&
    demoVideo
) {

    videoButton.addEventListener(
        "click",
        () => {

            const isOpen =
                videoContent.classList.contains("active");

            if (isOpen) {

                videoContent.classList.remove("active");

                videoButton.classList.remove("active");


                demoVideo.pause();
                demoVideo.currentTime = 0;

            } else {

                videoContent.classList.add("active");

                videoButton.classList.add("active");


                demoVideo.play();

            }

        }
    );

    demoVideo.addEventListener(
        "ended",
        () => {

            videoContent.classList.remove("active");

            videoButton.classList.remove("active");


            demoVideo.currentTime = 0;

        }
    );

}

    /* =========================================
       PIX
    ========================================= */

    const copyButton =
        document.getElementById("copyPixButton");

    if (copyButton) {

        copyButton.addEventListener("click", () => {

            const pixKey =
                document.getElementById("pixKey").value;

            navigator.clipboard.writeText(pixKey);

            copyButton.innerText =
                "✅ Chave Copiada";

            setTimeout(() => {

                copyButton.innerText =
                    "Copiar Chave Pix";

            }, 2000);

        });

    }

    /* =========================================
       INSCRIÇÕES
    ========================================= */

    const inscricaoForm =
        document.getElementById("inscricaoForm");

    if (inscricaoForm) {

        inscricaoForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                try {

                    await addDoc(
                        collection(db, "inscricoes"),
                        {

                            nome:
                                document.getElementById("nome").value,

                            canal:
                                document.getElementById("canal").value,

                            plataforma:
                                document.getElementById("plataforma").value,

                            linkCanal:
                                document.getElementById("linkCanal").value,

                            email:
                                document.getElementById("email").value,

                            discord:
                                document.getElementById("discord").value,

                            mensagem:
                                document.getElementById("mensagem").value,

                            status: "pendente",

                            criadoEm:
                                serverTimestamp()

                        }
                    );

                    alert(
                        "Solicitação enviada com sucesso!"
                    );

                    inscricaoForm.reset();

                }
                catch (erro) {

                    console.error(
                        "Erro ao salvar:",
                        erro
                    );

                    alert(
                        "Erro ao enviar solicitação."
                    );

                }

            }
        );

    }

/* =========================================
   CLOUDINARY
========================================= */

async function uploadArquivoCloudinary(file) {

    if (!file) return "";

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        "Site LIP"
    );

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/dntxzc2hj/auto/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const data =
        await response.json();

    return data.secure_url;
}

/* =========================================
   APOIOS
========================================= */

const doeiButton =
    document.getElementById("doeiButton");

if (doeiButton) {

    doeiButton.addEventListener(
        "click",
        async () => {

            try {

                doeiButton.disabled = true;

                doeiButton.innerText =
                    "Enviando...";

                const nome =
                    document.getElementById("apoioNome").value;

                const mensagem =
                    document.getElementById("apoioMensagem").value;

                const arquivo =
                    document.getElementById("apoioComprovante").files[0];

                let comprovante = "";

                if (arquivo) {

                    comprovante =
                        await uploadArquivoCloudinary(arquivo);
                }

                await addDoc(
                    collection(db, "apoios"),
                    {
                        nome,
                        mensagem,
                        comprovante,
                        criadoEm:
                            serverTimestamp()
                    }
                );

                alert(
                    "Obrigado pelo apoio ❤️"
                );

                document.getElementById("apoioNome").value = "";
                document.getElementById("apoioMensagem").value = "";
                document.getElementById("apoioComprovante").value = "";

            }
            catch (erro) {

                console.error(erro);

                alert(
                    "Erro ao enviar apoio."
                );
            }

            doeiButton.disabled = false;

            doeiButton.innerText =
                "❤️ Doei";
        }
    );
}

/* =========================================
   SUGESTÕES
========================================= */

const sugestaoForm =
    document.getElementById("sugestaoForm");

if (sugestaoForm) {

    sugestaoForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                const nome =
                    document.getElementById("sugestaoNome").value;

                const mensagem =
                    document.getElementById("sugestaoTexto").value;

                const arquivo =
                    document.getElementById("sugestaoImagem").files[0];

                let arquivoUrl = "";

                if (arquivo) {

                    arquivoUrl =
                        await uploadArquivoCloudinary(arquivo);
                }

                await addDoc(
                    collection(db, "sugestoes"),
                    {
                        nome,
                        mensagem,
                        arquivo: arquivoUrl,
                        criadoEm:
                            serverTimestamp()
                    }
                );

                alert(
                    "Sugestão enviada!"
                );

                sugestaoForm.reset();

            }
            catch (erro) {

                console.error(erro);

                alert(
                    "Erro ao enviar sugestão."
                );
            }

        }
    );
}

/* =========================================
   BUGS
========================================= */

const bugForm =
    document.getElementById("bugForm");

if (bugForm) {

    bugForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                const tipo =
                    document.getElementById("bugTipo").value;

                const nome =
                    document.getElementById("bugNome").value;

                const mensagem =
                    document.getElementById("bugDescricao").value;

                const arquivo =
                    document.getElementById("bugImagem").files[0];

                let arquivoUrl = "";

                if (arquivo) {

                    arquivoUrl =
                        await uploadArquivoCloudinary(arquivo);
                }

                await addDoc(
                    collection(db, "bugs"),
                    {
                        tipo,
                        nome,
                        mensagem,
                        arquivo: arquivoUrl,
                        criadoEm:
                            serverTimestamp()
                    }
                );

                alert(
                    "Relatório enviado!"
                );

                bugForm.reset();

            }
            catch (erro) {

                console.error(erro);

                alert(
                    "Erro ao enviar relatório."
                );
            }

        }
    );
}

});