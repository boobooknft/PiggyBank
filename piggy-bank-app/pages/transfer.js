import React from 'react'
import { 
  useAccount, 
 } from 'wagmi'
 import WithdrawTokens from '../components/WithdrawTokens'
 import {
  Title,
  Group
 } from '@mantine/core'

 import TransferTokens from '../components/TransferTokens'

const Transfer = () => {

  const { isConnected } = useAccount()

  return (
  <>
    {!isConnected && (
      <>
      <Title 
      order={2}
      align="center"
      >
      Connect Wallet To Transfer NFT
      </Title>
      </>
    )}
    {isConnected && (
      <TransferTokens/>
    )}

    </>
  )
}

export default Transfer