import React from 'react'
import { Input } from '@mantine/core'

const TokenID = ( {selectedRowIdHandler} ) => {

  return (
    <Input.Wrapper id="token-id" label="Token Id">
    <Input id="token-id" onChange={selectedRowIdHandler} className = "input" placeholder='e.g. 1...'/>
    </Input.Wrapper>
  )
}

export default TokenID


