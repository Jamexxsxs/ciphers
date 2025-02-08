const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function toggleInputs() {
    let cipherType = document.getElementById("cipherType").value;
    document.getElementById("shiftContainer").style.display = cipherType === "caesar" ? "block" : "none";
    document.getElementById("monoKeyContainer").style.display = cipherType === "monoalphabetic" ? "block" : "none";
    document.getElementById("playfairKeyContainer").style.display = cipherType === "playfair" ? "block" : "none";
}

// Caesar Cipher
function caesarCipher(text, shift, encrypt = true) {
    let result = '';

    for (let char of text) {
        if (char === ' ') {
            result += ' ';
        } else {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();

            let index = alphabet.indexOf(char);
            if (index !== -1) {
                let newIndex = encrypt ? (index + shift) % 26 : (index - shift + 26) % 26;
                let newChar = alphabet[newIndex];
                result += isUpper ? newChar.toUpperCase() : newChar;
            } else {
                result += char;
            }
        }
    }
    return result;
}

// Monoalphabetic Cipher
function generateMonoKey() {
    let shuffledAlphabet = alphabet.split('').sort(() => Math.random() - 0.5).join('');
    document.getElementById("monoKey").value = shuffledAlphabet;
}

function monoCipher(text, key, encrypt = true) {
    let result = '';

    for (let char of text) {
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

// Playfair Cipher
function generatePlayfairMatrix() {
    let key = document.getElementById("playfairKey").value.toLowerCase().replace(/j/g, 'i');
    let matrix = [];
    let used = new Set();
    let filteredKey = '';

    for (let char of key + alphabet.replace('j', '')) {
        if (!used.has(char) && char !== ' ') {
            used.add(char);
            filteredKey += char;
        }
    }

    for (let i = 0; i < 5; i++) {
        matrix.push(filteredKey.slice(i * 5, i * 5 + 5));
    }

    return matrix;
}

function playfairCipher(text, key, encrypt = true) {
    let matrix = generatePlayfairMatrix();
    text = text.toLowerCase().replace(/j/g, 'i').replace(/ /g, '');
    let result = '';

    let pairs = [];
    for (let i = 0; i < text.length; i += 2) {
        let first = text[i];
        let second = text[i + 1] || 'x';

        if (first === second) {
            second = 'x';
            i--;
        }

        pairs.push([first, second]);
    }

    function findPosition(letter) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (matrix[row][col] === letter) return [row, col];
            }
        }
    }

    for (let [first, second] of pairs) {
        let [r1, c1] = findPosition(first);
        let [r2, c2] = findPosition(second);

        if (r1 === r2) {
            c1 = (c1 + (encrypt ? 1 : 4)) % 5;
            c2 = (c2 + (encrypt ? 1 : 4)) % 5;
        } else if (c1 === c2) {
            r1 = (r1 + (encrypt ? 1 : 4)) % 5;
            r2 = (r2 + (encrypt ? 1 : 4)) % 5;
        } else {
            [c1, c2] = [c2, c1];
        }

        result += matrix[r1][c1] + matrix[r2][c2];
    }

    return result.toUpperCase();
}

// Process Text
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
    } else if (cipherType === "playfair") {
        let key = document.getElementById("playfairKey").value;
        if (!key) {
            alert("Enter a valid Playfair key phrase!");
            return;
        }
        output = playfairCipher(text, key, encrypt);
    }

    document.getElementById("outputText").value = output;
}
