import React, {useState, useEffect} from 'react';
import Confetti from 'react-confetti'
import IconVolumen from "@/pages/components/IconVolumen";
import verbs from "@/verbs.json";


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
    const [win, setWin] = useState({
        width: 0,
        height: 0,
    });
    const [verb, setVerb] = useState([{
        "verb": "Give up",
        "description": "To abandon something or give up on it"
    }]);
    const [rWord, setRWord] = useState(getRandomPosition(verb))
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

        const rWord = getRandomPosition(verb);

        setDescription(rWord.description ?? "");
        setWord(rWord.verb ?? "");
        setHints(generateHints(rWord.verb));

    }

    function handleVoice() {
        const text = new SpeechSynthesisUtterance(word)
        speechSynthesis.speak(text)
    }

    useEffect(() => {
        setVerb(verbs)
        setWin({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            {gameWon && <Confetti
                width={win.width}
                height={win.height}
                tweenDuration={100}
                className={"items-center justify-center"}
            />}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="mb-4 text-4xl text-white text-center font-bold">Verbs Phrasals</h1>
                {!gameWon && (<p className="mb-3 text-white">Hints: {hints.join(' ')}</p>
                )}
                {gameWon && (
                    <div className={"flex"}>
                        <strong className="mb-4 mr-4 text-white text-center  text-3xl font-bold">{word}</strong>
                        <IconVolumen onClick={handleVoice}/>
                    </div>

                )}
                <figcaption className="mb-3 text-white">{description}</figcaption>

                <input
                    disabled={gameWon}
                    className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text" value={guess} onChange={(e) => setGuess(e.target.value)}/>
                <div className="flex justify-between my-2">
                    <button
                        className={`  flex-1 font-bold text-white mr-1  py-2 px-4 rounded ${gameWon ? `  bg-gray-600 hover:bg-gray-500  ` : `bg-blue-500 hover:bg-blue-700   `} `}
                        disabled={gameWon} onClick={handleGuess}>try
                    </button>
                    <button
                        className={`  flex-1 font-bold text-white ml-1  py-2 px-4 rounded ${gameWon ? `  bg-gray-600 hover:bg-gray-500  ` : `bg-blue-500 hover:bg-blue-700   `} `}
                        disabled={gameWon} onClick={revealHint}>hint
                    </button>
                </div>
                <div className="flex justify-between my-2">

                    <button
                        className={`flex-1 text-white   py-2 px-4 rounded   font-bold   ${!gameWon ? `   bg-gray-500` : `   bg-green-700 hover:bg-green-500 `}`}
                        disabled={!gameWon} onClick={nextStep}>next
                    </button>
                </div>
            </div>
        </div>

    );
};


