import React from 'react'
import { Accordion, MediaQuery } from '@mantine/core'

const FAQAccordion = () => {
    return (
        <div>
        <MediaQuery largerThan="sm" styles={{width: 600}}>
        <Accordion 
        variant="separated" 
        mt="sm"
        size="md"
        >
            <Accordion.Item
            value = "target">
            <Accordion.Control>Who is this service for?</Accordion.Control>
            <Accordion.Panel>Anyone who wants non-custodial “forced savings” or wants to being able to gift Eth for the future.
                Think “Trust Fund” and “Term Deposit” (except no trustees, it’s completely non-custodial and you don’t earn any interest on it ¯\_(ツ)_/¯ ).</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item
            value = "interest">
            <Accordion.Control>Are there any fees or royalties?</Accordion.Control>
            <Accordion.Panel>No. Mintning, depositing, withdrawing and transferring is free. You will only need to pay gas (transaction fee).
                However, there is a minimum deposit amount required when minting a piggy bank.
            </Accordion.Panel>
            </Accordion.Item>
        
            <Accordion.Item
            value = "interest">
            <Accordion.Control>Do I earn any interest on my locked ETH?</Accordion.Control>
            <Accordion.Panel>No. This is a non-interest bearing account. 
                Think of it like a traditional piggy bank you may have had when you were a kid. 
                The amount of money that comes out is the same amount of money that went in</Accordion.Panel>
            </Accordion.Item>
        
            <Accordion.Item 
            value = "additionaldeposits">
            <Accordion.Control>Can I make additional deposits to the NFT after it is minted?</Accordion.Control>
            <Accordion.Panel>Yes. You can make as many deposits as you like. 
            </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "releasedate">
            <Accordion.Control>Can I change the Release Date?</Accordion.Control>
            <Accordion.Panel>No. Once you set a Release Date it is written into the contract that the Eth cannot be withdrawn until that date is reached.
            </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "eth-limit">
            <Accordion.Control>Is there a limit to how much Eth I can lock up?</Accordion.Control>
            <Accordion.Panel>No. There is no limit. You can lock up as much Eth as you want.</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "immediateWithdraw">
            <Accordion.Control>What happens if I don’t withdraw immediately on the release date?</Accordion.Control>
            <Accordion.Panel>Nothing. Your Eth is still held safely in the NFT. 
                You can withdraw on the release date, or at any time beyond that. 
                Just note that you must withdraw all Eth at once. You cannot make partial withdrawals.</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "withdraw">
            <Accordion.Control>Who can withdraw the Eth from the NFT?</Accordion.Control>
            <Accordion.Panel>The owner of the NFT is the only wallet that can withdraw the Eth from the NFT. 
                You can authorize a third-party to transfer the NFT (e.g. transferring with OpenSea), 
                but you cannot authorize a third-party to withdraw the Eth.
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "deposit">
            <Accordion.Control>Who can deposit Eth to the NFT?</Accordion.Control>
            <Accordion.Panel>Anyone can deposit to any NFT. This allows family and friends to make Eth deposits to an NFT held outside of their wallet. 
                Think birthdays, religious celebrations, graduations, weddings.</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "erc20">
            <Accordion.Control>Can I deposit ERC20 tokens?</Accordion.Control>
            <Accordion.Panel>No. This implementation of the contract only allows for Eth deposits. We are working on one for select ERC20 tokens, this will be released soon.</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item 
            value = "nft-work">
            <Accordion.Control>So, the locked up Eth is stored as an NFT…how does that work?</Accordion.Control>
            <Accordion.Panel>In a standard ERC721 contract each NFT that is minted is mapped to the wallet that minted it. 
                E.g. NFT #1 is minted (and therefore owned) by 0xQwer address.
                This contract allows any amount of Eth to be stored against each NFT and requires a release date to be set upon minting. 
                E.g. NFT #1 holds 0.1Eth and cannot be released until 30 December 2023 and is owned by 0xQwer address.
                It is possible for this NFT to be transferred to another wallet which would then become the new owner and therefore the wallet that is able to withdraw the Eth once the release date has been reached.</Accordion.Panel>
            </Accordion.Item>
        </Accordion>
        </MediaQuery>
        </div>
    )
    }



    
export default FAQAccordion