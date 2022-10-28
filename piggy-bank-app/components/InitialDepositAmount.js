import React from 'react'
import { Input } from '@mantine/core'

const IntialDepositAmount = (props) => {
  
  return (
      <Input onChange={(e) => (props.initialDeposit(e.target.value))} type="text" placeholder="Minimum 0.005 ETH Deposit" />     
  )
}

export default React.memo(IntialDepositAmount)