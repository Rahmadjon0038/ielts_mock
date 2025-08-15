import styled from "styled-components";

export const FormContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
`;

export const FormWrapper = styled.div`
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

export const AudioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto 50px;
  padding: 0 20px;
`;

export const AudioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #f1f5f9, #e0e7ff);
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const DeleteBtn = styled.button`
  background: #ff4d4f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition:  0.3s ease, transform 0.2s ease;

  &:hover {
    background: #d9363e;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;