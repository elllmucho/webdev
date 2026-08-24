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

        iframe.setAttribute("sandbox", "allow-same-origin allow-popups");

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

document.addEventListener("DOMContentLoaded", initTryItBoxes);
