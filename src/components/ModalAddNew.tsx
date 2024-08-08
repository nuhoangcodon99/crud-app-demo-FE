import { useState } from "react";
import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import { postCreateUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
    const { show, handleClose, handleUpdateTable } = props;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
    const handleSaveUser = async () => {
        let res = await postCreateUser(firstName, lastName);
        if (res && res.id) {
            handleClose();
            setFirstName('');
            setLastName('');
            toast.success("A user has been created successed");
            handleUpdateTable({ id: res.id, first_name: firstName, last_name: lastName, email: `${firstName}.${lastName}@reqres.in` })
        } else {
            toast.error("An error has been occured");
        }
    }

    return (
        <div>
            <Modal 
            show={show} 
            onHide={handleClose}
            backdrop={"static"}
            keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body__add-new">
                        <div>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputName1">Name</label>
                                    <input type="name" className="form-control" id="exampleInputName1" aria-describedby="nameHelp" placeholder="Enter name"
                                        value={firstName} onChange={(event) => setFirstName(event.target.value)} />

                                </div>
                                <div className="form-group py-4">
                                    <label htmlFor="exampleInputJob1">Job</label>
                                    <input type="job" className="form-control" id="exampleInputJob1" placeholder="Job"
                                        value={lastName} onChange={(event) => setLastName(event.target.value)} />
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className="bg-gray-400">
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSaveUser()} className="bg-blue-800">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default ModalAddNew


