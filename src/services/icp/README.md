
# Internet Computer Backend Setup Guide

This document provides instructions for setting up and running the Internet Computer backend with this frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [dfx](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) (DFINITY Canister SDK)

## Installation Steps

1. **Install dfx (DFINITY Canister SDK)**
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
   Verify installation:
   ```bash
   dfx --version
   ```

2. **Navigate to the ICP backend directory**
   ```bash
   cd src/services/icp/backend
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --clean --background
   ```

4. **Deploy the canister to the local replica**
   ```bash
   dfx deploy
   ```
   This will build and deploy your canister to the local replica.

5. **Note the canister ID**
   After deployment, note the canister ID printed in the terminal. You'll need to update the frontend configuration with this ID.

## Connecting Frontend to Backend

1. **Update canister ID in frontend config**
   Edit `src/services/icp/config.ts` and replace the `testsCanister` ID with the one from your deployment.

2. **Connect to ICP via UI**
   Use the provided "Connect to ICP" button in the UI to authenticate with Internet Identity.

## Troubleshooting

- **Connection issues:** Ensure the local replica is running with `dfx ping`
- **Build errors:** Check Rust dependencies and ensure Cargo.toml is properly configured
- **Authentication problems:** The local replica uses a different Identity Provider than production

## Deployment to Production

To deploy to the IC mainnet:

1. **Get cycles** 
   You'll need cycles to deploy to mainnet. Get them from the Cycles Faucet or by converting ICP.

2. **Deploy to mainnet**
   ```bash
   dfx deploy --network ic
   ```

3. **Update frontend config**
   Update `src/services/icp/config.ts` to use the mainnet canister ID and network.
