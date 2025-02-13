import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { theme as baseTheme } from "@chakra-ui/react";
// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(["container", "body"]);

export const CardConfig = helpers.defineMultiStyleConfig({
  baseStyle: {
    ...baseTheme.components.Card.baseStyle,
    container: {
      rounded: "xl",
      _light: {
        bg: "white",
      },
      _dark: {
        bg: "gray.800",
      },
    },
    body: {
      p: 4,
    },
  },

  variants: {
    outline: {
      container: {
        border: "1px solid",
        _light: {
          borderColor: "gray.300",
        },
        _dark: {
          borderColor: "gray.700",
        },
      },
    },
  },
});
