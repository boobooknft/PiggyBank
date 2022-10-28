import React from 'react'
import { 
  useAccount, 
 } from 'wagmi'
 import WithdrawTokens from '../components/WithdrawTokens'
 import {
  Title,
 } from '@mantine/core'

 const Withdraw = () => {

  const { isConnected } = useAccount()

  return (
    <>
        {!isConnected && (
          <Title 
          order={2}
          align="center"
          >
          Connect Wallet To Withdraw
          </Title>
        )}
        {isConnected && (
          <WithdrawTokens/>
        )}
      </>
  )
}

export default Withdraw
