import React from 'react'
import styled, { css } from 'styled-components';

// Styled Components
const BoxInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom:1.5rem;
`;

const Label = styled.label`
  font-size: var(--fz_small);
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.2rem 0;
  color: var(--gray);

  span {
    color: red;
  }
`;

const BoxInputWrapper = styled.div`
  width: 100%;

  input::placeholder {
    font-size: var(--fz_smallmax);
    color: var(--shadow-black);
    font-weight: 700;
  }

  span {
    color: red;
    font-size: var(--fz_smallmax);
  }
`;

const Input = styled.textarea`
  width: 100%;
  line-height: 1.2rem;
  padding: 0.7rem 0.5rem;
  border: none;
  outline: none;
  min-height:8rem;
  border-radius: 0.3rem;
   border: 0.05rem solid var(--shadow-black);
  box-shadow: 0 0 2px var(--shadow-black);

  &:focus {
   border: 1px solid var(--active);
  }

  /* Conditional error styling */
  ${(props) =>
    props.hasError &&
    css`
      border-color: red;
    `}
`;

// React Component
export default function TextArea({ typeInput, Textlabel, isRequire, err, Textplacehoder, fnChange }) {
  return (
    <BoxInput>
      <Label>
        {Textlabel} {isRequire && <span>*</span>}
      </Label>
      <BoxInputWrapper>
        <Input
          placeholder={Textplacehoder}
          onChange={fnChange}
          type={typeInput}
          hasError={err && err !== ''}  // Pass a prop to conditionally apply error styling
        />
        <span>{err & err !== '' ? '* ' + err : ''}</span>
      </BoxInputWrapper>
    </BoxInput>
  );
}
