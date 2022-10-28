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
    const [selectedRowId,setSelectedRowId] = useState(null)
    const [isRowSelected, setIsRowSelected] = useState(false)

    const selectedRowIdHandler = event => {
        setSelectedRowId(event.target.value)
    }

    const depositHandler = event => {
        setInitialDeposit(event.target.value)
    }

    const contractConfig = {
      addressOrName:'0x819F7f9290Eb5c8d7E8A2d3faAdB9d05017Fb00D',
      contractInterface: contractInterface,
    }

    const { config, error } = usePrepareContractWrite({
        ...contractConfig,
        functionName: 'deposit',
        args: selectedRowId,
        overrides: {
          value: ethers.utils.parseEther(initialDeposit)
        }
      })
    
      const { 
        data: depositData,
        write: deposit, 
        isLoading: isDepositLoading,
        isSuccess: isDepositStarted
      } = useContractWrite(config)

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
            if(selectedRowId >= 0 && selectedRowId !== ''){
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

  return (
    <>
      {!isDeposited && (
        <Stack>
          <Title 
            order={2}
            align="center">
            Enter Deposit Details
          </Title>
          <TokenID selectedRowIdHandler={selectedRowIdHandler}/>
          <DepositAmount depositHandler={depositHandler}/>
          <Button justify="stretch"
            mt="20px"
            onClick={() => deposit?.()}
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
          {error && isRowSelected && 
          <Alert style={{width: 256}}  title="Error" mt="xl">
          <Text> {obj.reason} </Text>
          </Alert>}
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
              View on{' '}
              <Anchor
                href={`https://testnets.opensea.io/assets/goerli/${txData?.to}/`}
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