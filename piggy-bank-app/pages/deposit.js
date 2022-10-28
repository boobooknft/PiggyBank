import React, {useState} from 'react'
import { 
  useAccount, 
 } from 'wagmi'
import DepositTokens from '../components/DepositTokens'
import { 
  Button, 
  Group, 
  Title, 
  } from '@mantine/core'
import ElseDepositTransaction from '../components/ElseDepositTransaction'

const Deposit = () => {

  const [active, setActive] = useState('deposit')

  const { isConnected } = useAccount()
      
  return (
      <>
        {/* 1 */}
        {!isConnected && (
          <Title 
          order={2}
          align="center">
              Connect Wallet to Deposit
          </Title>
        )}
        {/* 2 */}
        {isConnected && active === 'deposit' && (
          <Group position="center">
            <Title 
            order={2}
            align="center">
              Deposit to a token you own or one someone else owns?
            </Title>
            <Group direction="column" position="center" mt="20px">
              <Button onClick={ () => setActive('own')}>
                I own it
              </Button>
              <Button onClick={() => setActive('someone-else')}>
                Someone else owns it
              </Button>
            </Group>
            
          </Group>

        )}      
        {/* 3a */}
        {isConnected && active === "own" && (
          <DepositTokens/>
        )}
        {/* 3b */}
        {isConnected && active === "someone-else" && (
          <ElseDepositTransaction />
        )}
      </>
  )
}

export default Deposit