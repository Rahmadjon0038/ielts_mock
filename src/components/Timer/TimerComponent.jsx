'use client'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CustomModal } from './style';

export default function TimerModal({ show, handleSubmit }) {
    const isMobile = useMediaQuery({ maxWidth: 480 });
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95%' : '400px',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: isMobile ? 2 : 4,
        outline: 'none',
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (show) setOpen(true);
    }, [show]);

    return (
        <Modal
            open={open}
            // foydalanuvchi esc bosib yoki fonni bosib chiqib ketmasligi uchun
            onClose={() => {}}
            disableEscapeKeyDown
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <CustomModal>
                    <h2>⏰ Vaqt tugadi!</h2>
                    <p>Endi javoblaringizni yuboring.</p>
                    <button onClick={handleSubmit}>Yuborish</button>
                </CustomModal>
            </Box>
        </Modal>
    );
}
