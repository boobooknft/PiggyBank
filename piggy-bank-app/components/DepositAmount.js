import React from 'react'
import { Input } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const DepositAmount = (props) => {


  return (
    <Input.Wrapper id="deposit-amount" label="Deposit Amount">
    <Input type="text" id="deposit-amount" onChange={(e) => props.initialDeposit(e.target.value)} className = "input" placeholder="e.g 0.01 Eth...."/>
    </Input.Wrapper>
  )
}

export default DepositAmount