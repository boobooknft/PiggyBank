import React, { useState, useEffect } from 'react'
import { 
  usePrepareContractWrite, 
  useContractWrite,
  useWaitForTransaction,
  useContract,
 } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { ethers } from 'ethers'
import { 
  Button,
  Stack,
  Title,
  Alert,
  Text
  } from '@mantine/core'
import DepositAmount from './DepositAmount'

const OwnDepositTransaction = ({selectedRowId, setIsDeposited, setDepositHash, setTxData}) => {

    const [initialDeposit, setInitialDeposit] = useState ('0')
    const [isRowSelected, setIsRowSelected] = useState(false)


    const contractConfig = {
      addressOrName:'0x63177830e23Aac9Bd0AA908106265A05253B67e7',
      contractInterface: contractInterface,
    }

    // const { config, error } = usePrepareContractWrite({
    //     ...contractConfig,
    //     functionName: 'deposit',
    //     args: [selectedRowId],
    //     overrides: {
    //       value: ethers.utils.parseEther(initialDeposit)
    //     }
    //   })
    
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
        
        console.log(obj)
        console.log(isRowSelected)

  return (
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
  )
}

export default OwnDepositTransaction