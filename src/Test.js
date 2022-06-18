import React, { Fragment, useEffect, useState } from 'react'
//libs
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//my components
import './test.scss'
import { baseUrl } from './baseUrl';
import { override } from "./override";
import Progress from './Progress';
import CountdownTimer from './CountdownTimer';

const Test = () => {
    const [loading, setLoading] = useState(true);
    const [progressWidth, setProgressWidth] = useState()
    const [userName, setUserName] = useState()
    const [quizzeName, setQuizzeName] = useState()
    const [quizzeId, setQuizzeId] = useState()
    const [answerBookTable, setAnswerBookTable] = useState()
    const [questions, setQuestions] = useState()
    const [selectAnswer, setSelectAnswer] = useState(true)
    const [ansLoading, setAnsLoading] = useState(false)
    const [time, setTime] = useState()
    /**
     * css for loading icon after selecting a button for answer
     *  
     */
    const ansOverride = css`
    display: block;
    margin:auto;
    margin-top: 350px;
    padding-left: 48%;
    @media (max-width: 520px) {
        padding-left: 45%;
    }
`

    useEffect(() => {
        baseUrl.get('api/get-single-quizze')
            .then((response) => {
                if (response.data.result == 1) {
                    setTimeout(() => {
                        const MySwal = withReactContent(Swal);
                        return (
                            MySwal.fire({
                                title: 'هشدار!',
                                text: 'زمان آزمون به اتمام رسیده است',
                                confirmButtonText: 'باشه',
                                icon: "warning"
                            }).then(() => {
                                window.setTimeout(() => {
                                    window.location.href = "https://app.farostaha.net/user/dash";
                                }, 2000);

                            })
                        )
                    }, response.data.time * 1000);

                    setTime(response.data.timer)
                    setUserName(response.data.user_name)
                    setQuizzeName(response.data.quizze.name)
                    setQuizzeId(response.data.quizze.id)
                    /**
                     * calculating the progressBar width
                     *  
                     */
                    const timerFuncrion = () => {
                        let msQTime = response.data.quizze.time * 60 * 1000
                        let msQTimer = response.data.time * 1000
                        let progressTime = 100 - ((msQTimer * 100) / msQTime)
                        setProgressWidth(progressTime)
                    }
                    timerFuncrion()
                    /**
                     * changes the color of the selected button and the answer table
                     *  
                     * @param {number} id 
                     * @returns number
                     */
                    const colorChanger = (id) => {
                        const answeredQuestions = response.data.btn_questions
                        const arrayAnsweredQuestions = Object.entries(answeredQuestions)
                        for (const [key, value] of arrayAnsweredQuestions) {
                            if (key == id) {
                                return value
                            }
                        }
                    }

                    let lessons = response.data.data.map((lesson) => {
                        return (
                            <React.Fragment key={lesson.id}>
                                <div className='w-100 bg-warning text-white text-center p-2 mt-2 rounded shadow'>{lesson.name}</div>
                                <div>
                                    {lesson.get_questions.map((question) => {
                                        return (
                                            <div className='answer' key={question.id} id={question.id} >
                                                <div className='custom-shape' >
                                                    <div className='inercustom' >
                                                        {question.i}
                                                    </div>
                                                </div>
                                                <div className='my-image-container' >
                                                    <img src={`https://app.farostaha.net/${question.question}`} className='my-image' />
                                                </div>
                                                <div className='d-flex justify-content-around options' >
                                                    <button className={`testoption ${colorChanger(question.id) == 1 ? 'bg-warning' : null}`} value={'option_a'} id={question.id} onClick={handleOptionSelect}>1</button>
                                                    <button className={`testoption ${colorChanger(question.id) == 2 ? 'bg-warning' : null}`} value={'option_b'} id={question.id} onClick={handleOptionSelect}>2</button>
                                                    <button className={`testoption ${colorChanger(question.id) == 3 ? 'bg-warning' : null}`} value={'option_c'} id={question.id} onClick={handleOptionSelect}>3</button>
                                                    <button className={`testoption ${colorChanger(question.id) == 4 ? 'bg-warning' : null}`} value={'option_d'} id={question.id} onClick={handleOptionSelect}>4</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </React.Fragment>
                        )
                    })
                    setQuestions(lessons)
                    /**
                     * chunking the question arrays to 5 index arrays
                     *  
                     */
                    let answerArray = response.data.questions
                    const arrayOFchunkedArrrays = []
                    var i, j, temporary, chunk = 5;
                    for (i = 0, j = answerArray.length; i < j; i += chunk) {
                        temporary = answerArray.slice(i, i + chunk);
                        arrayOFchunkedArrrays.push(temporary)
                    }

                    const answerBook = arrayOFchunkedArrrays.map((temp) => {
                        return (
                            <React.Fragment key={temp.id}>
                                <table className="my-table">
                                    <thead className='table-head'>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">1</th>
                                            <th scope="col">2</th>
                                            <th scope="col">3</th>
                                            <th scope="col">4</th>
                                        </tr>
                                    </thead>
                                    <tbody className='table-body'>
                                        <tr>
                                            <th scope="row">  <a href={`#${temp[0].id}`} >{temp[0].i} </a></th>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[0].id) == 1 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[0].id) == 2 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[0].id) == 3 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[0].id) == 4 ? 'bg-success' : null}`}></div></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">  <a href={`#${temp[1].id}`} >{temp[1].i} </a></th>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[1].id) == 1 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[1].id) == 2 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[1].id) == 3 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[1].id) == 4 ? 'bg-success' : null}`}></div></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">  <a href={`#${temp[2].id}`} >{temp[2].i} </a></th>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[2].id) == 1 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[2].id) == 2 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[2].id) == 3 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[2].id) == 4 ? 'bg-success' : null}`}></div></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">  <a href={`#${temp[3].id}`} >{temp[3].i} </a></th>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[3].id) == 1 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[3].id) == 2 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[3].id) == 3 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[3].id) == 4 ? 'bg-success' : null}`}></div></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">  <a href={`#${temp[4].id}`} >{temp[4].i} </a></th>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[4].id) == 1 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[4].id) == 2 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[4].id) == 3 ? 'bg-success' : null}`}></div></td>
                                            <td><div className={`myAnswerSelect ${colorChanger(temp[4].id) == 4 ? 'bg-success' : null}`}></div></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </React.Fragment>
                        )
                    })

                    setAnswerBookTable(answerBook)
                    setLoading(false)

                } else {
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        title: 'هشدار!',
                        text: response.data.message,
                        confirmButtonText: 'باشه',
                        icon: "warning"
                    }).then(() => {
                        window.setTimeout(() => {
                            window.location.href = "https://app.farostaha.net/user/dash";
                        }, 2000);
                    })
                }
            }).catch((err) => {
                if (err.response.status == 401) {
                    window.location.href = "https://app.farostaha.net/login";
                }
            })
    }, [selectAnswer, quizzeId])



    /**
 * this function andles the changing the color of the selected button on click
 *  
 * @param {event obj} e 
 */
    const handleOptionSelect = (e) => {
        setAnsLoading(true)
        if (e.target.classList.contains('bg-warning')) {
            e.target.parentNode.childNodes[0].classList.remove('bg-warning')
            e.target.parentNode.childNodes[1].classList.remove('bg-warning')
            e.target.parentNode.childNodes[2].classList.remove('bg-warning')
            e.target.parentNode.childNodes[3].classList.remove('bg-warning')
        } else {
            e.target.parentNode.childNodes[0].classList.remove('bg-warning')
            e.target.parentNode.childNodes[1].classList.remove('bg-warning')
            e.target.parentNode.childNodes[2].classList.remove('bg-warning')
            e.target.parentNode.childNodes[3].classList.remove('bg-warning')
            e.target.classList.add('bg-warning');
        }


        let answerNum
        switch (e.target.value) {
            case 'option_a':
                answerNum = 1
                break;
            case 'option_b':
                answerNum = 2
                break;
            case 'option_c':
                answerNum = 3
                break;
            case 'option_d':
                answerNum = 4
                break;
            default:
                break;
        }

        baseUrl.post('api/get-single-quizze', { quizze_id: quizzeId, question: e.target.id, answer: e.target.value, answer_num: answerNum })
            .then((response) => {
                if (response.data.result == 1) {
                    setAnsLoading(false)
                    setSelectAnswer(!selectAnswer)
                } else {
                    const MySwal = withReactContent(Swal);
                    MySwal.fire({
                        title: 'هشدار!',
                        text: response.data.message,
                        confirmButtonText: 'باشه',
                        icon: "warning"
                    }).then(() => {
                        setAnsLoading(false)
                        window.setTimeout(() => {
                            window.location.href = "https://app.farostaha.net/user/dash";
                        }, 2000);
                    })
                }

            }).catch((err) => {
                console.log(err);
            })
    }
    /**
     * handling when end button clicks
     *  
     */
    const handleEnd = () => {
        const MySwal = withReactContent(Swal);
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: "آیا مطمئن هستید؟",
                icon: "warning",
                text: 'با زدن بله مطمئن هستم آزمون پایان می یابد',
                showCancelButton: true,
                confirmButtonText: "بله، مطمئن هستید",
                cancelButtonText: "بی خیال",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    baseUrl
                        .post('api/finish-quizze', { quize_id: quizzeId })
                        .then((response) => {
                            MySwal.fire({
                                confirmButtonText: 'آزمون با موفقیت پایان یافت',
                                title: "پایان آزمون",
                                icon: "success",
                            }).then((response) => {
                                window.setTimeout(() => {
                                    window.location.href = "https://app.farostaha.net/user/dash";
                                }, 2000);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
    }

    /**
     * showing loading icon or the jsx
     *  
     * @returns block of jsx
     */
    const useLoading = () => {
        if (loading) {
            return (
                <BeatLoader color="gray" loading={loading} size={35} css={override} />
            );
        } else {
            return (
                <>
                    <div className={ansLoading ? 'overlay' : null} >{ansLoading ? <BeatLoader color='black' loading={ansLoading} css={ansOverride} size={20} /> : null}</div>
                    <div className='container'>
                        <div className='bg-success d-flex justify-content-around text-white p-2 info' >
                            <div className='' >{quizzeName}</div>
                            <div className=''>نام دانشجو: {userName}</div>
                        </div>
                        <div className='bg-success d-flex justify-content-around' >
                            <div className='timer' >
                                <CountdownTimer countdownTimestampMs={time * 1000} />
                            </div>
                            <Progress width={progressWidth} />
                        </div>
                        <button onClick={handleEnd} className='btn btn-block text-white  btn-warning' >جهت پایان آزمون کلیک کنید</button>
                        <div className={`d-flex flex-wrap tabels rounded shadow ${ansLoading ? null : 'sticky-top'}`} >
                            {answerBookTable}
                        </div>
                        {questions}
                    </div>
                </>
            )
        }
    }


    return <>{useLoading()}</>;
}

export default Test