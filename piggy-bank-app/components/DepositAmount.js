import React from 'react'
import { Input } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const DepositAmount = (props) => {

  const fixInitialDeposit = (e) => {
    if(e.target.value == '.' ) {
      showNotification({
        message: "Please Add Leading 0 e.g. 0.01 Eth not .01 Eth",
        title: "Invalid Format",
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.cyan[7],
            borderColor: theme.colors.cyan[7],
            '&::before': { backgroundColor: theme.colors.gray[0] },
          },
          title: {color: theme.white},
          description: { color: theme.white},
          closeButton: {
            color: theme.white,
            '&:hover': {backgroundColor: theme.colors.cyan[3]},
          },
        }),
      })
    
    } else if(e.target.value == undefined){
      () => props.setInitialDeposit('0')
    } else {
      () => props.setInitialDeposit(e.target.value)
    }}

  return (
    <Input.Wrapper id="deposit-amount" label="Deposit Amount">
    <Input type="text" id="deposit-amount" onChange={fixInitialDeposit} className = "input" placeholder="e.g 0.01 Eth...."/>
    </Input.Wrapper>
  )
}

export default DepositAmount