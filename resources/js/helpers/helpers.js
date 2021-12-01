export function showAlertifyConfirm(title, msg, callback) {
    alertify.confirm(title, msg, callback, null).set({
        movable: false,
        labels: { ok: "Tak", cancel: "Nie" },
        defaultFocusOff: true,
        transition: "zoom",
    });
}

export const quillOptions = {
    placeholder: "Treść",
    theme: "snow",
    modules: {
        toolbar: [["bold", "italic", "underline"], ["link"], [{ align: [] }], [{ list: "ordered" }, { list: "bullet" }], [{ indent: "-1" }, { indent: "+1" }]],
    },
    formats: ["bold", "italic", "underline", "align", "list", "indent", "link"],
};

export function getSuccessAlert(response) {
    alertify.success(response);
    return {};
}
export function getErrorsOrAlert(response) {
    if (response && response.status === 422) {
        return response.data.errors;
        // window.scrollTo(0, 0);
    }
    if (response && response.status === 424) {
        alertify.error(response.data.msg);
        window.location.reload();
        return {};
    }
    let msg = "Wystąpił błąd serwera.";
    if (response) {
        if (response.status === 432) {
            msg = response.data.msg;
        } else if (response.status === 429) {
            msg = "Wykryto zbyt dużą ilość żądań. Proszę odczekać 1 minutę i spróbować ponownie.";
        }
    }
    alertify.error(msg);
    return {};
}
