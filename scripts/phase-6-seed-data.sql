-- =====================================================
-- NINO360 HRMS - PHASE 6: SEED DATA & FINALIZATION
-- =====================================================
-- Purpose: Insert initial data and finalize setup
-- Prerequisites: Phases 1-5 must be completed
-- =====================================================

BEGIN;

-- =====================================================
-- SEED DATA: PERMISSIONS
-- =====================================================

INSERT INTO core.permissions ("key", name, description, module) VALUES
  ('users.view', 'View Users', 'Can view user list', 'users'),
  ('users.create', 'Create Users', 'Can create new users', 'users'),
  ('users.edit', 'Edit Users', 'Can edit user details', 'users'),
  ('users.delete', 'Delete Users', 'Can delete users', 'users'),
  
  ('crm.view', 'View CRM', 'Can view CRM data', 'crm'),
  ('crm.create', 'Create CRM Records', 'Can create CRM records', 'crm'),
  ('crm.edit', 'Edit CRM Records', 'Can edit CRM records', 'crm'),
  ('crm.delete', 'Delete CRM Records', 'Can delete CRM records', 'crm'),
  
  ('hrms.view', 'View HRMS', 'Can view HRMS data', 'hrms'),
  ('hrms.create', 'Create HRMS Records', 'Can create HRMS records', 'hrms'),
  ('hrms.edit', 'Edit HRMS Records', 'Can edit HRMS records', 'hrms'),
  ('hrms.delete', 'Delete HRMS Records', 'Can delete HRMS records', 'hrms'),
  
  ('talent.view', 'View Talent', 'Can view talent/ATS data', 'talent'),
  ('talent.create', 'Create Talent Records', 'Can create talent records', 'talent'),
  ('talent.edit', 'Edit Talent Records', 'Can edit talent records', 'talent'),
  ('talent.delete', 'Delete Talent Records', 'Can delete talent records', 'talent'),
  
  ('projects.view', 'View Projects', 'Can view projects', 'projects'),
  ('projects.create', 'Create Projects', 'Can create projects', 'projects'),
  ('projects.edit', 'Edit Projects', 'Can edit projects', 'projects'),
  ('projects.delete', 'Delete Projects', 'Can delete projects', 'projects'),
  
  ('finance.view', 'View Finance', 'Can view financial data', 'finance'),
  ('finance.create', 'Create Finance Records', 'Can create financial records', 'finance'),
  ('finance.edit', 'Edit Finance Records', 'Can edit financial records', 'finance'),
  ('finance.delete', 'Delete Finance Records', 'Can delete financial records', 'finance'),
  
  ('reports.view', 'View Reports', 'Can view reports', 'reports'),
  ('reports.create', 'Create Reports', 'Can create custom reports', 'reports'),
  
  ('admin.full', 'Full Admin Access', 'Complete system access', 'admin')
ON CONFLICT ("key") DO NOTHING;

-- =====================================================
-- REALTIME CONFIGURATION
-- =====================================================

-- Enable realtime for critical tables (only if not already added)
DO $$
DECLARE
  tbl_name TEXT;
  tbl_schema TEXT;
  tables_to_add TEXT[][] := ARRAY[
    ARRAY['core', 'users'],
    ARRAY['public', 'notifications'],
    ARRAY['public', 'hrms_timesheets'],
    ARRAY['public', 'talent_applications'],
    ARRAY['public', 'projects']
  ];
  table_pair TEXT[];
BEGIN
  FOREACH table_pair SLICE 1 IN ARRAY tables_to_add
  LOOP
    tbl_schema := table_pair[1];
    tbl_name := table_pair[2];
    
    -- Check if table exists and is not already in publication
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = tbl_schema AND table_name = tbl_name
    ) AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = tbl_schema 
      AND tablename = tbl_name
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I.%I', tbl_schema, tbl_name);
      RAISE NOTICE 'Added %.% to supabase_realtime publication', tbl_schema, tbl_name;
    ELSE
      RAISE NOTICE 'Skipped %.% (already in publication or table does not exist)', tbl_schema, tbl_name;
    END IF;
  END LOOP;
END $$;

COMMIT;

-- Display final success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 6: Seed Data & Finalization - COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Completed:';
  RAISE NOTICE '  ✓ 27 default permissions';
  RAISE NOTICE '  ✓ Realtime enabled for 5 tables';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ALL PHASES COMPLETE!';
  RAISE NOTICE 'NINO360 HRMS Database Setup Finished';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Database Summary:';
  RAISE NOTICE '  ✓ 4 extensions';
  RAISE NOTICE '  ✓ 35+ tables across 14 modules';
  RAISE NOTICE '  ✓ 50+ performance indexes';
  RAISE NOTICE '  ✓ Complete RLS policies';
  RAISE NOTICE '  ✓ Business logic functions';
  RAISE NOTICE '  ✓ Automated triggers';
  RAISE NOTICE '  ✓ Seed data loaded';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Verify tables: SELECT count(*) FROM information_schema.tables WHERE table_schema = ''public'';';
  RAISE NOTICE '  2. Check RLS: SELECT * FROM pg_policies LIMIT 10;';
  RAISE NOTICE '  3. Test tenant isolation with app.current_tenant_id';
  RAISE NOTICE '';
END $$;
