import styled from "styled-components";

// Styled Components (Animatsiyalarsiz va yangi ranglar bilan)
export const Container = styled.div`
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

export const FormWrapper = styled.div`
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  border-bottom: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 5px;
  letter-spacing: -0.5px;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 15px;
  font-weight: 500;
`;

export const FormContent = styled.div`
  padding: 30px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr"};
  gap: 20px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div``;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fdfdff;

  &:focus {
    outline: none;
    border-color: #38a169;
    background: white;
    box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: #fdfdff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #38a169;
    background: white;
    box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: #fdfdff;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #38a169;
    background: white;
    box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1);
  }
`;

export const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  position: relative;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
`;

export const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Badge = styled.span`
  background-color: #38a169;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const QuestionCard = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
`;

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const QuestionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

export const TaskCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const TaskType = styled.span`
  background: ${(props) => {
    switch (props.type) {
      case "text":
        return "#e6fffa";
      case "radio":
        return "#fef5e7";
      case "select":
        return "#f0f9ff";
      default:
        return "#f7fafc";
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case "text":
        return "#047857";
      case "radio":
        return "#c05621";
      case "select":
        return "#1e40af";
      default:
        return "#374151";
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.type) {
        case "text":
          return "#a7f3d0";
        case "radio":
          return "#fed7aa";
        case "select":
          return "#bfdbfe";
        default:
          return "#e5e7eb";
      }
    }};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const NumberBadge = styled.span`
  background: #2d3748;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const OptionsList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;

export const OptionInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const OptionText = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #38a169;
  }
`;

export const Button = styled.button`
  padding: ${(props) => (props.small ? "8px 12px" : "14px 28px")};
  background-color: ${(props) => {
    if (props.danger) return "#e53e3e";
    if (props.secondary) return "white";
    return "#38a169";
  }};
  color: ${(props) => (props.secondary ? "#2d3748" : "white")};
  border: ${(props) => (props.secondary ? "1px solid #cbd5e1" : "none")};
  border-radius: ${(props) => (props.small ? "6px" : "8px")};
  font-weight: 600;
  font-size: ${(props) => (props.small ? "0.8rem" : "1rem")};
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) => {
      if (props.danger) return "#c53030";
      if (props.secondary) return "#f7fafc";
      return "#2f855a";
    }};
    box-shadow: ${(props) =>
      props.secondary ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SaveButton = styled(Button)`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 20px;
  z-index: 100;
  font-size: 1.05rem;
  padding: 16px 32px;
  background: linear-gradient(135deg, #38a169, #2f855a);

  &:hover {
    background: linear-gradient(135deg, #2f855a, #276749);
    box-shadow: 0 12px 35px rgba(56, 161, 105, 0.4);
  }

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    right: auto;
    width: 100%;
  }
`;
