import "./VaultEth.scss";
import { Big } from "big.js";
import { Box, Avatar, Center, SimpleGrid, Flex, Text, Button, Collapse } from "@chakra-ui/react";
import { getEthApr, getEthTVL, getEthUserInfo, stakeEth, withdrawEth } from "api/tokenManagerEth";
import { StakeModalEth, WithdrawModalEth } from "components/StakeModalEth/StakeModalEth";
import { tokenRound } from "../../helpers/calculation";
import { useState, useCallback, useEffect } from "react";
import Modal from "components/Modal/Modal";
import React from "react";
import useEth from "hooks/useEth";
import VaultDetailsEth from "components/VaultDetailsEth/VaultDetailsEth";

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

export default function VaultEth({ logo, name, user, setUser }) {
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

  const getInfo = useCallback(() => {
    getEthApr(ethContractManager)
      .then((_apr) => {
        setApr(_apr);
      })
      .catch((err) => {
        console.error(err);
      });

    getEthTVL(ethContractManager)
      .then((_tvl) => {
        setTvl(new Big(_tvl));
      })
      .catch((err) => {
        console.error(err);
      });
    getEthUserInfo(ethContractManager, user.address)
      .then((_info) => {
        setEthAmountStaked(new Big(_info.ethAmountStaked));
        setPendingRewards(new Big(_info.pendingRewards));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [ethContractManager, user.address]);

  useEffect(() => {
    if (ethContractManager && user.address) {
      getInfo();
    }
  }, [ethContractManager, getInfo, user.address]);

  const handleStake = async (value) => {
    try {
      await stakeEth(ethContractManager, user.address, value);
      getInfo();
      setUser();
    } catch (error) {
      console.error("error");
    }

    onToggleModal();
  };

  const handleWithdraw = async (value) => {
    try {
      await withdrawEth(ethContractManager, user.address, value.toFixed());
      getInfo();
      setUser();
    } catch (error) {
      console.error("error");
    }
    onToggleModal();
  };

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <Modal isOpen={isOpen} onClose={onToggleModal} width={"50%"} height={"70%"}>
        {modalType === "stake" ? (
          <StakeModalEth token={name} balance={userBalance} handleStake={handleStake} />
        ) : (
          <WithdrawModalEth
            token={name}
            handleWithdraw={handleWithdraw}
            balance={ethAmountStaked}
            pendingRewards={pendingRewards}
          />
        )}
      </Modal>

      <SimpleGrid columns={5} justify="center" align="center">
        <Avatar src={logo} />
        <VaultElement>{name.toUpperCase() || "?"}</VaultElement>
        <VaultElement>{`${apr} %` || "?"}</VaultElement>
        <VaultElement>{`${tvl && tokenRound(tvl).toFixed()}` || "?"}</VaultElement>

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
