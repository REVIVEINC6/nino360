-- Minimal table to support ML model performance widget (development/demo)
create table if not exists ml_models (
  id uuid primary key default gen_random_uuid(),
  model_name text unique,
  status text default 'deployed',
  accuracy numeric,
  mae numeric,
  rmse numeric,
  last_trained_at timestamptz,
  training_samples int,
  performance_history jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
