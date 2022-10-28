import React from 'react'
import { Input } from '@mantine/core'

const TokenID = ( {selectedRowIdHandler} ) => {

  return (
    <Input onChange={selectedRowIdHandler} className = "input" placeholder='Enter Token ID...'/>
  )
}

export default TokenID


