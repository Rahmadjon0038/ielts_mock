'use client'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { CustomModal } from '../style';
import { useRegister } from '@/hooks/auth';
import { getNotify } from '@/hooks/notify';
import { useMediaQuery } from 'react-responsive';


export default function Register({ children }) {
    const isMobile = useMediaQuery({ maxWidth: 480 });
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? 280 : 400,
        bgcolor: 'background.paper',
        p: isMobile ? 1 : 2,
        outline: 'none',
        borderRadius: '8px'
    };

    const registerMuation = useRegister() // register mutation hook
    const notify = getNotify();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [registerData, setregisterData] = useState({
        username: "",
        password: "",
        email: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setregisterData({ ...registerData, [name]: value })
    }
    const handleSumbit = (e) => {
        e.preventDefault();
        if (registerData.password.length < 6) {
            notify('err', 'parol kamida 6 ta belgi bolishi kerak')
        }
        else {
            registerMuation.mutate(registerData)
        }
    }

    return (
        <div>
            <button onClick={handleOpen}>{children}</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <CustomModal>
                        <h2>Create an account</h2>
                        <p>Please register to access IELTS mock tests</p>

                        <form onSubmit={handleSumbit}>
                            <input onChange={handleChange} name='username' type="text" placeholder='username' required />
                            <input onChange={handleChange} name='password' type="password" placeholder='password' required />
                            <input onChange={handleChange} name='email' type="email" placeholder='email' required />
                            <button>Login</button>
                        </form>
                    </CustomModal>
                </Box>
            </Modal>
        </div>
    );
}
