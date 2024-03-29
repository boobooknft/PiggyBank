import React, { useState, useEffect } from 'react'
import { 
  useContractWrite,
  useWaitForTransaction,
 } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { ethers } from 'ethers'
import { 
  Button,
  Stack,
  Title,
  Alert,
  Text,
  MediaQuery
  } from '@mantine/core'
import DepositAmount from './DepositAmount'

const OwnDepositTransaction = ({selectedRowId, setIsDeposited, setDepositHash, setTxData}) => {

    const [initialDeposit, setInitialDeposit] = useState ('0')
    const [isRowSelected, setIsRowSelected] = useState(false)


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
    
      useEffect(() => {
        setIsDeposited(txSuccess)
      },[txSuccess])

      useEffect(() => {
        setDepositHash(depositData?.hash);
        setTxData(txData)
      }, [depositData?.hash,txData])

      const mintObj = JSON.parse(JSON.stringify(error))
      const txnObj = JSON.parse(JSON.stringify(txError))

      useEffect(()=>{
        const rowSelect = () => {
          if(selectedRowId >= 0 && selectedRowId != null){
            setIsRowSelected(true)
          }
        }
        rowSelect()
      },[selectedRowId])
      
      console.log(`IsRowSelected: ${isRowSelected}`)
      console.log(`\nSelectedRowID: ${selectedRowId}`)
      console.log(`\nInitialDeposit: ${initialDeposit}`)

  return (
    <MediaQuery 
      smallerThan="xs" 
      styles={{width: 300}}
    >
    <Stack pb="50px">
      <Title
      mt="20px" 
      order={5}
      align="center" 
      >Selected Token Id: {selectedRowId} </Title>
    <DepositAmount initialDeposit={setInitialDeposit} />
    <Button position="center"
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
      {error && isRowSelected && (
        <Alert title="Error" mt="xl" mb="40px">
        <Text>An error occurred: {mintObj.reason} </Text>
        </Alert> 
      )}
      {txError && isRowSelected && (
        <Alert title="Error" mt="xl" mb="40px">
        <Text>An error occurred: {txnObj.reason} </Text>
        </Alert> 
      )}
      </Stack>   
      </MediaQuery>
  )
}

export default OwnDepositTransaction