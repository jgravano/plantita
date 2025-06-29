-- Script para resetear las tablas de Supabase
-- ⚠️ ADVERTENCIA: Esto eliminará todos los datos existentes

-- Eliminar tablas existentes (en orden correcto debido a las foreign keys)
DROP TABLE IF EXISTS diagnoses CASCADE;
DROP TABLE IF EXISTS plants CASCADE;

-- Eliminar función si existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Crear tabla de plantas
CREATE TABLE plants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT,
  species TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de diagnósticos
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  diagnosis_text TEXT NOT NULL,
  care_suggestions TEXT,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en plants
CREATE TRIGGER update_plants_updated_at 
  BEFORE UPDATE ON plants 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 