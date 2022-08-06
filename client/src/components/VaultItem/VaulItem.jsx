import "./VaultItem.scss";
import { useState, Fragment } from "react";
import { Grid, GridItem, Box, Avatar, Center, SimpleGrid, Flex, Text, Button, Link, Collapse } from "@chakra-ui/react";
import Modal from "components/Modal/Modal";
import { StakeModal, WithdrawModal } from "components/StakeModal/StakeModal";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import useToken from "../../hooks/useToken";
import useTokenManager from "../../hooks/useTokenManager";
import React from "react";
import { tokenRound } from "../../helpers/calculation";
import { useEffect, useCallback } from "react";
import Big from "big.js";

const VaultInfo = ({ children, title }) => {
  return (
    <Box my={4} fontSize={14} display="flex">
      <Text>{title} </Text>
      <Text fontWeight="bold" ml={2}>
        {children}
      </Text>
    </Box>
  );
};

const VaultLink = ({ children, link }) => {
  return (
    <Link href={link} isExternal my={4} color="blue.500">
      {children} <ExternalLinkIcon mx="2px" />
    </Link>
  );
};

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

const VaultButton = ({ children, onClick }) => {
  return (
    <Button variant={"outline"} colorScheme="teal" size="sm" my={4} mx={"auto"} p={4} onClick={onClick}>
      {children}
    </Button>
  );
};

const VaultDetails = ({
  token,
  onToggleStake,
  balance,
  balanceSToken,
  contractTokenAdress,
  manager,
  pendingRewards
}) => {
  const { amountStaked } = manager;

  const NETWORK_SCAN = "etherscan.io";
  const MY_BALANCE = balance && `${tokenRound(balance)} ${token}`;
  const TOTAL_LOCKED = amountStaked && `${tokenRound(amountStaked)} BYX`;
  const CONTRACT_ETHERSCAN = contractTokenAdress && `https://${NETWORK_SCAN}/address/${contractTokenAdress}`;

  const canWithDraw = balanceSToken && balanceSToken.gt(0);
  const canStake = balance && balance.gt(0);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={2} h="100%">
      <GridItem w="100%" colSpan={1} py={5}>
        <VaultInfo title="MyBalance:">{MY_BALANCE}</VaultInfo>
        <VaultInfo title="Total staked:">{TOTAL_LOCKED}</VaultInfo>
        <VaultLink link={CONTRACT_ETHERSCAN}>View Contract</VaultLink>
      </GridItem>

      <GridItem w="100%" colSpan={2}>
        <Flex width="100%" height="100%" justify={"center"} align="center">
          <Box borderWidth="1px" borderRadius="20" width="80%" height="80%" p={8}>
            <Text fontSize={16}>BIX Earned</Text>
            <Text fontSize={16} fontWeight="bold">
              {pendingRewards}
            </Text>
            {/* <Text fontSize={16}>{REWARD_IN_USD}</Text> */}
          </Box>
        </Flex>
      </GridItem>

      <GridItem w="100%" colSpan={1}>
        <Flex width="100%" height="100%" justify={"center"} align="center" p={10} direction={"column"}>
          <Fragment>
            {canStake && <VaultButton onClick={() => onToggleStake("stake")}>Stake {token}</VaultButton>}
            {canWithDraw && <VaultButton onClick={() => onToggleStake("withdraw")}>Withdraw {token}</VaultButton>}
          </Fragment>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default function VaultItem({ logo, name, user }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [tvl, setTvl] = useState(null);
  const [apr, setApr] = useState(null);
  const [pendingRewards, setPendingRewards] = useState(null);

  const token = useToken("byx");
  const sToken = useToken("sbyx");

  const manager = useTokenManager(name.toLowerCase());
  const sManager = useTokenManager("sbyx");

  const isAuth = !!user.address;

  const onToggleDetails = async () => {
    setShowDetails((_showDetails) => !_showDetails);
  };

  const onToggleModal = (type) => {
    setModalType(type);
    setIsOpen((_isOpen) => !_isOpen);
  };

  useEffect(() => {
    !manager.amountStaked && manager.getUserTotalStake();
  }, [manager]);

  useEffect(() => {
    !token.balance && token.getBalance();
  }, [token]);

  useEffect(() => {
    !sToken.balance && sToken.getBalance();
  }, [sToken]);

  const getPendingRewards = useCallback(async () => {
    if (!manager || !sToken) return;

    const userSBYX = await sToken.balance;
    if (!userSBYX) {
      setPendingRewards(0);
      return;
    }

    const totalStokenSupply = await sToken.getTotalSupply();
    const tvl = await manager.getTVL();
    const onPlatformByx = userSBYX && userSBYX.mul(tvl).div(totalStokenSupply);
    const valueStaked = manager.amountStaked;
    const pendingRewards = onPlatformByx && onPlatformByx.minus(valueStaked);

    pendingRewards && setPendingRewards(tokenRound(pendingRewards).toFixed());
  }, [manager, sToken]);

  useEffect(() => {
    if (manager) {
      manager.getPoolInfo().then((data) => {
        data && setTvl(data.tvl);
        data && setApr(data.apr);
      });
    }
  }, [manager]);

  useEffect(() => {
    if (manager) {
      getPendingRewards();
    }
  }, [manager]);

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <Modal isOpen={isOpen} onClose={onToggleModal} width={"50%"} height={"70%"}>
        {modalType === "stake" ? (
          <StakeModal
            token={name}
            tokenBalance={token.balance}
            getBalance={token.getBalance}
            getSBalance={sToken.getBalance}
            onToggleModal={onToggleModal}
            manager={manager}
          />
        ) : (
          <WithdrawModal
            token={"sbyx"}
            tokenBalance={token.balance}
            sTokenBalance={sToken.balance}
            getBalance={token.getBalance}
            getSBalance={sToken.getBalance}
            onToggleModal={onToggleModal}
            manager={manager}
            sManager={sManager}
          />
        )}
      </Modal>

      <SimpleGrid columns={5} justify="center" align="center">
        <Avatar src={logo} />
        <VaultElement>{name || "?"}</VaultElement>
        <VaultElement>{`${apr} %` || "?"}</VaultElement>
        <VaultElement>{`${tvl}` || "?"}</VaultElement>

        {isAuth && (
          <Button colorScheme="teal" size="md" onClick={onToggleDetails} my="auto">
            Details
          </Button>
        )}
      </SimpleGrid>
      <Collapse in={showDetails} animateOpacity>
        <VaultDetails
          token={name}
          onToggleStake={onToggleModal}
          balance={token.balance}
          balanceSToken={sToken.balance}
          contractTokenAdress={token.contractTokenAdress}
          manager={manager}
          pendingRewards={pendingRewards}
        />
      </Collapse>
    </Box>
  );
}

//<Button onClick={() => setIsOpen((isOpen) => !isOpen)}>sqdqs</Button>
