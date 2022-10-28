import React from 'react'
import { Input } from '@mantine/core'

const DepositAmount = ({depositHandler}) => {

  return (
    <Input mt="20px" onChange={depositHandler} className = "input" placeholder="Enter amount to deposit..."/>
  )
}

export default DepositAmount