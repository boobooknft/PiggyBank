import React, { useState, useEffect } from 'react'
import { Input, Button, Stack, Title, Alert, Text } from '@mantine/core'
import { 
  usePrepareContractWrite, 
  useContractWrite, 
  useAccount,
  useWaitForTransaction,
  useContract,
  useSigner,
  useContractEvent, 
  useSignMessage
  } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { showNotification } from '@mantine/notifications'


const TransferTransactionUseContract = ({selectedRowId, setTxnHash}) => {

    const [toAddress, setToAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
   

    const contractConfig = {
      addressOrName:'0x819F7f9290Eb5c8d7E8A2d3faAdB9d05017Fb00D',
      contractInterface: contractInterface,
    }

    const { address: fromAddress } = useAccount()
    const { 
      data: signer, 
      error
      } = useSigner()

    const contract = useContract({
        ...contractConfig,
        signerOrProvider: signer
      })

    const inputHandler = e => {
      setToAddress(e.target.value)
    }

    const onClickHandler = () => {
      if(toAddress == ''){
        showNotification({
          message: "Please enter 'To' address",
          title: "Invalid Address",
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
      } else if(selectedRowId == null || undefined){
        showNotification({
          message: "Please select Token",
          title: "Invalid Token Id",
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
      } else etherjs() }
      
    const etherjs = async () => {
        setIsLoading(true)
        await contract["safeTransferFrom(address,address,uint256)"](fromAddress, toAddress, selectedRowId);
        setIsStarted(true)
      }

    useContractEvent({
      ...contractConfig,
      eventName: 'Transfer',
      once: true,
      listener(event){
        const txHash = event.find(txHash => txHash.transactionHash != null || undefined)
        const txHashComplete = txHash.transactionHash
        setTxnHash(txHashComplete)
      }
    }) 
   
      const obj = JSON.parse(JSON.stringify(error))


  return (
    <div pb="30px">
        <Stack>
        <Title
        mt="20px" 
        order={5}
        align="center" 
        >Selected Token Id: {selectedRowId} </Title>
        <Input.Wrapper id="transer" label="Address" >
        <Input id="transfer" placeholder="e.g. 0xAeFF...or destination.eth" onChange={inputHandler}/>
        </Input.Wrapper>
        <Button
        mt="20px"
        onClick={() => onClickHandler()}
        disabled={isLoading}
        data-nfttransfer-loading={isLoading}
        data-nfttransfer-started={isStarted}
        sx={{
          '&[disabled]': { color: 'gray' },
        }}
        >
        {isLoading && !isStarted && 'Waiting for approval'}
        {isStarted && isLoading && 'Transfering NFT'}
        {!isLoading && !isStarted && 'Transfer NFT'}
        </Button>
        </Stack>
        {error && (
        <Alert title="Error" my="xl">
        <Text>An error occurred: {obj.reason} </Text>
        </Alert> 
      )}
    </div>
  )
}

export default TransferTransactionUseContract
