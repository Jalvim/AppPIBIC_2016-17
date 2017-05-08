-- Adicionando timestamps
-- Funciona para o MariaDB
USE `cl19-dbpipibic`;

ALTER TABLE paciente ADD COLUMN IF NOT EXISTS (timestamp TIMESTAMP);

ALTER TABLE lembrete ADD COLUMN IF NOT EXISTS (timestamp TIMESTAMP);
