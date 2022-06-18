import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { override } from "./override";
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
import { baseUrl } from "./baseUrl";
import ReactPaginate from "react-paginate";
import SearchTest from "./SearchTest";
import { errorsCatch } from "./errorsCatch";
import Select from "react-select";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const ResultList = () => {
    let [loading, setLoading] = useState(true);
    let [tableLoading, settableLoading] = useState(false);
    const [items, setItems] = useState("");
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState("");
    const [curentPage, setCurentPage] = useState("1");
    const [totalPage, setTotalPage] = useState("");
    const [searchDate, setSearchDate] = useState();
    const [searchDateValue, setSearchDateValue] = useState("");
    const [dateOptions, setDateOption] = useState()
    const params = useParams();
    const [id, setId] = useState(params.id);
   
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
    const overrideTableLoader = css`
    display: block;
    text-align: center;
    height: 600px;
  `;
    /**
     * use Effect hook sends a request to api and mapes the response arary and sets the results in state
     *
     */
    useEffect(() => {

        baseUrl
            .get(
                `api/send-user-answer-for-manager?user_id=${id}page=${curentPage}&search=${search}&date=${searchDateValue}`
            )
            .then((response) => {
                const data = response.data.data.data.data;
                setTotalPage(response.data.data.data.total);
                setLoading(false);
                settableLoading(false);
                const dates = response.data.data.date.map((item) => {
                    return { value: response.data.data.date.indexOf(item), label: item }
                })
                setDateOption([{ value: 10, label: 'هیچکدام' }])
                for (let i = 0; i < dates.length; i++) {
                    setDateOption((prevDateOption) => [...prevDateOption, dates[i]]);
                }

                const items = data.map((item) => {
                    const field = (x) => {
                        switch (x) {
                            case '1':
                                return 'تجربی'
                                break;
                            case '2':
                                return 'ریاضی'
                                break;
                            case '3':
                                return 'انسانی'
                                break;
                        }
                    }
                    const base = (x) => {
                        switch (x) {
                            case '1':
                                return 'دهم'
                                break;
                            case '2':
                                return 'یازدهم'
                                break;
                            case '3':
                                return 'دوازدهم'
                                break;
                            case '4':
                                return 'کنکوری'
                                break;

                        }
                    }
                    return (
                        <tr key={item.id}>
                            <td scope="row" className="header-table">{item.name}</td>
                            <td scope="row" className="header-table">{field(item.field)}</td>
                            <td scope="row" className="header-table">{base(item.base_id)}</td>
                            <td scope="row" className="header-table">{item.time}دقیقه</td>
                            <td scope="row" className="header-table">
                                <Link
                                    id={item.id}
                                    to={`/manager/result/${id}/${item.id}`}
                                    className="btn btn btn-outline-warning m-1 my-2 my-sm-0"
                                >
                                    مشاهده
                                </Link>





                            </td>
                        </tr>
                    );
                });
                setItems(items);

            })
            .catch((err) => {
                errorsCatch(err.response.data);
                setInterval(()=>{
                    window.location.pathname = '/manager'
                }, 2000)
            });
    }, [curentPage, searchItem, searchDateValue]);
    /**
     * this function handles the panination click
     *
     * @param {response from pagination click} data
     */
    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurentPage(selectedPage);
        settableLoading(true);
    };


 


    /**
      * handling the on change event on the type of the search selectbax
      *
      * @param {value of the select} searchType
      */
    const handeleDateChange = (searchDate) => {
        if (searchDate.value == 10) {
            setSearchDateValue('')
            setSearchDate(searchDate);
        } else {
            setSearchDate(searchDate);
            setSearchDateValue(searchDate.label);
        }

    };
    /**
     * handles the search form by sending a get request to api with query string that is the word that users wants to search
     *
     * @param {event obj} e
     */
    const handleSearch = (e) => {
        setSearchItem(search);
        e.preventDefault();
        baseUrl
            .get(
                `api/send-user-answer-for-manager?user_id=${id}page=${curentPage}&search=${search}&date=${searchDateValue}`
            )
            .then((response) => { })
            .catch((err) => {
                errorsCatch(err.response.data);
            });
    };




    /**
     * this is a conditional rendering function that is going to show or doesn't the loading icon
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
                    <div className="d-flex header-table">
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
                            <nav className="navbar rounded shadow navbar-light bg-light">
                                <form className="form-inline" onSubmit={handleSearch}>
                                    <SearchTest setSearch={setSearch} />

                                    <button
                                        className="btn btn-outline-success my-2 my-sm-0"
                                        type="submit"
                                    >
                                        جست و جو
                                    </button>


                                </form>
                                <Select
                                    options={dateOptions}
                                    placeholder="تاریخ"
                                    value={searchDate}
                                    onChange={handeleDateChange}
                                    name="date"
                                    className="basic-multi-select pt-3  text-right col-8"
                                    classNamePrefix="select"
                                />
                            </nav>

                            <div className="container m-auto">
                                <h2 className="text-center mt-3">آزمون ها</h2>
                                <table className="table  table-hover rounded shadow text-right ">
                                    <tbody>
                                        <tr>
                                            <th scope="row" className="header-table" > نام آزمون  </th>
                                            <th scope="row" className="header-table" > رشته   </th>
                                            <th scope="row" className="header-table" >  پایه  </th>
                                            <th scope="row" className="header-table" >  زمان  </th>
                                            <th scope="row" className="header-table"> کارنامه </th>
                                        </tr>
                                        {tableLoading ? (
                                            <tr scope="row">
                                                <td colspan="2">
                                                    <BeatLoader
                                                        color="gray"
                                                        loading={tableLoading}
                                                        size={10}
                                                        css={overrideTableLoader}
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            items
                                        )}
                                    </tbody>
                                </table>
                                <ReactPaginate
                                    nextLabel="بعدی >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={Math.ceil(totalPage / 20)}
                                    previousLabel="< قبلی"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination justify-content-center mt-3"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    };

    return <>{useLoading()}</>;
}

export default ResultList