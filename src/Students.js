import React, { useState, useEffect } from "react";
import { override } from "./override";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { baseUrl } from "./baseUrl";
import ReactPaginate from "react-paginate";
import SearchInput from "./SearchInput";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import  './styles.scss';

const Subjects = () => {
  let [loading, setLoading] = useState(false);
  let [tableLoading, settableLoading] = useState(false);
  const [items, setItems] = useState("");
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [curentPage, setCurentPage] = useState("1");
  const [totalPage, setTotalPage] = useState("");


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
        `api/send-users-for-manager-school?page=${curentPage}&search=${search}`
      )
      .then((response) => {
        const data = response.data.data.data.data;
        setTotalPage(response.data.data.data.total);
        setLoading(false);
        settableLoading(false);
        const items = data.map((item , index) => {
          const field = (x) => {
            switch (x) {
              case 1:
                return 'تجربی'
                break;
              case 2:
                return 'ریاضی'
                break;
              case 3:
                return 'انسانی'
                break;
            }
          }
          const base = (x) => {
            switch (x) {
              case 1:
                return 'دهم'
                break;
              case 2:
                return 'یازدهم'
                break;
              case 3:
                return 'دوازدهم'
                break;
              case 4:
                return 'کنکوری'
                break;
             
            }
          }
          return (
            <tr key={item.id}>
              <td className="header-table">{index+1}</td>
              <td className="header-table">{item.name}</td>
              <td className="header-table">{item.phone}</td>
              <td className="header-table">{item.father}</td>
              <td className="header-table">{field(item.field)}</td>
              <td className="header-table">{base(item.base)}</td>
              
              <td className="header-table">
              <Link
                  id={item.id}
                  to={`/manager/results/${item.id}`}
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
        if(err.response.status == 401){
          window.location.href='/login'
        }
        if(err.response.status == 403){
          window.location.href='/login'
        }
      });
  }, [curentPage, searchItem]);
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
   * handles the search form by sending a get request to api with query string that is the word that users wants to search
   *
   * @param {event obj} e
   */
  const handleSearch = (e) => {
    setSearchItem(search);
    e.preventDefault();
    baseUrl
      .get(
        `/api/send-users-for-manager-school?page=${curentPage}&search=${search}`
      )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
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
                  <SearchInput setSearch={setSearch} />

                  <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    جست و جو
                  </button>

                </form>
                
              </nav>

              <div className="container m-auto">
                <h2 className="text-center mt-3">دانش پذیران</h2>
                <table className="table  table-hover rounded shadow text-right ">
                  <tbody>
                    <tr>
                    <th scope="row" className="header-table"> ردیف  </th>
                      <th scope="row" className="header-table" > نام و نام خانوادگی  </th>
                      <th scope="row" className="header-table"> شماره همراه </th>
                      <th scope="row" className="header-table"> شماره والدین </th>
                      <th scope="row" className="header-table"> رشته تحصیلی </th>
                      <th scope="row" className="header-table"> پایه تحصیلی </th>
                      
                      <th scope="row"  className="header-table"> کارنامه ها </th>
                    </tr>
                    {tableLoading ? (
                      <tr >
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
};
export default Subjects;
