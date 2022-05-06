import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { ConversionCard } from "../components/ConversionCard";
import { WalletModal } from "../components/WalletModal";
import { hooks, metaMask } from "./connectors/metaMask";

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

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  chains,
  chainCoins,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [accountBalance, setAccountBalance] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);

  const { useChainId, useAccounts, useIsActive, useProvider } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();

  const isActive = useIsActive();

  const provider = useProvider();

  const currentChain = chains?.find((c: ChainInfo) => c.chainId === chainId);
  const chainCoinData = chainCoins?.find(
    (c: ChainCoin) => c.chainId === currentChain?.chainId
  );

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

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  useEffect(() => {
    if (chainId && accounts) {
      getBalance(accounts[0]).then((balance) => {
        setAccountBalance(balance);
      });
    }
  }, [accounts, chainId]);

  useEffect(() => {
    if (isActive === false) {
      setVisible(false);
    }
  }, [isActive]);

  let coinImage = chainCoinData?.name
    ? `https://defillama.com/chain-icons/rsz_${chainCoinData.name.toLowerCase()}.jpg`
    : `https://defillama.com/chain-icons/rsz_ethereum.jpg`;

  if (currentChain?.chainId === 97) {
    coinImage = `https://defillama.com/chain-icons/rsz_binance.jpg`;
  }
  const darkTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

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
      <ThemeProvider theme={darkTheme}>
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
      </ThemeProvider>
    </div>
  );
};

export default Home;
