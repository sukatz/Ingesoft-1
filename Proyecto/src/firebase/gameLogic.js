function verifyWord(targetWord, attempt) {
    const wordLength = targetWord.length;
    let targetWordArray = targetWord.split("");
    
    // Initialize verification array
    let verification = Array(wordLength).fill(-1);
    
    // First pass: Check for exact matches (green)
    for (let i = 0; i < wordLength; i++) {
        if (attempt[i] === targetWordArray[i]) {
            verification[i] = 2;
            targetWordArray[i] = " "; // Mark as used
        }
    }
    
    // Second pass: Check for letters in wrong positions (yellow) or not present (gray)
    for (let i = 0; i < wordLength; i++) {
        // Skip positions that were already marked green
        if (verification[i] !== 2) {
            const letterIndex = targetWordArray.indexOf(attempt[i]);
            if (letterIndex !== -1) {
                verification[i] = 1; // Letter exists but wrong position
                targetWordArray[letterIndex] = " "; // Mark as used
            } else {
                verification[i] = 0; // Letter does not exist in the word
            }
        }
    }
    console.log(verification)
    return verification;
}

export default verifyWord;