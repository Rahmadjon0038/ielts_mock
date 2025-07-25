'use client'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { AddBtn, CustomModal } from './style'
import { FaRegTrashAlt } from "react-icons/fa";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 2,
    outline: 'none',
    borderRadius: '8px'
};
function DeleteMock({ info, id, handledelete }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <AddBtn onClick={handleOpen}>Delete <FaRegTrashAlt /></AddBtn>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <CustomModal>
                        <p style={{ margin: '10px 0', fontSize: '18px' }}> {id} {info}</p>
                        <AddBtn modalBtn={'modal'} onClick={() => handledelete(id)}>Delete <FaRegTrashAlt size={14} /></AddBtn>
                    </CustomModal>
                </Box>
            </Modal>
        </div>
    )
}

export default DeleteMock