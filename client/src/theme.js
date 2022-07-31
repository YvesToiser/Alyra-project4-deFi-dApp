import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

// 3. extend the theme
const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      html: {
        fontSize: "14px"
      },
      body: {
        fontFamily: "body",
        color: mode("gray.800", "whiteAlpha.900")(props)
      }
    })
  }
});

export default theme;
