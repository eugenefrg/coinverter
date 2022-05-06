import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Actions } from "@web3-react/types";

export const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions: Actions) => new MetaMask(actions)
);
