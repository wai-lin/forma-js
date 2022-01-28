import * as React from 'react'
import styled from '@emotion/styled'

const Pre = styled.pre({
  padding: '20px',
  overflow: 'auto',
  width: '100%',
  height: '320px',
  border: '1px solid #a5a5a5',
  borderRadius: '10px',
  fontFamily: 'Monaco, monospace',
  fontSize: '12px',
})

export const JsonPretty: React.FC<{ json: any }> = ({ json = {} }) => {
  return (
    <Pre>
      Result
      <br />
      <br />
      {JSON.stringify(json, null, 2)}
    </Pre>
  )
}

export const Button = styled.button({
  cursor: 'pointer',
  background: 'rgb(50 67 199)',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  ':hover': {
    filter: 'brightness(1.1)',
  },
  ':active': {
    filter: 'brightness(1)',
  },
  ':focus': {
    boxShadow: '0 0 0 1px #fff, 0 0 0 3px rgb(50 67 199)',
  },
})

export const FormControl = styled.div({
  margin: '10px 0 20px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px',
  '& > label': {
    fontSize: '12px',
    fontWeight: 'bold',
  },
  '& > input': {
    fontSize: '14px',
    padding: '10px',
    border: '1px solid #a5a5a5',
    borderRadius: '3px',
    width: '100%',
  },
})
