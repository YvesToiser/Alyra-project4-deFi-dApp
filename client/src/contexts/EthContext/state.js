const actions = {
  init: "INIT",
  setUser: "SET_USER",
  resetUser: "RESET_USER",
  setNetwork: "SET_NETWORK"
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contractTokenManager: null,
  contractToken: null,
  network: null,
  user: {
    address: null,
    balance: null
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
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
