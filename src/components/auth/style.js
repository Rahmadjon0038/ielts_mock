import styled from "styled-components";

export const CustomModal = styled.div`
    text-align: center;
    color: #1E293B;
    padding: 24px 10px;
    p{
        margin-top: 6px;
    }
    form{
        margin-top: 16px;
    }
    input{
        width: 100%;
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 4px;
        border: none;
        border: 1px solid #1E293B;
    }
    button{
        width: 100%;
        padding: 12px;
        border-radius: 4px;
        border: none;
        background-color: #B61304;
        color: white;
    }

    @media(max-width:468px){
     padding: 12px 10px;
        
     button{
        padding: 8px;
     }
     input{
        padding: 8px;
     }

     h2{
        font-size: 20px;
     }
     p{
        font-size: 14px;
     }
    }
`