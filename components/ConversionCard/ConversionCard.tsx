import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { metaMask } from "../../pages/connectors/metaMask";

interface ConversionCardProps {
  isActive: boolean;
  onClickDetails: () => void;
}

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(Number(n));
}

const NumberInputProps: TextFieldProps = {
  type: "number",
  inputProps: {
    inputMode: "decimal",
    pattern: "[0-9]*",
    error: true,
  },
  InputLabelProps: {
    shrink: true,
  },
};

const ConversionCard: React.FC<ConversionCardProps> = ({
  isActive,
  onClickDetails,
}) => {
  const [nepValue, setNepValue] = useState<number | string>();
  const [busdValue, setBusdValue] = useState<number | string>();

  const handleNepCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNepValue(value);
    if (!isNaN(Number(value))) {
      const busdValue = parseFloat(value) * 3;
      setBusdValue(busdValue.toFixed(2));
    }
  };

  const handleBusdCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setBusdValue(value);
    if (!isNaN(Number(value))) {
      const nepValue = parseFloat(value) / 3;
      setNepValue(nepValue.toFixed(2));
    }
  };

  const isNepValueInvalid =
    !isNumeric(nepValue as string) && nepValue !== undefined;
  const isBusdValueInvalid =
    !isNumeric(busdValue as string) && busdValue !== undefined;

  return (
    <Paper elevation={5} sx={{ px: 8, pb: 8, pt: 4 }}>
      <Typography variant="h6" align="center" sx={{ pb: 4 }}>
        Convert NEP to BUSD
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5.5}>
          <TextField
            label="NEP"
            fullWidth
            error={isNepValueInvalid}
            helperText={
              isNepValueInvalid
                ? "Please enter a valid number"
                : "1 NEP = 3 BUSD"
            }
            value={nepValue}
            onChange={handleNepCoinChange}
            {...NumberInputProps}
          ></TextField>
        </Grid>
        <Grid
          item
          xs={12}
          sm={1}
          sx={{
            display: { xs: "flex", sm: "inline-block" },
            justifyContent: "center",
            pb: {
              xs: 2,
              sm: 0,
            },
          }}
        >
          <CurrencyExchangeIcon
            sx={{ pt: 1, width: { sm: "100%" }, height: "auto" }}
          />
        </Grid>
        <Grid item xs={12} sm={5.5}>
          <TextField
            label="BUSD"
            fullWidth
            error={isBusdValueInvalid}
            helperText={
              isBusdValueInvalid
                ? "Please enter a valid number"
                : "3 BUSD = 1 NEP"
            }
            value={busdValue}
            onChange={handleBusdCoinChange}
            {...NumberInputProps}
          ></TextField>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!isActive && (
          <Button
            variant="outlined"
            onClick={() => {
              void metaMask.activate();
            }}
          >
            Connect with MetaMask
          </Button>
        )}
        {isActive && (
          <Button variant="contained" onClick={onClickDetails}>
            Wallet Details
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ConversionCard;
