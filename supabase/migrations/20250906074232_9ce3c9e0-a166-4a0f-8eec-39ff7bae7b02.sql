-- Add new content structure columns to tools table
ALTER TABLE public.tools 
ADD COLUMN bio text,
ADD COLUMN full_description text,
ADD COLUMN tags text[];

-- Update existing tools with default values
UPDATE public.tools 
SET 
  bio = LEFT(description, 200),
  full_description = description,
  tags = ARRAY['productivity', 'ai-tool']
WHERE bio IS NULL;

-- Add constraints to ensure proper content structure
ALTER TABLE public.tools 
ADD CONSTRAINT bio_length_check CHECK (char_length(bio) <= 200),
ADD CONSTRAINT full_description_not_empty CHECK (char_length(full_description) > 0);