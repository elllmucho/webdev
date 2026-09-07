function buildSrcDoc(code) {
    if (/<html[\s>]/i.test(code)) {
        return code;
    }
    return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\">" +
        "<style>body{font-family:Arial,Helvetica,sans-serif;margin:12px;color:#222;}</style>" +
        "</head><body>" + code + "</body></html>";
}

function initTryItBoxes() {
    var boxes = document.querySelectorAll(".tryit");

    boxes.forEach(function (box) {
        var textarea = box.querySelector(".tryit-code");
        var iframe = box.querySelector(".tryit-frame");
        var runBtn = box.querySelector(".tryit-run");
        var resetBtn = box.querySelector(".tryit-reset");
        var originalCode = textarea.value;

        iframe.setAttribute("sandbox", "allow-same-origin allow-popups allow-forms");

        function run() {
            iframe.srcdoc = buildSrcDoc(textarea.value);
        }

        run();

        runBtn.addEventListener("click", run);

        resetBtn.addEventListener("click", function () {
            textarea.value = originalCode;
            run();
        });

        textarea.addEventListener("keydown", function (event) {
            if (event.key === "Tab") {
                event.preventDefault();
                var start = textarea.selectionStart;
                var end = textarea.selectionEnd;
                textarea.value = textarea.value.slice(0, start) + "  " + textarea.value.slice(end);
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            } else if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                run();
            }
        });
    });
}

function initModuleSwitch() {
    var select = document.getElementById("module-select");
    if (!select) {
        return;
    }

    var formSectionIds = [
        "w4-objectives", "forms", "input-types", "validation",
        "form-elements", "multimedia", "accessibility", "w4-lab", "w4-takeaways"
    ];

    function applyModule(module) {
        document.querySelectorAll("[data-module]").forEach(function (el) {
            el.style.display = el.getAttribute("data-module") === module ? "" : "none";
        });
    }

    var currentHash = window.location.hash.replace("#", "");
    var initialModule = formSectionIds.indexOf(currentHash) !== -1 ? "form" : "structure";
    select.value = initialModule;
    applyModule(initialModule);

    select.addEventListener("change", function () {
        applyModule(select.value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", initTryItBoxes);
document.addEventListener("DOMContentLoaded", initModuleSwitch);
