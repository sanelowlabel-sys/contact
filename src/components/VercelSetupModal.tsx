import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Server,
  Database,
  Radio,
  Mail,
  ShieldCheck,
  ExternalLink,
  Terminal,
  Zap,
} from 'lucide-react';

interface VercelSetupModalProps {
  onClose: () => void;
}

export const VercelSetupModal: React.FC<VercelSetupModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'env' | 'architecture' | 'database' | 'deploy'>('env');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `# ==============================================================================
# SANELOW MUSIC GROUP SUPPORT - PRODUCTION VERCEL ENVIRONMENT CONFIGURATION
# ==============================================================================

# 1. APPLICATION & AUTHENTICATION (NextAuth.js v5 / Auth.js / Supabase Auth)
NEXT_PUBLIC_APP_URL="https://support.sanelowmusic.com"
AUTH_SECRET="gen_random_32_character_secret_key_here"
NEXTAUTH_URL="https://support.sanelowmusic.com"

# 2. DATABASE (PostgreSQL / Supabase / Neon / Prisma ORM)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 3. REAL-TIME ENGINE (Pusher Channels OR Supabase Realtime)
# Note: Zero stateful in-memory node processes to guarantee 100% Vercel Serverless compatibility.
NEXT_PUBLIC_PUSHER_KEY="YOUR_PUSHER_KEY"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
PUSHER_APP_ID="YOUR_PUSHER_APP_ID"
PUSHER_SECRET="YOUR_PUSHER_SECRET"

# Optional: Supabase Realtime & Auth Alternative
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. EMAIL DISPATCH (Resend OR SendGrid)
# Automated alerts for ticket receipt, replies, and status resolutions.
RESEND_API_KEY="re_123456789_abcdefg"
RESEND_FROM_EMAIL="Sanelow Support <support@sanelowmusic.com>"

# Optional SendGrid Fallback:
SENDGRID_API_KEY=""

# 5. STORAGE BUCKET (S3 / Supabase Storage / Uploadthing for merch damage photo proof)
ATTACHMENTS_BUCKET_NAME="sanelow-ticket-proofs"
`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl rounded-xs overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-black text-white">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-red-600 rounded text-white">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                Vercel Production & Serverless Architecture Guide
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                100% Stateless Edge & Serverless Execution Specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1 font-mono font-medium rounded-xs cursor-pointer transition-colors ${
              activeTab === 'env'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            1. Environment Variables (.env)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1 font-mono font-medium rounded-xs cursor-pointer transition-colors ${
              activeTab === 'architecture'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            2. Serverless Real-Time (No WebSockets)
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1 font-mono font-medium rounded-xs cursor-pointer transition-colors ${
              activeTab === 'database'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            3. Database & Drizzle/Prisma
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1 font-mono font-medium rounded-xs cursor-pointer transition-colors ${
              activeTab === 'deploy'
                ? 'bg-neutral-900 text-white font-bold'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            4. Vercel CLI & Deployment
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-neutral-800 text-sm">
          {activeTab === 'env' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-black">Vercel Environment Variables Specification</h3>
                  <p className="text-xs text-neutral-500">
                    Add these variables under your Project Settings &rarr; Environment Variables in Vercel.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(envSample, 'env')}
                  className="px-3 py-1.5 border border-neutral-300 hover:border-black bg-white text-xs font-mono font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'env' ? 'Copied to Clipboard' : 'Copy .env.example'}</span>
                </button>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-4 font-mono text-xs overflow-x-auto rounded border border-neutral-800 leading-relaxed">
                <pre>{envSample}</pre>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-black">Serverless-Compatible Real-Time Strategy</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Why traditional <code className="bg-neutral-100 px-1 py-0.5 font-mono text-red-600">ws://</code> servers fail on Vercel and how our architecture prevents disconnection:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-red-200 bg-red-50/40 rounded">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase font-mono mb-2">
                    <X className="w-4 h-4" /> The Vercel Serverless Trap
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    Vercel functions are stateless and freeze execution between HTTP requests. Standalone Node.js processes like <code className="font-mono text-[11px] bg-red-100 px-1">new WebSocketServer()</code> cannot maintain client connections when lambda instances scale down to zero.
                  </p>
                </div>

                <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase font-mono mb-2">
                    <Check className="w-4 h-4" /> The Sanelow Production Solution
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    We decouple connection handling to managed cloud brokers (<strong>Pusher Channels</strong> or <strong>Supabase Realtime</strong>). When an agent replies or changes ticket status, the serverless endpoint fires an authenticated HTTP webhook trigger to the broker, which fans out to all live client browser tabs instantly without persistent server memory.
                  </p>
                </div>
              </div>

              <div className="border border-neutral-200 p-4 rounded bg-neutral-50 font-mono text-xs">
                <div className="font-bold text-black mb-1">Live Serverless API Route:</div>
                <div className="text-neutral-600 mb-2">Endpoint: <code className="text-red-600 font-bold">POST /api/realtime</code></div>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Called by serverless functions when a ticket message is submitted. Broadcasts to channel <code className="bg-white px-1 border border-neutral-200">ticket-[id]</code> with payload.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-black">PostgreSQL & Drizzle / Prisma ORM Schema</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Ready-to-deploy schema with full support for role-based permissions (`customer`, `agent`, `admin`), internal notes, and attachments.
                </p>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-4 font-mono text-xs overflow-x-auto rounded border border-neutral-800">
                <pre>{`// PostgreSQL Prisma Schema (prisma/schema.prisma)
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  CUSTOMER
  AGENT
  ADMIN
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  PENDING_USER
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String
  role          UserRole       @default(CUSTOMER)
  avatar        String?
  tickets       Ticket[]       @relation("CustomerTickets")
  assigned      Ticket[]       @relation("AgentTickets")
  messages      TicketMessage[]
  notifications Notification[]
  createdAt     DateTime       @default(now())
}

model Ticket {
  id            String         @id // e.g. "#TK-8492"
  subject       String
  description   String
  category      String
  priority      TicketPriority @default(MEDIUM)
  status        TicketStatus   @default(OPEN)
  orderNumber   String?
  customerId    String
  customer      User           @relation("CustomerTickets", fields: [customerId], references: [id])
  agentId       String?
  agent         User?          @relation("AgentTickets", fields: [agentId], references: [id])
  messages      TicketMessage[]
  attachments   Attachment[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model TicketMessage {
  id          String      @id @default(cuid())
  ticketId    String
  ticket      Ticket      @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  senderId    String
  sender      User        @relation(fields: [senderId], references: [id])
  content     String
  isInternal  Boolean     @default(false)
  createdAt   DateTime    @default(now())
}`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-black">Vercel Deployment Workflow</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Deploy from your terminal or link directly to GitHub with zero build friction.
                </p>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="border border-neutral-200 p-3 rounded bg-neutral-50">
                  <div className="text-neutral-500 mb-1 font-sans font-semibold">Step 1: Install Vercel CLI</div>
                  <code className="text-red-600 bg-white px-2 py-1 rounded border border-neutral-200 block">npm i -g vercel</code>
                </div>

                <div className="border border-neutral-200 p-3 rounded bg-neutral-50">
                  <div className="text-neutral-500 mb-1 font-sans font-semibold">Step 2: Link & Push Project</div>
                  <code className="text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200 block">vercel --prod</code>
                </div>

                <div className="border border-neutral-200 p-3 rounded bg-neutral-50">
                  <div className="text-neutral-500 mb-1 font-sans font-semibold">Step 3: Push Database Schema</div>
                  <code className="text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200 block">npx prisma db push</code>
                </div>
              </div>

              <div className="p-3 bg-neutral-100 rounded text-xs text-neutral-700 leading-relaxed">
                <strong>Configured vercel.json:</strong> Includes routing for client SPA routing and direct serverless lambda bindings for <code className="font-mono bg-white px-1">/api/*</code>.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-white flex items-center justify-between text-xs">
          <span className="font-mono text-neutral-500 text-[11px]">
            Compliant with Vercel Edge & Serverless Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
