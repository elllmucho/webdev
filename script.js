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

    // Every topic in the site-wide dropdown: which page it lives on, the URL to
    // reach it from elsewhere, and (for multi-module pages) the section ids whose
    // presence in the URL hash means "start on this topic".
    var topics = {
        structure:  { page: "html5",     url: "index.html",
            hashIds: [] },
        form:       { page: "html5",     url: "index.html#forms",
            hashIds: ["w4-objectives", "forms", "input-types", "validation", "form-elements", "multimedia", "accessibility", "w4-lab", "w4-takeaways"] },
        css3:       { page: "css3",      url: "css3-fundamentals.html",
            hashIds: [] },
        layouts:    { page: "layouts",   url: "css3-layouts-responsive-design.html",
            hashIds: [] },
        responsive: { page: "layouts",   url: "css3-layouts-responsive-design.html#mobile-first",
            hashIds: ["mobile-first", "fluid-layouts", "responsive-images", "media-queries", "bootstrap5", "lab2"] }
    };

    function applyModule(module) {
        document.querySelectorAll("[data-module]").forEach(function (el) {
            el.style.display = el.getAttribute("data-module") === module ? "" : "none";
        });
    }

    // Pick this page's default topic + figure out which topic the current hash implies
    var defaultTopic = { html5: "structure", css3: "css3", layouts: "layouts" }[page];
    var currentHash = window.location.hash.replace("#", "");
    var initialTopic = defaultTopic;
    Object.keys(topics).forEach(function (key) {
        if (topics[key].page === page && topics[key].hashIds.indexOf(currentHash) !== -1) {
            initialTopic = key;
        }
    });

    select.value = initialTopic;
    applyModule(initialTopic);

    select.addEventListener("change", function () {
        var target = topics[select.value];
        if (!target) {
            return;
        }
        if (target.page === page) {
            applyModule(select.value);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.location.href = target.url;
        }
    });
}

document.addEventListener("DOMContentLoaded", initTryItBoxes);
document.addEventListener("DOMContentLoaded", initModuleSwitch);
