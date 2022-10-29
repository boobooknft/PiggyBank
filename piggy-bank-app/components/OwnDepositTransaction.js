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
        args: [selectedRowId],
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
      
        useEffect(() => {
          setIsDeposited(txSuccess)
        },[txSuccess])

        useEffect(() => {
          setDepositHash(depositData?.hash);
          setTxData(txData)
        }, [depositData?.hash,txData])

        const obj = JSON.parse(JSON.stringify(error))

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
    <DepositAmount depositHandler={depositHandler} />
    <Button position="center"
      my="20px"
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
    
      {error && isRowSelected && (
        <Alert title="Error" mt="xl" mb="40px">
        <Text>An error occurred: {obj.reason} </Text>
        </Alert> 
      )}
      </Stack>   
  )
}

export default OwnDepositTransaction