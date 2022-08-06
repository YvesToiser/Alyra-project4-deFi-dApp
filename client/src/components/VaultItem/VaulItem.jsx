import "./VaultItem.scss";
import { useState } from "react";
import { Box, Avatar, Center, SimpleGrid, Flex, Text, Button, Collapse } from "@chakra-ui/react";
import Modal from "components/Modal/Modal";
import { StakeModal, WithdrawModal } from "components/StakeModal/StakeModal";

import useToken from "../../hooks/useToken";
import useTokenManager from "../../hooks/useTokenManager";
import React from "react";
import { tokenRound } from "../../helpers/calculation";
import { useEffect, useCallback } from "react";
import VaultDetails from "components/VaultDetails/VaultDetails";

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

export default function VaultItem({ logo, name, user }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [tvl, setTvl] = useState(null);
  const [apr, setApr] = useState(null);
  const [pendingRewards, setPendingRewards] = useState(null);

  const token = useToken(name.toLowerCase());
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

  useEffect(() => {
    if (manager) {
      getPendingRewards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);

  const getPendingRewards = useCallback(async () => {
    if (!manager || !sToken) return;

    const userSBYX = await sToken.balance;
    if (!userSBYX) {
      setPendingRewards(0);
      return;
    }

    const totalStokenSupply = await sToken.getTotalSupply();
    const tvl = await manager.getTVL();
    const onPlatformByx = userSBYX && totalStokenSupply && userSBYX.mul(tvl).div(totalStokenSupply);
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
