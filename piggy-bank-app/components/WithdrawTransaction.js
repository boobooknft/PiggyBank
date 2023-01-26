import React, { useEffect, useState } from 'react'
import { 
  useContractWrite, 
  usePrepareContractWrite, 
  useWaitForTransaction, 
  } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { Button, Title, Stack, Text, Alert } from '@mantine/core'

const WithdrawTransaction = ({selectedRowId, setIsWithdrawn, setWithdrawHash, setTxData }) => {

      const [isRowSelected, setIsRowSelected] = useState(false)

      const contractConfig = {
        addressOrName:'0x63177830e23Aac9Bd0AA908106265A05253B67e7',
        contractInterface: contractInterface,
      }

      const { config, error } = usePrepareContractWrite({
        ...contractConfig,
        functionName: 'withdraw',
        args: [selectedRowId], 
      })
    
      const { 
        data: withdrawData,
        write: withdraw, 
        isLoading: isWithdrawLoading,
        isSuccess: isWithdrawStarted,
        error: withDrawError,
      } = useContractWrite(config)

      const { 
        isSuccess: txSuccess,
        error: txError,
        data: txData,
        } 
        = useWaitForTransaction({
          hash: withdrawData?.hash,
        })

        useEffect (() => {
          setIsWithdrawn(txSuccess)
        },[txSuccess])

        const obj = JSON.parse(JSON.stringify(error))

        useEffect(()=>{
          const rowSelect = () => {
            if(selectedRowId >= 0 && selectedRowId != null){
              setIsRowSelected(true)
            }
          }
          rowSelect()
        },[selectedRowId])

        useEffect(() => {
          setWithdrawHash(withdrawData?.hash);
          setTxData(txData)
        }, [withdrawData?.hash,txData])
        

        console.log(obj)


  return (
      <Stack position="center"
      mt='lg'
      pb="50px">
      <Title
      mt="20px" 
      order={5}
      align="center" 
      >Selected Token Id: {selectedRowId} </Title>
      <Button 
        my="20px"
        onClick={withdraw}
        data-withdraw-loading={isWithdrawLoading}
        data-withdraw-started={isWithdrawStarted}
        disabled={isWithdrawLoading || isWithdrawStarted}
        sx={{
          '&[disabled]': { color: 'gray' },
        }}
        >
          {isWithdrawLoading && 'Waiting for approval'}
          {isWithdrawStarted && 'Withdrawing'}
          {!isWithdrawLoading && !isWithdrawStarted && 'Withdraw'}
      </Button>
    {error && isRowSelected && (
      <Alert title="Error" mt="xl" mb="40px">
      <Text> {obj.reason} </Text>
      </Alert> 
    )}
    </Stack>
  )
}

export default WithdrawTransaction

