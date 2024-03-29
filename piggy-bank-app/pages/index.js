import React, { useState, useEffect } from 'react'
import { 
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useContract,
  useSigner,
  useConnect,
  usePrepareContractWrite
 } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { ethers, Signer } from 'ethers'
import InitialDepositAmount from '../components/InitialDepositAmount'
import FlipCard, { BackCard, FrontCard } from '../components/FlipCard'
import Image from 'next/image'
import NFTimage from '../images/NotEvenOwl-min.png'
import { 
  Button, 
  Text, 
  Title, 
  Container, 
  Group,
  Stack,
  Paper,
  Anchor,
  MediaQuery,
  Alert,
  Modal,
  TextInput,
  } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { format } from 'date-fns'
import FAQAccordion from '../components/FAQAccordion'

const Home = () => {
  
  const [value, setValue] = useState(new Date())
  const [initialDeposit, setInitialDeposit] = useState('0')
  const [active, setActive] = useState("ethDeposit")
  const [faq, setFaq] = useState(false)
  const [tip, setTip] = useState('0')  
  const [opened, setOpened] = useState(false)

  const numInitialDeposit = parseFloat(initialDeposit)
  const numTip = parseFloat(tip)
  const numTotalOpeningAmount = ((numInitialDeposit * 10 ** 18) + (numTip * 10 ** 18)) / 10 ** 18
  const totalOpeningAmount = String(numTotalOpeningAmount)

  console.log(numInitialDeposit)
  console.log(numTip)
  console.log(numTotalOpeningAmount)
  console.log(totalOpeningAmount)

  const { isConnected } = useAccount()
  const signer = useSigner()
  const connect = useConnect()

  const onChange = (newValue) => {
    setValue(newValue)
  }
    
  const date = Date.now() / 1000
  const timeStamp = Math.round(value.getTime()) / 1000

  // Setting the users initial deposit when minting the eth bank
  const contractConfig = {
    addressOrName:'0x5Ff60e28F9493F08Fa5895b75df1F5223088A031',
    contractInterface: contractInterface,
  }

  const { 
    data: mintData,
    write: mint, 
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
    } = useContractWrite({
    mode: 'recklesslyUnprepared',  
    ...contractConfig,
    functionName: 'formingDiamondHands',
    })

   
  const { data: supplyData } = useContractRead({
    ...contractConfig,
    functionName: 'totalSupply',
    watch: true,
    })


  const { 
    isSuccess: txSuccess,
    error: txError,
    data: txData,
    } 
    = useWaitForTransaction({
      hash: mintData?.hash,
    })
  
  const isMinted = txSuccess  


  const logs = txData?.logs[0].topics[3]
  const mintedToken = parseInt(logs)
  console.log(mintedToken)

  

 
  const totalSupplyData = parseInt(supplyData)
  const mintObj = JSON.parse(JSON.stringify(mintError))
  const txnObj = JSON.parse(JSON.stringify(txError))
    

  const ethDepositHandler = () => {
    if (Number(initialDeposit) < 0.005 || Number(initialDeposit) <.005 ) {
        showNotification({
          message: "Minimum 0.005 ETH opening deposit required",
          title: "Not Enough ETH",
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
          
        });
        console.log(initialDeposit)
    } else {
      setActive("calendar")
    }
  }

  const calendarHandler = () => {
    if (timeStamp < date ) {
      showNotification({
        message: "Please Choose a Future Date",
        title: "Invalid Date",
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
    } else {
      setActive('mintPage')
    }
  }
  console.log(timeStamp)
  console.log(txData)
  console.log(`\nmintData: ${mintData}`)

  return (
    <>
    <Container 
    align="center"
    mt="40px"
    mb="40px"
    >
      <Group
      align-items="center"
      >
      {/* <Nav /> */}
        {!isConnected && (
          <div>
            <MediaQuery largerThan="sm" styles={{width: 500}}>
            <Group style={{justifyContent: "center"}}>
            <Title order={1}>
              Eth burning a hole in your pocket?
            </Title>
            <Title order={2} p="20px" >
            Why not lock it up for a bit...
            </Title>            
            <Title order={3} italic>
            PiggyBank allows you to store Eth in a time locked, transferable NFT
            </Title>
            <Title 
              order={3}
              mt="20px">
              Connect your wallet to start
            </Title>
            </Group>
            </MediaQuery>
            {!faq && 
              <Button mt="100px"
              mb="40px"
              color= 'gray.6'
              onClick={() => setFaq(true)}
              size="lg"
              compact>
                FAQ
              </Button>    
              }
            
          </div>
        )}
          {isConnected && active === "ethDeposit" && (
            <MediaQuery largerThan="sm" styles={{width: 300}}>
            <Stack>
              <Title 
              order={2}
              align="center"
              >
                Enter Opening Amount
              </Title>
              <InitialDepositAmount initialDeposit={setInitialDeposit} />
                <Button onClick={ethDepositHandler}
                >
                  Next
                </Button>
            </Stack>
            </MediaQuery>
            
          )}
          {isConnected && active === "calendar" && (
            <Stack >
              <Title 
              order={3} 
              align="center">
                Choose Release Date
              </Title>
              <Paper p="sm">
              <Calendar 
                value={value}
                onChange={onChange} 
                />
                </Paper>
              <Button 
                my="20px"
                onClick={calendarHandler}>
                  Next
              </Button>
            </Stack>
          )}
          {isConnected && active === "mintPage" && (
              <Group style={{ justifyContent: "center"}}>
                  <Stack 
                  spacing="sm" 
                  sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })
                  }>
                  <Title order={2}>
                    Mint Piggy Bank
                  </Title>
                  <Text>
                    Total Supply of Piggy Banks: {totalSupplyData}
                  </Text>
                  {!isMinted && (
                    <>
                    <Group mt="20px"
                      style={{justifyContent: "space-between"}}>
                      <Text ml="8px">
                        Deposit Amount: {initialDeposit} ETH
                      </Text>
                      <Button 
                        compact
                        variant="outline"
                        mr="8px" 
                        color="pink.3"
                        onClick={() => setActive("ethDeposit")}
                        >
                        Edit
                      </Button>
                    </Group>
                    <Group style={{justifyContent: "space-between", align: "space-around"}}>
                      <Group>
                        <Text ml="8px">
                          Release Date: {format(new Date(value),"do MMMM yyyy")}
                        </Text>
                      </Group>
                      <Button 
                        compact
                        variant="outline"
                        mr="8px" 
                        color="pink.3"
                        onClick={() => setActive("calendar")}>
                        Edit
                      </Button>
                    </Group>
                    </>
                  )}
                  {!isMinted && (
                    <>
                    <Modal
                    centered
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Almost there..."
                    style={{fontSize: "1.4rem"}}
                    >
                      <Group 
                          style={{fontSize: "1rem", justifyContent: "center", textAlign:"center"}}
                        >
                        <Text>
                          This services uses a pay-what-you-want model 
                        </Text>
                        <Text>
                        Creating this PiggyBank has been a labour of love. Any support is greatly appreciated and will be used for further development
                        </Text>
                        <Text>
                        Note: You are not required to pay to mint a PiggyBank
                        </Text>
                        <Group
                          style={{flexDirection:"row", flexWrap:"wrap"}}
                          mb="5px"
                          >
                        <Text style={{fontWeight: "semi-bold"}}
                        color="pink.3">
                          Tip:
                        </Text>
                        <Button 
                        variant="outline"
                        color="pink.3"
                        onClick={()=> setTip("0.01")}>
                          0.01eth
                        </Button>
                        <Button 
                        variant="outline"
                        color="pink.3"
                        onClick={() => setTip("0.03")}>
                          0.03eth
                        </Button>
                        <TextInput 
                        type='text'
                        placeholder="Other.."
                        style={{width: "90px"}}
                        color="pink.3"
                        onChange={(e) => setTip(e.target.value)}
                        />
                        </Group>
                        </Group>
                        <Group style={{fontSize: "0.9rem", flexDirection: "column"}}
                        >
                          <Stack mt="5px">
                          <Text>
                            Deposit: {numInitialDeposit} ETH
                          </Text>
                          <Text
                          mt="-md">
                            Tip: {numTip} ETH
                          </Text>
                          <Text
                          mt="-md"
                          style = {{fontWeight: "bold"}}>
                            Total: {totalOpeningAmount} ETH
                          </Text>
                         </Stack>
                          <Button
                            onClick={() => mint({
                              recklesslySetUnpreparedArgs: [timeStamp, ethers.utils.parseEther(tip)],
                              recklesslySetUnpreparedOverrides: {
                                value: ethers.utils.parseEther(totalOpeningAmount),
                              }
                            })}
                            disabled={isMintLoading || isMintStarted}
                            data-mint-loading={isMintLoading}
                            data-mint-started={isMintStarted}
                            sx={{
                              '&[disabled]': { color: 'gray' },
                            }}
                          >
                            {isMintLoading && 'Waiting for approval'}
                            {isMintStarted && 'Minting'}
                            {!isMintLoading && !isMintStarted && 'Confirm Mint Piggy Bank'}
                          </Button>
                      </Group>
                      <Group style={{justifyContent: "center", width: 350}} align="center">
                        {mintError && (
                          <Alert title="Error" mt="xl" mb="40px">
                        <Text>
                        An error occurred: {mintObj.reason}
                        </Text>
                        </Alert>
                      )}
                      {txError && (
                        <Alert title="Error" mt="xl" mb="40px">
                        <Text>
                        An error occurred: {txnObj.reason}
                        </Text>
                        </Alert>    
                      )}
                      </Group>
                      </Modal>   
                    <Group style={{justifyContent: "center"}}>
                      <Button
                      onClick={() => setOpened(true)}>
                        Mint Piggy Bank
                      </Button>
                    </Group>
                    </>
                  )}
                </Stack>   
                  <div style={{ flex: '0 0 auto' }} pb="50px">
                    <FlipCard>
                      <FrontCard isCardFlipped={isMinted}>
                        <Image
                          layout="responsive"
                          src={NFTimage}
                          width="500"
                          height="500"
                        />
                      </FrontCard>
                      <BackCard isCardFlipped={isMinted}>
                        <div style={{ padding: 24 }}>
                          <Image
                            src={NFTimage}
                            width="80"
                            height="80"
                            alt="RainbowKit Demo NFT"
                            style={{ borderRadius: 8 }}
                          />
                          <h2 style={{ marginTop: 24, marginBottom: 6 }}>Minted!</h2>
                          <p style={{ marginBottom: 24 }}>
                            Your NFT will show up in your wallet in the next few minutes.
                          </p>
                          <p style={{ marginBottom: 6 }}>
                            View on{' '}
                            <Anchor href={`https://goerli.etherscan.io/tx/${mintData?.hash}`} 
                            target="_blank"
                            >
                              Etherscan
                            </Anchor>
                          </p>
                          <p>
                          View on{' '}
                            <Anchor
                              href={`https://testnets.opensea.io/assets/${txData?.to}/${mintedToken}`}
                              target="_blank"
                            >
                              Opensea
                            </Anchor>
                          </p>
                        </div>
                      </BackCard>
                    </FlipCard>
                  </div> 
              </Group>          
            )}
          </Group>     
    </Container>

    {!isConnected && faq && (
      <Container 
        my="40px"
        py="30px">
          <Title 
            align="center"
            order={3}
          >
              FAQ
          </Title>
          <FAQAccordion/>
      </Container>
    )}
    </>
  )
}
    


export default Home