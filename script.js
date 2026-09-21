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
        var htmlArea = box.querySelector(".tryit-html");
        var cssArea = box.querySelector(".tryit-css");
        var singleArea = box.querySelector(".tryit-code:not(.tryit-html):not(.tryit-css)");
        var iframe = box.querySelector(".tryit-frame");
        var runBtn = box.querySelector(".tryit-run");
        var resetBtn = box.querySelector(".tryit-reset");

        var originalHtml = htmlArea ? htmlArea.value : null;
        var originalCss = cssArea ? cssArea.value : null;
        var originalSingle = singleArea ? singleArea.value : null;

        iframe.setAttribute("sandbox", "allow-same-origin allow-popups allow-forms");

        function getCode() {
            if (htmlArea && cssArea) {
                return "<style>\n" + cssArea.value + "\n</style>\n" + htmlArea.value;
            }
            return singleArea.value;
        }

        function run() {
            iframe.srcdoc = buildSrcDoc(getCode());
        }

        run();

        runBtn.addEventListener("click", run);

        resetBtn.addEventListener("click", function () {
            if (htmlArea) { htmlArea.value = originalHtml; }
            if (cssArea) { cssArea.value = originalCss; }
            if (singleArea) { singleArea.value = originalSingle; }
            run();
        });

        [htmlArea, cssArea, singleArea].filter(Boolean).forEach(function (textarea) {
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
    });
}

function initModuleSwitch() {
    var select = document.getElementById("module-select");
    if (!select) {
        return;
    }

    var page = document.body.getAttribute("data-page") || "html5";

    var formSectionIds = [
        "w4-objectives", "forms", "input-types", "validation",
        "form-elements", "multimedia", "accessibility", "w4-lab", "w4-takeaways"
    ];

    function applyModule(module) {
        document.querySelectorAll("[data-module]").forEach(function (el) {
            el.style.display = el.getAttribute("data-module") === module ? "" : "none";
        });
    }

    if (page === "html5") {
        var currentHash = window.location.hash.replace("#", "");
        var initialModule = formSectionIds.indexOf(currentHash) !== -1 ? "form" : "structure";
        select.value = initialModule;
        applyModule(initialModule);
    } else {
        select.value = "css3";
    }

    select.addEventListener("change", function () {
        var topic = select.value;

        if (page === "html5") {
            if (topic === "css3") {
                window.location.href = "css3-fundamentals.html";
                return;
            }
            applyModule(topic);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // On the CSS3 page: "structure"/"form" live on index.html, "css3" is already here
        if (topic === "structure") {
            window.location.href = "index.html";
        } else if (topic === "form") {
            window.location.href = "index.html#forms";
        }
    });
}

document.addEventListener("DOMContentLoaded", initTryItBoxes);
document.addEventListener("DOMContentLoaded", initModuleSwitch);
