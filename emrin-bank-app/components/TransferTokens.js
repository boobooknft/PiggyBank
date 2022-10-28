import React, { useEffect, useState } from 'react'
import { 
    useAccount, 
    useContractRead,
    useContract,
    useSigner,
    useWaitForTransaction
   } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { TokenTable } from './TokenTable'
import { format } from 'date-fns'
import { Loader, Text, Stack, Title, Anchor, Paper } from '@mantine/core'
import TransferTransactionUseContract from './TransferTransactionUseContract'



const TransferTokens = () => {

    
    const [finalTokenDetails, setFinalTokenDetails] = useState([{}])
    const [selectedRowId,setSelectedRowId] = useState(null)
    const [showTable, setShowTable] = useState(false)
    const [hasTokens, setHasTokens] = useState(true)
    const [isTransferred, setIsTransferred] = useState(false)
    // const [transferHash, setTransferHash] = useState('')
    // const [transferTxData, setTransferTxData] = useState(null)
    const [txnHash, setTxnHash] = useState('')
    
    const { data: signer } = useSigner('')
    const { address } = useAccount()

    const contractConfig = {
        addressOrName:'0x11A06e5a0B9e01170eA5dF279A1342af079F5a68',
        contractInterface: contractInterface,
      }

    // this gets all tokens owned by the connected address

    const { data: tokens } = useContractRead({
        ...contractConfig,
        functionName: 'getAccountsByOwner',
        args: address,
    })

    // instantiates ethers.Contract to enable calling functions from loops
    const contract = useContract({
        ...contractConfig,
        signerOrProvider: signer
      })

    useEffect(() => {
        const fetchData = async () => {
            try{
                const tokenJSONData = await JSON.parse(JSON.stringify(tokens));
                const tokenHexArray = await tokenJSONData?.map(a=>a.hex);
                const tokensArray = [];
                for(var i = 0; i < tokenHexArray.length; i++){
                    tokensArray.push(parseInt(tokenHexArray[i]));
                };
                const balanceArray = [];
                for (var i of tokensArray) {
                    let accountBalance = await contract.getAccountBalance(i);
                    balanceArray.push(accountBalance);
                };
                const balances = balanceArray.toString();
                const splitBalances = balances.split(',').map(Number);
                const finalBalancesArray=[];
                for (const i of splitBalances){
                    finalBalancesArray.push(i / 10 ** 18);
                };
                let timeArray=[];
                for(const i of tokensArray){
                    let readyTime = await contract.getReadyTime(i);
                    timeArray.push(readyTime);
                };
                let finalTimeArray = []
                const timeToSplit = timeArray.toString();
                const splitTime = timeToSplit.split(',').map(Number);
                for(const i of splitTime){
                    const unixTimeStamp = i;
                    const millisecond = unixTimeStamp * 1000;
                    const dateObject = format(new Date(millisecond), "do MMMM yyyy");
                    finalTimeArray.push(dateObject);
                }
                const tokenDetails = finalBalancesArray?.map((id,i) => {
                    return {
                        AccountBalance: id,
                        TokenID: tokensArray[i],
                        ReleaseDate: finalTimeArray[i]
                    };
                });
                const finalTokenDetails = tokenDetails.filter(token => token.AccountBalance !== 0)
                if (finalTokenDetails.length > 0){
                    setShowTable(true)
                }   
                return setFinalTokenDetails(finalTokenDetails)
            } catch(error){
                console.log(error.message)
            }        
        }
        fetchData()
    },[contract,tokens])

    useEffect(() => {
        setTimeout(() => {
            if (finalTokenDetails.length === 0){
                setHasTokens(false)
            } 
        },1500)
        
    },[finalTokenDetails])

    
    // useEffect(() => {
    //     setTransferTxData(trnsTxData)
    //   }, [trnsTxData])
  
      const { 
        isSuccess: transferTxSuccess,
        error: transferTxError,
        data: trnsTxData,
        } 
        = useWaitForTransaction({
          hash: txnHash,
        })
  
        useEffect(() => {
          setIsTransferred(transferTxSuccess)
        },[transferTxSuccess])

    return (
        <>
        {hasTokens && !showTable && 
        <>
            <Title order={4}>Querying blockchain...</Title>
            <Loader size="lg" />
        </>
        }
        {showTable && !isTransferred && (
            <div>
            <TokenTable 
            finalTokenDetails={finalTokenDetails}
            setSelectedRowId={setSelectedRowId}
            />
            <TransferTransactionUseContract
            selectedRowId={selectedRowId}
            setTxnHash={setTxnHash}
             />
          </div>
        )}
          {!hasTokens && (
            <>
            {!showTable && (
                <div> no Tokens to show</div>
            )} 
            </>
        )}
        {isTransferred &&
            <Stack>
                <Paper
                p="40px">
                    <Title 
                    order={4}
                    align="center">
                    Successfully transferred Token {selectedRowId}
                    </Title>
                    <Text
                    align="center"
                    mt="sm">
                    View transaction on {' '}
                        <Anchor href={`https://goerli.etherscan.io/tx/${txnHash}`} target="_blank" >
                            Etherscan
                        </Anchor>
                    </Text>                
                    <Text 
                    align="center"
                    mt="sm"
                    >
                    View NFT on{' '}
                    <Anchor
                    href={`https://testnets.opensea.io/assets/${trnsTxData?.to}/`}
                    target="_blank"
                    >
                    Opensea
                    </Anchor>
                    </Text>
                </Paper>
            </Stack>
        }
        </>
    )

}

export default TransferTokens
