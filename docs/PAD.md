# 🏗️ Project Architecture Document (PAD)

**Project:** 313 Connect  
**Version:** 0.1  
**Date:** October 2025  
**Maintainer:** John Gulbronson — Detroit Commons / Barefoot Devs

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Data Architecture](#4-data-architecture)
5. [API Design](#5-api-design)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Identity Architecture](#7-identity-architecture)
8. [Network Architecture](#8-network-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Performance & Scalability](#10-performance--scalability)
11. [Development Workflow](#11-development-workflow)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Future Architecture](#14-future-architecture)

---

## 1. Architecture Overview

### 1.1 System Philosophy

313 Connect is built on a **local-first, progressive decentralization architecture** that enables:
- **Community-rooted identity** - Numeric IDs tied to Detroit's 313 area code
- **Privacy by design** - User data stays local, peer verification over centralized auth
- **Real-world verification** - Physical presence and peer connections matter
- **Progressive enhancement** - Start simple, layer in complexity
- **Hyperlocal networking** - Regional communities and proximity-based discovery

### 1.2 Architecture Patterns

- **Local-First Architecture** - Data lives on device, syncs when connected
- **Peer-to-Peer Communication** - Direct connections between verified users
- **Progressive Web App (PWA)** - Web app that works offline
- **Mobile-Native Companion** - React Native app for BLE and geolocation
- **Edge-First API** - Low-latency serverless endpoints
- **Event Sourcing** - Track identity and verification events

### 1.3 Design Principles

1. **Identity Simplicity** - A number is easier than a username
2. **Verification Trust** - Real people, real connections
3. **Privacy Default** - Minimal data collection, maximum control
4. **Regional Roots** - Identity tied to physical place
5. **Offline Resilient** - Core features work without internet

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 15 | React framework with SSR/SSG |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Styled Components | CSS-in-JS with theming |
| **State Management** | React Hooks + Context | Local state management |
| **Forms** | React Hook Form | Form validation and handling |
| **PWA** | next-pwa (Planned) | Offline support and installability |

### 2.2 Mobile Stack (Planned)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | React Native (Expo) | Cross-platform mobile app |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Styled Components | Consistent with web |
| **Bluetooth** | react-native-ble-plx | BLE device discovery |
| **Location** | expo-location | Geolocation services |
| **Storage** | AsyncStorage + SQLite | Local-first data storage |

### 2.3 Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **API Routes** | Next.js API Routes | Serverless API endpoints |
| **Database** | Supabase / Turso | PostgreSQL or distributed SQLite |
| **Identity** | Custom DID Registry | Decentralized identifier management |
| **P2P Network** | Nostr Protocol (TBD) | Peer-to-peer messaging |
| **Authentication** | Ed25519 Keypairs | Cryptographic identity |

### 2.4 Identity & Networking Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **DID Method** | Custom (did:313) | Detroit-specific DID namespace |
| **Cryptography** | Ed25519 | Public/private key pairs |
| **P2P Protocol** | Nostr / Atproto (TBD) | Decentralized messaging |
| **Discovery** | BLE Beacons | Proximity-based user discovery |
| **Verification** | Peer Graph | Web of trust connections |

### 2.5 Development Tools

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Version Control** | Git + GitHub | Source control |
| **Package Manager** | Yarn | Dependency management |
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier (Planned) | Code formatting |
| **Testing** | Jest + Playwright (Planned) | Unit and E2E testing |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web PWA    │  │  Mobile App  │  │   Browser    │      │
│  │  (Next.js)   │  │   (Expo)     │  │    Only      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Local Storage Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  IndexedDB   │  │    SQLite    │  │  Keypairs    │      │
│  │   (Web)      │  │   (Mobile)   │  │  (Secure)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Edge API Layer (Vercel)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │ API Routes   │  │  Middleware  │      │
│  │     Page     │  │ (Serverless) │  │    (Auth)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     DID      │  │     P2P      │  │  Verification│      │
│  │   Registry   │  │   Relay      │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Supabase   │  │     Turso    │  │   Node DB    │      │
│  │  (Postgres)  │  │   (SQLite)   │  │  (Planned)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              P2P Network Layer (Future)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Nostr     │  │   Atproto    │  │     BLE      │      │
│  │   Relays     │  │     PDSs     │  │   Mesh Net   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Request Flow

#### Landing Page - Check Availability
```
User → Dial Number → API Request → DB Check → Available/Taken Response
```

#### Identity Claim Flow (MVP)
```
User → Choose Number → Generate Keypair → Store Locally → Register DID
         ↓                                                      ↓
   Check Available                                       Save to Registry
```

#### Peer Verification Flow (Future)
```
User A → Scan QR / BLE → User B → Mutual Verification → Update Graph
                            ↓
                     Both Sign Event
                            ↓
                      Broadcast to P2P
```

#### Discovery Flow (Future)
```
Mobile App → BLE Scan → Detect Nearby 313 Users → Show Profile Cards
                 ↓
          Filter by Region
                 ↓
       Optional Connect Request
```

### 3.3 Component Diagram

```
┌─────────────────────────────────────────────────┐
│              Frontend Components                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Pages   │  │Components│  │   Lib    │      │
│  │          │  │          │  │          │      │
│  │ - Landing│  │ - DialPad│  │ - DID    │      │
│  │ - Claim  │  │ - IDCard │  │ - Crypto │      │
│  │ - Profile│  │ - Map    │  │ - API    │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            Identity Services Layer               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   DID    │  │  Verify  │  │  Region  │      │
│  │ Registry │  │ Service  │  │ Service  │      │
│  │          │  │          │  │          │      │
│  │ - Claim  │  │ - Peer   │  │ - Zones  │      │
│  │ - Lookup │  │ - Graph  │  │ - Hubs   │      │
│  │ - Update │  │ - Trust  │  │ - Events │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            Network Services Layer                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   P2P    │  │   BLE    │  │  Events  │      │
│  │  Relay   │  │Discovery │  │ Service  │      │
│  │          │  │          │  │          │      │
│  │ - Msgs   │  │ - Scan   │  │ - RSVP   │      │
│  │ - Sync   │  │ - Beacon │  │ - Checkin│      │
│  │ - Calls  │  │ - Connect│  │ - POAP   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

---

## 4. Data Architecture

### 4.1 Database Schema (MVP)

#### Connect IDs (DID Registry)
```typescript
interface ConnectID {
  id: number;              // Primary key
  number: string;          // 313 + digits (e.g., "313562")
  didString: string;       // did:313:313562
  publicKey: string;       // Ed25519 public key
  createdAt: timestamp;
  claimedAt: timestamp | null;
  status: 'reserved' | 'claimed' | 'verified';
}
```

#### User Profiles
```typescript
interface Profile {
  id: number;
  connectId: string;       // Foreign key to ConnectID.number
  displayName: string | null;
  bio: string | null;
  profileImage: string | null;
  region: string | null;   // 'Midtown', 'Hamtramck', etc.
  createdAt: timestamp;
  updatedAt: timestamp;
  verifiedAt: timestamp | null;
}
```

#### Verification Graph (Peer Connections)
```typescript
interface Verification {
  id: number;
  verifierConnectId: string;  // Who verified
  verifiedConnectId: string;  // Who was verified
  method: string;             // 'peer' | 'wifi' | 'event'
  location: text | null;      // JSON: {lat, lng, accuracy}
  metadata: text | null;      // JSON: additional proof
  verifiedAt: timestamp;
  expiresAt: timestamp | null;
}
```

#### Regional Zones
```typescript
interface Region {
  id: number;
  name: string;              // 'Midtown', 'Hamtramck', etc.
  code: string;              // 'M', 'H', etc.
  description: text | null;
  boundary: text | null;     // GeoJSON polygon
  hubLocations: text | null; // JSON array of hub addresses
  createdAt: timestamp;
}
```

#### Events
```typescript
interface Event {
  id: number;
  title: string;
  description: text;
  organizerId: string;       // ConnectID
  regionId: number | null;
  location: text | null;     // JSON: {address, lat, lng}
  startTime: timestamp;
  endTime: timestamp;
  capacity: number | null;
  imageUrl: string | null;
  status: string;            // 'draft' | 'published' | 'active' | 'completed'
  checkInEnabled: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### Check-ins
```typescript
interface CheckIn {
  id: number;
  eventId: number;
  connectId: string;
  checkInTime: timestamp;
  method: string;            // 'qr' | 'nfc' | 'bluetooth' | 'manual'
  location: text | null;     // JSON: {lat, lng}
  proofData: text | null;    // JSON: signature, witnesses, etc.
  verified: boolean;
  createdAt: timestamp;
}
```

### 4.2 Local Storage Schema (Client-Side)

#### IndexedDB (Web) / SQLite (Mobile)

```typescript
// Keypair Storage (Encrypted)
interface Keypair {
  connectId: string;
  publicKey: string;
  encryptedPrivateKey: string;  // Encrypted with user passphrase
  algorithm: 'ed25519';
  createdAt: timestamp;
}

// Cached DIDs
interface CachedDID {
  connectId: string;
  didDocument: text;            // JSON DID document
  lastSynced: timestamp;
}

// Cached Profiles
interface CachedProfile {
  connectId: string;
  profile: text;                // JSON profile data
  lastSynced: timestamp;
}

// Pending Messages (Offline Queue)
interface PendingMessage {
  id: string;
  toConnectId: string;
  message: text;
  signature: string;
  createdAt: timestamp;
  attempts: number;
}
```

### 4.3 DID Document Structure

```json
{
  "id": "did:313:313562",
  "verificationMethod": [{
    "id": "did:313:313562#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:313:313562",
    "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
  }],
  "authentication": ["did:313:313562#key-1"],
  "service": [{
    "id": "did:313:313562#profile",
    "type": "Profile",
    "serviceEndpoint": "https://313connect.app/profile/313562"
  }, {
    "id": "did:313:313562#region",
    "type": "Region",
    "serviceEndpoint": "Midtown"
  }],
  "created": "2025-10-16T00:00:00Z",
  "updated": "2025-10-16T00:00:00Z"
}
```

### 4.4 Data Flow Patterns

#### Identity Claim Flow
```
1. User chooses number
2. Check availability (API call)
3. Generate Ed25519 keypair (client-side)
4. Create DID document
5. Encrypt and store private key locally
6. Register public key + DID in registry (API call)
7. Status: 'claimed' (awaiting verification)
```

#### Verification Flow
```
1. User A meets User B in person
2. Both scan QR codes or exchange via BLE
3. Each signs a verification message
4. Submit mutual verification to API
5. Update peer graph
6. After 2+ verifications, status → 'verified'
```

---

## 5. API Design

### 5.1 API Structure

```
/api
├── /check-availability
│   └── POST    - Check if number is available
├── /connect-ids
│   ├── POST    - Claim a new 313 number
│   ├── GET     - Lookup DID by number
│   └── /[id]
│       ├── GET    - Get DID document
│       └── PUT    - Update DID (authenticated)
├── /profiles
│   ├── GET     - List profiles (public)
│   ├── POST    - Create profile
│   └── /[id]
│       ├── GET    - Get profile
│       └── PUT    - Update profile (authenticated)
├── /verifications
│   ├── POST    - Submit verification
│   ├── GET     - Get verification graph
│   └── /status
│       └── GET - Check verification status
├── /regions
│   ├── GET     - List regions
│   └── /[id]
│       ├── GET - Get region details
│       └── /members
│           └── GET - List members in region
├── /events
│   ├── GET     - List events
│   ├── POST    - Create event
│   └── /[id]
│       ├── GET    - Get event
│       ├── PUT    - Update event
│       └── /checkin
│           └── POST - Check in to event
└── /discovery
    └── GET     - Find nearby users (authenticated)
```

### 5.2 API Response Format

#### Success Response
```typescript
{
  success: true,
  data: T,
  meta?: {
    timestamp?: string,
    cached?: boolean
  }
}
```

#### Error Response
```typescript
{
  success: false,
  error: {
    code: string,      // 'UNAVAILABLE', 'UNAUTHORIZED', etc.
    message: string,
    details?: object
  }
}
```

### 5.3 Key API Endpoints

#### POST /api/check-availability
```typescript
// Request
{
  number: string  // e.g., "562" (without 313 prefix)
}

// Response
{
  success: true,
  data: {
    available: boolean,
    message: string,
    number: string  // Full number: "313562"
  }
}
```

#### POST /api/connect-ids
```typescript
// Request
{
  number: string,        // e.g., "313562"
  publicKey: string,     // Ed25519 public key
  didDocument: object    // Full DID document
}

// Response
{
  success: true,
  data: {
    connectId: string,
    didString: string,
    status: 'claimed'
  }
}
```

#### POST /api/verifications
```typescript
// Request
{
  verifierConnectId: string,
  verifiedConnectId: string,
  signature: string,         // Signed by verifier
  location?: {
    lat: number,
    lng: number
  },
  method: 'peer' | 'wifi' | 'event'
}

// Response
{
  success: true,
  data: {
    verificationId: number,
    verified: boolean,
    verificationCount: number  // Total verifications for user
  }
}
```

### 5.4 Authentication

**Signature-based Authentication**
```
1. User has Ed25519 keypair
2. Sign request payload with private key
3. Include signature in header: X-313-Signature
4. Include ConnectID in header: X-313-ID
5. Server verifies signature against public key from DID registry
```

**Header Format**
```
X-313-ID: 313562
X-313-Signature: base64(signature)
X-313-Timestamp: unix_timestamp
```

---

## 6. Authentication & Authorization

### 6.1 Identity Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │────────▶│ Generate │────────▶│   API    │
│          │◀────────│ Signature│◀────────│  Route   │
└──────────┘         └──────────┘         └──────────┘
     │                     │                     │
     │ 1. Request          │                     │
     │─────────────────▶  │                     │
     │                     │                     │
     │ 2. Sign with Private Key                 │
     │◀─────────────────  │                     │
     │                     │                     │
     │ 3. Send Request + Signature + ConnectID  │
     │─────────────────────────────────────────▶│
     │                     │                     │
     │                     │ 4. Lookup Public Key│
     │                     │◀────────────────────│
     │                     │                     │
     │                     │ 5. Verify Signature │
     │                     │─────────────────────▶
     │                     │                     │
     │ 6. Response         │                     │
     │◀─────────────────────────────────────────│
```

### 6.2 Authorization Levels

| Status | Permissions |
|--------|-------------|
| **Anonymous** | View landing page, check availability |
| **Claimed** | Own a number, create profile |
| **Verified** | Connect with others, join events, message |
| **Regional Admin** | Manage region events and hubs |
| **System Admin** | Manage DID registry, moderation |

### 6.3 Verification Requirements

**Minimum Verification** (to unlock features):
- 2 peer verifications from already-verified users
- OR 1 in-person verification at a community hub
- OR 1 event check-in at official 313Connect event

---

## 7. Identity Architecture

### 7.1 DID (Decentralized Identifier) Design

**313 DID Method Specification**

```
DID Format: did:313:{number}
Examples:
  - did:313:313562
  - did:313:3131
  - did:313:313090
```

**DID Resolution**
```
GET /api/connect-ids/313562
→ Returns DID Document

{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:313:313562",
  "verificationMethod": [...],
  "authentication": [...],
  "service": [...]
}
```

### 7.2 Key Management

**Client-Side Key Generation**
```typescript
import { generateKeyPair } from 'crypto';

// Generate Ed25519 keypair
const { publicKey, privateKey } = await generateKeyPair('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Encrypt private key with user passphrase
const encrypted = await encryptPrivateKey(privateKey, userPassphrase);

// Store in IndexedDB/SQLite
await storeKeypair(connectId, publicKey, encrypted);
```

**Key Recovery Options**
1. **Passphrase Recovery** - User remembers passphrase
2. **Backup Export** - Encrypted backup file
3. **Social Recovery** - Split key among trusted peers (future)

### 7.3 Regional Sub-IDs

**Format:** `{connectId}@{region}`

Examples:
- `313562@Midtown`
- `3131@Hamtramck`
- `313090@Corktown`

**Implementation**
```typescript
interface RegionalID {
  baseId: string;      // "313562"
  region: string;      // "Midtown"
  fullId: string;      // "313562@Midtown"
  joinedAt: timestamp;
}
```

---

## 8. Network Architecture

### 8.1 P2P Communication Design (Future)

**Protocol Options**

| Protocol | Pros | Cons | Status |
|----------|------|------|--------|
| **Nostr** | Simple, censorship-resistant | Relay dependency | Evaluating |
| **Atproto** | Mature, portable identity | Complex | Evaluating |
| **Custom** | Full control | Maintenance burden | Fallback |

**Selected: Nostr (Tentative)**

### 8.2 Nostr Integration Architecture

```
┌────────────────────────────────────────────┐
│           313Connect Client                 │
│  ┌─────────────┐     ┌─────────────┐      │
│  │   Nostr     │────▶│   Relay     │      │
│  │   Client    │◀────│  Manager    │      │
│  └─────────────┘     └─────────────┘      │
└────────────────────────────────────────────┘
                ▼
┌────────────────────────────────────────────┐
│           Nostr Relay Network               │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │Relay1│  │Relay2│  │Relay3│  │Relay4│  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
└────────────────────────────────────────────┘
```

**Event Types (Nostr)**
```typescript
// Kind 0: Profile metadata
{
  kind: 0,
  pubkey: publicKey,
  content: JSON.stringify({
    connectId: "313562",
    name: "John",
    region: "Midtown"
  })
}

// Kind 1: Text message
{
  kind: 1,
  pubkey: senderPubKey,
  content: "Hey, want to connect?",
  tags: [["p", recipientPubKey]]
}

// Kind 30078: Custom 313 verification event
{
  kind: 30078,
  pubkey: verifierPubKey,
  content: JSON.stringify({
    verifiedId: "313562",
    method: "peer",
    location: {lat: 42.3314, lng: -83.0458}
  }),
  tags: [
    ["d", "verification"],
    ["p", verifiedPubKey]
  ]
}
```

### 8.3 Bluetooth Discovery (Mobile)

**BLE Beacon Format**
```typescript
interface BLEBeacon {
  serviceUUID: '313C0000-...',  // 313Connect service
  characteristics: {
    connectId: string,           // Advertised 313 number
    region: string,              // Current region
    status: 'available' | 'busy'
  }
}
```

**Discovery Flow**
```
1. Mobile app starts BLE scanning
2. Detects nearby 313Connect beacons
3. Filters by region (optional)
4. Shows cards of nearby users
5. User can request to connect
6. If accepted, exchange Nostr pubkeys
7. Begin encrypted messaging
```

### 8.4 Wi-Fi Node Verification

**Community Hub Wi-Fi Signature**
```typescript
interface WiFiNode {
  nodeId: string;              // Unique hub ID
  ssid: string;                // Wi-Fi network name
  location: {
    address: string,
    lat: number,
    lng: number
  },
  operator: string,            // Hub operator ConnectID
  publicKey: string,           // Node's public key
  verificationEnabled: boolean
}
```

**Verification Process**
```
1. User connects to hub Wi-Fi
2. App detects known 313Connect node
3. Request signed verification token from node
4. Submit verification to API
5. Gain regional verification status
```

---

## 9. Security Architecture

### 9.1 Security Model

```
┌─────────────────────────────────────┐
│     Client-Side Encryption Layer    │
│  (User controls private keys)       │
└─────────────────────────────────────┘
                ▼
┌─────────────────────────────────────┐
│     Signature Verification Layer    │
│  (All requests cryptographically    │
│   signed and verified)              │
└─────────────────────────────────────┘
                ▼
┌─────────────────────────────────────┐
│     API Rate Limiting Layer         │
│  (Prevent spam and abuse)           │
└─────────────────────────────────────┘
                ▼
┌─────────────────────────────────────┐
│     Database Access Layer           │
│  (Parameterized queries, no direct  │
│   user input in SQL)                │
└─────────────────────────────────────┘
```

### 9.2 Threat Model

| Threat | Mitigation |
|--------|-----------|
| **Identity Theft** | Private keys never leave device, signature verification |
| **Sybil Attack** | Peer verification requirement, limited initial connections |
| **Spam/Harassment** | Rate limiting, block list, reputation system |
| **Data Breach** | Minimal server-side data, encryption at rest |
| **MITM Attack** | TLS 1.3, certificate pinning (mobile) |
| **Device Loss** | Encrypted backup, social recovery option |

### 9.3 Privacy Protections

**Data Minimization**
- No email/phone collection
- Profiles optional
- Location data approximate only
- No tracking pixels

**User Control**
- Users can be pseudonymous
- Optional regional visibility
- Control who can message
- Export/delete all data

**Encryption**
- Private keys encrypted at rest
- Messages encrypted E2E (via Nostr NIP-04 or NIP-44)
- Backups encrypted

---

## 10. Performance & Scalability

### 10.1 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **Landing Page Load** | < 1.5s | ~1.2s |
| **Check Availability API** | < 200ms | ~150ms |
| **DID Lookup** | < 100ms | TBD |
| **BLE Discovery Time** | < 3s | TBD |
| **Message Delivery** | < 1s | TBD |

### 10.2 Scalability Plan

**Phase 1** (0-1,000 users):
- Single database instance
- Centralized DID registry
- Vercel edge functions

**Phase 2** (1,000-10,000 users):
- Database replication (read replicas)
- CDN for static assets
- Nostr relay integration

**Phase 3** (10,000+ users):
- Distributed DID registry
- Multiple Nostr relays
- Peer-to-peer mesh network
- Zero central dependencies

### 10.3 Optimization Strategies

**Frontend**
- SSG for landing page
- Service worker caching
- Lazy load images
- Code splitting per route

**Backend**
- Database indexes on connectId, region
- Cache DID documents (1 hour)
- Rate limit by IP and ConnectID
- Background jobs for verification processing

**Mobile**
- Lazy load profile images
- Local SQLite cache
- Background BLE scanning (low power mode)
- Differential sync

---

## 11. Development Workflow

### 11.1 Repository Structure

```
313-connect/
├── src/
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx       # Landing page
│   │   ├── claim.tsx       # Claim ID flow
│   │   ├── profile/
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── DialPad.tsx
│   │   ├── IDCard.tsx
│   │   └── Map.tsx
│   ├── lib/
│   │   ├── did.ts          # DID utilities
│   │   ├── crypto.ts       # Key generation
│   │   ├── api.ts          # API client
│   │   └── storage.ts      # Local storage
│   └── types/
│       └── index.ts
├── mobile/                 # React Native app (future)
│   ├── src/
│   ├── App.tsx
│   └── package.json
├── docs/
│   ├── PRD.md
│   ├── PAD.md              # This document
│   └── API.md              # API documentation
├── public/
├── package.json
└── README.md
```

### 11.2 Development Process

1. **Feature Development**
   ```bash
   git checkout -b feature/peer-verification
   yarn dev                    # Start dev server
   yarn test                   # Run tests (future)
   ```

2. **Code Review**
   - Create PR to `main`
   - Automated linting
   - Manual review
   - Merge

3. **Deployment**
   - Push to `main`
   - Vercel auto-deploys
   - Monitor for errors

---

## 12. Deployment & Infrastructure

### 12.1 Hosting

**Vercel (Web App)**
- Automatic deployments from GitHub
- Edge functions for API routes
- Global CDN
- Analytics

**Expo/EAS (Mobile App - Future)**
- Build service
- Over-the-air updates
- App Store / Play Store distribution

### 12.2 Database

**Option 1: Supabase (PostgreSQL)**
- Real-time subscriptions
- Built-in auth (optional use)
- Row-level security
- Automatic backups

**Option 2: Turso (LibSQL)**
- Edge database
- SQLite-compatible
- Lower latency
- Lower cost

**Current Choice**: Start with Supabase, evaluate Turso

### 12.3 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...      # Direct connection (migrations)

# API Keys (Future)
NOSTR_RELAY_URL=wss://...
OPENAI_API_KEY=sk-...            # If using AI features

# App Config
NEXT_PUBLIC_APP_URL=https://313connect.app
NEXT_PUBLIC_DID_REGISTRY_URL=https://...
```

---

## 13. Monitoring & Observability

### 13.1 Monitoring Stack (Planned)

| Component | Tool | Metrics |
|-----------|------|---------|
| **Web Vitals** | Vercel Analytics | LCP, FID, CLS |
| **API Metrics** | Vercel Logs | Response time, errors |
| **Error Tracking** | Sentry | Exceptions, crashes |
| **Uptime** | UptimeRobot | Availability |

### 13.2 Key Metrics

**User Metrics**
- Total 313 IDs claimed
- Verified users count
- Daily/monthly active users
- Regional distribution

**Network Metrics**
- Peer verifications per day
- Event check-ins
- Messages sent (P2P)
- BLE discoveries

**Performance Metrics**
- API response times
- Database query times
- Mobile app crash rate
- BLE connection success rate

---

## 14. Future Architecture

### 14.1 Decentralization Roadmap

**Phase 1: Centralized Registry** ✅ (Current - v0.1-0.2)
- Central API and database
- Simple DID registry
- Proof of concept

**Phase 2: Federated Network** (v0.3-0.5)
- Nostr relay integration
- P2P messaging
- Multiple DID registries
- Community hub nodes

**Phase 3: Fully Decentralized** (v1.0+)
- No central registry required
- Peer-to-peer DID resolution
- Mesh network via BLE
- DAO governance
- On-chain anchoring (optional)

### 14.2 Advanced Features

**Web of Trust Visualization**
```
User Dashboard → Graph View
├── Direct connections (1-hop)
├── Friends of friends (2-hop)
├── Regional network (all in area)
└── Trust score visualization
```

**Voice/Video Calls**
```
P2P WebRTC → Signaling via Nostr → Direct Connection
├── End-to-end encrypted
├── No central media server
└── Works offline (local network)
```

**Reputation System**
```
On-chain or P2P Event Log
├── Event attendance
├── Contributions
├── Peer vouches
└── Community participation
```

**Smart City Integration**
```
313Connect as Detroit's Identity Layer
├── Transit pass integration
├── Library card
├── Voting/governance
├── Public Wi-Fi access
└── Local business rewards
```

### 14.3 Blockchain Integration (Future)

**DID Registry Contract**
```solidity
// Store DID commitments on-chain for permanence
contract DIDRegistry313 {
  mapping(uint256 => bytes32) public didCommitments;
  
  function registerDID(uint256 number, bytes32 commitment) external;
  function verifyDID(uint256 number, bytes proof) external view returns (bool);
}
```

**Deployment**: Base Network (low fees, Ethereum security)

---

## Appendix

### A. Related Documents

- **[Product Requirements (PRD)](PRD.md)** - What we're building and why
- **[README](../README.md)** - Getting started guide
- **[API Documentation](API.md)** - Detailed API reference (Coming Soon)

### B. Glossary

- **313 Connect ID**: Unique numeric identifier in the 313 namespace (e.g., 313562)
- **DID**: Decentralized Identifier - cryptographically verifiable identity
- **BLE**: Bluetooth Low Energy - for proximity discovery
- **P2P**: Peer-to-peer - direct communication without intermediaries
- **Nostr**: Notes and Other Stuff Transmitted by Relays - simple P2P protocol
- **Ed25519**: Elliptic curve for digital signatures (fast, secure)
- **POAP**: Proof of Attendance Protocol - on-chain event verification
- **Web of Trust**: Network of peer verifications establishing reputation

### C. Architecture Decision Records (ADRs)

**ADR-001**: Use numeric IDs over usernames
- **Status**: Accepted
- **Reason**: Simpler, more memorable, phone-inspired UX, finite namespace creates scarcity/value

**ADR-002**: Choose Ed25519 over RSA
- **Status**: Accepted
- **Reason**: Smaller keys, faster signing, better mobile performance, modern standard

**ADR-003**: Local-first with server backup vs server-first
- **Status**: Accepted
- **Reason**: User controls keys, works offline, privacy by design, aligns with decentralization goals

**ADR-004**: Nostr over custom P2P protocol
- **Status**: Under Evaluation
- **Reason**: Proven protocol, existing relays, censorship-resistant, but relay dependency is a concern

**ADR-005**: Peer verification over automated checks
- **Status**: Accepted
- **Reason**: Builds real community, prevents Sybil attacks, creates trusted network

---

**Document Status:** Living Document  
**Last Updated:** October 2025  
**Next Review:** January 2026

**Feedback**: Open an issue or PR on [GitHub](https://github.com/detroitcommons/313connect)

