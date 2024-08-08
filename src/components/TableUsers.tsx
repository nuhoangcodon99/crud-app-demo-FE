import { SetStateAction, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from './ModalConfirm';
import _, { debounce, result } from "lodash";
import { CSVLink } from "react-csv";
import Papa from "papaparse"
import { toast } from 'react-toastify';
import './TableUsersDesign.scss'

const TableUsers = (props) => {
    const [listUsers, setListUsers] = useState([]);
    //const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    //Create
    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
    //Update
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});
    //Delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({})
    //Sorting
    // const [sortBy, setSortBy] = useState("asc");
    // const [sortField, setSortField] = useState("id");
    //Searching
    const [keyword, setKeyword] = useState("");
    const [dataExport, setDataExport] = useState([]);

    const handleClose = () => {
        setIsShowModalAddNew(false);
        setIsShowModalEdit(false);
        setIsShowModalDelete(false);
    }

    //Handle Features
    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUsers]);
    }

    const handleEditUserFromModal = (user) => {
        let index = listUsers.findIndex(item => item.id === user.id);
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers[index].first_name = user.first_name;
        cloneListUsers[index].last_name = user.last_name;
        setListUsers(cloneListUsers)
    }

    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id)
        setListUsers(cloneListUsers)
    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1);
    }

    const handleEditUser = (user) => {
        setDataUserEdit(user);
        setIsShowModalEdit(true)
    }

    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true);
        setDataUserDelete(user)
    }

    const handleSort = (sortBy, sortField) => {
        // setSortBy(sortBy);
        // setSortField(sortField);

        let cloneListUsers = _.cloneDeep(listUsers);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy])

        setListUsers(cloneListUsers)
    }

    const handleSearch = () => {
        if (keyword) {
            let cloneListUsers = _.cloneDeep(listUsers);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(keyword))
            setListUsers(cloneListUsers)
        } else {
            getUsers(1)
        }
    }

    const handleSearchUsingDebounce = debounce((event) => {
        let word = event.target.value
        if (word) {
            let cloneListUsers = _.cloneDeep(listUsers);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(word))
            setListUsers(cloneListUsers)
        } else {
            getUsers(1)
        }
    }, 2000)

    const handleInput = (event) => {
        setKeyword(event.target.value);
    }

    useEffect(() => {
        //call apis
        //dry
        getUsers(1);
    }, [])

    //import data to listUsers
    const getUsers = async (page: unknown) => {
        const res = await fetchAllUser(page);
        if (res && res.data) {
            setListUsers(res.data);
            //setTotalUsers(res.total);
            setTotalPages(res.total_pages)
        }
    }

    const getUsersExport = (event, done) => {
        let result = [];
        if (listUsers && listUsers.length > 0) {
            result.push(["ID", "First Name", "Last Name", "Email"]);
            listUsers.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.first_name
                arr[2] = item.last_name
                arr[3] = item.email
                result.push(arr);
            })
            setDataExport(result);
            done();
        }
    }

    const handleImport = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            if (file.type !== "text/csv") {
                toast.error("Just accept CSV files")
                return;
            } else {
                toast.success("File upload success")
            }

            Papa.parse(file, {
                //header: true,
                complete: function (results) {
                    let rawCSV = results.data
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 4) {
                            if (rawCSV[0][0] !== "ID"
                                || rawCSV[0][1] !== "FirstName"
                                || rawCSV[0][2] !== "LastName"
                                || rawCSV[0][3] !== "Email") {
                                toast.error("Wrong format CSV file !");
                            } else {
                                console.log(rawCSV)
                                let result = [];
                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 4) {
                                        let obj = {};
                                        obj.id = item[0];
                                        obj.first_name = item[1];
                                        obj.last_name = item[2];
                                        obj.email = item[3];
                                        result.push(obj)
                                    }
                                })
                                setListUsers(result);
                                console.log("Check result: ", result);
                            }
                        } else {
                            toast.error("Wrong format CSV file !");
                        }
                    } else {
                        toast.error("Data not found on CSV file")
                    }
                }
            });
        }
    }

    return (
        <div>
            <div className='app__user'>
                <h2 className='app__user-list'><b>List users:</b></h2>

                <div className='group-btns'>
                    <div>
                        <label className='btn btn-warning' htmlFor="test"><i className="fa-solid fa-upload"></i> Import</label>
                        <input hidden id='test' type="file" onChange={event => handleImport(event)} />
                    </div>

                    <CSVLink
                        filename='user.csv'
                        data={dataExport}
                        asyncOnClick={true}
                        onClick={(event, done) => getUsersExport(event, done)}
                        className='btn btn-primary'>
                        <i className="fa-solid fa-download"></i> Export
                    </CSVLink>

                    <button
                        onClick={() => setIsShowModalAddNew(true)}
                        type='button'
                        className='app__user-add_new btn btn-primary'>
                        Add new user
                    </button>
                </div>
            </div>
            {/* Using debounce library */}
            <div className='col-4 my-3'>
                <input
                    type="text"
                    placeholder='Search user by email'
                    className='form-control'
                    onChange={(event) => handleSearchUsingDebounce(event)}
                />
            </div>
            {/* 
                Using button to confirm
                <div className='flex'>
                <div className='col-4 my-3'>
                    <input
                        type="text"
                        placeholder='Search user by email'
                        className='form-control'
                        onChange={(event) => handleInput(event)}
                    />
                </div>

                <input className='btn bg-cyan-400 w-1/6 h-10 my-3 mx-4' onClick={() => handleSearch()} value="Confirm" />

            </div> */}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td>
                            <div className='sort-header'>
                                <span>ID</span>
                                <div>
                                    <span><i className="fa-solid fa-arrow-up" onClick={() => handleSort("asc", "id")}></i></span>
                                    <span><i className="fa-solid fa-arrow-down" onClick={() => handleSort("desc", "id")}></i></span>
                                </div>
                            </div>
                        </td>
                        {/* <td>
                            <div className='sort-header'>
                                <span>Avatar</span>
                            </div>
                        </td> */}
                        <td>
                            <div className='sort-header'>
                                <span>First Name</span>
                            </div>
                        </td>
                        <td>
                            <div className='sort-header'>
                                <span>Last Name</span>
                            </div>
                        </td>
                        <td>
                            <div className='sort-header'>
                                <span>Email</span>
                            </div>
                        </td>
                        <td>
                            <div className='sort-header'>
                                <span>Actions</span>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 &&
                        listUsers.map((item, index) => {
                            return (
                                <tr key={`user-${index}`}>
                                    <td>{item.id}</td>
                                    {/* <td><img src={item.avatar} alt="" /></td> */}
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <button className='btn btn-warning mr-3'
                                            onClick={() => handleEditUser(item)}>Edit</button>
                                        <button className='btn btn-danger'
                                            onClick={() => handleDeleteUser(item)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                pageClassName="page-item"
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
            />
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />
            <ModalEditUser
                show={isShowModalEdit}
                dataUserEdit={dataUserEdit}
                handleClose={handleClose}
                handleEditUserFromModal={handleEditUserFromModal}
            />
            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFromModal={handleDeleteUserFromModal}
            />
        </div>
    )
}

export default TableUsers