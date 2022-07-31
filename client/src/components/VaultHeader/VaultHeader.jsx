import "./VaultHeader.scss";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

export default function VaultHeader() {
  return (
    <Box borderRadius="20" px={5}>
      <SimpleGrid columns={5}>
        <Text>LOGO</Text>
        <Text>NAME</Text>
        <Text>APR</Text>
        <Text>TVL</Text>
      </SimpleGrid>
    </Box>
  );
}
