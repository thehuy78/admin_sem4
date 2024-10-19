import React from 'react'
import Select from 'react-select';
export default function SelectInput({ defaultVl, options, fnChangeOption, multi }) {
  return (
    <Select
      value={defaultVl}

      onChange={fnChangeOption}
      options={options}
      isMulti={multi}
      styles={{
        control: (base) => ({
          ...base,
          minWidth: '12rem',
          fontSize: '1rem',
          isMulti: true,
          // padding: '0.3rem',
          margin: '0',
          minHeight: '2.5rem',
          overflow: "hidden",
          border: '0.05rem solid var(--shadow-black)'
        }),
        container: (base) => ({
          ...base,
          padding: '0',
        }),
      }}
    />
  )
}
