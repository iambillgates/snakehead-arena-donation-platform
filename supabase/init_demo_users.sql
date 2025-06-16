-- Insert demo admin user
INSERT INTO public.users (id, email, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@example.com',
  'Admin User'
);

-- Insert demo regular user
INSERT INTO public.users (id, email, name)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'user@example.com',
  'Regular User'
);
