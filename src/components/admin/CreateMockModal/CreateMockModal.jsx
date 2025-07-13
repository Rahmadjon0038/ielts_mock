'use client'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { AddBtn, Form, Label, Button,Input } from './style'
import { FaPlus } from "react-icons/fa";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    outline: 'none',
    borderRadius: '8px'
};
function CreateMockModal({ addMock }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [date, setDate] = useState();
    
    const handleSumbit = (e) => {
        e.preventDefault();
        addMock(date)
        handleClose()
    }

    return (
        <div>
            <AddBtn onClick={handleOpen}>New mock</AddBtn>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Form onSubmit={handleSumbit}>
                        <Label>🗓 Sana tanlang:</Label>
                        <Input
                            required
                            type="date"
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <Button type="submit"><FaPlus /> Mock yaratish</Button>
                    </Form>
                </Box>
            </Modal>
        </div>
    )
}

export default CreateMockModal