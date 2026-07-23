const fs = require('fs');

let html = fs.readFileSync('scratch_redesign.html', 'utf-8');

// Get body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (bodyMatch) {
    html = bodyMatch[1];
}

html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
html = html.replace(/<img(.*?)>/g, '<img$1 />');
html = html.replace(/<input(.*?)>/g, '<input$1 />');
// Fix style attributes
html = html.replace(/style="([^"]*)"/g, (match, styleString) => {
    const parts = styleString.split(';').filter(p => p.trim() !== '');
    const styleObj = {};
    parts.forEach(p => {
        const [k, v] = p.split(':');
        if(k && v) {
            const camelK = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            styleObj[camelK] = v.trim();
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});
// Replace For labels
html = html.replace(/for=/g, 'htmlFor=');

fs.writeFileSync('scratch_jsx.txt', html);
console.log('Done!');
