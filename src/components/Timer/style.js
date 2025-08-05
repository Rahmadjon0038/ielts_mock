import styled from "styled-components";

export const CustomModal = styled.div`
    text-align: center;
    color: #1E293B;

    h2 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    p {
        font-size: 16px;
        margin-bottom: 20px;
    }

    button {
        width: 100%;
        padding: 12px;
        border-radius: 6px;
        border: none;
        background-color: #B61304;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #900d02;
        }
    }
`;
