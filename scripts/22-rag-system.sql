CREATE SCHEMA IF NOT EXISTS rag;

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents uploaded for RAG
CREATE TABLE rag.docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime TEXT,
  tokens INT DEFAULT 0,
  status TEXT CHECK (status IN ('ready', 'processing', 'error')) DEFAULT 'ready',
  uploaded_by UUID REFERENCES core.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chunks with embeddings
CREATE TABLE rag.chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  doc_id UUID NOT NULL REFERENCES rag.docs(id) ON DELETE CASCADE,
  chunk_no INT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 dimension
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(doc_id, chunk_no)
);

-- Chat threads
CREATE TABLE rag.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  started_by UUID REFERENCES core.users(id),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages in threads
CREATE TABLE rag.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES rag.threads(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system', 'tool')) NOT NULL,
  content TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  tokens INT DEFAULT 0,
  cost NUMERIC(12,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_rag_docs_tenant ON rag.docs(tenant_id, created_at DESC);
CREATE INDEX idx_rag_chunks_doc ON rag.chunks(doc_id, chunk_no);
CREATE INDEX idx_rag_chunks_embedding ON rag.chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_rag_threads_tenant ON rag.threads(tenant_id, created_at DESC);
CREATE INDEX idx_rag_messages_thread ON rag.messages(thread_id, created_at);

-- RLS Policies
ALTER TABLE rag.docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY rag_docs_tenant ON rag.docs FOR ALL USING (tenant_id = sec.current_tenant_id());
CREATE POLICY rag_chunks_tenant ON rag.chunks FOR ALL USING (tenant_id = sec.current_tenant_id());
CREATE POLICY rag_threads_tenant ON rag.threads FOR ALL USING (tenant_id = sec.current_tenant_id());
CREATE POLICY rag_messages_tenant ON rag.messages FOR ALL USING (tenant_id = sec.current_tenant_id());

-- Helper function for vector similarity search
CREATE OR REPLACE FUNCTION rag.search_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 6
)
RETURNS TABLE (
  id uuid,
  doc_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.doc_id,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  FROM rag.chunks c
  WHERE c.tenant_id = sec.current_tenant_id()
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
