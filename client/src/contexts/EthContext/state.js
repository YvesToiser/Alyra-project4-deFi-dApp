const actions = {
  init: "INIT",
  setUser: "SET_USER",
  resetUser: "RESET_USER",
  setNetwork: "SET_NETWORK",
  setUserBalance: "SET_USER_BALANCE",
  setUserBalanceStaked: "SET_USER_BALANCE_STAKED"
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contracts: {
    manager: null,
    byx: null,
    sbyx: null
  },
  contractSToken: null,
  network: null,
  user: {
    address: null,
    balance: null,
    balanceStaked: null
  }
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.setUser:
      return { ...state, user: { address: data.address, balance: data.balance } };
    case actions.resetUser:
      return { ...state, user: { address: null, balance: null } };
    case actions.setNetwork:
      return { ...state, network: data };
    case actions.setUserBalance:
      return { ...state, user: { ...state.user, balance: { ...state.user.balance, ...data } } };
    case actions.setUserBalanceStaked:
      return { ...state, user: { ...state.user, balanceStaked: { ...state.user.balanceStaked, ...data } } };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
