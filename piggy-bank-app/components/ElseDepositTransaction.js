import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  usePrepareContractWrite, 
  useContractWrite,
  useWaitForTransaction,
 } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { ethers } from 'ethers'
import TokenID from './TokenID'
import { 
  Button, 
  Title, 
  Stack, 
  Alert,
  Text,
  Anchor,
  Paper
  } from '@mantine/core'
import DepositAmount from './DepositAmount'

const ElseDepositTransaction = () => {

    const [initialDeposit, setInitialDeposit] = useState ('0')
    const [selectedRowId,setSelectedRowId] = useState('')
    const [isRowSelected, setIsRowSelected] = useState(false)

    const selectedRowIdHandler = event => {
        setSelectedRowId(event.target.value)
    }

    const contractConfig = {
      addressOrName:'0x5Ff60e28F9493F08Fa5895b75df1F5223088A031',
      contractInterface: contractInterface,
    }
    
    const { 
      data: depositData,
      write: deposit, 
      isLoading: isDepositLoading,
      isSuccess: isDepositStarted,
      error
    } = useContractWrite({
      ...contractConfig,
      functionName: 'deposit'
    })

    const { 
      isSuccess: txSuccess,
      error: txError,
      data: txData,
      } 
      = useWaitForTransaction({
        hash: depositData?.hash,
      })
    
      const isDeposited = txSuccess

      console.log(selectedRowId)

      const obj = JSON.parse(JSON.stringify(error))

      useEffect(()=>{
        const rowSelect = () => {
          if(selectedRowId >= 0 && (selectedRowId !== '')){
            setIsRowSelected(true)
          } else {
            if(selectedRowId == ''){
              setIsRowSelected(false)
            }
          }
        }
        rowSelect()
      },[selectedRowId])

      console.log(error)
      console.log(txData)

  return (
    <>
      {!isDeposited && (
        <Stack pb="50px">
          <Title 
            order={2}
            align="center">
            Enter Deposit Details
          </Title>
          <TokenID selectedRowIdHandler={selectedRowIdHandler}/>
          <DepositAmount initialDeposit={setInitialDeposit}
            
            />
          <Button
            my="20px"
            onClick={() => 
              deposit({
              recklesslySetUnpreparedArgs: selectedRowId,
              recklesslySetUnpreparedOverrides: {
                value: ethers.utils.parseEther(initialDeposit)
              }
            })}
            disabled={isDepositStarted || isDepositLoading}
            data-deposit-loading={isDepositLoading}
            data-deposit-started={isDepositStarted}
            sx={{
              '&[disabled]': { color: 'gray' },
            }}
            >
            {!isDepositLoading && !isDepositStarted && 'Deposit'}
            {isDepositLoading && 'Waiting for Approval'}
            {isDepositStarted && 'Depositing'}
          </Button> 
          {error && isRowSelected && obj.error.data.originalError.data == "0x2dac9bb2" && (
          <Alert style={{width: 256}}  title="Error" mt="xl" mb="40px">
          <Text> Token Id Does Not Exist. Please check. </Text>
          </Alert>)}
        </Stack>
      )} 
    {isDeposited && (
      <Stack>
        <Paper p='40px'>
            <Title order={4} align="center">
                Successfully deposited {initialDeposit} Eth to Token {selectedRowId}
           </Title>
           <Text 
              align="center"
              mt="sm">
           View transaction on{' '}
           <Anchor href={`https://goerli.etherscan.io/tx/${depositData?.hash}`} 
           target="_blank"
           >
             Etherscan
           </Anchor>
           </Text>
           <Text 
              align="center"
              mt="sm">
              View token on{' '}
              <Anchor
                href={`https://testnets.opensea.io/assets/${txData?.to}/${selectedRowId}`}
                target="_blank"
              >
                Opensea
              </Anchor>
            </Text>
            </Paper>
      </Stack>
       )}
    </> 
  )
}

export default ElseDepositTransaction