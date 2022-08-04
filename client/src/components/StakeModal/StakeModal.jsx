import styled from "@emotion/styled";
import { Text } from "@chakra-ui/react";
import { GrMoney } from "react-icons/gr";
import { GiTwoCoins } from "react-icons/gi";
import { useState } from "react";
import useChakraColor from "hooks/useChakraColor";
import useTokenManager from "../../hooks/useTokenManager";
import { truncNumbers } from "helpers/calculation";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip
} from "@chakra-ui/react";

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

const CustomSlider = ({ sliderValue, setSliderValue }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const labelStyles = {
    mt: "10",
    ml: "-2.5",
    fontSize: "md"
  };

  return (
    <Slider
      aria-label="slider-ex-1"
      defaultValue={sliderValue}
      value={sliderValue}
      focusThumbOnChange={false}
      width={"80%"}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseEnter={() => setShowTooltip(true)}
      onChange={(val) => setSliderValue(val)}
    >
      <SliderMark value={0} {...labelStyles}>
        0%
      </SliderMark>
      <SliderMark value={25} {...labelStyles}>
        25%
      </SliderMark>
      <SliderMark value={50} {...labelStyles}>
        50%
      </SliderMark>
      <SliderMark value={75} {...labelStyles}>
        75%
      </SliderMark>
      <SliderMark value={100} {...labelStyles}>
        100%
      </SliderMark>

      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={`${sliderValue}%`}>
        <SliderThumb boxSize={6}>
          <Box color="tomato" as={GiTwoCoins} />
        </SliderThumb>
      </Tooltip>
    </Slider>
  );
};

export const StakeModal = ({ total, getBalance, token }) => {
  const { getColor, theme } = useChakraColor();
  const { stake, getUserTotalStake } = useTokenManager(token.toLowerCase());

  const [stakeValuePercentage, setStakeValuePercentage] = useState(0);
  const [stakeValue, setStakeValue] = useState(0);
  const bgColor = getColor("chakra-body-bg");
  const curency = "byx";

  const handleStakeValueChange = (val) => {
    setStakeValuePercentage((parseFloat(val) * 100) / total);
    setStakeValue(val);
  };

  const handleStakeValuePercentageChange = (val) => {
    setStakeValuePercentage(val);
    setStakeValue((total * val) / 100);
  };

  const handleStake = async () => {
    await stake(stakeValue, curency);
    await getBalance();
  };

  // const bodyTextColor = getColor(theme, colorMode, "chakra-body-text");
  // const borderColor = getColor(theme, colorMode, "chakra-border-color");
  // const PlaceholderColor = getColor(theme, colorMode, "chakra-placeholder-color");
  const truncTotal = truncNumbers(total);

  return (
    <StakeModalContainer bgColor={bgColor}>
      <StakeModalHeader backgroundColor={theme.colors.teal[500]}>
        <Text fontSize={24} color="white">
          Stake
        </Text>
      </StakeModalHeader>

      <StakeModalBody>
        <Flex gridRowStart={1}>
          <Text fontSize={24} color="white">
            My balance : {truncTotal} {curency}
          </Text>
        </Flex>
        <Flex gridRowStart={2} justify="center" align="center">
          <InputGroup width={"30%"}>
            <InputLeftAddon children={<GrMoney />} />
            <Input
              type="text"
              placeholder="Value"
              value={truncNumbers(stakeValue)}
              onChange={(e) => handleStakeValueChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Flex gridRowStart={4} justify="center">
          <CustomSlider sliderValue={stakeValuePercentage} setSliderValue={handleStakeValuePercentageChange} />
        </Flex>
        <Flex gridRowStart={6} justify="center">
          <Button width={200} onClick={handleStake}>
            Stake
          </Button>
          <Button width={200} onClick={getUserTotalStake}>
            GetLog
          </Button>
        </Flex>
      </StakeModalBody>
    </StakeModalContainer>
  );
};

export const WithdrawModal = ({ tokenBalance, sTokenBalance, getBalance, token }) => {
  const { getColor, theme } = useChakraColor();
  const { withdraw } = useTokenManager(token.toLowerCase());

  const [stakeValuePercentage, setStakeValuePercentage] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const bgColor = getColor("chakra-body-bg");
  const curency = "byx";

  const handleStakeValueChange = (val) => {
    setStakeValuePercentage((parseFloat(val) * 100) / sTokenBalance);
    setWithdrawValue(val);
  };

  const handleStakeValuePercentageChange = (val) => {
    setStakeValuePercentage(val);
    setWithdrawValue((sTokenBalance * val) / 100);
  };

  const handleWithdraw = async () => {
    await withdraw(withdrawValue, curency);
  };

  // const bodyTextColor = getColor(theme, colorMode, "chakra-body-text");
  // const borderColor = getColor(theme, colorMode, "chakra-border-color");
  // const PlaceholderColor = getColor(theme, colorMode, "chakra-placeholder-color");
  const truncTotal = truncNumbers(sTokenBalance);

  return (
    <StakeModalContainer bgColor={bgColor}>
      <StakeModalHeader backgroundColor={theme.colors.teal[500]}>
        <Text fontSize={24} color="white">
          WithDraw
        </Text>
      </StakeModalHeader>

      <StakeModalBody>
        <Flex gridRowStart={1}>
          <Text fontSize={24} color="white">
            Value max to withdraw : {truncTotal} s{curency}
          </Text>
        </Flex>
        <Flex gridRowStart={2} justify="center" align="center">
          <InputGroup width={"30%"}>
            <InputLeftAddon children={<GrMoney />} />
            <Input
              type="text"
              placeholder="Value"
              value={truncNumbers(withdrawValue)}
              onChange={(e) => handleStakeValueChange(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Flex gridRowStart={4} justify="center">
          <CustomSlider sliderValue={stakeValuePercentage} setSliderValue={handleStakeValuePercentageChange} />
        </Flex>
        <Flex gridRowStart={6} justify="center">
          <Button width={200} onClick={handleWithdraw}>
            WithDraw
          </Button>
        </Flex>
      </StakeModalBody>
    </StakeModalContainer>
  );
};
