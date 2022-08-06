import styled from "@emotion/styled";
import { Text } from "@chakra-ui/react";
import { GrMoney } from "react-icons/gr";
import { useState } from "react";
import useChakraColor from "hooks/useChakraColor";
import CustomSlider from "components/Slider/Slider";
import { tokenRound, roundNumbers } from "helpers/calculation";
import { Button, Flex, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { stakeEth } from "api/tokenManagerEth";

const StakeModalContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.bgColor};
`;

const StakeModalHeader = styled.div`
  display: flex;
  justify-content: center;
  height: 10%;
  align-items: center;
  text-align: center;
  background-color: ${(props) => props.backgroundColor};
`;
const StakeModalBody = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  height: 90%;
  width: 100%;
  padding: 2rem;
`;

export const StakeModalEth = ({ balance, onToggleModal, handleStake }) => {
  const { getColor, theme } = useChakraColor();

  const [stakeValuePercentage, setStakeValuePercentage] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);

  const roundedBalance = tokenRound(balance);
  const MY_BALANCE = balance && `${roundedBalance} ETH`;

  const handleStakeInputValueChange = (val) => {
    setStakeValuePercentage((parseFloat(val) * 100) / roundedBalance);
    setStakeValue(val);
  };

  const handleStakeValuePercentageChange = (val) => {
    setStakeValuePercentage(val);
    setStakeValue((roundedBalance * val) / 100);
  };

  return (
    <StakeModalContainer bgColor={getColor("chakra-body-bg")}>
      <StakeModalHeader backgroundColor={theme.colors.teal[500]}>
        <Text fontSize={24} color="white">
          Stake
        </Text>
      </StakeModalHeader>

      <StakeModalBody>
        <Flex gridRowStart={1}>
          <Text fontSize={24} color="white">
            My balance : {MY_BALANCE}
          </Text>
        </Flex>
        <Flex gridRowStart={2} justify="center" align="center">
          <InputGroup width={"30%"}>
            <InputLeftAddon children={<GrMoney />} />
            <Input
              type="text"
              placeholder="Value"
              value={roundNumbers(stakeValue)}
              onChange={(e) => handleStakeInputValueChange(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Flex gridRowStart={4} justify="center">
          <CustomSlider sliderValue={stakeValuePercentage} setSliderValue={handleStakeValuePercentageChange} />
        </Flex>

        <Flex gridRowStart={6} justify="center">
          <Button
            width={200}
            onClick={() => handleStake(balance.mul(stakeValuePercentage / 100).round())}
            disabled={stakeValue <= 0}
          >
            Stake
          </Button>
        </Flex>
      </StakeModalBody>
    </StakeModalContainer>
  );
};

export const WithdrawModalEth = ({
  tokenBalance,
  sTokenBalance,
  getBalance,
  getSBalance,
  token,
  onToggleModal,
  manager,
  sManager
}) => {
  const { getColor, theme } = useChakraColor();
  const { withdraw, getApproval } = sManager;
  const [approved, setApproved] = useState(false);

  const [stakeValuePercentage, setStakeValuePercentage] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);

  const roundedBalance = sTokenBalance && tokenRound(sTokenBalance);
  const MY_BALANCE = sTokenBalance && `${roundedBalance} ${token}`;

  const handleStakeValueChange = (val) => {
    setStakeValuePercentage((parseFloat(val) * 100) / roundedBalance);
    setWithdrawValue(val);
    setApproved(false);
  };

  const handleStakeValuePercentageChange = (val) => {
    setStakeValuePercentage(val);
    setWithdrawValue((roundedBalance * val) / 100);
    setApproved(false);
  };

  const handleApproval = async () => {
    try {
      await getApproval(sTokenBalance.mul(stakeValuePercentage / 100).round(), token);
      setApproved(true);
    } catch (error) {
      setApproved(false);
    }
  };

  const handleWithdraw = async () => {
    await withdraw(sTokenBalance.mul(stakeValuePercentage / 100).round(), token);
    await getBalance();
    await getSBalance();
    await manager.getUserTotalStake();

    onToggleModal();
  };

  return (
    <StakeModalContainer bgColor={getColor("chakra-body-bg")}>
      <StakeModalHeader backgroundColor={theme.colors.teal[500]}>
        <Text fontSize={24} color="white">
          WithDraw
        </Text>
      </StakeModalHeader>

      <StakeModalBody>
        <Flex gridRowStart={1}>
          <Text fontSize={24} color="white">
            Value max to withdraw : {MY_BALANCE}
          </Text>
        </Flex>
        <Flex gridRowStart={2} justify="center" align="center">
          <InputGroup width={"30%"}>
            <InputLeftAddon children={<GrMoney />} />
            <Input
              type="text"
              placeholder="Value"
              value={roundNumbers(withdrawValue)}
              onChange={(e) => handleStakeValueChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Flex gridRowStart={4} justify="center">
          <CustomSlider sliderValue={stakeValuePercentage} setSliderValue={handleStakeValuePercentageChange} />
        </Flex>
        <Flex gridRowStart={6} justify="center">
          <Button width={200} onClick={handleApproval} disabled={approved}>
            Approve
          </Button>
          <Button width={200} onClick={handleWithdraw} disabled={!approved}>
            WithDraw
          </Button>
        </Flex>
      </StakeModalBody>
    </StakeModalContainer>
  );
};
