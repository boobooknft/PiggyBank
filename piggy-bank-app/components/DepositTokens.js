import React, { useEffect, useState } from 'react'
import { 
    useAccount, 
    useContractRead,
    useContract,
    useSigner
   } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { TokenTable } from './TokenTable'
import { format } from 'date-fns'
import { Loader, Title, Text, Anchor, Stack, Paper } from '@mantine/core'
import OwnDepositTransaction from './OwnDepositTransaction'


const DepositTokens = () => {

    
    const [finalTokenDetails, setFinalTokenDetails] = useState([{}])
    const [showTable, setShowTable] = useState(false)
    const [hasTokens, setHasTokens] = useState(true)
    const [isDeposited, setIsDeposited] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState(null)
    const [depositHash, setDepositHash] = useState('')
    const [txData, setTxData] = useState(null)
   
    
    const { data: signer } = useSigner('')
    const { address } = useAccount()

    // this gets all tokens owned by the connected address

    const contractConfig = {
        addressOrName:'0x5Ff60e28F9493F08Fa5895b75df1F5223088A031',
        contractInterface: contractInterface,
      }

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
                for(const i = 0; i < tokenHexArray.length; i++){
                    tokensArray.push(parseInt(tokenHexArray[i]));
                };
                const balanceArray = [];
                for (const i of tokensArray) {
                    const accountBalance = await contract.getAccountBalance(i);
                    balanceArray.push(accountBalance);
                };
                const balances = balanceArray.toString();
                const splitBalances = balances.split(',').map(Number);
                const finalBalancesArray=[];
                for (const i of splitBalances){
                    finalBalancesArray.push(i / 10 ** 18);
                };
                const timeArray=[];
                for(const i of tokensArray){
                    const readyTime = await contract.getReadyTime(i);
                    timeArray.push(readyTime);
                };
                const finalTimeArray = []
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
                const finalTokenDetails =  tokenDetails.filter(token => token.AccountBalance !== 0)
                //creates a new array which starts out as empty
                setFinalTokenDetails(finalTokenDetails)
                if (finalTokenDetails.length > 0 ){ 
                    return setShowTable(true)
                }
            } catch(error){
                console.log(error)
            }        
        }
        fetchData()
    },[contract,tokens])

    useEffect(() => {
        setTimeout(() => {
            if (finalTokenDetails.length === 0){
                setHasTokens(false)
            } 
            // return () => clearTimeout(timer)
        },1500)
        
    },[finalTokenDetails])

    console.log(showTable)
    console.log(hasTokens)
    console.log(finalTokenDetails)
    

    return (
        <>
        {hasTokens && !showTable &&
        <>
            <Title order={4}>Querying blockchain...</Title>
            <Loader size="md"/>
        </>
        }
        {showTable &&  !isDeposited && (
          <div align="center">
            <TokenTable
            finalTokenDetails={finalTokenDetails}
            setSelectedRowId={setSelectedRowId}
            />
            <OwnDepositTransaction setIsDeposited={setIsDeposited}
            selectedRowId={selectedRowId}
            setDepositHash={setDepositHash}
            setTxData={setTxData}/>
            <Text>
                Tokens with 0 balance do not show in this table. 
            </Text>
            <Text>
                You can view all tokens owned by this address in etherscan or OpenSea
            </Text>
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
        {isDeposited && (
            <Stack>
                <Paper
                    p='40px'>
                    <Title 
                        order={4}
                        align="center">
                        Successfully deposited Eth to Token {selectedRowId}
                    </Title>
                    <Text 
                        align="center"
                        mt='sm'>
                        View transaction on {' '}
                        <Anchor href={`https://goerli.etherscan.io/tx/${depositHash}`} 
                        target="_blank"
                        >
                            Etherscan
                        </Anchor>
                    </Text>
                    <Text
                        align="center"
                        mt="sm">
                        View NFT on{' '}
                        <Anchor
                            href={`https://testnets.opensea.io/assets/goerli/${txData?.to}/${selectedRowId}`}
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

export default DepositTokens
