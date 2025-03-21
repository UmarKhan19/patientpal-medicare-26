
// ICP network configuration
export const ICP_NETWORK = {
  local: "http://localhost:4943",
  ic: "https://ic0.app"
};

// Default canister IDs - these would be replaced with your actual deployed canisters
export const DEFAULT_CANISTER_IDS = {
  patientsCanister: "rrkah-fqaaa-aaaaa-aaaaq-cai", // Example canister ID
  doctorsCanister: "ryjl3-tyaaa-aaaaa-aaaba-cai",  // Example canister ID
  prescriptionsCanister: "r7inp-6aaaa-aaaaa-aaabq-cai", // Example canister ID
  testsCanister: "renrk-eyaaa-aaaaa-aaada-cai", // Example canister ID
};

// Configuration for the ICP actors
export const ICP_CONFIG = {
  network: process.env.NODE_ENV === "production" ? ICP_NETWORK.ic : ICP_NETWORK.local,
  canisterIds: DEFAULT_CANISTER_IDS,
};
