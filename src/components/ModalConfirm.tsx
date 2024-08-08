import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalConfirm = (props) => {
    const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } = props;

    const confirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        if(res && res.statusCode === 204) {
            toast.success("Delete user success");
            handleClose();
            handleDeleteUserFromModal(dataUserDelete)
        } else {
            toast.error("Error in delete user")
            handleClose();
        }
        console.log("Check res: ", res)
    }

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop={"static"}
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body__add-new">
                        <h3>Are you sure to delete this user ?, this action can't be undone !</h3>
                        <h3><b>Email = {dataUserDelete.email}</b></h3>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className="bg-gray-400">
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => confirmDelete()} className="bg-blue-800">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}

export default ModalConfirm


