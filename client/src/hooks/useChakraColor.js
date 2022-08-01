import { useColorMode, useTheme } from "@chakra-ui/react";
const useChakraColor = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const getColor = (element) => {
    const chakraColor = theme.semanticTokens.colors[element][`_${colorMode}`].split(".");
    return theme.colors[chakraColor[0]][chakraColor[1]];
  };

  return { getColor, theme, colorMode };
};

export default useChakraColor;
