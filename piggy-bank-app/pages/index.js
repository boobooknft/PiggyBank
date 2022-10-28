import React, { useState, useEffect } from 'react'
import { 
  useAccount, 
  usePrepareContractWrite, 
  useContractWrite,
  useWaitForTransaction,
  useContractRead
 } from 'wagmi'
import contractInterface from '../utils/contract-abi.json'
import { ethers } from 'ethers'
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
  MediaQuery
  } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { format } from 'date-fns'
import FAQAccordion from '../components/FAQAccordion'


const Home = () => {
  
  // const [totalMinted, setTotalMinted] = useState(0)

  const [value, setValue] = useState(new Date())
  const [initialDeposit, setInitialDeposit] = useState('0')
  const [active, setActive] = useState("ethDeposit")
  const [faq, setFaq] = useState(false)

  const { isConnected } = useAccount()

  const onChange = (newValue) => {
    setValue(newValue)
  }

  const date = Date.now() / 1000
  const timeStamp = Math.round(value.getTime()) / 1000

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

  // Setting the users initial deposit when minting the eth bank

  const contractConfig = {
    addressOrName:'0x819F7f9290Eb5c8d7E8A2d3faAdB9d05017Fb00D',
    contractInterface: contractInterface,
  }

  const { config, error } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'formingDiamondHands',
    args: [timeStamp], // may need to add debounce here as this performs an RPC request on every args change
    overrides: {
      value: ethers.utils.parseEther(initialDeposit)
    }
  })

  const { 
    data: mintData,
    write: mint, 
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(config)

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

  const totalSupplyData = parseInt(supplyData)

  // useEffect(() => {
  //   if (totalSupplyData) {
  //     setTotalMinted(totalSupplyData);
  //   }
  // }, [totalSupplyData])

  const ethDepositHandler = () => {
    if (Number(initialDeposit) < 0.005) {
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
        })
    } else {
      setActive("calendar")
    }
  }
     
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
            <Stack>
              <Title 
              order={2}
              align="center"
              >
                Enter Opening Amount
              </Title>
              <InitialDepositAmount initialDeposit={setInitialDeposit} />
                <Button 
                onClick={ethDepositHandler}
                >
                  Next
                </Button>
            </Stack>
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
              <Group flex-wrap style={{ justifyContent: "center"}}>
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
                  {mintError && (
                  <p>
                    Error: {mintError.message}
                  </p>
                )}
                {txError && (
                  <p>
                    Error: {txError.message}
                  </p>    
                )}
                  {!isMinted && (
                    <Button
                    my="20px"
                    onClick={() => mint?.()}
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
                              href={`https://testnets.opensea.io/assets/goerli/${txData?.to}/`}
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
      <Container my="40px"
      py="30px">
      <Title align="center"
                order={3}>
                FAQ
              </Title>
        <FAQAccordion/>
      </Container>
    )}
 
    </>
  )
}
    


export default Home