import React, {useState, useEffect} from 'react';
import Confetti from 'react-confetti'
const verbs = [
    {
        "verb": "Look after",
        "description": "To take care of or watch over someone or something"
    },
    {
        "verb": "Give up",
        "description": "To abandon something or give up on it"
    },
    {
        "verb": "Get along",
        "description": "To have a good relationship with someone"
    },
    {
        "verb": "Put off",
        "description": "To postpone something for another time"
    }]

function getRandomPosition(array) {
    if (array.length === 0) {
        return undefined; // Manejar el caso de un array vacío según tus necesidades
    }

    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}

function generateHints(word) {
    return Array.from(word, (char) => (char === ' ' ? '*' : '_'));
}

export default function Home() {
    const [rWord, setRWord] = useState(getRandomPosition(verbs))
    const [word, setWord] = useState(rWord.verb);
    const [description, setDescription] = useState(rWord.description);

    const [guess, setGuess] = useState('');
    const [gameWon, setGameWon] = useState(false);
    const [hints, setHints] = useState([]);

    useEffect(() => {
        if (word && word !== '') {
            setHints(generateHints(word));
        }

    }, [word]);


    const handleGuess = () => {
        const formattedGuess = guess.toLowerCase();
        console.log(formattedGuess, word)
        if (formattedGuess === word.toLowerCase()) {
            setGameWon(true);
        } else {
            setGuess('');
        }
    };


    const revealHint = () => {
        const hintArray = [...hints];
        const unrevealedIndexes = [];

        hintArray.forEach((hint, index) => {
            if (hint === '_') {
                unrevealedIndexes.push(index);
            }
        });

        if (unrevealedIndexes.length === 0) {
            setGameWon(true);
            return;
        }

        const randomIndex = unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
        hintArray[randomIndex] = word[randomIndex];
        setHints(hintArray);
    };

    function nextStep() {
        setGameWon(false);
        setHints([]);
        setGuess('');

        const rWord = getRandomPosition(verbs);

        setDescription(rWord.description ?? "");
        setWord(rWord.verb ?? "");
        setHints(generateHints(rWord.verb));

    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            {/*{gameWon &&<Confetti*/}
            {/*    width={400}*/}
            {/*    height={400}*/}
            {/*    tweenDuration={100}*/}
            {/*    className={"items-center justify-center"}*/}
            {/*/> }*/}
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h1 className="mb-4 text-3xl text-center font-bold">Verbs Phrasals</h1>
                {gameWon && (
                    <strong className="mb-4 text-2xl font-bold">{word}</strong>
                )}
                <p className="mb-3">Hints: {hints.join(' ')}</p>

                <h1 className="mb-3 text-white">{description}</h1>
                <input
                    className=" mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text" value={guess} onChange={(e) => setGuess(e.target.value)}/>
                <div className="flex justify-between my-2">
                    <button className="mx-2 flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleGuess}>Intentar
                    </button>
                    <button className="mx-2 flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={revealHint}>Pista
                    </button>
                </div>
                <div className="flex justify-between my-2">

                    <button
                        className={!gameWon ? ` mx-2 flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded  ` : ` mx-2 flex-1 bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded`}
                        disabled={!gameWon} onClick={nextStep}>Siguiente
                    </button>
                </div>
            </div>
        </div>

    );
};


