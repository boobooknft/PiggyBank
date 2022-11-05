import React from 'react'
import { Input } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

const IntialDepositAmount = ({setInitialDeposit}) => {

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
    
    } else {
      return setInitialDeposit(e.target.value)
    }}
  

  return (
    <Input onChange={fixInitialDeposit} type="text" step="1e18" placeholder="Minimum 0.005 ETH Deposit" />     
)
}

export default React.memo(IntialDepositAmount)