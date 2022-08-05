import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from '@chakra-ui/react'

import { GiTwoCoins } from 'react-icons/gi'
import { useState } from 'react'

const CustomSlider = ({ sliderValue, setSliderValue }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const labelStyles = {
    mt: '10',
    ml: '-2.5',
    fontSize: 'md',
  }

  return (
    <Slider
      aria-label="slider-ex-1"
      defaultValue={sliderValue}
      value={sliderValue}
      focusThumbOnChange={false}
      width={'80%'}
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
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${sliderValue}%`}
      >
        <SliderThumb boxSize={6}>
          <Box color="tomato" as={GiTwoCoins} />
        </SliderThumb>
      </Tooltip>
    </Slider>
  )
}

export default CustomSlider
