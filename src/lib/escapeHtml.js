// scape html characters in string
function escapeHtml(html) {
    if (!html) return '';
    if (typeof html != 'string') return "" + html;
    return html.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
