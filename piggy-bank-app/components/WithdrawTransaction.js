import React, { useEffect, useState } from 'react'
import { 
  useContractWrite, 
  usePrepareContractWrite, 
  useWaitForTransaction, 
  } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { Button, Title, Stack, Text, Alert, MediaQuery } from '@mantine/core'

const WithdrawTransaction = ({selectedRowId, setIsWithdrawn, setWithdrawHash, setTxData }) => {

      const [isRowSelected, setIsRowSelected] = useState(false)

      const contractConfig = {
        addressOrName:'0x5Ff60e28F9493F08Fa5895b75df1F5223088A031',
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
    <MediaQuery
      smallerThan="xs" 
      styles={{width: 300}}
    >
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
    {error && isRowSelected && obj.error.data.originalError.data == "0x4d9015d9" && (
      <Alert title="Error" mt="xl" mb="40px">
      <Text align="left">Eth Still Locked. Try Again Later</Text>
      </Alert> 
    )}
    </Stack>
    </MediaQuery>
  )
}

export default WithdrawTransaction

