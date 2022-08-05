import './VaultItem.scss'
import { useState, Fragment } from 'react'
import {
  Grid,
  GridItem,
  Box,
  Avatar,
  Center,
  SimpleGrid,
  Flex,
  Text,
  Button,
  Link,
  Collapse,
} from '@chakra-ui/react'
import Modal from 'components/Modal/Modal'
import { StakeModal, WithdrawModal } from 'components/StakeModal/StakeModal'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import useToken from '../../hooks/useToken'
import useTokenManager from '../../hooks/useTokenManager'
import React from 'react'
import { tokenRound } from '../../helpers/calculation'
import { useEffect } from 'react'

const VaultInfo = ({ children, title }) => {
  return (
    <Box my={4} fontSize={14} display="flex">
      <Text>{title} </Text>
      <Text fontWeight="bold" ml={2}>
        {children}
      </Text>
    </Box>
  )
}

const VaultLink = ({ children, link }) => {
  return (
    <Link href={link} isExternal my={4} color="blue.500">
      {children} <ExternalLinkIcon mx="2px" />
    </Link>
  )
}

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  )
}

const VaultButton = ({ children, onClick }) => {
  return (
    <Button
      variant={'outline'}
      colorScheme="teal"
      size="sm"
      my={4}
      mx={'auto'}
      p={4}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

const VaultDetails = ({
  token,
  onToggleStake,
  balance,
  balanceSToken,
  contractTokenAdress,
  manager,
}) => {
  const { amountStaked } = manager

  const NETWORK_SCAN = 'etherscan.io'
  const MY_BALANCE = balance && `${tokenRound(balance)} ${token}`
  const TOTAL_LOCKED = amountStaked && `${tokenRound(amountStaked)} BYX`
  const CONTRACT_ETHERSCAN =
    contractTokenAdress &&
    `https://${NETWORK_SCAN}/address/${contractTokenAdress}`
  const REWARD_IN_CRYPTO = `27`

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={2} h="100%">
      <GridItem w="100%" colSpan={1} py={5}>
        <VaultInfo title="MyBalance:">{MY_BALANCE}</VaultInfo>
        <VaultInfo title="Total staked:">{TOTAL_LOCKED}</VaultInfo>
        <VaultLink link={CONTRACT_ETHERSCAN}>View Contract</VaultLink>
      </GridItem>

      <GridItem w="100%" colSpan={2}>
        <Flex width="100%" height="100%" justify={'center'} align="center">
          <Box
            borderWidth="1px"
            borderRadius="20"
            width="80%"
            height="80%"
            p={8}
          >
            <Text fontSize={16}>BIX Earned</Text>
            <Text fontSize={16} fontWeight="bold">
              {REWARD_IN_CRYPTO}
            </Text>
            {/* <Text fontSize={16}>{REWARD_IN_USD}</Text> */}
          </Box>
        </Flex>
      </GridItem>

      <GridItem w="100%" colSpan={1}>
        <Flex
          width="100%"
          height="100%"
          justify={'center'}
          align="center"
          p={10}
          direction={'column'}
        >
          <Fragment>
            <VaultButton onClick={() => onToggleStake('stake')}>
              Stake {token}
            </VaultButton>
            {amountStaked > 0 && (
              <VaultButton onClick={() => onToggleStake('withdraw')}>
                Withdraw {token}
              </VaultButton>
            )}
          </Fragment>
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default function VaultItem({ logo, name, apr, tvl, user }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [modalType, setModalType] = useState(null)

  const token = useToken('byx')
  const sToken = useToken('sbyx')

  const manager = useTokenManager(name.toLowerCase())

  const isAuth = !!user.address

  const onToggleDetails = () => {
    setShowDetails((_showDetails) => !_showDetails)
  }

  const onToggleStake = (type) => {
    setModalType(type)
    setIsOpen((_isOpen) => !_isOpen)
  }

  useEffect(() => {
    if (isAuth) {
      token.getBalance()
      sToken.getBalance()
    }
  }, [isAuth])

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <Modal
        isOpen={isOpen}
        onClose={onToggleStake}
        width={'50%'}
        height={'70%'}
      >
        {modalType === 'stake' ? (
          <StakeModal
            tokenBalance={token.balance}
            getBalance={token.getBalance}
            token={name}
          />
        ) : (
          <WithdrawModal
            tokenBalance={token.balance}
            sTokenBalance={sToken.balance}
            getBalance={token.getBalance}
            token={'sbyx'}
          />
        )}
      </Modal>

      <SimpleGrid columns={5} justify="center" align="center">
        <Avatar src={logo} />
        <VaultElement>{name || '?'}</VaultElement>
        <VaultElement>{apr || '?'}</VaultElement>
        <VaultElement>{tvl || '?'}</VaultElement>

        {isAuth && (
          <Button
            colorScheme="teal"
            size="md"
            onClick={onToggleDetails}
            my="auto"
          >
            Details
          </Button>
        )}
      </SimpleGrid>
      <Collapse in={showDetails} animateOpacity>
        <VaultDetails
          token={name}
          onToggleStake={onToggleStake}
          balance={token.balance}
          balanceSToken={sToken.balance}
          contractTokenAdress={token.contractTokenAdress}
          manager={manager}
        />
      </Collapse>
    </Box>
  )
}

//<Button onClick={() => setIsOpen((isOpen) => !isOpen)}>sqdqs</Button>
