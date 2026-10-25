INSERT INTO users (full_name, email, role)
VALUES
  ('Admin FreshTrack', 'admin@freshtrack.com', 'admin'),
  ('Usuario Demo', 'demo@freshtrack.com', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO master_catalog (product_name, category, avg_shelf_life_days)
VALUES
  ('Leche', 'Lácteos', 7),
  ('Huevos', 'Proteínas', 21),
  ('Tomate', 'Verduras', 7),
  ('Banano', 'Frutas', 5),
  ('Pollo', 'Proteínas', 3),
  ('Arroz', 'Granos', 365)
ON CONFLICT (product_name) DO NOTHING;