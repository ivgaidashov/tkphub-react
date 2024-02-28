import { atom } from "recoil";
export const modalState = atom({
  key: "modalState",
  default: true,
});

export const userState = atom({
  key: "userState",
  default: "",
});

export const deviceNewState = atom({
  key: "deviceNewState",
  default: {
    "ID" : "",
    "ASSET_NMB" : "",
    "TYPE_NMB" : "",
    "CATEGORY" : "",
    "USR" : "",
    "TITLE" : "",
    "OS" : "",
    "IP_ADDRESS" : "",
    "BRANCH" : "",
    "DEPARTMENT" : "",
    "MOTHERBOARD" : "",
    "CPU" : "",
    "RAM" : "",
    "HARD_DRIVE" : "",
    "NOTES" : "",
  },
});

export const tkpbBranches = atom({
  key: "tkpbBranches",
  default : []
})

export const dvcTypes = atom({
  key: "dvcTypes",
  default : []
})


