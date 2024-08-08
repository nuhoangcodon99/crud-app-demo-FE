import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import { putEditUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalEditUser = (props) => {
    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleEditUser = async () => {
        let res = await putEditUser(firstName, lastName);
        if(res) {
            handleEditUserFromModal({
                first_name: firstName,
                last_name: lastName,
                id: dataUserEdit.id
            })
            handleClose();
            toast.success("Update user succeeded !!!")
        } else {
            toast.error("Failed !!!")
            handleClose();
        }
    }
    
    useEffect(() => {
        if(show) {
            setFirstName(dataUserEdit.first_name)
            setLastName(dataUserEdit.last_name)
        }
    }, [dataUserEdit])
    return (
        <div>
            <Modal 
            show={show} 
            onHide={handleClose}
            backdrop={"static"}
            keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body__add-new">
                        <div>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputName1">First Name</label>
                                    <input type="name1" className="form-control" id="exampleInputName1" aria-describedby="nameHelp" placeholder="Enter name1"
                                        value={firstName} onChange={(event) => setFirstName(event.target.value)} />

                                </div>
                                <div className="form-group py-4">
                                    <label htmlFor="exampleInputJob1">Last Name</label>
                                    <input type="name2" className="form-control" id="exampleInputName2" placeholder="name2"
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
                    <Button variant="primary" onClick={() => handleEditUser()} className="bg-blue-800">
                        Save Changes 
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default ModalEditUser


