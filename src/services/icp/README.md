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
   After deployment, note the canister ID printed in the terminal (e.g., `bw4dl-smaaa-aaaaa-qaacq-cai`). You'll need to update the frontend configuration with this ID.

## Internet Identity Setup

To get Internet Identity working:

1. **For local development:**
   The Internet Identity canister is automatically deployed when you run `dfx start --clean`.
   The local Internet Identity URL is typically: `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`

2. **Using Internet Identity:**
   - Click the "Connect to ICP" button in the UI
   - You'll be redirected to the Internet Identity service
   - For local development, you can create a new identity by following the prompts
   - After authentication, you'll be redirected back to your application

## Connecting Frontend to Backend

1. **Update canister ID in frontend config**
   Edit `src/services/icp/config.ts` and replace the `testsCanister` ID with the one from your deployment:
   ```typescript
   export const DEFAULT_CANISTER_IDS = {
     // ...other canisters
     testsCanister: "bw4dl-smaaa-aaaaa-qaacq-cai", // Use your deployed canister ID
   };
   ```

2. **Connect to ICP via UI**
   Use the provided "Connect to ICP" button in the UI to authenticate with Internet Identity.

## Troubleshooting

- **Connection issues:** Ensure the local replica is running with `dfx ping`
- **Build errors:** Check Rust dependencies and ensure Cargo.toml is properly configured
- **Authentication problems:** 
  - For local development, make sure your Internet Identity canister is running
  - Try clearing browser cache and cookies if you experience authentication issues
  - Check browser console for detailed error messages

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
