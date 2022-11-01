import React from 'react'
import { Input } from '@mantine/core'

const DepositAmount = ({depositHandler}) => {

  return (
    <Input.Wrapper id="deposit-amount" label="Deposit Amount">
    <Input type="number" id="deposit-amount" onChange={depositHandler} className = "input" placeholder="e.g 0.01 Eth...."/>
    </Input.Wrapper>
  )
}

export default DepositAmount