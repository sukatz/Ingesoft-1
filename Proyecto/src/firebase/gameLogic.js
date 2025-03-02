function verifyWord(guessWord, attempt){

    const guessWordLen = guessWord.length

    guessWordList = guessWord.split("")

    let attemptVerification = [] 

    for (let i = 0; i < guessWordLen; i++) {
        attemptVerification.push(-1)
            //   0 - La letra no esta
            //   1 - Posicion incorrecta de la letra
            //   2 - Posicion correcta
    }

    for (let i = 0; i < guessWordLen; i++) {
        if (!guessWordList.includes(attempt[i])) {
            attemptVerification[i] = 0;
        }
    }

    for (let i = 0; i < guessWordLen; i++) {
        if (attempt[i] == guessWordList[i]) {
            attemptVerification[i] = 2;

            guessWordList[i] = " "

            console.log(guessWordList)
        }
    }

    for (let i = 0; i < guessWordLen; i++) {
        if (attempt[i] != guessWord[i] && guessWord.includes(attempt[i])) {


            if (guessWordList.filter(letter => letter === attempt[i]).length > 0) {

                attemptVerification[i] = 1;
                guessWordList[guessWordList.indexOf(attempt[i])] = " "

            }
            else {
                attemptVerification[i] = 0;
            }
        }
    }

    return attemptVerification
}