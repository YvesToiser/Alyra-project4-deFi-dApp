import "./VaultEth.scss";
import { useState } from "react";
import { Box, Avatar, Center, SimpleGrid, Flex, Text, Button, Collapse } from "@chakra-ui/react";
import Modal from "components/Modal/Modal";
import { StakeModal, WithdrawModal } from "components/StakeModal/StakeModal";
import useToken from "../../hooks/useToken";
import useTokenManager from "../../hooks/useTokenManager";
import React from "react";
import { tokenRound } from "../../helpers/calculation";
import { useEffect, useCallback } from "react";
import VaultDetailsEth from "components/VaultDetailsEth/VaultDetailsEth";
import useEth from "hooks/useEth";
import { StakeModalEth, WithdrawModalEth } from "components/StakeModalEth/StakeModalEth";

import { getEthApr, getEthTVL, getEthUserInfo, stakeEth } from "api/tokenManagerEth";

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

export default function VaultEth({ logo, name, user }) {
  const [apr, setApr] = useState(null);
  const [ethAmountStaked, setEthAmountStaked] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [pendingRewards, setPendingRewards] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [tvl, setTvl] = useState(null);
  const { state } = useEth();
  const ethContractManager = state.contracts["ETHStakingManager"];
  const userBalance = user && user?.balance?.eth;

  const isAuth = !!user.address;

  const onToggleDetails = async () => {
    setShowDetails((_showDetails) => !_showDetails);
  };

  const onToggleModal = (type) => {
    setModalType(type);
    setIsOpen((_isOpen) => !_isOpen);
  };

  useEffect(() => {
    if (ethContractManager && user.address) {
      getEthApr(ethContractManager)
        .then((_apr) => {
          setApr(_apr);
        })
        .catch((err) => {
          console.error(err);
        });

      getEthTVL(ethContractManager)
        .then((_tvl) => {
          setTvl(_tvl);
        })
        .catch((err) => {
          console.error(err);
        });
      getEthUserInfo(ethContractManager, user.address)
        .then((_info) => {
          setEthAmountStaked(_info.ethAmountStaked);
          setPendingRewards(_info.pendingRewards);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ethContractManager, user]);

  const handleStake = async (value) => {
    stakeEth(ethContractManager, user.address, value);
    onToggleModal();
  };

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <Modal isOpen={isOpen} onClose={onToggleModal} width={"50%"} height={"70%"}>
        {modalType === "stake" ? (
          <StakeModalEth token={name} balance={userBalance} handleStake={handleStake} />
        ) : (
          <WithdrawModalEth
            token={"sbyx"}
            // tokenBalance={token.balance}
            // sTokenBalance={sToken.balance}
            // getBalance={token.getBalance}
            // getSBalance={sToken.getBalance}
            // onToggleModal={onToggleModal}
            // manager={manager}
            // sManager={sManager}
          />
        )}
      </Modal>

      <SimpleGrid columns={5} justify="center" align="center">
        <Avatar src={logo} />
        <VaultElement>{name.toUpperCase() || "?"}</VaultElement>
        <VaultElement>{`${apr} %` || "?"}</VaultElement>
        <VaultElement>{`${tvl}` || "?"}</VaultElement>

        {isAuth && (
          <Button colorScheme="teal" size="md" onClick={onToggleDetails} my="auto">
            Details
          </Button>
        )}
      </SimpleGrid>
      <Collapse in={showDetails} animateOpacity>
        <VaultDetailsEth
          token={name}
          onToggleStake={onToggleModal}
          balance={userBalance}
          contractTokenAdress={"adress eth TODO"}
          pendingRewards={pendingRewards}
          amountStaked={ethAmountStaked}
        />
      </Collapse>
    </Box>
  );
}

//<Button onClick={() => setIsOpen((isOpen) => !isOpen)}>sqdqs</Button>
