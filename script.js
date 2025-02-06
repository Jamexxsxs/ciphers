const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function toggleShiftInput() {
    let cipherType = document.getElementById("cipherType").value;
    document.getElementById("shiftContainer").style.display = cipherType === "caesar" ? "block" : "none";
    document.getElementById("monoKeyContainer").style.display = cipherType === "monoalphabetic" ? "block" : "none";
}

function caesarCipher(text, shift, encrypt = true) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char === ' ') {
            result += ' ';
        } else {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();

            let index = alphabet.indexOf(char);
            if (index !== -1) {
                let newIndex = encrypt 
                    ? (index + shift) % 26 
                    : (index - shift + 26) % 26;
                let newChar = alphabet[newIndex];
                result += isUpper ? newChar.toUpperCase() : newChar;
            } else {
                result += char;
            }
        }
    }
    return result;
}

function generateMonoKey() {
    let shuffledAlphabet = alphabet.split('').sort(() => Math.random() - 0.5).join('');
    document.getElementById("monoKey").value = shuffledAlphabet;
}

function monoCipher(text, key, encrypt = true) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char === ' ') {
            result += ' ';
        } else {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();

            let index = encrypt ? alphabet.indexOf(char) : key.indexOf(char);
            if (index !== -1) {
                let newChar = encrypt ? key[index] : alphabet[index];
                result += isUpper ? newChar.toUpperCase() : newChar;
            } else {
                result += char;
            }
        }
    }
    return result;
}

function processText(encrypt) {
    let text = document.getElementById("inputText").value;
    let cipherType = document.getElementById("cipherType").value;
    let output = '';

    if (cipherType === "caesar") {
        let shift = parseInt(document.getElementById("shift").value) || 0;
        output = caesarCipher(text, shift, encrypt);
    } else if (cipherType === "monoalphabetic") {
        let key = document.getElementById("monoKey").value;
        if (!key || key.length !== 26) {
            alert("Generate a valid monoalphabetic key first!");
            return;
        }
        output = monoCipher(text, key, encrypt);
    }

    document.getElementById("outputText").value = output;
}
