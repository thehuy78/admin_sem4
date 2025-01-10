import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
const MapApi = ({ errors, label, placeholder, functionCallback, required }) => {
  const [address, setAddress] = useState('');


  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(errors);
  useEffect(() => {
    setError(errors)
  }, [errors]);
  const [results, setResults] = useState([]);
  const handleGeocode = async () => {
    const apiKey = '951c3bd4a93441539a374498567c3eca';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        const firstResult = response.data.results[0].geometry;
        setCoordinates(firstResult);
        setResults(response.data.results);
        functionCallback(firstResult)
        setError('');
      } else {
        setError('Không tìm thấy tọa độ cho địa chỉ này.');
        setCoordinates(null);
        functionCallback(null)
        setResults([]);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gọi API.');
      setCoordinates(null);
      functionCallback(null)
      setResults([]);
    }
  };

  return (
    <BoxInput>
      <Label>{label}{required && (<span> *</span>)}</Label>
      <RowInput>
        <Input
          type="text"
          placeholder={placeholder}
          value={address}
          onChange={(e) => setAddress(e.target.value)}

        />
        <Button onClick={handleGeocode}>Get</Button>
      </RowInput>
      <ListItem>
        {results && results.length > 0 &&
          results.map((item, index) => (
            <Item>
              <p
                key={index}
                onClick={() => {
                  setCoordinates(item.geometry)
                  setAddress(item.formatted)
                  setResults([])
                  functionCallback(item.geometry)
                }}
              >
                {item.formatted}
              </p>
            </Item>
          ))}
      </ListItem>
      {coordinates && coordinates.lat && coordinates.lng && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Latitude:</strong> {coordinates.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {coordinates.lng}
          </p>
        </div>
      )}

      {error && <Error>{error}</Error>}
    </BoxInput>
  );
};

export default MapApi;


const BoxInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom: 1.5rem;
`;

const Item = styled.div`
  padding: 0.5rem 1rem;
  background-color: var(--white);
  color: var(--cl_2);
  cursor: pointer;
  transition: 0.3s ease-in-out;
  border-radius: 0.5rem;
  &:hover{
    background-color: var(--cl_2);
    color: white;
  }
  p{
    text-decoration: none;
  }

`;

const ListItem = styled.div`
 display: flex;
flex-direction: column;
gap: 0.3rem;

`;

const RowInput = styled.div`
   display: grid;
  grid-template-columns: 7fr 2fr;
  gap: 0.5rem;
  align-items: center;
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

const Error = styled.p`
 
    color: red;
    font-size: var(--fz_smallmax);
  
`;

const Input = styled.input`
  width: 100%;
  line-height: 1.2rem;
  padding: 0.7rem 0.5rem;
  border: none;
  outline: none;
  min-height: 3rem;
  border-radius: 0.3rem;
  border: 0.05rem solid var(--shadow-black);
  box-shadow: 0 0 2px var(--shadow-black);

  &:focus {
    border: 1px solid var(--active);
  }

  /* Conditional error styling */
  ${(props) =>
    props.$hasError && // Use $hasError to avoid passing it to the DOM
    css`
      border-color: red;
    `}
`;

const Button = styled.p`
  width: 100%;
  line-height: 1.2rem;
  padding: 0.7rem 0.5rem;
  border: none;
  outline: none;
  min-height: 3rem;
  border-radius: 0.3rem;
  border: 0.05rem solid var(--shadow-black);
  box-shadow: 0 0 2px var(--shadow-black);
background-color: var(--cl_3);
  color:white;
    display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s ease-in-out;
  &:hover {
    transform: scale(0.98);
  }

`;