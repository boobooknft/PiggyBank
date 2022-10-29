import React, { useState } from 'react'
import { 
    AppShell,
    useMantineTheme,
    Group,
    Footer,
    Anchor, 
    Header
    } from '@mantine/core'
import Nav from '../components/Nav'

export const ApplicationContainer = ({children}) => {

    const theme = useMantineTheme();

  return (
    <AppShell
        styles={{
            main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
            footer: {
                background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                paddingTop: theme.spacing.xl * 2,
                paddingBottom: theme.spacing.xl * 2,
            },
            header: {
                position: 'sticky',
                top: '0px',
            }
        }}
        header={
            <Header>
                <Nav/>
            </Header>
        }
        footer={
            <Footer p="sm">
                <Group position="center" align="center" spacing={30}>
                    <Anchor
                     href="https://twitter.com/its_me_emma_dee"
                     target="_blank"
                     color="dark.0">
                        @its_me_emma_dee
                    </Anchor>
                    <Anchor href="https://etherscan.io/address/0x466b299db5f66fe42d7be58cb599c61bee66c09d"
                    color="dark.0">
                        boobook.eth
                    </Anchor>
                </Group>
            </Footer>    
        }
      >
        <Group direction="column" position="center" align="center">
            <Group style={{width: "900px"}} mt="140px" direction="column" position="center">
             {children}
            </Group>
        </Group>
    </AppShell>
  )
}
// 
