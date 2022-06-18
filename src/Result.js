import React, { useEffect, useState } from "react";
import { baseUrl } from "./baseUrl";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";

import { useParams } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { override } from "./override";
const Result = () => {
  let [loading, setLoading] = useState(true);
  const params = useParams();
  const [id, setId] = useState(params.id);
  const [quizzesId, setQuizzesId] = useState(params.quizzes_id);
  const [items, setItems] = useState()
  const [time, setTime] = useState()
  const [user, setUser] = useState()
  const [quizzesName, setQuizzesName] = useState()
  const [school, setSchool] = useState()
  const [schoolManager, setSchoolManager] = useState()
  const [phone, setPhone] = useState()
  const [parent, setParent] = useState()
  const [modalData, setModalData] = useState()
  let [modalLoading, setModalLoading] = useState(true);
  const [modalTittel, setModalTittle] = useState()

  /**
     * controling the collapse and toggle in sidebar
     */
  const [collapse, setCollapse] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  /**
    * css code for loading code inside table
    *
    */
  const overrideModalLoader = css`
    display: block;
    text-align: center;
    
  `;


  useEffect(() => {
    baseUrl.get(`api/get-single-answer-for-manager?user_id=${id}&quizzes_id=${quizzesId}`)
      .then((response) => {
        setQuizzesName(response.data.quizze_name)
        setTime(response.data.time)
        setUser(response.data.user)
        setSchool(response.data.school_name)
        setSchoolManager(response.data.school_manager)
        setPhone(response.data.phone)
        setParent(response.data.parent)
        const testResult = response.data.data
        const resultsItem = testResult.map((result) => {
          const correct = Math.round((result.true_answer * 100) / result.question)
          const noAnswer = Math.round((result.no_answer * 100) / result.question)
          const wrong = Math.round((result.false_answer * 100) / result.question)
          return (
            <div key={result.id} className="card d-flex wrapper rounded shadow bg-light flex-row card-body">

              <div className="w-50 text-right">
                سوالات {result.name} : <span id="totalQ">{result.question}</span> <br />
                پاسخ صحیح : <span id="correctQ">{result.true_answer}</span><br />
                پاسخ غلط : <span id="wrongQ">{result.false_answer}</span><br />
                بدون پاسخ : <span id="noAnswerQ">{result.no_answer}</span><br />
                درصد کل : <span id="totalPercentage">{result.result}</span><br />

                <button type="button" className="btn btn-primary" id={result.id} onClick={handleClickModal} data-toggle="modal" data-target='#myModal'>
                  تحلیل
                </button>
                <div className="modal fade" id='myModal' tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">{modalTittel}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true" className="myclose" >&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        {modalLoading ? <BeatLoader color="gray" loading={modalLoading} size={15} css={overrideModalLoader} /> : modalData}

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-50 justify-content-end d-flex">
                <div className="w-25">
                  <h6 className="progresTittle">درصد کل</h6>
                  <div className="ml-4 progress progress-bar-vertical">
                    <div
                      style={{ height: result.result }}
                      className="progress-bar progress-bar-info progress-bar-striped"
                      id="tatalBar"
                      role="progressbar"
                      aria-valuenow=''
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {result.result}
                    </div>
                  </div>
                </div>

                <div className="w-25">
                  <h6 className="progresTittle">پاسخ صحیح</h6>
                  <div className="ml-4 progress progress-bar-vertical">
                    <div
                      style={{ height: correct }}
                      className="progress-bar bg-success progress-bar-striped"
                      id="correctBar"
                      role="progressbar"
                      aria-valuenow=""
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {correct}
                    </div>
                  </div>
                </div>

                <div className="w-25">
                  <h6 className="progresTittle">پاسخ غلط</h6>
                  <div className="ml-4 progress progress-bar-vertical">
                    <div
                      style={{ height: wrong }}
                      className="progress-bar bg-danger progress-bar-striped"
                      id="wrongBar"
                      role="progressbar"
                      aria-valuenow=""
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {wrong}
                    </div>
                  </div>
                </div>

                <div className="w-25">
                  <h6 className="progresTittle">بدون پاسخ</h6>
                  <div className="ml-4 progress progress-bar-vertical">
                    <div
                      style={{ height: noAnswer }}
                      className="progress-bar bg-warning progress-bar-striped"
                      id="noAnswerBar"
                      role="progressbar"
                      aria-valuenow=""
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {noAnswer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
        setItems(resultsItem)
        setLoading(false)
      }).catch((err) => {
        console.log(err.response);
      })

  }, [modalData])


  const handleClickModal = (e) => {
   
    var bookId = e.target.id
    baseUrl.post(`api/analysis-answer-user?book_id=${bookId}&quizzes_id=${quizzesId}&user_id=${id}`)
      .then((response) => {
        setModalLoading(false)
        setModalTittle(response.data.data.name)
        const analysis = response.data.data.analysis.map((subject) => {
          return (
            <div key={subject.id} className="d-flex justify-content-between p-2">
              <div>مبحث: <span>{subject.name}</span></div>
              <div>{subject.percent}%</div>
            </div>
          )
        })
        setModalData(analysis)
      }).catch((err) => {
        console.log(err);
      })
  }

  /**
   * conditional rendering either loading icon or the page 
   *  
   * @returns block of jsx
   */

  const useLoading = () => {
    if (loading) {
      return (
        <BeatLoader color="gray" loading={loading} size={35} css={override} />
      );
    } else {
      return (<>
        <div className="d-flex header-table" onClick={()=>{ setModalData() ;setModalTittle(); setModalLoading(true)}}>
          <Sidebar
            handleToggleSidebar={handleToggleSidebar}
            collapse={collapse}
            setCollapse={setCollapse}
            toggled={toggled}
            setToggled={setToggled}
          />
          <div className="w-100 p-2">
            <Navbar
              collapse={collapse}
              setCollapse={setCollapse}
              toggled={toggled}
              setToggled={setToggled}
            />
            <div className="w-100 rounded shadow" >
              <div className="row">
                <div className="col">
                  <div className="card-headertext-right d-flex flex-wrap justify-content-between">
                    <div className="text-right" >
                      نام آزمون : {quizzesName}<br />
                      نام شرکت کننده : {user}<br />
                      شماره همراه : {phone}<br />
                      مدت زمان : {time} دقیقه

                    </div>
                    <div className="text-right" >
                      شماره والدین : {parent}<br />
                      مدرسه : {school}<br />
                      نام مدیر : {schoolManager}
                    </div>

                  </div>
                  <button className="btn btn-info btn-block" onClick={() => window.print()}>پرینت</button>
                  {items}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      )
    }
  }








  return useLoading()
}

export default Result