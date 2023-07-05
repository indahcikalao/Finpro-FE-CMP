import numeral from "numeral";
const FormatCurrency = ({value, currency}) => {
  let formattedValue = numeral(Math.abs(value)).format("0,0");
  let sign = value < 0 ? "- " : "";

  switch (currency) {
    case "JPY":
      sign += "¥";
      break;
    case "EUR":
      sign += "€";
      break;
    case "IDR":
      sign += "Rp";
      break;
    case "USD":
      sign += "$";
      break;
    default:
      break;
  }

  return `${sign} ${formattedValue}`;
};

export default FormatCurrency;
