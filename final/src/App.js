import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {

	const QUESTION_API = 'https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple';
	const [questions, setquestions] = useState([]);
    const [isBusy, setBusy] = useState(true);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);

	const handleAnswerOptionClick = (isCorrect) => {
		if (isCorrect) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};

    const decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

	const transformRawQuestions = (rawQuestions) => {
	    let transformedQuestions = [];
        rawQuestions.results.forEach(function(item, index) {
            console.log("Parsing...", item, index);
            let question = {}
            question.category = item.category;
            question.questionText = decodeHtml(item.question);
            question.answerOptions = [];
            item.incorrect_answers.forEach(function(inner_item, inner_index) {
                question.answerOptions.push(
                    {
                        'answerText': decodeHtml(inner_item),
                        'isCorrect': false,
                    }
                )
            });
            question.answerOptions.push(
                {
                    'answerText': decodeHtml(item.correct_answer),
                    'isCorrect': true,
                }
            );
            question.answerOptions = question.answerOptions.sort(() => Math.random() - 0.5)
            transformedQuestions.push(question);
        });
        return transformedQuestions;
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                QUESTION_API
            );
            setquestions(transformRawQuestions(result.data));
            setBusy(false);
        };
        fetchData();
    }, []);

    return (
        <div className='app'>
            {showScore ? (
                <div className='score-section'>
                    You scored {score} out of {questions.length}
                </div>
            ) : ( !isBusy ? (
                    <>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {currentQuestion + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>{questions[currentQuestion].questionText}</div>
                        </div>
                        <div className='answer-section'>
                            {questions[currentQuestion].answerOptions.map((answerOption) => (
                                <button onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div>Loading</div>
                )

            )}
        </div>
    );
}
