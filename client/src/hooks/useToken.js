import { useEffect, useCallback } from 'react'
import useEth from 'hooks/useEth'
import { ApiGetBalance } from 'api/token'
import Big from 'big.js'

const useToken = (tokenName) => {
  // userBalance should be lgobal, use context
  const { state, dispatch } = useEth()
  const { user, contracts } = state
  const contractToken = contracts[tokenName]

  const balance = user && user.balance && user.balance[tokenName]
  const contractTokenAdress = contractToken && contractToken._address

  const getBalance = useCallback(async () => {
    console.log('GetBalance function')
    try {
      const balance = await ApiGetBalance(contractToken, user.address)
      //TODO: Make global function
      const newBalance = new Big(balance)
      const data = {
        [tokenName]: newBalance,
      }
      dispatch({ type: 'SET_USER_BALANCE', data })
    } catch (error) {
      console.error(error)
    }
  }, [contractToken, dispatch, tokenName, user.address])

  return { getBalance, balance }
}

export default useToken
