'use client'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { CustomModal } from '../style';
import { uselogin } from '@/hooks/auth';
import { useAuth } from '@/context/userData';
import { useRouter } from 'next/navigation';
import { usegetUser } from '@/hooks/user';
import { useMediaQuery } from 'react-responsive';

export default function Login({ children }) {
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

    const { user, setUser } = useAuth();
    const { refetch } = usegetUser();
    const loginMuation = uselogin();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const router = useRouter();
    const [logindata, setLoginData] = useState({
        username: "",
        password: ""
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...logindata, [name]: value })
    }
    const handleSumbit = (e) => {
        e.preventDefault();
        loginMuation.mutate(logindata, {
            onSuccess: (data) => {
                refetch()
            }
        })
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
                        <h2>Welcome back</h2>
                        <p>please login to your account</p>
                        <form onSubmit={handleSumbit}>
                            <input onChange={handleChange} name='username' type="text" placeholder='username' required />
                            <input onChange={handleChange} name='password' type="password" placeholder='password' required />
                            <button>Login</button>
                        </form>
                    </CustomModal>
                </Box>
            </Modal>
        </div>
    );
}
