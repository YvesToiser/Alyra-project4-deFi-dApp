import "./VaultItem.scss";
import { useState } from "react";
import { Grid, GridItem, Box, Avatar, Center, SimpleGrid, Flex, Text, Button } from "@chakra-ui/react";

export default function VaultItem({ logo, name, apr, tvl }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((_showDetails) => !_showDetails);
  };

  return (
    <Box borderWidth="1px" borderRadius="20" p={5} px={10}>
      <SimpleGrid columns={5}>
        <Avatar src={logo} />
        <Flex>
          <Center>
            <Text>{name || "?"}</Text>
          </Center>
        </Flex>

        <Flex>
          <Center>
            <Text>{apr || "?"}</Text>
          </Center>
        </Flex>
        <Flex>
          <Center>
            <Text>{tvl || "?"}</Text>
          </Center>
        </Flex>
        {/* <Button className="vault-item__button" onClick={toggleDetails}>
            {showDetails ? "Hide Details" : " Show Details"}
          </Button> */}

        <Button colorScheme="teal" size="lg" onClick={toggleDetails}>
          Details
        </Button>
      </SimpleGrid>
      <div className={`vault-item__details${showDetails ? "--show" : ""}`}>
        <Grid templateColumns="repeat(4, 1fr)" gap={4} h="100%">
          <GridItem w="100%" bg="blue.500" colSpan={1} />
          <GridItem w="100%" bg="blue.500" colSpan={2} />
          <GridItem w="100%" bg="blue.500" colSpan={1} />
        </Grid>
      </div>
    </Box>
  );
}
