import React, { useEffect, useState } from 'react'
import { 
    useAccount, 
    useContractRead,
    useContract,
    useSigner,
   } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { TokenTable } from './TokenTable'
import { format } from 'date-fns'
import { Loader, Text, Stack, Title, Anchor, Paper } from '@mantine/core'
import WithdrawTransaction from './WithdrawTransaction'



const WithdrawTokens = () => {

    
    const [finalTokenDetails, setFinalTokenDetails] = useState([{}])
    const [selectedRowId,setSelectedRowId] = useState(null)
    const [showTable, setShowTable] = useState(false)
    const [hasTokens, setHasTokens] = useState(true)
    const [isWithdrawn, setIsWithdrawn] = useState(false)
    const [withdrawHash, setWithdrawHash] = useState('')
    const [txData, setTxData] = useState(null)
    
    const { data: signer } = useSigner('')
    const { address } = useAccount()

    const contractConfig = {
        addressOrName:'0x63177830e23Aac9Bd0AA908106265A05253B67e7',
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

    console.log(hasTokens)
    console.log(showTable)
    console.log(finalTokenDetails)
    console.log(isWithdrawn)

    return (
        <>
        {hasTokens && !showTable && 
        <>
            <Title order={4}>Querying blockchain...</Title>
            <Loader size="lg" />
        </>
        }
        {showTable && !isWithdrawn && (
            <div>
            <TokenTable 
            finalTokenDetails={finalTokenDetails}
            setSelectedRowId={setSelectedRowId}
            />
            <WithdrawTransaction
            selectedRowId={selectedRowId}
            setIsWithdrawn={setIsWithdrawn}
            setWithdrawHash={setWithdrawHash}
            setTxData={setTxData}
             />
          </div>
        )}
          {!hasTokens && (
            <>
            {!showTable && (
              <Title order={4}>
                No Tokens Available
              </Title>
            )} 
            </>
        )}
        {isWithdrawn &&
            <Stack>
                <Paper
                p="40px">
                    <Title 
                    order={4}
                    align="center">
                    Successfully withdrew Eth from Token {selectedRowId}
                    </Title>
                    <Text
                    align="center"
                    mt="sm">
                    View transaction on {' '}
                        <Anchor href={`https://goerli.etherscan.io/tx/${withdrawHash}`} target="_blank" >
                            Etherscan
                        </Anchor>
                    </Text>                
                    <Text 
                    align="center"
                    mt="sm"
                    >
                    View NFT on{' '}
                    <Anchor
                    href={`https://testnets.opensea.io/assets/goerli/${txData?.to}/`}
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

export default WithdrawTokens
