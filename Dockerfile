FROM node:22-slim AS base
WORKDIR /app

# Install Rust for building the host binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl build-essential pkg-config \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy source
COPY . .

# Build Rust host binary
RUN cargo build --manifest-path crates/ardyn-host/Cargo.toml --release --bin session

# Build console
WORKDIR /app/apps/console
RUN npm install && npm run build

# Production stage
FROM node:22-slim AS production
WORKDIR /app

COPY --from=base /app /app
COPY --from=base /app/target/release/session /app/target/release/session

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/apps/console
CMD ["npm", "start"]