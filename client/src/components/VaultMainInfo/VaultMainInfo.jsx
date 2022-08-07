import { Avatar, Center, SimpleGrid, Flex, Text, Button, Spinner } from "@chakra-ui/react";
import { tokenRound } from "../../helpers/calculation";

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

const VaultMainInfo = ({ logo, name, apr, tvl, isAuth, onToggleDetails }) => {
  return (
    <SimpleGrid columns={5} justify="center" align="center">
      <Avatar src={logo} />
      <VaultElement>{name.toUpperCase() || "?"}</VaultElement>
      {apr ? <VaultElement>{`${apr} %`}</VaultElement> : <Spinner />}
      {tvl ? <VaultElement>{`${tvl && tokenRound(tvl).toFixed()}`}</VaultElement> : <Spinner />}

      {isAuth && (
        <Button colorScheme="teal" size="md" onClick={onToggleDetails} my="auto">
          Details
        </Button>
      )}
    </SimpleGrid>
  );
};

export default VaultMainInfo;
