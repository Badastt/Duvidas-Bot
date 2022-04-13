const { max } = require("pg/lib/defaults");

const messageBreak = (lines, error_msg) => {
    let messages = [];

    if (lines.length == 0)
        messages.push(error_msg);
    else {
        let j = 0, size = 0;
        for (let i = 0; i < lines.length; i++) {
            size += lines[i].length;
            if (size >= 1800) {
                messages.push(lines.slice(j, i).join("\n"));
                j = i;
                size = 0;
                i--;
            }
        }
        if (size > 0)
            messages.push(lines.slice(j, lines.length).join("\n"));
    }

    return messages;
}

const textBreak = (text, max_size) => {
    let messages = [];

    let j = 0, size = text.length;
    while (size > 0) {
        messages.push(text.slice(0, max_size));
        text = text.slice(max_size, text.length);
        size -= max_size;
    }
    
    return messages;
}

// Exports
module.exports.messageBreak = messageBreak;
module.exports.textBreak = textBreak;
