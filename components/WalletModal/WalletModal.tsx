import Modal, { ModalProps } from "@mui/material/Modal";
import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface WalletModalProps extends Omit<ModalProps, "children"> {
  chainName: string;
  walletAddress?: string;
  balance: number;
  symbol: string;
  coinImage: string;
  onDeactivate: () => void;
}

const WalletModal: React.FC<WalletModalProps> = (props) => {
  // ModalProps
  const { open, onClose } = props;

  // WalletModalProps
  const { onDeactivate, chainName, walletAddress, balance, symbol, coinImage } =
    props;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          borderRadius: "0px",
        }}
      >
        <Card
          sx={{
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ pb: 4 }}>
              Wallet Details
            </Typography>
            <Typography variant="body1">
              Your wallet is connected to:
            </Typography>
            <Typography variant="h6" sx={{ pb: 4 }}>
              {chainName}
            </Typography>
            <Typography variant="body1">Wallet Address:</Typography>
            <Typography variant="h6" sx={{ pb: 4 }}>
              {walletAddress?.substring(0, 10)}...
            </Typography>
            <Typography variant="body1">You have:</Typography>
            <Typography variant="h6" sx={{ pb: 4 }}>
              {balance} {symbol}
              <img
                src={coinImage}
                alt={symbol}
                style={{ borderRadius: "50%" }}
              />
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={() => onClose && onClose({}, "escapeKeyDown")}
              sx={{ mr: 2 }}
            >
              Close
            </Button>
            <Button variant="outlined" onClick={onDeactivate} color="error">
              Disconnect
            </Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
};
export default WalletModal;
