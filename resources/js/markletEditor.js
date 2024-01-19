export default class markletEditor {
    constructor({ el, previewEl, parseFunction = null, onChange = null }) {
        this.editor = document.querySelector(el);
        this.preview = document.querySelector(previewEl);
        this.parseFunction = this.convertToHtml;
        if (parseFunction) {
            this.parseFunction = parseFunction;
        }
        this.onChange = function () {};
        if (onChange) {
            this.onChange = onChange;
        }
        if (!this.editor) throw "Editor Element not found";
        if (!this.preview) console.warn("Preview Element not found");
        this.updatePreview();
    }
    formatText(format) {
        var selectionStart = this.editor.selectionStart;
        var selectionEnd = this.editor.selectionEnd;
        var selectedText = this.editor.value.substring(
            selectionStart,
            selectionEnd
        );
        var lineposition = this.getTextLinePosition();
        var newLine = "";
        if (lineposition) {
            if (lineposition.textBefore) {
                newLine = "\n";
            }
        }
        switch (format) {
            case "bold":
                selectedText = `**${selectedText}**`;
                break;
            case "italic":
                selectedText = `*${selectedText}*`;
                break;
            case "strikethrough":
                selectedText = `~~${selectedText}~~`;
                break;
            case "heading1":
                selectedText = `${newLine}# ${selectedText}`;
                break;
            case "heading2":
                selectedText = `${newLine}## ${selectedText}`;
                break;
            case "heading3":
                selectedText = `${newLine}### ${selectedText}`;
                break;
            case "heading4":
                selectedText = `${newLine}#### ${selectedText}`;
                break;
            case "heading5":
                selectedText = `${newLine}##### ${selectedText}`;
                break;
            case "heading6":
                selectedText = `${newLine}###### ${selectedText}`;
                break;
            case "unorderedList":
                selectedText = selectedText
                    .split("\n")
                    .map((line) => `- ${line}`)
                    .join("\n");
                break;
            case "orderedList":
                selectedText = selectedText
                    .split("\n")
                    .map((line, index) => `${index + 1}. ${line}`)
                    .join("\n");
                break;
            case "blockquote":
                selectedText = selectedText
                    .split("\n")
                    .map((line) => `> ${line}`)
                    .join("\n");
                break;
            case "code":
                selectedText = "```\n" + selectedText + "\n```";
                break;
            case "horizontalRule":
                selectedText = "\n---\n";
                break;
            case "image":
                var imageSrc = prompt("Enter the URL of the image:");
                if (imageSrc) {
                    selectedText = `![alt text](${imageSrc})`;
                }
                break;
            case "link":
                var linkText = prompt("Enter the link text:");
                if (linkText) {
                    var linkUrl = prompt("Enter the URL of the link:");
                }

                if (linkText && linkUrl) {
                    selectedText = `[${linkText}](${linkUrl})`;
                }
                break;
        }

        //add test
        document.execCommand("insertText", false, selectedText);
        this.editor.selectionStart = selectionStart;
        this.editor.selectionEnd = selectionStart + selectedText.length;
        this.editor.focus();
        this.updatePreview();
    }
    getTextLinePosition() {
        // Get the value of the textarea
        var textarea = this.editor;

        var cursorPosition = textarea.selectionStart;

        // Get the value of the textarea
        var textareaValue = textarea.value;

        // Extract the text before the cursor position
        var textBefore = textareaValue.substring(0, cursorPosition);

        // Count the number of newline characters before the cursor position
        var linePosition = textBefore.split("\n").length;

        return {
            linePosition: linePosition,
            textBefore: textBefore,
        };
    }
    handleKeyPress(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            this.handleTabKey();
        }
    }

    handleTabKey() {
        var start = this.editor.selectionStart;
        var end = this.editor.selectionEnd;
        var value = this.editor.value;

        // Insert tab character at the current cursor position
        this.editor.value =
            value.substring(0, start) + "\t" + value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + 1;

        // Trigger input event to update preview
        var event = new Event("input", {
            bubbles: true,
        });
        this.editor.dispatchEvent(event);
    }

    updatePreview() {
        var markdown = this.editor.value;
        var html = this.parseFunction(markdown);
        this.onChange({ text: markdown, html: html });
        if (this.preview) {
            this.preview.innerHTML = html;
        }
    }
    togglePreview() {
        var display = this.preview.style.display;
        switch (display) {
            case "none":
                this.preview.style.display = "block";
                break;
            default:
                this.preview.style.display = "none";
                break;
        }
    }
    parseLists(markdown) {
        // Splitting the input markdown into separate lines
        const lines = markdown.split("\n");

        let html = "";
        let listType = null;
        let listOpen = false;

        // Iterate over each line of the markdown
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("- ")) {
                // Unordered list item
                if (!listOpen) {
                    // Start a new unordered list
                    html += "<ul>";
                    listOpen = true;
                }
                html += `<li>${trimmedLine.substring(2)}</li>`;
            } else if (/^\d+\. /.test(trimmedLine)) {
                // Ordered list item
                if (listType !== "ol") {
                    // Start a new ordered list
                    html += "<ol>";
                    listType = "ol";
                    listOpen = true;
                }
                html += `<li>${trimmedLine.substring(
                    trimmedLine.indexOf(".") + 2
                )}</li>`;
            } else {
                // Other content or end of list
                if (listOpen) {
                    // Close the list
                    html += `</${listType}>`;
                    listOpen = false;
                    listType = null;
                }
                html += line + "<br>";
            }
        }

        // Close any remaining open list
        if (listOpen) {
            html += `</${listType}>`;
        }

        return html;
    }
    convertToHtml(markdown) {
        var html = markdown
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
            .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics
            .replace(/~~(.*?)~~/g, "<del>$1</del>") // Strikethrough
            .replace(/^# (.*?)(\r?\n|$)/gm, "<h1>$1</h1>") // Heading 1
            .replace(/^## (.*?)(\r?\n|$)/gm, "<h2>$1</h2>") // Heading 2
            .replace(/^### (.*?)(\r?\n|$)/gm, "<h3>$1</h3>") // Heading 3
            .replace(/^#### (.*?)(\r?\n|$)/gm, "<h4>$1</h4>") // Heading 4
            .replace(/^##### (.*?)(\r?\n|$)/gm, "<h5>$1</h5>") // Heading 5
            .replace(/^###### (.*?)(\r?\n|$)/gm, "<h6>$1</h6>") // Heading 6
            .replace(/>\s(.*)/gm, "<blockquote>$1</blockquote>") // Blockquote
            .replace(/```([^```]+)```/g, "<pre><code>$1</code></pre>") // Code
            .replace(/---/g, "<hr>") // Horizontal Rule
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">') // Image
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'); // Link
        html = this.parseLists(html);
        html = html.replace(/\n\n/g, "<br>"); // Line breaks between paragraphs

        return html;
    }
}
