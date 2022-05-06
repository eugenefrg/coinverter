import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ConversionCard } from "../components/ConversionCard";
import { WalletModal } from "../components/WalletModal";
import { hooks, metaMask } from "../connectors/metaMask";

interface ChainInfo {
  name: string;
  chain: string;
  chainId: number;
  icon: string;
  infoURL: string;
  nativeCurrency: {
    name: string;
    symbol: string;
  };
}

interface ChainCoin {
  chainId: number;
  name: string;
}

export async function getStaticProps() {
  const chainData = await fetch(`https://chainid.network/chains.json`);
  const chainCoin = await fetch(`https://api.llama.fi/chains`);

  return {
    props: {
      chains: await chainData.json(),
      chainCoins: await chainCoin.json(),
    },
  };
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  chains,
  chainCoins,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // Get the metamask hooks
  const { useChainId, useAccounts, useIsActive, useProvider } = hooks;
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  // initialize states
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  // get the current chain and it's icon from chainCoins.
  const currentChain = chains?.find((c: ChainInfo) => c.chainId === chainId);
  const chainCoinData = chainCoins?.find(
    (c: ChainCoin) => c.chainId === currentChain?.chainId
  );

  // set the current chain's icon as a variable.
  let coinImage = chainCoinData?.name
    ? `https://defillama.com/chain-icons/rsz_${chainCoinData.name.toLowerCase()}.jpg`
    : `https://defillama.com/chain-icons/rsz_ethereum.jpg`;

  // if the user is using binance testnet, set the icon to the binance icon.
  if (currentChain?.chainId === 97) {
    coinImage = `https://defillama.com/chain-icons/rsz_binance.jpg`;
  }

  /**
   * Get the balance of the account
   * @param account The account to check the balance of
   * @returns The balance of the account
   */
  const getBalance = async (account: string): Promise<number> => {
    try {
      const balance = await provider?.getBalance(account, "latest");
      /**
       * if the balance is undefined, it means that the account is not active.
       * therefore, we set the balance to 0.
       */
      if (!balance) return 0;

      /**
       * if the balance is defined, we return the balance.
       * The balance is a hexadecimal string representing the balance in wei.
       * We convert it to a number using web3.utils.fromWei.
       */
      const weiToEther = Web3.utils.fromWei(balance._hex, "ether");

      // fromWei returns a string, so we need to parse it to a number
      return Number(weiToEther);
    } catch (error) {
      /**
       * If the error contains underlying network changed, disconnect
       * the provider and close the modal if it is open.
       */
      if ((error as any).toString().includes("underlying network changed")) {
        metaMask?.deactivate();
        setVisible(false);
      }
      return 0;
    }
  };

  /**
   * This function is called when the user clicks on the dark / light mode button.
   * @param setToDarkMode Set the dark mode to true or false
   */
  const handleToggleDarkMode = (setToDarkMode: boolean) => {
    setIsDarkMode(setToDarkMode);
    window?.localStorage.setItem("isDarkMode", setToDarkMode.toString());
  };

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  // get the balance of the account
  useEffect(() => {
    if (chainId && accounts) {
      getBalance(accounts[0]).then((balance) => {
        setAccountBalance(balance);
      });
    }
  }, [accounts, chainId]);

  /**
   * If the connection is not active, we close the modal.
   * This is to ensure that the modal is closed when the user disconnects.
   * The user gets disconnected when the network changes.
   */
  useEffect(() => {
    if (isActive === false) {
      setVisible(false);
    }
  }, [isActive]);

  // set the theme based on the dark mode state
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(window?.localStorage.getItem("isDarkMode") === "true");
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Coinverter</title>
        <meta name="description" content="Convert NEP to BUSD" />
        <link
          rel="icon"
          href="https://ethereum.org/favicon-32x32.png?v=8b512faa8d4a0b019c123a771b6622aa"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Paper
          elevation={0}
          square
          sx={{ flexGrow: 1, height: "100vh", pt: 20 }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: "3rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Coinverter
            </Typography>
            <ConversionCard
              isActive={isActive}
              onClickDetails={() => setVisible(true)}
            />
          </Container>
          <WalletModal
            open={visible}
            onClose={() => {
              setVisible(false);
            }}
            walletAddress={accounts?.[0]}
            balance={accountBalance}
            chainName={currentChain?.name}
            coinImage={coinImage}
            symbol={currentChain?.nativeCurrency?.symbol}
            onDeactivate={() => {
              void metaMask.deactivate();
            }}
          />
        </Paper>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SettingsIcon />}
        >
          {!isDarkMode && (
            <SpeedDialAction
              icon={<DarkModeIcon />}
              tooltipTitle={"Dark Mode"}
              onClick={() => handleToggleDarkMode(true)}
            />
          )}
          {isDarkMode && (
            <SpeedDialAction
              icon={<LightModeIcon />}
              tooltipTitle={"Light Mode"}
              onClick={() => handleToggleDarkMode(false)}
            />
          )}
        </SpeedDial>
      </ThemeProvider>
    </div>
  );
};

export default Home;
