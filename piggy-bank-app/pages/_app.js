import { WagmiConfig, createClient, chain, configureChains } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { infuraProvider } from 'wagmi/providers/infura'
import { MantineProvider } from '@mantine/core';
import { ApplicationContainer } from '../components/ApplicationContainer'
import { NotificationsProvider } from '@mantine/notifications';


const { chains, provider } = configureChains(
  [chain.goerli],
  [infuraProvider({apiKey: process.env.INFURA_API_KEY})],
)


const client = createClient(
  getDefaultClient({
    autoConnect: false,
    appName: "PiggyBank4",
    provider,
    chains,
  }),
);

function MyApp({ Component, pageProps }) {
  return (
    
      <WagmiConfig client={client}>
        <ConnectKitProvider theme="default" mode="dark">
          <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme ={{
            colorScheme: 'dark',
            colors: {
              brand: ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82','#AD1374' ],
            },
            primaryColor: 'brand',
          }} >
            <NotificationsProvider position="top-center">
            <ApplicationContainer>
                  <Component {...pageProps} />
            </ApplicationContainer>
            </NotificationsProvider>
        </ MantineProvider>
        </ConnectKitProvider>
      </WagmiConfig>   
  )
}

export default MyApp

