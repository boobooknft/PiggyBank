import React from 'react'
import { Input } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const IntialDepositAmount = (props) => {


  return (
      <Input onChange={(e) => (props.initialDeposit(e.currentTarget.value))} type="text" placeholder="Minimum 0.005 ETH Deposit"/>     
      // <Input type="number" placeholder="Minimum 0.005 ETH Deposit" /> 
  )

}

export default React.memo(IntialDepositAmount)